import { Router } from "express";
import {
	deleteEmailFromGmailHandler,
	getDraftsFromGmailHandler,
	getEmailFromGmailHandler,
	getEmailsFromGmailHandler,
	postSendGmailHandler,
} from "../controllers/mail.controller";
import getCurrentConnectedService from "../middleware/getCurrentConnectedService.middleware";
import requireSameUser from "../middleware/requireSameUser.middleware";
import {
	deleteEmailFromGmailSchema,
	getDraftsFromGmailSchema,
	getEmailFromGmailSchema,
	getEmailsFromGmailSchema,
	postSendGmailSchema,
} from "../schemas/mail.schema";
import validateRequest from "../middleware/validateRequest.middleware";
import deserializeUser from "../middleware/deserializeUser.middleware";

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
 * DELETE -> delete single message from Gmail
 *
 * @author tharun634, aayushchugh
 */
mailRouter
	.route("/mail/:id/gmail/:email/:messageId")
	.get(
		validateRequest(getEmailFromGmailSchema),
		deserializeUser,
		getCurrentConnectedService,
		requireSameUser,
		getEmailFromGmailHandler,
	)
	.delete(
		validateRequest(deleteEmailFromGmailSchema),
		deserializeUser,
		getCurrentConnectedService,
		requireSameUser,
		deleteEmailFromGmailHandler,
	);

/**
 * This route does following things
 * GET -> fetch drafts from Gmail
 *
 * @author tharun634
 */
mailRouter.get(
	"/mail/:id/gmail/:email/drafts",
	requireSameUser,
	validateRequest(getDraftsFromGmailSchema),
	getCurrentConnectedService,
	getDraftsFromGmailHandler,
);

export default mailRouter;
