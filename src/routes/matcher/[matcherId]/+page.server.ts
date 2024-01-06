import { foodTypes } from "$lib/data/foods";
import { db } from "$lib/server/db";
import { comparison, matcherSession } from "$lib/server/db/schema.js";
import { redirect } from "@sveltejs/kit";
import { and, count, eq } from "drizzle-orm";

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
		redirect(303, "/");
	}

	if (matcher.finished) {
		redirect(303, `/matcher/${matcherId}/results`);
	}

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

		redirect(303, `/matcher/${matcherId}/done`);
	}

	redirect(303, `/matcher/${matcherId}/match`);
};
