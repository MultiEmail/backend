import { DocumentDefinition, FilterQuery, UpdateQuery } from "mongoose";
import UserModel, { User } from "../models/user.model";

/**
 * Find user by Id
 * @param {string} id this is the id of the user
 *
 * @author aayushchugh
 */
export function findUserByIdService(id: string) {
	return UserModel.findById(id);
}

/**
 * Find a user from the database with matching email
 * @param {string} email this is email of the user
 *
 * @author aayushchugh
 */
export function findUserByEmailService(email: string) {
	return UserModel.findOne({ email });
}

/**
 * Find user from database with given username
 * @param {string} username user's username to find in database
 *
 * @author aayushchugh
 */
export function findUserByUsernameService(username: string) {
	return UserModel.findOne({ username });
}

/**
 * This will find a user from the database with matching username or email
 * @param {string} email email of the user
 * @param {string} username username of the user
 *
 * @author aayushchugh
 */
export function findUserByEitherEmailOrUsernameService(email: string, username: string) {
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

	@author aayushchugh
 */
export function createUserService(
	payload: DocumentDefinition<
		Omit<
			User,
			| "uid"
			| "verificationCode"
			| "passwordResetCode"
			| "comparePassword"
			| "connected_services"
		>
	>,
) {
	return UserModel.create(payload);
}

/**
 * Find all users in database with given query
 * @param {object | undefined} query this is filter which will be used to find the user
 *
 * @author aayushchugh
 */
export function findUsersService(query?: FilterQuery<User>) {
	return UserModel.find(query || {});
}

/**
 * Delete a user form the database with given id
 * @param {string} id this is id of user to be deleted
 *
 * @author aayushchugh
 */
export function deleteUserByIdService(id: string) {
	return UserModel.findByIdAndDelete(id);
}

/**
 * Update user in the database with given id
 * @param id this is id of user which will be updated
 * @param payload fields which will be updated in the user
 *
 * @author aayushchugh
 */
export function updateUserByIdService(id: string, payload: UpdateQuery<User>) {
	return UserModel.findByIdAndUpdate(id, payload);
}

/**
 * @author is-it-ayush
 * @description Babel and CommonJS fix: Without This *.test.js wont recognise the typescript functions.
 *
 * @author aayushchugh
 */
module.exports = {
	findUserByIdService,
	findUserByEmailService,
	findUserByUsernameService,
	findUserByEitherEmailOrUsernameService,
	createUserService,
	findUsersService,
	deleteUserByIdService,
	updateUserByIdService,
};
