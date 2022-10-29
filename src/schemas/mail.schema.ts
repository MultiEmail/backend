import { z } from "zod";

/**
 * This schema will validate `GET /mail/gmail/:email` route
 *
 * @author aayushchugh
 */
export const getEmailsFromGmailSchema = z.object({
	params: z.object({
		email: z.string({ required_error: "Email is required" }),
	}),
	query: z.object({
		maxResults: z.string().optional(),
		pageToken: z.string().optional(),
		q: z.string().optional(),
		includeSpamTrash: z.string().optional(),
	}),
});

/**
 * This type is generated using `getEmailsFromGmailSchema`
 *
 * @author aayushchugh
 */
export type GetEmailsFromGmailSchema = z.TypeOf<typeof getEmailsFromGmailSchema>;

/**
 * This schema will validate `POST /mail/gmail/:email` route
 *
 * @author aayushchugh
 */
export const postSendGmailSchema = z.object({
	body: z.object({
		to: z.string({ required_error: "to is required" }).email("to must be a valid email"),
		subject: z.string({ required_error: "subject is required" }),
		html: z.string({ required_error: "html is required" }),
	}),
	params: z.object({
		email: z
			.string({ required_error: "email param is required" })
			.email("please enter a valid email param"),
	}),
});

/**
 * This type is generated from `sendGmailSchema`
 *
 * @author aayushchugh
 */
export type PostSendGmailSchema = z.TypeOf<typeof postSendGmailSchema>;

/**
 * This schema will validate `/mail/:id/gmail/:email/:messageId` route
 *
 * @author tharun634
 */
export const getEmailFromGmailSchema = z.object({
	params: z.object({
		email: z.string({ required_error: "Email is required" }),
		messageId: z.string({ required_error: "messageId is required" }),
	}),
});

/**
 * This type is generated using `getEmailFromGmailSchema`
 *
 * @author tharun634
 */
export type GetEmailFromGmailSchema = z.TypeOf<typeof getEmailFromGmailSchema>;
