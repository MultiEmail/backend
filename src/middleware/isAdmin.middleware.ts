import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import UserModel from '../models/user.model';

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('No User');
  try {
    const verified = verify(token, process.env.JWT_SECRET!);
    req.user = verified;
    let user = await UserModel.findOne({ username: req.user });
    if (req.user && user?.role === 'admin') {
      return next();
    }
  } catch (err) {
    return res.status(401).send({ msg: 'User is not admin' });
  }
};
