import { Router } from "express";
import passport from "passport";
import { logoutHandler } from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.get(
	"/auth/oauth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

//TODO: create signup handler controller that will create a new user in the database after google login

authRouter.get(
	"/auth/oauth/google/redirect",
	// TODO: redirect to client login success and failure page instead on server
	passport.authenticate("google", {
		failureRedirect: "/failed",
		successRedirect: "/good",
	})
);

authRouter.get("/auth/logout", logoutHandler);

export default authRouter;
