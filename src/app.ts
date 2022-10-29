import { config } from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import logger from "./utils/logger.util";

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import ticketRouter from "./routes/ticket.routes";
import rateLimiter from "./middleware/rateLimiter.middleware";
import adminRouter from "./routes/admin.routes";
import mailRouter from "./routes/mail.routes";
import deserializeUser from "./middleware/deserializeUser.middleware";
import requireAdminRole from "./middleware/requireAdminRole.middleware";
import requireSameUser from "./middleware/requireSameUser.middleware";

config();

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(rateLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", ticketRouter);
app.use("/api", deserializeUser, requireSameUser, mailRouter);
app.use("/api", deserializeUser, requireAdminRole, adminRouter);

logger.info("Current Environment: " + process.env.NODE_ENV);

if (process.env.NODE_ENV?.trim() !== "test") {
	mongoose.connect(process.env.DB_URI as string, () => {
		const PORT = process.env.PORT || 3001;

		logger.info("Connected to Database!");

		app.listen(PORT, () => {
			logger.info(`Server listening on http://localhost:${PORT}`);
		});
	});
}

module.exports = app;
