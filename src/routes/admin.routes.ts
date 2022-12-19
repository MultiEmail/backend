import { Router } from "express";
import {
	createMarketingEmailHandler,
	getAllMarketingEmailsHandler,
} from "../controllers/marketingEmail.controller";
import {
	deleteUserHandler,
	getAllUsersHandler,
	getSingleUserHandler,
	patchMarkUserAdminHandler,
	patchMarkUserVerifiedHandler,
} from "../controllers/user.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import {
	deleteUserSchema,
	getAllUsersSchema,
	getSingleUserSchema,
	patchMarkUserAdminSchema,
	patchMarkUserVerifiedSchema,
} from "../schemas/user.schema";
import { createMarketingEmailSchema } from "../schemas/marketingEmail.schema";

const adminRouter: Router = Router();

// NOTE: all routes defined with `adminRouter` will be pre-fixed with `/api`
// NOTE: all routes in this file are protected by `deserializeUser` and `requireAdminRole` middlewares

/**
 * This route will get all users
 * protected for admin
 *
 * @author aayushchugh, is-it-ayush
 */
adminRouter.get("/admin/users", validateRequest(getAllUsersSchema), getAllUsersHandler);

/**
 * This route will mark user as verified.
 * protected for admin
 *
 * @author aayushchugh, is-it-ayush
 */
adminRouter.patch(
	"/admin/users/:id/mark-verified",
	validateRequest(patchMarkUserVerifiedSchema),
	patchMarkUserVerifiedHandler,
);

/**
 * protected for admin
 * This route will do following things
 *
 * GET -> get single user
 * DELETE -> delete single user
 *
 * @author aayushchugh, is-it-ayush
 */
adminRouter
	.route("/admin/users/:id")
	.get(validateRequest(getSingleUserSchema), getSingleUserHandler)
	.delete(validateRequest(deleteUserSchema), deleteUserHandler);

/**
 * This route will send marketing emails
 *
 * @author aayushchugh, tharun634
 */
adminRouter
	.route("/admin/marketing-emails")
	.get(getAllMarketingEmailsHandler)
	.post(validateRequest(createMarketingEmailSchema), createMarketingEmailHandler);

/**
 * This route does following things
 * PATCH -> mark user as admin
 *
 * @author tharun634
 */
adminRouter
	.route("/admin/users/:id/mark-admin")
	.patch(validateRequest(patchMarkUserAdminSchema), patchMarkUserAdminHandler);

export default adminRouter;
