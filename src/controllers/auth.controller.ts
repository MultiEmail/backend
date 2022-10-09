import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
	ForgotPasswordSchema,
	LoginSchema,
	ResetPasswordSchema,
	SignupSchema,
	VerifyUserSchema,
} from "../schemas/auth.schema";
import { signAccessTokenService, signRefreshTokenService } from "../services/auth.service";
import {
	createUserService,
	findUserByEmailService,
	findUserByIdService,
} from "../services/user.service";
import { findSessionByIdService } from "../services/session.service";
import { sendEmail } from "../utils/email.util";
import { verifyJWT } from "../utils/jwt.util";
import logger from "../utils/logger.util";
import { omit } from "lodash";
import { userModalPrivateFields } from "../models/user.model";
import { generateRandomOTP } from "../utils/otp.util";

/**
 * This controller will create new account of user in database
 * and send an email to the given email that will contain a verification code (OTP)
 * which will be verified in `/api/auth/verify/:email/:verificationCode` route
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh
 */
export const signupHandler = async (req: Request<{}, {}, SignupSchema["body"]>, res: Response) => {
	const { password } = req.body;
	const username = req.body.username.toLowerCase().trim();
	const email = req.body.email.toLowerCase().trim();

	try {
		const createdUser = await createUserService({
			username,
			email,
			password,
			role: "user",
			verified: false,
		});

		const token = await signAccessTokenService(createdUser);

		sendEmail(
			email,
			"OTP for Multi Email",
			`<h2>Welcome to Multi Email</h2>
			<h4>please visit this URL and enter your OTP</h4>
			<p>
			OTP: ${createdUser.verificationCode}
			</p>
			<p>
			<a href="${process.env.FRONTEND_URL}/verify?v=${createdUser.verificationCode}&t=${token}">Verify My Account</a>
			</p>
			`,
		);

		return res.status(StatusCodes.CREATED).json({
			message: "User created successfully",
		});
	} catch (err: any) {
		if (err.code === 11000) {
			return res.status(StatusCodes.CONFLICT).json({
				error: "User with same email or username already exists",
			});
		}
		// @author is-it-ayush
		// fix: Only log error's if they are unknown errors to prevent console spam.
		logger.error(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
};

/**
 * This controller will verify the user
 * this is needed so that we can verify that email given by
 * user is correct
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh
 */
export const verifyUserHandler = async (
	req: Request<VerifyUserSchema["params"]>,
	res: Response,
) => {
	const { verificationCode } = req.params;

	try {
		// QUESTION: should we use username to find the user or email?

		const { user } = res.locals;

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
};

/**
 * This controller will be used to login the user
 * and will create new session in database
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh
 */
export const loginHandler = async (req: Request<{}, {}, LoginSchema["body"]>, res: Response) => {
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

		// @author is-it-ayush
		//fix: if user is not verified then don't allow him to login
		if (!user.verified) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: "User is not verified",
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
};

/**
 * This controller will logout the user by invalidating the
 * current session
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh
 */
export const logoutHandler = async (req: Request, res: Response) => {
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
			"REFRESH_TOKEN_PUBLIC_KEY",
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
};

/**
 * This controller will get current user from
 * access token
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh
 */
export const getCurrentUserHandler = (req: Request, res: Response) => {
	const { user } = res.locals;

	if (!user) {
		// @author is-it-ayush
		//fix: if user is not found then return 401 status code
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: "User is not logged In",
			user: null,
		});
	}

	const removePrivateFieldsFromUser = omit(user.toJSON(), userModalPrivateFields);

	return res.status(StatusCodes.OK).json({
		message: "User is logged In",
		user: removePrivateFieldsFromUser,
	});
};

/**
 * This controller will send a forgot password verification code
 * to the given email which will be verified in `/api/auth/resetpassword/:email/:passwordResetCode`
 * route
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh
 */
export const forgotPasswordHandler = async (
	req: Request<{}, {}, ForgotPasswordSchema["body"]>,
	res: Response,
) => {
	const { email } = req.body;

	try {
		const user = await findUserByEmailService(email.trim());

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

		/**
		 * @author is-it-ayush
		 * fix: send email to user with password reset code before saving the user.
		 * fix: wrapped the save method in a try catch block to handle errors.
		 */
		try {
			await sendEmail(
				email,
				"OTP to password reset for Multi Email",
				`Your OTP to reset password is ${passwordResetCode}`,
			);
		} catch (err) {
			logger.error(err);
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: "Internal server error",
			});
		}

		await user.save();

		return res.status(StatusCodes.OK).json({
			message: "Password reset code sent to your email",
		});
	} catch (err) {
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
};

/**
 * This controller will update the password of user in database
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh
 */
export const resetPasswordHandler = async (
	req: Request<ResetPasswordSchema["params"], {}, ResetPasswordSchema["body"]>,
	res: Response,
) => {
	const { email, passwordResetCode } = req.params;
	const { password } = req.body;

	try {
		const user = await findUserByEmailService(email);

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "User not found",
			});
		}

		if (!user?.passwordResetCode || user?.passwordResetCode !== parseInt(passwordResetCode)) {
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
};

/**
 * This controller will refresh the `access_token`
 * use the `refresh_token` sent in header
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh
 */
export const refreshAccessTokenHandler = async (req: Request, res: Response) => {
	const refreshToken = req.headers["x-refresh"] as string;

	if (!refreshToken) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			error: "Invalid refresh token",
		});
	}

	try {
		const decoded = await verifyJWT<{ session: string }>(
			refreshToken,
			"REFRESH_TOKEN_PUBLIC_KEY",
		);

		if (!decoded) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: "Invalid refresh token",
			});
		}

		const session = await findSessionByIdService(decoded.session);

		if (!session || !session.valid) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: "Session is not valid",
			});
		}

		const user = session.user && (await findUserByIdService(session.user.toString()));

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "User not found",
			});
		}

		const accessToken = await signAccessTokenService(user);

		return res.status(StatusCodes.OK).json({
			access_token: accessToken,
		});
	} catch (err) {
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};
