import { Router } from "express";
import { createMarketingEmailHandler } from "../controllers/marketingEmail.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import { deleteUserSchema, patchMarkUserVerifiedSchema } from "../schemas/admin.schema";
import { createMarketingEmailSchema } from "../schemas/marketingEmail.schema";
import { patchMarkUserAdminSchema } from "../schemas/admin.schema";
import { patchMarkUserAdminHandler, deleteUserHandler, getAllUsersHandler, patchMarkUserVerifiedHandler } from "../controllers/user.controller";

const adminRouter: Router = Router();

// NOTE: all routes defined with `adminRouter` will be pre-fixed with `/api`

/**
 * This route will get all users
 * protected for admin
 *
 * @author aayushchugh, is-it-ayush
 */
adminRouter.get("/admin/users", getAllUsersHandler);

/**
 * This route will mark user as verified.
 * protected for admin
 *
 * @author aayushchugh, is-it-ayush
 */
adminRouter.patch(
	"/admin/users/markverified/:id",
	validateRequest(patchMarkUserVerifiedSchema),
	patchMarkUserVerifiedHandler,
);

/**
 * This route will delete a user
 * protected for admin
 *
 * @author aayushchugh, is-it-ayush
 */
adminRouter.route("/admin/users/:id").delete(validateRequest(deleteUserSchema), deleteUserHandler);

/**
 * This route will send marketing emails
 *
 * @author aayushchugh, tharun634
 */
adminRouter
	.route("/admin/marketing-emails")
	.post(validateRequest(createMarketingEmailSchema), createMarketingEmailHandler);

/**
 * This route does following things
 * PATCH -> mark user as admin
 *
 * @author tharun634
 */
adminRouter
	.route("/admin/users/markadmin/:id")
	.patch(validateRequest(patchMarkUserAdminSchema), patchMarkUserAdminHandler);

export default adminRouter;
