import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SignupSchema, VerifyUserSchema } from "../schemas/auth.schema";
import {
	createUserService,
	findUserByEitherEmailOrUsernameService,
	findUserByEmailService,
} from "../services/user.service";
import { sendEmail } from "../util/email.util";
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

		const createdUser = await createUserService({
			username,
			email,
			password,
			role: "user",
		});

		sendEmail(
			email,
			"OTP for Multi Email",
			`Welcome to Multi Email your OTP is ${createdUser.verificationCode}`
		);

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

export async function verifyUserHandler(
	req: Request<VerifyUserSchema["params"]>,
	res: Response
) {
	const { email, verificationCode } = req.params;

	try {
		// QUESTION: should we use username to find the user or email?
		const user = await findUserByEmailService(email);

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "User not found",
			});
		}

		if (user.verified) {
			return res.status(StatusCodes.OK).json({
				message: "User verified successfully",
			});
		}

		if (!parseInt(verificationCode)) {
			return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
				error: "Invalid verification code",
			});
		}

		if (user.verificationCode !== +verificationCode) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: "Invalid verification code",
			});
		}

		user.verified = true;
		await user.save();

		return res.status(StatusCodes.OK).json({
			message: "User verified successfully",
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
}
