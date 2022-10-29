import { Request, Response } from "express";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { GetEmailsFromGmailSchema, PostSendGmailSchema } from "../schemas/mail.schema";
import { ConnectedServices, User } from "../models/user.model";
import logger from "../utils/logger.util";
import { URLSearchParams } from "url";
import { createTransport, SendMailOptions, Transporter } from "nodemailer";

/**
 * This function will fetch all the emails from gmail
 * @param req express request
 * @param res express response
 *
 * @author aayushchugh
 */
export const getEmailsFromGmailHandler = async (
	req: Request<GetEmailsFromGmailSchema["params"], {}, {}, GetEmailsFromGmailSchema["query"]>,
	res: Response,
) => {
	try {
		const { email } = req.params;
		const { maxResults, pageToken, q, includeSpamTrash } = req.query;
		const user = res.locals.user as User;

		// get email accessToken
		const foundService = user.connected_services.find(
			(service: ConnectedServices) => service.email === email,
		);

		if (!foundService) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "Account not connected",
			});
		}

		const fetchEmailsQueryURL = new URLSearchParams({
			maxResults: maxResults || "100",
			pageToken: pageToken || "",
			q: q || "",
			includeSpamTrash: includeSpamTrash || "false",
		});

		const response = await axios.get(
			`https://gmail.googleapis.com/gmail/v1/users/${email}/messages?${fetchEmailsQueryURL.toString()}`,
			{
				headers: {
					Authorization: `Bearer ${foundService.access_token}`,
					"Content-type": "application/json",
				},
			},
		);

		return res.status(StatusCodes.OK).json({
			message: "Emails fetched successfully",
			records: response.data.messages,
			size: response.data.messages.length,
			nextPageToken: response.data.nextPageToken,
		});
	} catch (err) {
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};

/**
 * This controller will send a email from users gmail account
 * @param req express request
 * @param res express response
 *
 * @author aayushchugh
 */
export const postSendGmailHandler = async (
	req: Request<PostSendGmailSchema["params"], {}, PostSendGmailSchema["body"]>,
	res: Response,
) => {
	const { email } = req.params;
	const { to, subject, html } = req.body;
	const user = res.locals.user as User;

	try {
		const connectedAccount = user.connected_services.find((service) => service.email === email);

		if (!connectedAccount) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "Account not connected",
			});
		}

		const transporter: Transporter = createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: email,
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				refreshToken: connectedAccount.refresh_token,
				accessToken: connectedAccount.access_token,
			},
		});

		const mailOptions: SendMailOptions = {
			from: user.email,
			to,
			subject,
			html,
		};

		await transporter.sendMail(mailOptions);

		return res.status(StatusCodes.OK).json({
			message: "Email sent successfully",
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};
