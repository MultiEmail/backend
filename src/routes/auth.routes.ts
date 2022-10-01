import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import {
	forgotPasswordHandler,
	getCurrentUserHandler,
	loginHandler,
	logoutHandler,
	resetPasswordHandler,
	signupHandler,
	verifyUserHandler,
} from "../controllers/auth.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import {
	forgotPasswordSchema,
	loginSchema,
	resetPasswordSchema,
	signupSchema,
	verifyUserSchema,
} from "../schemas/auth.schema";
const authRouter: Router = Router();

authRouter.post("/auth/signup", validateRequest(signupSchema), signupHandler);

authRouter.get(
	// QUESTION: should we use username to find the user or email?
	"/auth/verify/:email/:verificationCode",
	validateRequest(verifyUserSchema),
	verifyUserHandler
);

authRouter.post("/auth/login", validateRequest(loginSchema), loginHandler);

authRouter.get("/auth/logout", logoutHandler);

authRouter.get("/auth/me", getCurrentUserHandler);

authRouter.post(
	"/auth/forgotpassword",
	validateRequest(forgotPasswordSchema),
	forgotPasswordHandler
);

authRouter.patch(
	"/auth/resetpassword/:email/:passwordResetCode",
	validateRequest(resetPasswordSchema),
	resetPasswordHandler
);

authRouter.get(
	"/auth/oauth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);

authRouter.get(
	"/auth/oauth/google/redirect",
	passport.authenticate("google", {
		failureRedirect: "/api/auth/google/fail",
		successRedirect: "/api/auth/google/success",
	})
);

authRouter.get("/auth/oauth/google/success", async (req, res) => {
	const user = req.user as any;

	return res.status(StatusCodes.OK).json({
		message: `Login successful welcome ${user.displayName}`,
	});
});

export default authRouter;
