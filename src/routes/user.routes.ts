import { Router } from "express";
import {
	deleteUserHandler,
	getAllUsersHandler,
} from "../controllers/user.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import { deleteUserSchema } from "../schemas/user.schema";

const userRouter = Router();

userRouter.get("/users", getAllUsersHandler);
userRouter
	.route("/users/:id")
	.delete(validateRequest(deleteUserSchema), deleteUserHandler);

export default userRouter;
