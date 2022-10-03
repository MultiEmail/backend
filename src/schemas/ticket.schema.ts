import { z } from "zod";

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

export type CreateTicketSchema = z.TypeOf<typeof createTicketSchema>;
