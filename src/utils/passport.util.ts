import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import "dotenv/config";
import UserModel from "../models/user.model";
import logger from "./logger.util";

passport.use(
	new Strategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			callbackURL: "http://localhost:3001/api/auth/oauth/google/redirect",
			scope: ["profile", "email"],
		},

		async function (accessToken: string, refreshToken: string, profile: any, done: any) {
			const user = await UserModel.findOne({ email: profile.emails[0].value });
			if (user) {
				logger.info(`Email ${user.email} already exists`);
				return done(null, profile);
			}
			await UserModel.create({
				email: profile.emails[0].value,
				username: profile.displayName,
				googleId: profile.id,
			}).then(() =>
				logger.info(`Inserted email ${profile.emails[0].value} into the database`),
			);
			return done(null, profile);
		},
	),
);

passport.serializeUser(function (user: any, done: any) {
	done(null, user);
});

passport.deserializeUser(function (user: any, done: any) {
	done(null, user);
});
