import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
	ForgotPasswordSchema,
	LoginSchema,
	RedirectToGoogleConcentScreenHandlerSchema,
	ResetPasswordSchema,
	SignupSchema,
	VerifyUserSchema,
} from "../schemas/auth.schema";
import {
	getGoogleOAuthTokensService,
	signAccessTokenService,
	signRefreshTokenService,
} from "../services/auth.service";
import {
	createUserService,
	findUserByEitherEmailOrUsernameService,
	findUserByEmailService,
	findUserByIdService,
} from "../services/user.service";
import { findSessionByIdService } from "../services/session.service";
import { sendEmail } from "../utils/email.util";
import { verifyJWT } from "../utils/jwt.util";
import logger from "../utils/logger.util";
import { omit } from "lodash";
import { URLSearchParams } from "url";
import { userModalPrivateFields } from "../models/user.model";
import { generateRandomOTP } from "../utils/otp.util";
import { decode } from "jsonwebtoken";

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
	const { password, receiveMarketingEmails, acceptedTermsAndConditions } = req.body;
	const username = req.body.username.toLowerCase().trim();
	const email = req.body.email.toLowerCase().trim();

	try {
		const createdUser = await createUserService({
			username,
			email,
			password,
			role: "user",
			verified: false,
			receive_marketing_emails: receiveMarketingEmails,
			accepted_terms_and_conditions: acceptedTermsAndConditions,
		});

		const token = await signAccessTokenService(createdUser);

		sendEmail(
			email,
			"Verify your Multi Email account",
			`<h2>Welcome to Multi Email</h2>
			<h4>please visit this URL and enter your OTP</h4>
			<p>
			OTP: ${createdUser.verification_code}
			</p>
			<p>
			<a href="${process.env.FRONTEND_URL}/verify?v=${createdUser.verification_code}&t=${token}">Verify My Account</a>
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
	const { email, password, username } = req.body;
	try {
		if (!email && !username) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: "You must provide a valid email or username",
			});
		}

		if (email && username) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: "You can only provide one thing either email or username",
			});
		}

		const user = await findUserByEitherEmailOrUsernameService(
			email as string,
			username as string,
		);

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
			role: user.role,
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
		user.password_reset_code = passwordResetCode;

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

		if (
			!user?.password_reset_code ||
			user?.password_reset_code !== parseInt(passwordResetCode)
		) {
			return res.status(StatusCodes.FORBIDDEN).json({
				error: "Invalid password reset code",
			});
		}

		user.password_reset_code = null;

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

/**
 * This controller will redirect user to google concent screen
 * @param req express request
 * @param res express response
 *
 * @author aayushchugh
 */
export const redirectToGoogleConcentScreenHandler = (
	req: Request<{}, {}, {}, RedirectToGoogleConcentScreenHandlerSchema["query"]>,
	res: Response,
) => {
	const { id } = req.query;
	const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
	const redirectUrl = process.env.GOOGLE_REDIRECT_URL as string;
	const clientId = process.env.GOOGLE_CLIENT_ID as string;

	const options = {
		redirect_uri: redirectUrl,
		client_id: clientId,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://mail.google.com/",
			"https://www.googleapis.com/auth/gmail.modify",
			"https://www.googleapis.com/auth/gmail.readonly",
			"https://www.googleapis.com/auth/gmail.metadata",
		].join(" "),
		state: id,
	};
	const qs = new URLSearchParams(options);

	return res.status(StatusCodes.TEMPORARY_REDIRECT).redirect(`${rootUrl}?${qs.toString()}`);
};

/**
 * This controller will add new service for user
 * @param req express request
 * @param res express response
 *
 * @author aayushchugh
 */
export const googleOauthHandler = async (req: Request, res: Response) => {
	interface IGoogleUser {
		iss: string;
		azp: string;
		aud: string;
		sub: string;
		email: string;
		email_verified: boolean;
		at_hash: string;
		name: string;
		picture: string;
		given_name: string;
		family_name: string;
		locale: string;
		iat: number;
		exp: number;
	}

	const FRONTEND_URL = process.env.FRONTEND_URL as string;

	try {
		const code = req.query.code as string;
		const id = req.query.state as string;
		const tokens = await getGoogleOAuthTokensService(code);
		const googleUser = decode(tokens.id_token) as IGoogleUser;

		const foundUser = await findUserByIdService(id);

		if (!foundUser) {
			// TODO: redirect to connect accounts path on frontend
			return res.status(StatusCodes.NOT_FOUND).redirect(FRONTEND_URL);
		}

		// if account is already added than redirect to frontend
		if (foundUser.connected_services.filter((s) => s.email === foundUser.email).length) {
			return res.status(StatusCodes.CONFLICT).redirect(FRONTEND_URL);
		}

		if (tokens.refresh_token) {
			foundUser.connected_services.push({
				service: "google",
				refresh_token: tokens.refresh_token,
				access_token: tokens.access_token,
				email: googleUser.email,
			});

			await foundUser.save();
		}

		// TODO: redirect to success page on frontend
		res.status(StatusCodes.PERMANENT_REDIRECT).redirect(FRONTEND_URL);
	} catch (err) {
		logger.error(err);
		// TODO: redirect should be to frontend connect account page
		return res.redirect(FRONTEND_URL);
	}
};
