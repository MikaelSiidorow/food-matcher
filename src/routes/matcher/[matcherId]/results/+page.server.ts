import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";

export const load = async (event) => {
	const { matcherId } = event.params;

	const matcher = await db.query.matcher.findFirst({
		where: (matcher, { eq }) => eq(matcher.id, matcherId),
		columns: {},
		with: {
			matcherSession: {
				columns: {},
				with: {
					comparison: {
						columns: {
							previous: true,
							current: true,
							winner: true,
						},
					},
				},
			},
		},
	});

	if (!matcher) {
		throw error(404, "Matcher not found");
	}

	const comparisons = matcher.matcherSession.flatMap((session) => session.comparison);

	// TODO: calculate results

	return {
		comparisons,
	};
};
