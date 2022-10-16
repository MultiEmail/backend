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
