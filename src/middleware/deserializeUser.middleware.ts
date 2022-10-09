import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { findUserByIdService } from "../services/user.service";
import { verifyJWT } from "../utils/jwt.util";

/**
 * This function will decode user from `authorization` header and add
 * it to `res.locals` as `res.locals.user`
 *
 * @param req request
 * @param res response
 *
 * @author aayushchugh
 */
const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/, "");

	if (!accessToken) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			error: "User is not logged in",
		});
	}

	const decoded = await verifyJWT<{ _id: string }>(accessToken, "ACCESS_TOKEN_PUBLIC_KEY");

	if (decoded) {
		const user = await findUserByIdService(decoded._id);
		res.locals.user = user;
	} else {
		res.locals.user = null;

		return res.status(StatusCodes.FORBIDDEN).json({
			// WARNING: Do not change this message because it will be used by frontend for condition
			error: "User is not logged in or access_token is expired",
		});
	}

	return next();
};

export default deserializeUser;
