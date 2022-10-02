import { z } from "zod";

export const signupSchema = z.object({
	body: z
		.object({
			username: z
				.string({ required_error: "Please enter your username" })
				.min(3, "Name must be at least 3 characters")
				.max(50, "Name can't be longer than 50 characters")
				.regex(/^[a-z\d0-9]+$/),
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
		.refine(data => data.password === data.cpassword, {
			path: ["custom"],
			message: "Password and Confirm password do not match",
		}),
});

export type SignupSchema = z.TypeOf<typeof signupSchema>;

export const verifyUserSchema = z.object({
	params: z.object({
		verificationCode: z.string({
			required_error: "Verification code is required",
		}),
		email: z
			.string({ required_error: "Email is required" })
			.email("Please enter a valid email"),
	}),
});

export type VerifyUserSchema = z.TypeOf<typeof verifyUserSchema>;

export const loginSchema = z.object({
	body: z.object({
		email: z
			.string({ required_error: "Email is required" })
			.email("Invalid credentials"),

		password: z
			.string({ required_error: "Password is required" })
			.min(6, "Invalid credentials"),
	}),
});

export type LoginSchema = z.TypeOf<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
	body: z.object({
		email: z
			.string({ required_error: "Email is required" })
			.email("Please enter a valid email"),
	}),
});

export type ForgotPasswordSchema = z.TypeOf<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
	params: z.object({
		email: z
			.string({ required_error: "email is required" })
			.email("Please provide a valid email"),
		passwordResetCode: z
			.string({
				required_error: "passwordResetCode is required",
			})
			.min(4, "passwordResetCode must be 4 characters long")
			.max(4, "passwordResetCode must be 4 characters long"),
	}),
	body: z
		.object({
			password: z
				.string({ required_error: "password is required" })
				.min(6, "password should be longer than 4 characters"),

			cpassword: z
				.string({ required_error: "cpassword is required" })
				.min(6, "password should be longer than 4 characters"),
		})
		.refine(data => data.password === data.cpassword, {
			message: "Password and confirm password do not match",
			path: ["cpassword"],
		}),
});

export type ResetPasswordSchema = z.TypeOf<typeof resetPasswordSchema>;
