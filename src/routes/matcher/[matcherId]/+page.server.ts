import { foodTypes } from "$lib/data/foods";
import { db } from "$lib/server/db";
import { comparison, matcherSession } from "$lib/server/db/schema.js";
import { redirect } from "@sveltejs/kit";
import { and, count, eq, sql } from "drizzle-orm";

export const load = async (event) => {
	const { matcherId } = event.params;
	const sessionId = event.locals.sessionId;

	const matcher = await db.query.matcher.findFirst({
		where: (matcher, { eq }) => eq(matcher.id, matcherId),
		with: {
			matcherSession: true,
		},
	});

	if (!matcher) {
		throw redirect(303, "/");
	}

	if (matcher.finished) {
		throw redirect(303, `/matcher/${matcherId}/results`);
	}

	await db
		.insert(matcherSession)
		.values({
			matcherId,
			sessionId,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		})
		.onDuplicateKeyUpdate({ set: { matcherId: sql`matcher_id` } });

	const comparisons = (
		await db
			.select({ count: count() })
			.from(comparison)
			.where(and(eq(comparison.matcherId, matcherId), eq(comparison.sessionId, sessionId)))
	)[0];

	if (comparisons.count === foodTypes.length - 1) {
		await db
			.update(matcherSession)
			.set({ finished: true })
			.where(and(eq(matcherSession.matcherId, matcherId), eq(matcherSession.sessionId, sessionId)));

		throw redirect(303, `/matcher/${matcherId}/done`);
	}

	throw redirect(303, `/matcher/${matcherId}/match`);
};
