import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { isLoggedin, logoutHandler } from '../controllers/auth.controller';

const authRouter: Router = Router();

authRouter.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

authRouter.get(
  '/auth/google/redirect',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/fail',
    successRedirect: '/api/auth/google/success',
  })
);

authRouter.get('/auth/google/success', isLoggedin, async (req, res) => {
  const user = req.user as any;

  return res.status(StatusCodes.OK).json({
    message: `Login successful welcome ${user.displayName}`,
  });
});

authRouter.get('/auth/logout', logoutHandler);

export default authRouter;
