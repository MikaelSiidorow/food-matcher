import { db } from "$lib/server/db";
import { matcher } from "$lib/server/db/schema";
import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

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
		error(404, "Matcher not found");
	}

	if (matcher.finished) {
		redirect(303, `/matcher/${matcherId}/results`);
	}

	return {
		matcherId,
		creator: matcher.createdBy === sessionId,
		startedSessions: matcher.matcherSession.length,
		finishedSessions: matcher.matcherSession.filter((session) => session.finished).length,
	};
};

export const actions = {
	default: async ({ params, locals }) => {
		const { matcherId } = params;
		const { sessionId } = locals;

		const foundMatcher = await db.query.matcher.findFirst({
			where: (matcher, { eq }) => eq(matcher.id, matcherId),
			with: {
				matcherSession: true,
			},
		});

		if (!foundMatcher) {
			error(404, "Matcher not found");
		}

		if (foundMatcher.finished) {
			redirect(303, `/matcher/${matcherId}/results`);
		}

		if (foundMatcher.createdBy !== sessionId) {
			error(403, "You are not the creator of this matcher");
		}

		await db.update(matcher).set({ finished: true }).where(eq(matcher.id, matcherId));

		redirect(303, `/matcher/${matcherId}/results`);
	},
};
