import { z } from "zod";

/**
 * This schema is used to validate `DELETE /users/:id` request
 *
 * @author aayushchugh, is-it-ayush
 */
export const deleteUserSchema = z.object({
	params: z.object({
		id: z.string({ required_error: "Id is required" }),
	}),
});

/**
 * This type is generated using `deleteUserSchema` and can be used
 * as express Request type generic
 *
 * @author aayushchugh, is-it-ayush
 */
export type DeleteUserSchema = z.infer<typeof deleteUserSchema>;

/**
 * This schema is used to validate `/users/markverified/:id` request
 *
 * @author aayushchugh, is-it-ayush
 */
export const patchMarkUserVerifiedSchema = z.object({
	params: z.object({
		id: z.string({ required_error: "Id is required" }),
	}),
});

/**
 * This type is generated using `patchMarkUserVerifiedSchema` and can be used
 * as express Request type generic
 *
 * @author aayushchugh, is-it-ayush
 */
export type PatchMarkUserVerifiedSchema = z.infer<typeof patchMarkUserVerifiedSchema>;

/**
 * This schema is used to validate `/admin/users/markadmin/:id` request
 *
 * @author tharun634
 */
export const patchMarkUserAdminSchema = z.object({
	params: z.object({
		id: z.string({ required_error: "Id is required" }),
	}),
});

// eslint-disable-next-line no-secrets/no-secrets
/**
 * This type is generated using `patchMarkUserAdminSchema` and can be used
 * as express Request type generic
 *
 * @author tharun634
 */
export type PatchMarkUserAdminSchema = z.infer<typeof patchMarkUserAdminSchema>;

/**
 * This schema is used to validate `GET /admin/users/:id` request
 *
 * @author tharun634, aayushchugh
 */
export const getAllUsersSchema = z.object({
	query: z.object({
		page: z.string().min(1, "page must be greater than 0").optional(),
		size: z.string().min(1, "limit must be greater than 0").optional(),
		receiveMarketingEmails: z.boolean().optional(),
	}),
});

/**
 * This type is generated using `getAllUsersHandler` and can be used
 * as express Request type generic
 *
 * @author tharun634
 */
export type GetAllUsersSchema = z.TypeOf<typeof getAllUsersSchema>;

/**
 * This schema is used to validate `PATCH /users/:id` request
 *
 * @author aayushchugh
 */
export const patchUserSchema = z.object({
	params: z.object({
		id: z.string({ required_error: "Id is required" }),
	}),
	body: z.object({
		username: z.string().optional(),
	}),
});

/**
 * This type is generated using `patchUserSchema` and can be used
 * as express Request type generic
 *
 * @author aayushchugh
 */
export type PatchUserSchema = z.infer<typeof patchUserSchema>;

/**
 * This schema is used to validate `GET /users/:id/marketing-emails/unsubscribe` request
 *
 * @author aayushchugh
 */
export const getUnsubscribeUserFromMarketingEmailSchema = z.object({
	params: z.object({
		id: z.string({ required_error: "id is required" }),
	}),
});

// eslint-disable-next-line no-secrets/no-secrets
/**
 * This type is generated using `unsubscribeUserFromMarketingEmailSchema`
 *
 * @author aayushchugh
 */
export type GetUnsubscribeUserFromMarketingEmailSchema = z.TypeOf<
	typeof getUnsubscribeUserFromMarketingEmailSchema
>;
