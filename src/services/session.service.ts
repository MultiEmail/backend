import SessionModel from "../models/session.model";

/**
 * Create a new session for given user
 * @param userId id of the user for which session will be created
 *
 * @author aayushchugh
 */
export async function createSessionService(userId: string) {
	return await SessionModel.create({ user: userId, valid: true });
}

/**
 * Finds session form the database with matching id
 * @param sessionId id of the session
 *
 * @author aayushchugh
 */
export function findSessionByIdService(sessionId: string) {
	return SessionModel.findById(sessionId);
}
