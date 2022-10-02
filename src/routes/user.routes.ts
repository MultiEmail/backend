import { Router } from "express";
import { getAllUsersHandler } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/users", getAllUsersHandler);

export default userRouter;
