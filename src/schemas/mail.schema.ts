import { z } from "zod";

/**
 * This schema will validate `/mail/gmail/:email` route
 *
 * @author aayushchugh
 */
export const getEmailsFromGmailSchema = z.object({
	params: z.object({
		email: z.string({ required_error: "Email is required" }),
	}),
});

/**
 * This type is generated using `getEmailsFromGmailSchema`
 *
 * @author aayushchugh
 */
export type GetEmailsFromGmailSchema = z.TypeOf<typeof getEmailsFromGmailSchema>;
