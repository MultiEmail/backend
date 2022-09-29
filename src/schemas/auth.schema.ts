import { z } from "zod";

export const signupSchema = z.object({
	body: z
		.object({
			username: z
				.string({ required_error: "Please enter your email" })
				.min(3, "Name must be at least 3 characters")
				.max(50, "Name can't be longer than 50 characters"),
			email: z
				.string({ required_error: "Email is required" })
				.email("Please enter a valid email"),

			password: z
				.string({ required_error: "Password is required" })
				.min(6, "Password must be at least 6 characters"),
			cpassword: z
				.string({ required_error: "Confirm password is required" })
				.min(6, "Password must be at least 6 characters"),
		})
		.refine(data => data.password === data.cpassword, {}),
});

export type SignupSchema = z.TypeOf<typeof signupSchema>;
