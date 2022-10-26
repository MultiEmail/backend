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
