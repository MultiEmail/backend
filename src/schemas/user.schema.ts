import { z } from "zod";

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
