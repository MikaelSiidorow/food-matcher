import { randomUUID } from "node:crypto";

export const handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get("sessionid") ?? randomUUID();

	event.cookies.set("sessionid", sessionId, {
		httpOnly: true,
		sameSite: "strict",
		secure: true,
		path: "/",
	});

	event.locals.sessionId = sessionId;

	return await resolve(event);
};
