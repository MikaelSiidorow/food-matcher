import { foodTypes } from "$lib/data/foods";
import { db } from "$lib/server/db";
import { comparison } from "$lib/server/db/schema.js";
import { shuffle } from "$lib/utils";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import * as z from "zod";

const pickTwo = (doneComparisons: (typeof comparison.$inferSelect)[]) => {
	const allOptions = shuffle(foodTypes);
	if (doneComparisons.length === 0) {
		return allOptions.slice(0, 2);
	}

	// filter all options to only those that have not been compared
	const uncomparedOptions = allOptions.filter((option) => {
		const hasBeenCompared = doneComparisons.some(
			(comparison) => comparison.previous === option || comparison.current === option,
		);
		return !hasBeenCompared;
	});
	const lastCompared = doneComparisons[0];

	return [lastCompared.current, uncomparedOptions[0]];
};

const voteSchema = z.object({
	winner: z.enum(["previous", "current"]),
	previous: z.enum(foodTypes),
	current: z.enum(foodTypes),
});

export const load = async (event) => {
	const { matcherId } = event.params;
	const sessionId = event.locals.sessionId;

	// get all sessions for this matcher
	const matcher = await db.query.matcher.findFirst({
		where: (matcher, { eq }) => eq(matcher.id, matcherId),
		with: {
			matcherSession: true,
		},
	});

	// verify that a session exists for this matcher
	if (!matcher?.matcherSession.some((session) => session.sessionId === sessionId)) {
		throw redirect(303, `/matcher/${matcherId}`);
	}

	// get all comparisons for this session
	const comparisons = await db.query.comparison.findMany({
		where: (comparison, { and, eq }) =>
			and(eq(comparison.matcherId, matcherId), eq(comparison.sessionId, sessionId)),
		orderBy: (comparison, { desc }) => desc(comparison.createdAt),
	});
	const [previous, current] = pickTwo(comparisons);

	// verify that this session is not already finished
	if (!current) {
		throw redirect(303, `/matcher/${matcherId}`);
	}

	const form = await superValidate(voteSchema);

	return {
		form,
		matcherId,
		sessionId,
		previous,
		current,
		startedSessions: matcher?.matcherSession.length ?? 0,
		finishedSessions: matcher?.matcherSession.filter((session) => session.finished).length ?? 0,
	};
};

export const actions = {
	default: async ({ request, params, locals }) => {
		const form = await superValidate(request, voteSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { matcherId } = params;
		const { sessionId } = locals;
		const { winner, previous, current } = form.data;

		await db.insert(comparison).values({
			matcherId,
			sessionId,
			previous,
			current,
			winner,
			createdAt: Date.now(),
		});

		return { form };
	},
};
