import { db } from "$lib/server/db";
import { matcherSession } from "$lib/server/db/schema.js";
import { sql } from "drizzle-orm";

export const load = async (event) => {
	const { matcherId } = event.params;
	const sessionId = event.locals.sessionId;

	await db
		.insert(matcherSession)
		.values({
			matcherId,
			sessionId,
		})
		.onDuplicateKeyUpdate({ set: { matcherId: sql`matcherId` } });

	const data = await db.query.matcher.findFirst({
		where: (matcher, { eq }) => eq(matcher.id, matcherId),
		with: {
			matcherSession: true,
		},
	});

	return {
		matcherId,
		sessionId,
		sessions: data?.matcherSession ?? [],
	};
};
