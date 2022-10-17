import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import {
	CreateMarketingEmailSchema,
	SendMarketingEmailSchema,
} from "../schemas/marketingEmail.schema";
import {
	createMarketingEmailService,
	sendMarketingEmailService,
} from "../services/marketingEmail.service";

/**
 * This controller creates a marketing email
 *
 * @param req - Request<{}, {}, CreateMarketingEmailSchema["body"]>
 * @param {Response} res - Response - this is the response object that will be sent back to the client
 *
 * @author tharun634
 */
export const createMarketingEmailHandler = async (
	req: Request<{}, {}, CreateMarketingEmailSchema["body"]>,
	res: Response,
) => {
	try {
		const { subject, users } = req.body;
		await createMarketingEmailService({
			subject,
			users: users.map((user) => new Types.ObjectId(user)),
		});
		res.status(StatusCodes.CREATED).json({
			message: "Successfully created marketing email",
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
};

/**
 * This controller sends a marketing email
 *
 * @param req - Request<{}, {}, SendMarketingEmailSchema["body"]>
 * @param {Response} res - Response - this is the response object that will be sent back to the client
 *
 * @author tharun634
 */
export const sendMarketingEmailHandler = async (
	req: Request<{}, {}, SendMarketingEmailSchema["body"]>,
	res: Response,
) => {
	try {
		const { html, subject } = req.body;
		await sendMarketingEmailService(html, subject);
		res.status(StatusCodes.OK).json({
			message: "Successfully sent marketing email(s)",
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
};
