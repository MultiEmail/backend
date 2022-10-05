import { DocumentType } from "@typegoose/typegoose";
import { User, userModalPrivateFields } from "../models/user.model";
import { omit } from "lodash";
import { signJWT } from "../utils/jwt.util";
import { createSessionService } from "./session.service";

/**
 * Create a access token for given user
 * @param user this is user which will be signed into JWT token
 *
 * @author aayushchugh
 */
export function signAccessTokenService(user: DocumentType<User>) {
	const payload = omit(user.toJSON(), userModalPrivateFields);

	return signJWT(payload, "ACCESS_TOKEN_PRIVATE_KEY", {
		expiresIn: "15m",
	});
}

/**
 * This service will create a refreshToken and create new session in database
 * @param userId id of user for which refreshToken will be generated
 *
 * @author aayushchugh
 */
export async function signRefreshTokenService(userId: string) {
	const session = await createSessionService(userId);

	return signJWT({ session: session._id }, "REFRESH_TOKEN_PRIVATE_KEY", {
		expiresIn: "15d",
	});
}
