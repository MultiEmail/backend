import { Router } from "express";
import {
    getAllUsersHandler,
	patchMarkUserVerifiedHandler,
	deleteUserHandler,
} from "../controllers/admin.controller";
import deserializeUser from "../middleware/deserializeUser.middleware";
import requireAdminRole from "../middleware/requireAdminRole.middleware";
import validateRequest from "../middleware/validateRequest.middleware";
import {
	deleteUserSchema,
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
 adminRouter.patch("/admin/users/markverified/:id", deserializeUser, requireAdminRole, validateRequest(patchMarkUserVerifiedSchema), patchMarkUserVerifiedHandler);

/**
 * This route will delete a user
 * protected for admin
 * 
 * @author aayushchugh, is-it-ayush
 */
 adminRouter.route("/admin/users/:id").delete(deserializeUser, requireAdminRole, validateRequest(deleteUserSchema), deleteUserHandler);

 export default adminRouter;
