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