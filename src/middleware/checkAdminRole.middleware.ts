import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model";

/**
 * This middleware will check if the current user has admin role
 */
function checkAdminRole() {
  return (_: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser: User = res.locals.user;
      if (currentUser == null || currentUser.role !== "admin") {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: "Insufficient rights",
        });
      }
      return next();
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
      });
    }
  };
}

export default checkAdminRole;
