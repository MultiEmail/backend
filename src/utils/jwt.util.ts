import { config } from "dotenv";
import jwt from "jsonwebtoken";
import logger from "./logger.util";

config();

/**
 * Create a JWT token from given payload
 * @param payload what should be signed into JWT
 * @param keyName which key should be used for signing token
 * @param options additional options for JWT library
 * @author aayushchugh, is-it-ayush
 */
export async function signJWT(
	payload: object,
	keyName: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY",
	options?: jwt.SignOptions,
): Promise<string> {
	const privateKey = process.env[keyName] as string;
	const token = (await jwt.sign(payload, privateKey, {
		...(options && options),
		algorithm: "RS256",
	})) as string;

	return token;
}

/**
 * Verify and decode JWT token
 * @param token encoded token which will be verified/decoded
 * @param keyName key which will be used to decode token (should be same as private key)
 * @author aayushchugh, is-it-ayush
 */
export async function verifyJWT<T>(
	token: string,
	keyName: "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_TOKEN_PUBLIC_KEY",
): Promise<T | null> {
	const publicKey = process.env[keyName] as string;
	let decoded: T;
	try {
		decoded = (await jwt.verify(token, publicKey, {
			algorithms: ["RS256"],
		})) as T;

		return decoded;
	} catch (error) {
		return null;
	}
}
