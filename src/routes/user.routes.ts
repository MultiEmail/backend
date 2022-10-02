import { Router } from "express";
import {
	deleteUserHandler,
	getAllUsersHandler,
	patchMarkUserVerifiedHandler,
} from "../controllers/user.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import { verifyUserSchema } from "../schemas/auth.schema";
import {
	deleteUserSchema,
	patchMarkUserVerifiedSchema,
} from "../schemas/user.schema";

const userRouter = Router();

userRouter.get("/users", getAllUsersHandler);
userRouter
	.route("/users/:id")
	.patch(
		validateRequest(patchMarkUserVerifiedSchema),
		patchMarkUserVerifiedHandler
	)
	.delete(validateRequest(deleteUserSchema), deleteUserHandler);

export default userRouter;
