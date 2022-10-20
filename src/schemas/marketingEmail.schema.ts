import { z } from "zod";

/**
 * This schema is used to validate `POST /marketing` request
 *
 * @author tharun634, aayushchugh
 */
export const createMarketingEmailSchema = z.object({
	body: z.object({
		subject: z.string({ required_error: "subject is required" }),
		html: z.string({ required_error: "html is required" }),
		specificUsers: z.array(z.string()).optional(),
		allUsers: z.boolean().optional(),
	}),
});

/**
 * This type is generated using createMarketingEmailSchema and can be used
 * as express Request type generic
 *
 * @author tharun634
 */
export type CreateMarketingEmailSchema = z.TypeOf<typeof createMarketingEmailSchema>;
