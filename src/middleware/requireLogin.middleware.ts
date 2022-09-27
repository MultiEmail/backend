import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * This middleware will check if the user is logged in or not
 * and send error if user is not logged in
 */
function requireUser(req: Request, res: Response, next: NextFunction) {
	const { user } = res.locals;

	if (!user)
		return res.status(StatusCodes.FORBIDDEN).json({
			error: "Please login to continue",
		});

	return next();
}

export default requireUser;
