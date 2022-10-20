import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PatchMarkUserAdminSchema, PatchMarkUserVerifiedSchema } from "../schemas/admin.schema";

import { PatchUserSchema } from "../schemas/user.schema";
import { findUserByUsernameService, updateUserByIdService } from "../services/user.service";
import logger from "../utils/logger.util";

/**
 * This controller will update user's username
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh
 */
export const patchUserHandler = async (
	req: Request<PatchUserSchema["params"], {}, PatchUserSchema["body"]>,
	res: Response,
) => {
	const { id } = req.params;
	const { username } = req.body;

	try {
		// check if username is already taken

		const existingUserWithSameUsername = await findUserByUsernameService(username || "");

		if (existingUserWithSameUsername) {
			return res.status(StatusCodes.CONFLICT).json({
				error: "Username is already taken",
			});
		}

		const updatedUser = await updateUserByIdService(id, { username });

		if (!updatedUser) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "User not found",
			});
		}

		return res.status(StatusCodes.OK).json({
			message: "User updated successfully",
		});
	} catch (err) {
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};

/**
 * This controller will mark user as verified.
 * this can be used by admin to mark any user as verified
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh, is-it-ayush
 */
export const patchMarkUserVerifiedHandler = async (
	req: Request<PatchMarkUserVerifiedSchema["params"]>,
	res: Response,
) => {
	const { id } = req.params;

	try {
		const verifiedUser = await updateUserByIdService(id, { verified: true });

		if (!verifiedUser) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "User not found",
			});
		}

		return res.status(StatusCodes.OK).json({
			message: "User verified successfully",
		});
	} catch (err) {
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};

/**
 * This controller will mark user as admin.
 * this can be used by admin to mark any user as admin
 *
 * @param req request
 * @param res response
 *
 * @author tharun634
 */
export const patchMarkUserAdminHandler = async (
	req: Request<PatchMarkUserAdminSchema["params"]>,
	res: Response,
) => {
	const { id } = req.params;

	try {
		const markedAdminUser = await updateUserByIdService(id, { role: "admin" });

		if (!markedAdminUser) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "User not found",
			});
		}

		return res.status(StatusCodes.OK).json({
			message: "User marked as admin successfully",
		});
	} catch (err) {
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};
