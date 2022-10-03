import { config } from "dotenv";
import express, { Application } from "express";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import logger from "./utils/logger.util";
import "./utils/passport.util";

import deserializeUser from "./middleware/deserializeUser.middleware";
import authRouter from "./routes/auth.routes";
import cookieSession from "cookie-session";
import userRouter from "./routes/user.routes";
import ticketRouter from "./routes/ticket.routes";

config();

const app: Application = express();

app.use(
	cookieSession({
		maxAge: 60 * 60 * 24 * 1000,
		keys: ["secret"],
		secret: "secret",
	}),
);

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(deserializeUser);
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", ticketRouter);

mongoose.connect(process.env.DB_URI as string, () => {
	const PORT = process.env.PORT || 3001;

	logger.info("Connected to Database!");

	app.listen(PORT, () => {
		logger.info(`Server listening on http://localhost:${PORT}`);
	});
});
