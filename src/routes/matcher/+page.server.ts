import { db } from "$lib/server/db";
import { matcher } from "$lib/server/db/schema";
import { redirect } from "@sveltejs/kit";
import { randomBytes } from "node:crypto";

export const actions = {
	default: async () => {
		const matcherId = randomBytes(4).toString("hex");

		await db.insert(matcher).values({
			id: matcherId,
		});

		throw redirect(303, `/matcher/${matcherId}`);
	},
};
