import { Request, Response } from "express";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { GetEmailsFromGmailSchema } from "../schemas/mail.schema";
import { ConnectedServices, User } from "../models/user.model";
import logger from "../utils/logger.util";
import { URLSearchParams } from "url";

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
		const { maxResults, pageToken } = req.query;
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
