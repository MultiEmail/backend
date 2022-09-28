import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { logoutHandler } from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);

//TODO: create signup handler controller that will create a new user in the database after google login

authRouter.get(
	"/auth/google/redirect",
	// TODO: redirect to client login success and failure page instead on server
	passport.authenticate("google", {
		failureRedirect: "/api/auth/google/fail",
		successRedirect: "/api/auth/google/success",
	})
);

authRouter.get("/auth/google/success", (req, res) => {
	console.log("====================================");
	console.log(req.user);
	console.log("====================================");

	const user = req.user as any;

	return res.status(StatusCodes.OK).json({
		message: `Login successful welcome ${user.displayName}`,
	});
});

authRouter.get("/auth/logout", logoutHandler);

export default authRouter;
