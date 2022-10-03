import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createTicketService, findTicketsService } from "../services/ticket.service";
import { CreateTicketSchema } from "../schemas/ticket.schema";

export async function createTicketHandler(
	req: Request<{}, {}, CreateTicketSchema["body"]>,
	res: Response,
) {
	const { message, name, email, subject } = req.body;

	try {
		// if user have already submitted tickets 3 times than don't let me submit more

		const existingTickets = await findTicketsService({ email, status: "new" });

		if (existingTickets.length >= 3) {
			return res.status(StatusCodes.CONFLICT).json({
				error: "You have already submitted 3 tickets, Please wait for our response",
			});
		}

		await createTicketService({ message, name, email, subject, status: "new" });

		res.status(StatusCodes.CREATED).json({
			message: "Successfully created support ticket, You will be contacted shortly",
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
}

export async function getAllTicketsHandler(req: Request, res: Response) {
	try {
		const records = await findTicketsService();
		res.status(StatusCodes.OK).json({
			message: "Successfully fetched all support tickets",
			records,
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
}
