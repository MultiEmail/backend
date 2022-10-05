import { Router } from "express";
import {
	deleteUserHandler,
	getAllUsersHandler,
	patchMarkUserVerifiedHandler,
	patchUserHandler,
} from "../controllers/user.controller";
import requireAdminRole from "../middleware/requireAdminRole.middleware";
import validateRequest from "../middleware/validateRequest.middleware";
import {
	deleteUserSchema,
	patchMarkUserVerifiedSchema,
	patchUserSchema,
} from "../schemas/user.schema";

const userRouter = Router();

// NOTE: all routes defined with `userRouter` will be pre-fixed with `/api`

/**
 * This route will get all users
 * protected for admin
 *
 * @author aayushchugh
 */
userRouter.get("/users", requireAdminRole, getAllUsersHandler);

/**
 * This route will mark user as verified
 * protected for admin
 *
 * @author aayushchugh
 */
userRouter.patch(
	"/users/markverified/:id",
	validateRequest(patchMarkUserVerifiedSchema),
	patchMarkUserVerifiedHandler,
);

/**
 * This route does following things
 *
 * PATCH -> update user's username
 * DELETE -> delete user from database (protected for admin)
 *
 * @author aayushchugh
 */
userRouter
	.route("/users/:id")
	.patch(validateRequest(patchUserSchema), patchUserHandler)
	.delete(requireAdminRole, validateRequest(deleteUserSchema), deleteUserHandler);

export default userRouter;
