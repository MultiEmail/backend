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
