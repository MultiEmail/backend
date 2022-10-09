import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import {
	forgotPasswordHandler,
	getCurrentUserHandler,
	loginHandler,
	logoutHandler,
	refreshAccessTokenHandler,
	resetPasswordHandler,
	signupHandler,
	verifyUserHandler,
} from "../controllers/auth.controller";
import deserializeUser from "../middleware/deserializeUser.middleware";
import validateRequest from "../middleware/validateRequest.middleware";
import {
	forgotPasswordSchema,
	loginSchema,
	resetPasswordSchema,
	signupSchema,
	verifyUserSchema,
} from "../schemas/auth.schema";

const authRouter: Router = Router();

// NOTE: all routes defined with `authRouter` will be pre-fixed with `/api`

/**
 * Use can signup using this route
 * after he signup an email containing OTP will be sent to his email
 *
 * @author aayushchugh
 */
authRouter.post("/auth/signup", validateRequest(signupSchema), signupHandler);

/**
 * This route is used for verifying the user's email after
 * he sign's up
 *
 * `verificationCode` --> OTP sent on users email
 *
 * @author aayushchugh
 */
authRouter.get(
	"/auth/verify/:verificationCode",
	validateRequest(verifyUserSchema),
	deserializeUser,
	verifyUserHandler,
);

/**
 * User can login with this route.
 * a `access_token` and `refresh_token` will be sent
 * on login
 *
 * @author aayushchugh
 */
authRouter.post("/auth/login", validateRequest(loginSchema), loginHandler);

/**
 * this route will logout user
 *
 * @author aayushchugh
 */
authRouter.get("/auth/logout", logoutHandler);

/**
 * This route will get current user by using `access_token`
 *
 * @author aayushchugh
 */
authRouter.get("/auth/me", deserializeUser, getCurrentUserHandler);

/**
 * This route will send a passwordResetCode to provided email
 * and that code will be verified in /auth/resetpassword/:email/:passwordResetCode
 * route
 *
 * @author aayushchugh
 */
authRouter.post(
	"/auth/forgotpassword",
	validateRequest(forgotPasswordSchema),
	forgotPasswordHandler,
);

/**
 * This route will verify the code sent by forgotPasswordRoute
 * and will change the password in database
 *
 * @author aayushchugh
 */
authRouter.patch(
	"/auth/resetpassword/:email/:passwordResetCode",
	validateRequest(resetPasswordSchema),
	resetPasswordHandler,
);

/**
 * This route is used to refresh the `access_token` using
 * `refresh_token`
 *
 * @author aayushchugh
 */
authRouter.get("/auth/refresh", refreshAccessTokenHandler);

/**
 * This route will authenticate the user using google
 *
 * @author NullableDev
 */
authRouter.get(
	"/auth/oauth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	}),
);

/**
 * This route will redirect to /fail and /success route
 * from google concent screen
 *
 * @author NullableDev
 */
authRouter.get(
	"/auth/oauth/google/redirect",
	passport.authenticate("google", {
		failureRedirect: "/api/auth/google/fail",
		successRedirect: "/api/auth/google/success",
	}),
);

/**
 * this route will run if login with google is successful
 *
 * @author NullableDev
 */
authRouter.get("/auth/oauth/google/success", (req, res) => {
	const user = req.user as any;

	return res.status(StatusCodes.OK).json({
		message: `Login successful welcome ${user.displayName}`,
	});
});

export default authRouter;
