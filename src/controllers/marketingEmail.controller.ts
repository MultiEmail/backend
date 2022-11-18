import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateMarketingEmailSchema } from "../schemas/marketingEmail.schema";
import {
	createMarketingEmailService,
	findMarketingEmailsService,
} from "../services/marketingEmail.service";
import { findUserByIdService, findUsersService } from "../services/user.service";
import { sendEmail } from "../utils/email.util";

/**
 * This controller will send marketing emails
 *
 * @param req express request
 * @param res express response
 *
 * @author tharun634, aayushchugh
 */
export const createMarketingEmailHandler = async (
	req: Request<{}, {}, CreateMarketingEmailSchema["body"]>,
	res: Response,
) => {
	try {
		const { subject, specificUsers, allUsers, html } = req.body;

		// validate request
		if (!specificUsers && !allUsers) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: "You must select either specificUsers or allUsers",
			});
		}

		if (specificUsers && specificUsers.length > 0 && allUsers) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: "You can only select one, specificUsers or allUsers",
			});
		}

		/**
		 * this helper function will generate url to unsubscribe user from marketing emails
		 * @param userId id of the user
		 *
		 * @author aayushchugh
		 */
		const unsubscribeUserURLGenerator = (userId: string) => {
			return `<a href="${process.env.BASE_URL}/api/users/${userId}/marketing-emails/unsubscribe">Unsubscribe</a>`;
		};

		/**
		 * Send email to all the users those have selected the checkbox
		 */
		if (allUsers) {
			const users = await findUsersService({ receive_marketing_emails: true });

			if (!users) {
				return res.status(StatusCodes.NOT_FOUND).json({
					error: "No user has opted to receive marketing emails",
				});
			}

			users.forEach(
				async (user) =>
					await sendEmail(
						user.email,
						subject,
						`${html}${unsubscribeUserURLGenerator(user._id)}`,
					),
			);

			await createMarketingEmailService({
				subject,
				users: users.map((user) => user._id),
			});

			return res.status(StatusCodes.OK).json({
				message: "Email sent successfully",
			});
		}

		/**
		 * Send email to specific users
		 */
		if (specificUsers && specificUsers.length > 0) {
			// get specific users from DB
			const users = await Promise.all(
				specificUsers.map((userId) => findUserByIdService(userId)),
			);

			users.forEach(
				async (user) =>
					user &&
					user.receive_marketing_emails &&
					(await sendEmail(
						user.email,
						subject,
						`${html}${unsubscribeUserURLGenerator(user._id)}`,
					)),
			);

			await createMarketingEmailService({
				subject,
				users: users.map((user) => user && user.receive_marketing_emails && user._id),
			});

			return res.status(StatusCodes.OK).json({
				message: "Email sent successfully",
			});
		}
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
};

/**
 * This controller will fetch all marketing emails from database
 *
 * @param req request
 * @param res response
 *
 * @author tharun634
 */
export const getAllMarketingEmailsHandler = async (req: Request, res: Response) => {
	try {
		const records = await findMarketingEmailsService();

		return res.status(StatusCodes.OK).json({
			message: "Successfully fetched all marketing emails",
			records,
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
};
