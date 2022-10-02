import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
	DeleteUserSchema,
	PatchMarkUserVerifiedSchema,
	PatchUserSchema,
} from "../schemas/user.schema";
import {
	deleteUserByIdService,
	findUserByUsernameService,
	findUsersService,
	updateUserByIdService,
} from "../services/user.service";
import logger from "../utils/logger.util";

export async function getAllUsersHandler(req: Request, res: Response) {
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
}

export async function deleteUserHandler(
	req: Request<DeleteUserSchema["params"]>,
	res: Response
) {
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
}

export async function patchMarkUserVerifiedHandler(
	req: Request<PatchMarkUserVerifiedSchema["params"]>,
	res: Response
) {
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
}

export async function patchUserHandler(
	req: Request<PatchUserSchema["params"], {}, PatchUserSchema["body"]>,
	res: Response
) {
	const { id } = req.params;
	const { username } = req.body;

	try {
		// check if username is already taken

		const existingUserWithSameUsername = await findUserByUsernameService(
			username || ""
		);

		if (existingUserWithSameUsername) {
			return res.status(StatusCodes.CONFLICT).json({
				error: "Username is already taken",
			});
		}

		const updatedUser = await updateUserByIdService(id, { username });

		console.log(updatedUser);

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
}
