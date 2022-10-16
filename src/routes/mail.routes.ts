import { Router } from "express";
import { getEmailsFromGmailHandler } from "../controllers/mail.controller";
import deserializeUser from "../middleware/deserializeUser.middleware";
import requireSameUser from "../middleware/requireSameUser.middleware";

const mailRouter = Router();

mailRouter.get(
	"/mail/:id/gmail/:email",
	deserializeUser,
	requireSameUser,
	getEmailsFromGmailHandler,
);

export default mailRouter;
