import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
	DeleteUserSchema,
	PatchMarkUserVerifiedSchema,
} from "../schemas/admin.schema";
import { 
	deleteUserByIdService,
	findUsersService,
	updateUserByIdService,
} from "../services/user.service";
import logger from "../utils/logger.util";


/**
 * This controller will get all users from database
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh, is-itayush
 */
 export const getAllUsersHandler = async (req: Request, res: Response) => {
	try {
		const records = await findUsersService();

		return res.status(StatusCodes.OK).json({
			message: "Users fetched successfully",
			records,
		});
	} catch (err) {
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};

/**
 * This controller will delete user from database
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh, is-it-ayush
 */
export const deleteUserHandler = async (
	req: Request<DeleteUserSchema["params"]>,
	res: Response,
) => {
	const { id } = req.params;

	try {
		const deletedUser = await deleteUserByIdService(id);

		if (!deletedUser) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "User not found",
			});
		}

		return res.status(StatusCodes.OK).json({
			message: "User deleted successfully",
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