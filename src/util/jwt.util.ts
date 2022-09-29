import { config } from "dotenv";
import jwt from "jsonwebtoken";
import logger from "./logger.util";

config();

/**
 * Create a JWT token from given payload
 * @param payload what should be signed into JWT
 * @param keyName which key should be used for signing token
 * @param options additional options for JWT library
 */
export function signJWT(
	payload: object,
	keyName: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY",
	options?: jwt.SignOptions
): string {
	const privateKey = process.env[keyName];

	return jwt.sign(payload, privateKey, {
		...(options && options),
		algorithm: "RS256",
	});
}

/**
 * Verify and decode JWT token
 * @param token encoded token which will be verified/decoded
 * @param keyName key which will be used to decode token (should be same as private key)
 */
export function verifyJWT<T>(
	token: string,
	keyName: "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_TOKEN_PUBLIC_KEY"
): T | null {
	const publicKey = process.env[keyName];

	try {
		return jwt.verify(token, publicKey, {
			algorithms: ["RS256"],
		}) as T;
	} catch (error) {
		logger.error(error);
		return null;
	}
}
