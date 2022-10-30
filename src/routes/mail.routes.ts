import { Router } from "express";
import {
	getEmailFromGmailHandler,
	getEmailsFromGmailHandler,
	postSendGmailHandler,
} from "../controllers/mail.controller";
import deserializeUser from "../middleware/deserializeUser.middleware";
import getCurrentConnectedService from "../middleware/getCurrentConnectedService.middleware";
import requireSameUser from "../middleware/requireSameUser.middleware";
import {
	getEmailFromGmailSchema,
	getEmailsFromGmailSchema,
	postSendGmailSchema,
} from "../schemas/mail.schema";
import validateRequest from "../middleware/validateRequest.middleware";

const mailRouter = Router();

mailRouter
	.route("/mail/:id/gmail/:email")
	.get(
		requireSameUser,
		validateRequest(getEmailsFromGmailSchema),
		getCurrentConnectedService,
		getEmailsFromGmailHandler,
	)
	.post(
		requireSameUser,
		validateRequest(postSendGmailSchema),
		getCurrentConnectedService,
		postSendGmailHandler,
	);

/**
 * This route does following things
 * GET -> fetch single message from Gmail
 *
 * @author tharun634
 */
mailRouter.get(
	"/mail/:id/gmail/:email/:messageId",
	validateRequest(getEmailFromGmailSchema),
	deserializeUser,
	requireSameUser,
	getEmailFromGmailHandler,
);

export default mailRouter;
