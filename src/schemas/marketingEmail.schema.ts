import { z } from "zod";

/**
 * This schema is used to validate `POST /marketing` request
 *
 * @constant
 * @author tharun634
 */
export const createMarketingEmailSchema = z.object({
	body: z.object({
		subject: z.string({ required_error: "subject is required" }),
		users: z.string().array().nonempty({ message: "users is required" }),
	}),
});

/**
 * This type is generated using createMarketingEmailSchema and can be used
 * as express Request type generic
 *
 * @author tharun634
 */
export type CreateMarketingEmailSchema = z.TypeOf<typeof createMarketingEmailSchema>;

/**
 * This schema is used to validate `POST /marketing-email` request
 *
 * @constant
 * @author tharun634
 */
export const sendMarketingEmailSchema = z.object({
	body: z.object({
		html: z.string({ required_error: "html is required" }),
		subject: z.string({ required_error: "subject is required" }),
	}),
});

/**
 * This type is generated using sendMarketingEmailSchema and can be used
 * as express Request type generic
 * @author tharun634
 *
 */

export type SendMarketingEmailSchema = z.TypeOf<typeof sendMarketingEmailSchema>;
