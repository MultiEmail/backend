import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { signupHandler } from "../controllers/auth.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import { signupSchema } from "../schemas/auth.schema";
const authRouter: Router = Router();

authRouter.post(
	"/auth/local/signup",
	validateRequest(signupSchema),
	signupHandler
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
