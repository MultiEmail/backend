import { z } from "zod";

/**
 * This is schema to validate /auth/signup request
 *
 * @constant
 * @author aayushchugh
 */
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
		.refine((data) => data.password === data.cpassword, {
			path: ["custom"],
			message: "Password and Confirm password do not match",
		}),
});

/**
 * This type is generated using signupSchema and can be used
 * as express Request type generic
 *
 * @author aayushchugh
 */
export type SignupSchema = z.TypeOf<typeof signupSchema>;

/**
 * This is schema to validate /auth/verify/:email/:verificationCode request
 *
 * @constant
 * @author aayushchugh
 */
export const verifyUserSchema = z.object({
	params: z.object({
		verificationCode: z.string({
			required_error: "Verification code is required",
		}),
	}),
});

/**
 * This type is generated using verifyUserSchema and can be used
 * as express Request type generic
 *
 * @author aayushchugh
 */
export type VerifyUserSchema = z.TypeOf<typeof verifyUserSchema>;

/**
 * This is schema to validate /auth/login request
 *
 * @constant
 * @author aayushchugh
 */
export const loginSchema = z.object({
	body: z.object({
		email: z.string({ required_error: "Email is required" }).email("Invalid credentials"),

		password: z
			.string({ required_error: "Password is required" })
			.min(6, "Invalid credentials"),
	}),
});

/**
 * This type is generated using loginSchema and can be used
 * as express Request type generic
 *
 * @author aayushchugh
 */
export type LoginSchema = z.TypeOf<typeof loginSchema>;

/**
 * This is schema to validate /auth/login request
 *
 * @constant
 * @author aayushchugh
 */
export const forgotPasswordSchema = z.object({
	body: z.object({
		email: z
			.string({ required_error: "Email is required" })
			.email("Please enter a valid email"),
	}),
});

/**
 * This type is generated using forgotPasswordSchema and can be used
 * as express Request type generic
 *
 * @author aayushchugh
 */
export type ForgotPasswordSchema = z.TypeOf<typeof forgotPasswordSchema>;

/**
 * This is schema to validate /auth/resetpassword/:email/:passwordResetCode request
 *
 * @constant
 * @author aayushchugh
 */
export const resetPasswordSchema = z.object({
	params: z.object({
		email: z
			.string({ required_error: "Email is required" })
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
		.refine((data) => data.password === data.cpassword, {
			message: "Password and confirm password do not match",
			path: ["cpassword"],
		}),
});

/**
 * This type is generated using resetPasswordSchema and can be used
 * as express Request type generic
 *
 * @author aayushchugh
 */
export type ResetPasswordSchema = z.TypeOf<typeof resetPasswordSchema>;
