import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * fix: This middleware will check if the current user's request is for himself.
 * 	@author is-it-ayush
 */
export default function requireSameUser(req: Request, res: Response, next: NextFunction) {
	try {

        const { id } = req.params;
		const currentUser = res.locals.user;


        if (currentUser._id != id && currentUser.role !== "admin") {
            return res.status(StatusCodes.FORBIDDEN).json({
                error: "Unauthorized",
            });
        }
		return next();
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
}
