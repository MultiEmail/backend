import { DocumentType } from "@typegoose/typegoose";
import { User, userModalPrivateFields } from "../models/user.model";
import { omit } from "lodash";
import { signJWT } from "../utils/jwt.util";
import { createSessionService } from "./session.service";
import axios from "axios";
import qs from "qs";
import logger from "../utils/logger.util";

/**
 * Create a access token for given user
 * @param user this is user which will be signed into JWT token
 *
 * @author aayushchugh
 */
export const signAccessTokenService = (user: DocumentType<User>) => {
	const payload = omit(user.toJSON(), userModalPrivateFields);

	return signJWT(payload, "ACCESS_TOKEN_PRIVATE_KEY", {
		expiresIn: "15m",
	});
};

/**
 * This service will create a refreshToken and create new session in database
 * @param userId id of user for which refreshToken will be generated
 *
 * @author aayushchugh
 */
export const signRefreshTokenService = async (userId: string) => {
	const session = await createSessionService(userId);

	return signJWT({ session: session._id }, "REFRESH_TOKEN_PRIVATE_KEY", {
		expiresIn: "15d",
	});
};

interface IGoogleTokenResult {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	scope: string;
	id_token: string;
}

/**
 * This service will get tokens from google api
 * @param code code received from google concent screen
 *
 * @author aayushchugh
 */
export const getGoogleOAuthTokensService = async (code: string): Promise<IGoogleTokenResult> => {
	const url = "https://oauth2.googleapis.com/token";
	const clientId = process.env.GOOGLE_CLIENT_ID as string;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
	const redirectUrl = process.env.GOOGLE_REDIRECT_URL as string;

	const values = {
		code,
		client_id: clientId,
		client_secret: clientSecret,
		redirect_uri: redirectUrl,
		grant_type: "authorization_code",
	};

	try {
		const res = await axios.post(url, qs.stringify(values), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return res.data;
	} catch (err: any) {
		logger.error(err);
		throw new Error(err.message);
	}
};
