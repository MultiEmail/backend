const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const logger = require('../utils/logger.util');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { findUserByEmailService } = require('../services/user.service');
const { expect } = require('@jest/globals');
const {
	createUserService,
	findUserByIdService
} = require("../services/auth.service");


describe("Authentication Endpoints", () => {
	let user;
	let createdUser;
	let mongod;

	beforeAll(async () => {
		mongod = await MongoMemoryServer.create(
			{
				instance: {
					port: 27016,
					dbName: 'multiemail'
				}
			}
		);
		
		await mongoose.connect(mongod.getUri());
		console.log(`Connected to ${mongod.getUri()}`);

		await app.listen(process.env.PORT || 3001, () => {
			console.log(`API started on port ${process.env.PORT || 3001}`);
		});

		// Generate a random user
		user = await createUser();
	});

	describe("POST /auth/signup", () => {

		it("should not create a new user if passwords do not match", async () => {
			const res  = await supertest(app)
				.post("/api/auth/signup")
				.set('Accept', 'application/json')
				.send({
					...user,
					cpassword: "1234567"
				});
				
				expect(res.status).toBe(401);
				expect(res.body).toHaveProperty("error");
				expect(res.body.error).toEqual("Password and Confirm password do not match");

			
		});

		it("should not create a new user if email is invalid", async () => {
			const res = await supertest(app)
				.post("/api/auth/signup")
				.set('Accept', 'application/json')
				.send({
					username: user.username,
					email: "test",
					password: user.password,
					cpassword: user.password
				});
			expect(res.status).toEqual(422);
			expect(res.body).toHaveProperty("error")
			expect(res.body.error).toEqual("Please enter a valid email");
		});

		it("should create a new user", async () => {

			const res = await supertest(app)
				.post("/api/auth/signup")
				.set('Accept', 'application/json')
				.send({
					...user,
					cpassword: user.password
				})
				
				expect(res.statusCode).toEqual(201);
				expect(res.body).toHaveProperty("message")
				expect(res.body.message).toEqual("User created successfully");
		});

		it("should not create a new user if email or username already exists", async () => {
			const res = await supertest(app)
				.post("/api/auth/signup")
				.set('Accept', 'application/json')
				.send({
					...user,
					cpassword: user.password
				});
			expect(res.status).toEqual(409);
			expect(res.body).toHaveProperty("error")
			expect(res.body.error).toEqual("User with same email or username already exists");
		});
	});

	describe("GET /auth/verify/:email/:verificationCode", () => {

		it("should not verify a user if email is invalid", async () => {
			const res = await supertest(app)
				.get(`/api/auth/verify/email/1234`);
			expect(res.status).toEqual(422);
			expect(res.body).toHaveProperty("error")
			expect(res.body.error).toEqual("Please enter a valid email");
		});

		it("should not verify a user if verification code is invalid", async () => {
			const res = await supertest(app)
				.get(`/api/auth/verify/${user.email}/1234`);
			expect(res.status).toEqual(401);
			expect(res.body).toHaveProperty("error")
			expect(res.body.error).toEqual("Invalid verification code");
		});

		it("should not verify a user if not found", async () => {
			let newRandomUser = await createUser();
			const res = await supertest(app)
				.get(`/api/auth/verify/${newRandomUser.email}/1234`);
			expect(res.status).toEqual(404);
			expect(res.body).toHaveProperty("error")
			expect(res.body.error).toEqual("User not found");
		});

		it("should verify a user", async () => {
			// Internal Call: findUserByEmailService (Fetching the vefication code)
			let userDocument = await findUserByEmailService(user.email);
			const res = await supertest(app)
				.get(`/api/auth/verify/${user.email}/${userDocument.verificationCode}`);
			expect(res.status).toEqual(200);
			expect(res.body).toHaveProperty("message")
			expect(res.body.message).toEqual("User verified successfully");
		});
	});

	describe("POST /auth/login", () => {

		it("should not login if the user is not found", async () => {
			let newRandomUser = await createUser();
			const res = await supertest(app)
				.post("/api/auth/login")
				.set('Accept', 'application/json')
				.send({
					email: newRandomUser.email,
					password: newRandomUser.password
				});

			expect(res.status).toEqual(404);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("User not found");
		});

		it("should not login if the user is not verified", async () => {
			
			// Create a new user to  test the if the login if the user is not verified.
			let newRandomUser = await createUser();
			const signupRequest = await supertest(app)
			.post("/api/auth/signup")
			.set('Accept', 'application/json')
			.send({
				...newRandomUser,
				cpassword: newRandomUser.password
			})
			
			expect(signupRequest.statusCode).toEqual(201);
			expect(signupRequest.body).toHaveProperty("message")
			expect(signupRequest.body.message).toEqual("User created successfully");

			// Login with the newly created unverified user.
			const res = await supertest(app)
				.post("/api/auth/login")
				.set('Accept', 'application/json')
				.send({
					email: newRandomUser.email,
					password: newRandomUser.password
				});

			expect(res.status).toEqual(401);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("User is not verified");
		});

		it("should not login if the password is incorrect", async () => {
			const res = await supertest(app)
				.post("/api/auth/login")
				.set('Accept', 'application/json')
				.send({
					email: user.email,
					password: "1234567"
				});

			expect(res.status).toEqual(401);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("Invalid credentials");
		});

		it("should login if the credentials are correct", async () => {
			const res = await supertest(app)
				.post("/api/auth/login")
				.set('Accept', 'application/json')
				.send({
					email: user.email,
					password: user.password
				});

			// Save the access token and refresh token for future test use.
			user.access_token = res.body.access_token;
			user.refresh_token = res.body.refresh_token;

			expect(res.status).toEqual(200);
			expect(res.body).toHaveProperty("message");
			expect(res.body.message).toEqual("User logged in successfully");
		});
	});

	describe("GET /auth/me", () => {
		
		it("should not get the user details if user is logged out", async () => {

			const res = await supertest(app)
				.get("/api/auth/me")
				.set('Accept', 'application/json');
			expect(res.status).toEqual(401);
			expect(res.body).toHaveProperty("message");
			expect(res.body).toHaveProperty("user");
			expect(res.body.message).toEqual("User is not logged In");
			expect(res.body.user).toEqual(null);
		});

		it("should get the user details if user is logged in", async () => {
			const res = await supertest(app)
				.get("/api/auth/me")
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${user.access_token}`);

			expect(res.status).toEqual(200);
			expect(res.body).toHaveProperty("message");
			expect(res.body).toHaveProperty("user");
			expect(res.body.message).toEqual("User is logged In");
			expect(res.body.user).toHaveProperty("email");
			expect(res.body.user.email).toEqual(user.email);
		});

	});

	describe("GET /auth/refresh", () => {

		it("should not refresh the access token if the refresh token is not provided", async () => {
			const res = await supertest(app)
				.get("/api/auth/refresh")
				.set('Accept', 'application/json');
			expect(res.status).toEqual(401);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("Invalid refresh token");
		});

		it("should not refresh the access token if the refresh token is invalid", async () => {
			const res = await supertest(app)
				.get("/api/auth/refresh")
				.set('Accept', 'application/json')
				.set('x-refresh', user.access_token + "invalidJWTString");
			expect(res.status).toEqual(401);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("Invalid refresh token");
		});

		it("should refresh the access token if the refresh token is valid", async () => {
			const res = await supertest(app)
				.get("/api/auth/refresh")
				.set('Accept', 'application/json')
				.set('x-refresh', user.refresh_token);
			expect(res.status).toEqual(200);
			expect(res.body).toHaveProperty("access_token");
			expect(res.body.access_token).toBeTruthy();
		});
	});

	describe("GET /auth/logout", () => {

		it("should not logout if the refresh token is invalid", async () => {
			const res = await supertest(app)
				.get("/api/auth/logout")
				.set('Accept', 'application/json')
				.set('x-refresh', user.access_token + "invalidJWTString");
			expect(res.status).toEqual(401);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("Invalid refresh token");
		});

		it("should logout if the refresh token is valid", async () => {
			const res = await supertest(app)
				.get("/api/auth/logout")
				.set('Accept', 'application/json')
				.set('x-refresh', user.refresh_token);
			expect(res.status).toEqual(200);
			expect(res.body).toHaveProperty("message");
			expect(res.body.message).toEqual("User logged out successfully");
		});
	});

	describe("POST /auth/forgotpassword", () => {

		it("should not send the reset password link if the email is not provided", async () => {
			const res = await supertest(app)
				.post("/api/auth/forgotpassword")
				.set('Accept', 'application/json');

			expect(res.status).toEqual(400);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("Email is required");
		});

		it("should not send the reset password link if the email is invalid", async () => {
			const res = await supertest(app)
				.post("/api/auth/forgotpassword")
				.set('Accept', 'application/json')
				.send({
					email: "invalidEmail"
				});
			expect(res.status).toEqual(422);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("Please enter a valid email");
		});

		it("should not send the reset password link if user is not found", async () => {
			const newRandomUser = await createUser();
			const res = await supertest(app)
				.post("/api/auth/forgotpassword")
				.set('Accept', 'application/json')
				.send({
					email: newRandomUser.email
			});
			
			expect(res.status).toEqual(404);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("User not found");
		});

		it("should not send the reset password link if the email is not verified", async () => {
			
			const newRandomUser = await createUser();


			const userSignup = await supertest(app)
			.post("/api/auth/signup")
			.set('Accept', 'application/json')
			.send({
				...newRandomUser,
				cpassword: newRandomUser.password
			})
			
			expect(userSignup.statusCode).toEqual(201);
			expect(userSignup.body).toHaveProperty("message")
			expect(userSignup.body.message).toEqual("User created successfully");

			const res = await supertest(app)
				.post("/api/auth/forgotpassword")
				.set('Accept', 'application/json')
				.send({
					email: newRandomUser.email
			});
			
			expect(res.status).toEqual(403);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("User is not verified");
		});

		it("should send the reset password link if the email is valid", async () => {
			const res = await supertest(app)
				.post("/api/auth/forgotpassword")
				.set('Accept', 'application/json')
				.send({
					email: user.email
			});
			
			expect(res.status).toEqual(200);
			expect(res.body).toHaveProperty("message");
			expect(res.body.message).toEqual("Password reset code sent to your email");
		});
	});

	describe("PATCH /auth/resetpassword/:email/:passwordResetCode", () => {

		it("should not reset the password if the email or verification code is invalid", async () => {
			const res = await supertest(app)
				.patch(`/api/auth/resetpassword/${"invalidEmail"}/${'1234'}`)
				.set('Accept', 'application/json')
				.send();
			expect(res.status).toEqual(422);
			expect(res.body).toHaveProperty("error");
		});

		it("should not send if the user is not found", async () => {
			const newRandomUser = await createUser();
			const res = await supertest(app)
				.patch(`/api/auth/resetpassword/${newRandomUser.email}/${'1234'}`)
				.set('Accept', 'application/json')
				.send({
					password: newRandomUser.password,
					cpassword: newRandomUser.password
				});
			expect(res.status).toEqual(404);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("User not found");
		});

		it("should not reset the password if the password do not match", async () => {
			let userDocument = await findUserByEmailService(user.email);
			const res = await supertest(app)
				.patch(`/api/auth/resetpassword/${user.email}/${userDocument.passwordResetCode}`)
				.set('Accept', 'application/json')
				.send({
					password: user.password,
					cpassword: "invalidPassword"
				});
			expect(res.status).toEqual(401);
			expect(res.body).toHaveProperty("error");
			expect(res.body.error).toEqual("Password and confirm password do not match");
		});

		it("should reset the password if the email and verification code is valid", async () => {
			let userDocument = await findUserByEmailService(user.email);
			const res = await supertest(app)
				.patch(`/api/auth/resetpassword/${user.email}/${userDocument.passwordResetCode}`)
				.set('Accept', 'application/json')
				.send({
					password: user.password,
					cpassword: user.password
				});
			expect(res.status).toEqual(200);
			expect(res.body).toHaveProperty("message");
			expect(res.body.message).toEqual("Password reset successfully");
		});
	});

	afterAll(async () => {
		console.log("Closing the current connection.");
		await mongoose.connection.close();
		await mongod.stop();

	});

});


/**
 * Helper function to generate a user object with random email, password and username.
 * @returns {Object} user
 */

async function createUser() {
	// Generate a random string for the email address
	const email = `${Math.random().toString(36).substring(4)}@multiemail.us`;
	// Generate a random string for the password
	const password = Math.random().toString(36).substring(4);
	// Generate a random string for the username
	const username = Math.random().toString(36).substring(4);

	// Update the user object with the generated email, password and username
	let user = { email: email, password: password, username: username };
	return user;
}