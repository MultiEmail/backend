import { DocumentDefinition, FilterQuery } from "mongoose";
import UserModel, { User } from "../models/user.model";

/**
 * Find user by Id
 * @param {string} id this is the id of the user
 */
export function findUserByIdService(id: string) {
	return UserModel.findById(id);
}

/**
 * Find a user from the database with matching email
 * @param {string} email this is email of the user
 */
export function findUserByEmailService(email: string) {
	return UserModel.findOne({ email });
}

/**
 * This will find a user from the database with matching username or email
 * @param {string} email email of the user
 * @param {string} username username of the user
 */
export function findUserByEitherEmailOrUsernameService(
	email: string,
	username: string
) {
	return UserModel.findOne({ $or: [{ email }, { username }] });
}

/**
 * This will create a new user in the database
 * @param {DocumentDefinition<
		Omit<
			User,
			| "uid"
			| "verified"
			| "verificationCode"
			| "passwordResetCode"
			| "comparePassword"
		>
	>} payload this is the payload of the user
 */
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

/**
 * Find all users in database with given query
 * @param {object | undefined} query this is filter which will be used to find the user
 */
export function findUsersService(query?: FilterQuery<User>) {
	return UserModel.find(query || {});
}

/**
 * Delete a user form the database with given id
 * @param {string} id this is id of user to be deleted
 */
export function deleteUserByIdService(id: string) {
	return UserModel.findByIdAndDelete(id);
}
