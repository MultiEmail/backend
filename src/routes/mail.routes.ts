import { Router } from "express";
import { getEmailsFromGmailHandler, postSendGmailHandler } from "../controllers/mail.controller";
import getCurrentConnectedService from "../middleware/getCurrentConnectedService.middleware";
import requireSameUser from "../middleware/requireSameUser.middleware";
import validateRequest from "../middleware/validateRequest.middleware";
import { getEmailsFromGmailSchema, postSendGmailSchema } from "../schemas/mail.schema";

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

export default mailRouter;
