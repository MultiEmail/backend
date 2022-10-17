import { Router } from "express";
import {
	createMarketingEmailHandler,
	sendMarketingEmailHandler,
} from "../controllers/marketingEmail.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import {
	createMarketingEmailSchema,
	sendMarketingEmailSchema,
} from "../schemas/marketingEmail.schema";

const marketingEmailRouter: Router = Router();

// NOTE: all routes defined with `marketingEmailRouter` will be pre-fixed with `/api`

/**
 * This route will do following
 * POST -> create new marketing email
 *
 * @author tharun634
 */
marketingEmailRouter
	.route("/marketing")
	.post(validateRequest(createMarketingEmailSchema), createMarketingEmailHandler);

/**
 * This route will do following
 * POST -> send new marketing email
 *
 * @author tharun634
 */
marketingEmailRouter
	.route("/marketing-email")
	.post(validateRequest(sendMarketingEmailSchema), sendMarketingEmailHandler);

export default marketingEmailRouter;
