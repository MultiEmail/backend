import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { findUsersService } from "../services/user.service";

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
