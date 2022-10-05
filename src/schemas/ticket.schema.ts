import { z } from "zod";

/**
 * This schema is used to validate `POST /ticket` request
 *
 * @constant
 * @author aayushchugh
 */
export const createTicketSchema = z.object({
	body: z.object({
		name: z
			.string({ required_error: "Name is required" })
			.min(3, "Name must be minimum 3 characters")
			.max(50, "Name can not be longer than 50 characters"),

		email: z
			.string({ required_error: "Email is required" })
			.email("Please enter a valid email"),

		subject: z
			.string({ required_error: "Title is required" })
			.min(10, "Title must be minimum 10 characters")
			.max(300, "Title can not be longer than 300 characters"),

		message: z
			.string({ required_error: "Description is required" })
			.max(1000, "Description can not be longer than 1000 characters"),
	}),
});

/**
 * This type is generated using createTicketSchema and can be used
 * as express Request type generic
 *
 * @author aayushchugh
 */
export type CreateTicketSchema = z.TypeOf<typeof createTicketSchema>;

/**
 * This schema is used to validate `PATCH /tickets/:id` request
 *
 * @author aayushchugh
 */
export const patchTicketStatusSchema = z.object({
	body: z.object({
		status: z.enum(["new", "in-progress", "solved"], { required_error: "Status is required" }),
	}),
	params: z.object({
		id: z.string({ required_error: "Id is required" }),
	}),
});

/**
 * This type is generated using `patchTicketSchema` and can be used
 * as express Request type generic
 *
 * @author aayushchugh
 */
export type PatchTicketStatusSchema = z.TypeOf<typeof patchTicketStatusSchema>;

/**
 * This schema is used to validate `DELETE /tickets/:id` request
 *
 * @author aayushchugh
 */
export const deleteTicketSchema = z.object({
	params: z.object({
		id: z.string({ required_error: "Id is required" }),
	}),
});

/**
 * This type is generated using `deleteTicketSchema` and can be used
 * as express Request type generic
 *
 * @author aayushchugh
 */
export type DeleteTicketSchema = z.TypeOf<typeof deleteTicketSchema>;
