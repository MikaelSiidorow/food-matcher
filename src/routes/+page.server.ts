import { db } from "$lib/server/db";
import { matcher } from "$lib/server/db/schema";
import { redirect } from "@sveltejs/kit";
import { randomBytes } from "node:crypto";

export const actions = {
	default: async (event) => {
		const matcherId = randomBytes(4).toString("hex");

		await db.insert(matcher).values({
			id: matcherId,
			createdBy: event.locals.sessionId,
			createdAt: Date.now(),
		});

		redirect(303, `/matcher/${matcherId}`);
	},
};
