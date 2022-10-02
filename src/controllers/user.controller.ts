import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DeleteUserSchema } from "../schemas/user.schema";
import {
	deleteUserByIdService,
	findUsersService,
} from "../services/user.service";

export async function getAllUsersHandler(req: Request, res: Response) {
	try {
		const records = await findUsersService();

		return res.status(StatusCodes.OK).json({
			message: "Users fetched successfully",
			records,
		});
	} catch (err) {
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

		console.log(deletedUser);

		if (!deletedUser) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "User not found",
			});
		}

		return res.status(StatusCodes.OK).json({
			message: "User deleted successfully",
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
}
