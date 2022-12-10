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
import { ConnectedServices, User } from "../models/user.model";
import logger from "../utils/logger.util";
import { URLSearchParams } from "url";
import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import DOMPurify from "isomorphic-dompurify";
import { findUserByIdService, updateUserByIdService } from "../services/user.service";

/**
 * This interceptor will refresh the access token if it is expired
 *
 * @author aayushchugh
 */
axios.interceptors.response.use(
	(res) => res,
	async (err) => {
		if (err.request.host === "gmail.googleapis.com") {
			const originalRequest = err.config;
			const userEmail = originalRequest.url
				.split("/")
				.find((email: string) => email.includes("@"));
			const userId = originalRequest.url.split("=").pop();

			if (
				userEmail.split("@")[1] === "gmail.com" &&
				err.response.status === 401 &&
				!originalRequest._retry
			) {
				const user = (await findUserByIdService(userId)) as User;

				const refreshToken = user?.connected_services.find(
					(service) => service.email === userEmail,
				)?.refresh_token;

				const refreshAccessTokenQuery = new URLSearchParams({
					client_id: process.env.GOOGLE_CLIENT_ID as string,
					client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
					refresh_token: refreshToken as string,
					grant_type: "refresh_token",
				});

				const responseFromGoogle = await axios.post(
					`https://oauth2.googleapis.com/token?${refreshAccessTokenQuery.toString()}}`,
					{
						Headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					},
				);

				const newAccessToken = responseFromGoogle.data.access_token;
				const connectedServices = user.connected_services;
				const serviceIndex = connectedServices.findIndex(
					(service) => service.email === userEmail,
				);
				connectedServices[serviceIndex].access_token = newAccessToken;

				await updateUserByIdService(userId, { connected_services: connectedServices });

				return Promise.reject(new Error("Please try again"));
			}
		}
	},
);

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
			state: res.locals.user._id,
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
			`https://gmail.googleapis.com/gmail/v1/users/${currentConnectedService.email}/messages/${messageId}?state=${res.locals.user._id}`,
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
			state: res.locals.user._id,
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
			`https://gmail.googleapis.com/gmail/v1/users/${currentConnectedService.email}/messages/${messageId}?state=${res.locals.user._id}`,
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
