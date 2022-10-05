import { Request, Response, NextFunction } from "express";
import { findUserByIdService } from "../services/user.service";
import { verifyJWT } from "../utils/jwt.util";

/**
 * This function will be called before every route
 * and will deserialize the user from the cookie token
 * and attach it to the req.locals
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh
 */
const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/, "");

	if (!accessToken) return next();

	const decoded = await verifyJWT<{ _id: string }>(accessToken, "ACCESS_TOKEN_PUBLIC_KEY");

	if (decoded) {
		const user = await findUserByIdService(decoded._id);
		res.locals.user = user;
	} else {
		res.locals.user = null;
	}

	return next();
};

export default deserializeUser;
