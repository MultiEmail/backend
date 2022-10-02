import { logger } from "@typegoose/typegoose/lib/logSettings";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { getAllTicketsHandler } from "../controllers/ticket.controller";
import checkAdminRole from "../middleware/checkAdminRole.middleware";
import TicketModel from "../models/ticket.model";
import { createTicket } from "../services/ticket.service";
import validateRequest from "../middleware/validateRequest.middleware";
import { createTicketSchema } from "../schemas/ticket.schema";

export const supportRoute: Router = Router();

supportRoute.post("/ticket", validateRequest(createTicketSchema), async (req, res) => {
	const ticket = await createTicket(req.body);
	return res.status(200).json({ message: "Successfully created ticket", ticket });
});

/* It's fetching all records from the database. */
supportRoute.get("/supports/", checkAdminRole, getAllTicketsHandler);

/* It's fetching a record from the database by id. */
supportRoute.get("/support/:id", checkAdminRole, async (req, res) => {
	const id = req.params?.id;
	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid id" });
	const rec = await TicketModel.findById({ id });
	if (!rec)
		return res.status(404).json({ message: `Record ${rec} doesn't exist in our database..` });

	res.status(StatusCodes.OK).json({ message: `Fetched record ${rec.topic}!` });
});

/* It's deleting a record from the database. */
supportRoute.delete("/support/delete/:id", checkAdminRole, async (req, res) => {
	const id = req.params.id;
	if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ message: `You didn't pass an id` });

	const record = await TicketModel.findByIdAndDelete({ id });
	if (!record)
		return res
			.status(StatusCodes.NOT_FOUND)
			.json({ message: `Record ${record} doesn't exist in our database....` });

	res.status(StatusCodes.OK).json({ message: `Deleted record ${record}` });
});
