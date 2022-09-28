import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function logoutHandler(req: Request, res: Response) {
  req.session = null;
  req.logout((err) => {
    if (err)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error',
      });
  });
}

export function isLoggedin(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
