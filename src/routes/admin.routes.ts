import { Router } from "express";
import { deleteUserHandler, getAllUsersHandler } from "../controllers/admin.controller";
import {
	patchMarkUserAdminHandler,
	patchMarkUserVerifiedHandler,
} from "../controllers/user.controller";
import deserializeUser from "../middleware/deserializeUser.middleware";
import requireAdminRole from "../middleware/requireAdminRole.middleware";
import validateRequest from "../middleware/validateRequest.middleware";
import {
	deleteUserSchema,
	patchMarkUserAdminSchema,
	patchMarkUserVerifiedSchema,
} from "../schemas/admin.schema";

const adminRouter: Router = Router();

// NOTE: all routes defined with `adminRouter` will be pre-fixed with `/api`

/**
 * This route will get all users
 * protected for admin
 *
 * @author aayushchugh, is-it-ayush
 */
adminRouter.get("/admin/users", deserializeUser, requireAdminRole, getAllUsersHandler);

/**
 * This route will mark user as verified.
 * protected for admin
 *
 * @author aayushchugh, is-it-ayush
 */
adminRouter.patch(
	"/admin/users/markverified/:id",
	deserializeUser,
	requireAdminRole,
	validateRequest(patchMarkUserVerifiedSchema),
	patchMarkUserVerifiedHandler,
);

/**
 * This route will delete a user
 * protected for admin
 *
 * @author aayushchugh, is-it-ayush
 */
adminRouter
	.route("/admin/users/:id")
	.delete(
		deserializeUser,
		requireAdminRole,
		validateRequest(deleteUserSchema),
		deleteUserHandler,
	);

/**
 * This route does following things
 * PATCH -> mark user as admin
 *
 * @author tharun634
 */
adminRouter
	.route("/admin/users/markadmin/:id")
	.patch(
		validateRequest(patchMarkUserAdminSchema),
		deserializeUser,
		requireAdminRole,
		patchMarkUserAdminHandler,
	);

export default adminRouter;
