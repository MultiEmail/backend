import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SignupSchema } from "../schemas/auth.schema";
import {
	createUserService,
	findUserByEitherEmailOrUsernameService,
} from "../services/user.service";
import logger from "../util/logger.util";

export async function signupHandler(
	req: Request<{}, {}, SignupSchema["body"]>,
	res: Response
) {
	const { username, email, password } = req.body;

	try {
		const existingUser = await findUserByEitherEmailOrUsernameService(
			email,
			username
		);

		if (existingUser) {
			return res.status(StatusCodes.CONFLICT).json({
				error: "User with same email or username already exists",
			});
		}

		await createUserService({ username, email, password, role: "user" });

		// TODO: send verification email

		return res.status(StatusCodes.CREATED).json({
			message: "User created successfully",
		});
	} catch (err: any) {
		logger.error(err);

		if (err.code === 11000) {
			return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
				error: "User with same email or username already exists",
			});
		}

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
}
