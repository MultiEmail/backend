import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);
  verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;

    next();
  });
};
