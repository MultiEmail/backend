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

// NOTE: all routes defined with `ticketRouter` will be pre-fixed with `/api`

/**
 * This route will do following
 * POST -> create new ticket
 * GET -> get all tickets (protected for admin)
 *
 * @author aayushchugh
 */
ticketRouter
	.route("/tickets")
	.post(validateRequest(createTicketSchema), createTicketHandler)
	.get(requireAdminRole, getAllTicketsHandler);

/**
 * This route will do following
 * PATCH -> update ticket status (protected for admin)
 * DELETE -> delete ticket (protected for admin)
 *
 * @author aayushchugh
 */
ticketRouter
	.route("/tickets/:id")
	.delete(requireAdminRole, validateRequest(deleteTicketSchema), deleteTicketHandler)
	.patch(requireAdminRole, validateRequest(patchTicketStatusSchema), patchTicketStatusHandler);

export default ticketRouter;
