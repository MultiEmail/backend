import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
	ForgotPasswordSchema,
	LoginSchema,
	ResetPasswordSchema,
	SignupSchema,
	VerifyUserSchema,
} from "../schemas/auth.schema";
import {
	signAccessTokenService,
	signRefreshTokenService,
} from "../services/auth.service";
import {
	createUserService,
	findUserByEitherEmailOrUsernameService,
	findUserByEmailService,
} from "../services/user.service";
import { findSessionByIdService } from "../services/session.service";
import { sendEmail } from "../utils/email.util";
import { verifyJWT } from "../utils/jwt.util";
import logger from "../utils/logger.util";
import { omit } from "lodash";
import { userModalPrivateFields } from "../models/user.model";
import { generateRandomOTP } from "../utils/otp.util";

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
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
}

export async function loginHandler(
	req: Request<{}, {}, LoginSchema["body"]>,
	res: Response
) {
	const { email, password } = req.body;
	try {
		const user = await findUserByEmailService(email);

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "User not found",
			});
		}

		const isPasswordCorrect = await user.comparePassword(password);

		if (!isPasswordCorrect) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: "Invalid credentials",
			});
		}

		// sign access and refresh token
		const accessToken = await signAccessTokenService(user);
		const refreshToken = await signRefreshTokenService(user._id);

		return res.status(StatusCodes.OK).json({
			message: "User logged in successfully",
			access_token: accessToken,
			refresh_token: refreshToken,
		});
	} catch (err) {
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
}

export async function logoutHandler(req: Request, res: Response) {
	const refreshToken = req.headers["x-refresh"] as string;

	if (!refreshToken) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			error: "Invalid refresh token",
		});
	}

	try {
		// verify if refresh token is valid
		const decoded = await verifyJWT<{ session: string }>(
			refreshToken,
			"REFRESH_TOKEN_PUBLIC_KEY"
		);

		if (!decoded) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: "Invalid refresh token",
			});
		}

		// make session invalid
		const session = await findSessionByIdService(decoded.session);

		if (!session || !session.valid) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: "Session is not valid",
			});
		}

		session.valid = false;
		await session.save();

		res.status(StatusCodes.OK).json({
			message: "User logged out successfully",
		});
	} catch (err) {
		logger.info(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
}

export function getCurrentUserHandler(req: Request, res: Response) {
	const { user } = res.locals;

	if (!user) {
		return res.status(StatusCodes.OK).json({
			message: "User is not logged In",
			user: null,
		});
	}

	const removePrivateFieldsFromUser = omit(
		user.toJSON(),
		userModalPrivateFields
	);

	return res.status(StatusCodes.OK).json({
		message: "User is logged In",
		user: removePrivateFieldsFromUser,
	});
}

export async function forgotPasswordHandler(
	req: Request<{}, {}, ForgotPasswordSchema["body"]>,
	res: Response
) {
	const { email } = req.body;

	try {
		const user = await findUserByEmailService(email);

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "User not found",
			});
		}

		if (!user.verified) {
			return res.status(StatusCodes.FORBIDDEN).json({
				error: "User is not verified",
			});
		}

		// generate password reset code and send that to users email
		const passwordResetCode = generateRandomOTP();
		user.passwordResetCode = passwordResetCode;
		await user.save();
		await sendEmail(
			email,
			"OTP to password reset for Multi Email",
			`Your OTP to reset password is ${passwordResetCode}`
		);

		return res.status(StatusCodes.OK).json({
			message: "Password reset code sent to your email",
		});
	} catch (err) {
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
}

export async function resetPasswordHandler(
	req: Request<ResetPasswordSchema["params"], {}, ResetPasswordSchema["body"]>,
	res: Response
) {
	const { email, passwordResetCode } = req.params;
	const { password } = req.body;

	try {
		const user = await findUserByEmailService(email);

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "User not found",
			});
		}

		if (
			!user?.passwordResetCode ||
			user?.passwordResetCode !== parseInt(passwordResetCode)
		) {
			return res.status(StatusCodes.FORBIDDEN).json({
				error: "Invalid password reset code",
			});
		}

		user.passwordResetCode = null;

		// NOTE: password will be hashed in user model
		user.password = password;

		await user.save();

		return res.status(StatusCodes.OK).json({
			message: "Password reset successfully",
		});
	} catch (err) {
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
}
