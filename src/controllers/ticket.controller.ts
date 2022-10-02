import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { findTickets } from "../services/ticket.service";
import { CreateTicketSchema } from "../schemas/ticket.schema";

export async function createTicket(
	req: Request<{}, {}, CreateTicketSchema["body"]>,
	res: Response,
) {
	const {  description, name, email, subject } = req.body;

	try {
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal server error",
		});
	}
}
export async function getAllTicketsHandler(req: Request, res: Response) {
	try {
		const records = await findTickets();
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
