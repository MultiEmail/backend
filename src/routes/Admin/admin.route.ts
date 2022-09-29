import { Request, Response, Router } from 'express';
import { isAdmin } from '../../middleware/isAdmin.middleware';
import UserModel from '../../models/user.model';
import { isAuth } from '../../middleware/authenticateToken.middleware';

export const Adminrouter: Router = Router();

Adminrouter.get(
  '/users',
  isAuth,
  isAdmin,
  async (req: Request, res: Response) => {
    const users = UserModel.find();
    return res.status(200).send(users);
  }
);
