import { Request, Response } from "express";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import {
	DeleteEmailFromGmailSchema,
	GetDraftsFromGmailSchema,
	GetEmailFromGmailSchema,
	GetEmailsFromGmailSchema,
	PostSendGmailSchema,
} from "../schemas/mail.schema";
import { ConnectedServices } from "../models/user.model";
import logger from "../utils/logger.util";
import { URLSearchParams } from "url";
import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import DOMPurify from "isomorphic-dompurify";

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
		const { maxResults, pageToken, q, includeSpamTrash } = req.query;
		const currentConnectedService = res.locals.currentConnectedService as ConnectedServices;

		const fetchEmailsQueryURL = new URLSearchParams({
			maxResults: maxResults || "100",
			pageToken: pageToken || "",
			q: q || "",
			includeSpamTrash: includeSpamTrash || "false",
		});

		const response = await axios.get(
			`https://gmail.googleapis.com/gmail/v1/users/${
				currentConnectedService.email
			}/messages?${fetchEmailsQueryURL.toString()}`,
			{
				headers: {
					Authorization: `Bearer ${currentConnectedService.access_token}`,
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
	} catch (err: any) {
		logger.error(err.response);

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
	const { to, subject, html } = req.body;
	const currentConnectedService = res.locals.currentConnectedService as ConnectedServices;

	try {
		const cleanedHTML = DOMPurify.sanitize(html);

		const transporter: Transporter = createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: currentConnectedService.email,
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				refreshToken: currentConnectedService.refresh_token,
				accessToken: currentConnectedService.access_token,
			},
		});

		const mailOptions: SendMailOptions = {
			from: currentConnectedService.email,
			to,
			subject,
			html: cleanedHTML,
		};

		await transporter.sendMail(mailOptions);

		return res.status(StatusCodes.OK).json({
			message: "Email sent successfully",
		});
	} catch (err) {
		logger.error(err);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};

/**
 * This function will fetch an email from gmail
 * @param req express request
 * @param res express response
 *
 * @author tharun634
 */
export const getEmailFromGmailHandler = async (
	req: Request<GetEmailFromGmailSchema["params"], {}, {}, {}>,
	res: Response,
) => {
	try {
		const { messageId } = req.params;
		const currentConnectedService = res.locals.currentConnectedService as ConnectedServices;

		const response = await axios.get(
			`https://gmail.googleapis.com/gmail/v1/users/${currentConnectedService.email}/messages/${messageId}`,
			{
				headers: {
					Authorization: `Bearer ${currentConnectedService.access_token}`,
					"Content-type": "application/json",
				},
			},
		);

		return res.status(StatusCodes.OK).json({
			message: "Email fetched successfully",
			record: response.data,
		});
	} catch (err: any) {
		logger.error(err.response);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};

/**
 * This function will fetch drafts from gmail
 * @param req express request
 * @param res express response
 *
 * @author tharun634
 */
export const getDraftsFromGmailHandler = async (
	req: Request<GetDraftsFromGmailSchema["params"], {}, {}, GetDraftsFromGmailSchema["query"]>,
	res: Response,
) => {
	try {
		const { maxResults, pageToken, q, includeSpamTrash } = req.query;
		const currentConnectedService = res.locals.currentConnectedService as ConnectedServices;

		const fetchDraftsQueryURL = new URLSearchParams({
			maxResults: maxResults || "100",
			pageToken: pageToken || "",
			q: q || "",
			includeSpamTrash: includeSpamTrash || "false",
		});

		const response = await axios.get(
			`https://gmail.googleapis.com/gmail/v1/users/${
				currentConnectedService.email
			}/drafts?${fetchDraftsQueryURL.toString()}`,
			{
				headers: {
					Authorization: `Bearer ${currentConnectedService.access_token}`,
					"Content-type": "application/json",
				},
			},
		);

		return res.status(StatusCodes.OK).json({
			message: "Drafts fetched successfully",
			records: response.data.drafts,
			size: response.data.drafts.length,
			nextPageToken: response.data.nextPageToken,
		});
	} catch (err: any) {
		logger.error(err.response);

		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};

export const deleteEmailFromGmailHandler = async (
	req: Request<DeleteEmailFromGmailSchema["params"]>,
	res: Response,
) => {
	try {
		const { messageId } = req.params;
		const currentConnectedService = res.locals.currentConnectedService as ConnectedServices;

		await axios.delete(
			`https://gmail.googleapis.com/gmail/v1/users/${currentConnectedService.email}/messages/${messageId}`,
			{
				headers: {
					Authorization: `Bearer ${currentConnectedService.access_token}`,
					"Content-type": "application/json",
				},
			},
		);

		return res.status(StatusCodes.OK).json({
			message: "Email deleted successfully",
		});
	} catch (err) {
		logger.error(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};
