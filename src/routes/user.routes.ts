import { Router } from "express";
import { patchMarkUserAdminHandler, patchUserHandler } from "../controllers/user.controller";
import deserializeUser from "../middleware/deserializeUser.middleware";
import requireAdminRole from "../middleware/requireAdminRole.middleware";
import requireSameUser from "../middleware/requireSameUser.middleware";
import validateRequest from "../middleware/validateRequest.middleware";
import { patchMarkUserAdminSchema, patchUserSchema } from "../schemas/user.schema";

const userRouter = Router();

// NOTE: all routes defined with `userRouter` will be pre-fixed with `/api`

/**
 * This route does following things
 * PATCH -> update user's username
 *
 * @author aayushchugh
 */
userRouter
	.route("/users/:id")
	.patch(validateRequest(patchUserSchema), deserializeUser, requireSameUser, patchUserHandler);

/**
 * This route does following things
 * PATCH -> mark user as admin
 *
 * @author tharun634
 */
userRouter
	.route("/admin/users/markadmin/:id")
	.patch(
		validateRequest(patchMarkUserAdminSchema),
		deserializeUser,
		requireAdminRole,
		patchMarkUserAdminHandler,
	);

export default userRouter;
