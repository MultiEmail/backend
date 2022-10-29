import { Router } from "express";
import { getEmailsFromGmailHandler, postSendGmailHandler } from "../controllers/mail.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import { getEmailsFromGmailSchema, postSendGmailSchema } from "../schemas/mail.schema";

const mailRouter = Router();

mailRouter
	.route("/mail/:id/gmail/:email")
	.get(validateRequest(getEmailsFromGmailSchema), getEmailsFromGmailHandler)
	.post(validateRequest(postSendGmailSchema), postSendGmailHandler);

export default mailRouter;
