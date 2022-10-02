import { z } from "zod";

export const deleteUserSchema = z.object({
	params: z.object({
		id: z.string({ required_error: "Id is required" }),
	}),
});

export type DeleteUserSchema = z.infer<typeof deleteUserSchema>;

export const patchMarkUserVerifiedSchema = z.object({
	params: z.object({
		id: z.string({ required_error: "Id is required" }),
	}),
});

export type PatchMarkUserVerifiedSchema = z.infer<
	typeof patchMarkUserVerifiedSchema
>;

export const patchUserSchema = z.object({
	params: z.object({
		id: z.string({ required_error: "Id is required" }),
	}),
	body: z.object({
		username: z.string().optional(),
	}),
});

export type PatchUserSchema = z.infer<typeof patchUserSchema>;
