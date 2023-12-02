export const load = async (event) => {
	const { matcherId } = event.params;
	const sessionId = event.locals.sessionId;

	// TODO: load matcher from database

	return {
		matcherId,
		sessionId,
	};
};
