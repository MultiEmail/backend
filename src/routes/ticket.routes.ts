import { Router } from "express";
import {
	createTicketHandler,
	deleteTicketHandler,
	getAllTicketsHandler,
} from "../controllers/ticket.controller";
import requireAdminRole from "../middleware/requireAdminRole.middleware";
import validateRequest from "../middleware/validateRequest.middleware";
import { createTicketSchema, deleteTicketSchema } from "../schemas/ticket.schema";

export const ticketRouter: Router = Router();

ticketRouter
	.route("/tickets")
	.post(validateRequest(createTicketSchema), createTicketHandler)
	.get(requireAdminRole, getAllTicketsHandler);

ticketRouter
	.route("/tickets/:id")
	.delete(requireAdminRole, validateRequest(deleteTicketSchema), deleteTicketHandler);
