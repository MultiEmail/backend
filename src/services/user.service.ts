import { DocumentDefinition } from "mongoose";
import UserModel, { User } from "../models/user.model";

/**
 * Find a user from the database with matching email
 * @param email this is email of the user
 */
export function findUserByEmailService(email: string) {
	return UserModel.findOne({ email });
}

/**
 * This will find a user from the database with matching username or email
 * @param email email of the user
 * @param username username of the user
 */
export function findUserByEitherEmailOrUsernameService(
	email: string,
	username: string
) {
	return UserModel.findOne({ $or: [{ email }, { username }] });
}

export function createUserService(
	payload: DocumentDefinition<
		Omit<
			User,
			| "uid"
			| "verified"
			| "verificationCode"
			| "passwordResetCode"
			| "comparePassword"
		>
	>
) {
	return UserModel.create(payload);
}
