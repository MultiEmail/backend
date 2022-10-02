import { FilterQuery, DocumentDefinition } from "mongoose";
import TicketModel, { Ticket } from "../models/ticket.model";

/**
 * Find tickets from database with given query
 * @param {FilterQuery<Ticket>} query filter which will be used to find tickets from database
 */
export function findTickets(query?: FilterQuery<Ticket>) {
	return TicketModel.find(query || {});
}

/**
 * Find ticket from database with given id
 * @param {string} id id of the ticket which will be used to find ticket from database
 */
export function findTicketsById(id: string) {
	return TicketModel.findById(id);
}

/**
 * Create ticket in database
 * @param {DocumentDefinition<Ticket>} payload payload which will be used to create ticket in database
 */
export function createTicket(payload: DocumentDefinition<Ticket>) {
	return TicketModel.create(payload);
}


/**
 * It deletes all the tickets that match the query
 * @param query - filter which will be used to delete tickets from database
 */
export function delteAllTickets(query: FilterQuery<Ticket>) {
	return TicketModel.deleteMany(query);
}

/**
 * It takes an id as a parameter, and returns a promise that will resolve to the deleted ticket
 * @param {string} id - The id of the ticket to be deleted.
 * @returns A promise that will resolve to the deleted ticket.
 */
export function deleteTicketById(id: string) {
	return TicketModel.findByIdAndDelete(id);
}
