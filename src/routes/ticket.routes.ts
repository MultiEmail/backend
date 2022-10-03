import { Router } from "express";
import {
	createTicketHandler,
	deleteTicketHandler,
	getAllTicketsHandler,
	patchTicketStatusHandler,
} from "../controllers/ticket.controller";
import requireAdminRole from "../middleware/requireAdminRole.middleware";
import validateRequest from "../middleware/validateRequest.middleware";
import {
	createTicketSchema,
	deleteTicketSchema,
	patchTicketStatusSchema,
} from "../schemas/ticket.schema";

const ticketRouter: Router = Router();

ticketRouter
	.route("/tickets")
	.post(validateRequest(createTicketSchema), createTicketHandler)
	.get(requireAdminRole, getAllTicketsHandler);

ticketRouter
	.route("/tickets/:id")
	.delete(requireAdminRole, validateRequest(deleteTicketSchema), deleteTicketHandler)
	.patch(requireAdminRole, validateRequest(patchTicketStatusSchema), patchTicketStatusHandler);

export default ticketRouter;
