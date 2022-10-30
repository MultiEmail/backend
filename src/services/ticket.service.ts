import { DocumentDefinition, FilterQuery, UpdateQuery } from "mongoose";
import TicketModel, { Ticket } from "../models/ticket.model";

/**
 * Find tickets from database with given query
 * @param {FilterQuery<Ticket>} query filter which will be used to find tickets from database
 *
 * @author aayushchugh
 */
export function findTicketsService(query?: FilterQuery<Ticket>) {
	return TicketModel.find(query || {});
}

/**
 * Find ticket from database with given id
 * @param {string} id id of the ticket which will be used to find ticket from database
 *
 * @author aayushchugh
 */
export function findTicketsByIdService(id: string) {
	return TicketModel.findById(id);
}

/**
 * Create ticket in database
 * @param {DocumentDefinition<Ticket>} payload payload which will be used to create ticket in database
 *
 * @author aayushchugh
 */
export function createTicketService(payload: DocumentDefinition<Ticket>) {
	return TicketModel.create(payload);
}

/**
 * It takes an id and a payload, and then it updates the ticket with the given id with the given
 * payload
 * @param {string} id - string - the id of the ticket to update
 * @param payload - UpdateQuery<Ticket>
 * @returns A promise that resolves to the updated ticket.
 *
 * @author aayushchugh
 */
export function updateTicketByIdService(id: string, payload: UpdateQuery<Ticket>) {
	return TicketModel.findByIdAndUpdate(id, payload, { new: true });
}

/**
 * It deletes all the tickets that match the query
 * @param query - filter which will be used to delete tickets from database
 *
 * @author aayushchugh
 */
export function deleteAllTicketsService(query: FilterQuery<Ticket>) {
	return TicketModel.deleteMany(query);
}

/**
 * It takes an id as a parameter, and returns a promise that will resolve to the deleted ticket
 * @param {string} id - The id of the ticket to be deleted.
 * @returns A promise that will resolve to the deleted ticket.
 *
 * @author aayushchugh
 */
export function deleteTicketByIdService(id: string) {
	return TicketModel.findByIdAndDelete(id);
}
