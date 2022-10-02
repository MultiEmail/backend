import { Router } from "express";
import {
	deleteUserHandler,
	getAllUsersHandler,
	patchMarkUserVerifiedHandler,
	patchUserHandler,
} from "../controllers/user.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import {
	deleteUserSchema,
	patchMarkUserVerifiedSchema,
	patchUserSchema,
} from "../schemas/user.schema";

const userRouter = Router();

userRouter.get("/users", getAllUsersHandler);
userRouter.patch(
	"/users/markverified/:id",
	validateRequest(patchMarkUserVerifiedSchema),
	patchMarkUserVerifiedHandler
);
userRouter
	.route("/users/:id")
	.patch(validateRequest(patchUserSchema), patchUserHandler)
	.delete(validateRequest(deleteUserSchema), deleteUserHandler);

export default userRouter;
