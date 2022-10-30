import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model";

/**
 * This middleware will find current connected service from current user
 * and save that to `res.locals.currentConnectedService`
 *
 * @param req express request
 * @param res express response
 * @param next express next function
 *
 * @author aayushchugh
 */
const getCurrentConnectedService = (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = res.locals.user as User;
		const { email } = req.params;

		const currentConnectedService = user.connected_services.find(
			(service) => service.email === email,
		);

		if (!currentConnectedService) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: "Account not connected",
			});
		}

		res.locals.currentConnectedService = currentConnectedService;
		next();
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Internal Server Error",
		});
	}
};

export default getCurrentConnectedService;
