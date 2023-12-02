import { redirect } from "@sveltejs/kit";
import { randomBytes } from "node:crypto";

export const actions = {
	default: async () => {
		const matcherId = randomBytes(4).toString("hex");

		// TODO: store id in database

		throw redirect(303, `/matcher/${matcherId}`);
	},
};
