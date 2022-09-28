import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { isLoggedin, logoutHandler } from '../controllers/auth.controller';
import { compare, hash } from 'bcryptjs';
import logger from '../util/logger.util';
import { JwtModel } from '../models/jwt.model';
import { sendRefreshToken } from '../util/sendRefreshToken';
import { createAccessToken, createRefreshToken } from '../util/authTokens';
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

authRouter.post('/local/signup', async (req, res) => {
  const { email, password } = req.body;

  const user = await JwtModel.findOne({ email });
  if (user)
    return res
      .status(500)
      .send('A user with the provided email already exists');

  if (!(email && password))
    return res.status(500).send('You must provide an email and password');

  const hashedPass = await hash(password, 12);
  try {
    await JwtModel.create({
      email,
      password: hashedPass,
    }).then(() => logger.info('Created user with email ' + email));
  } catch (err) {
    logger.error(err);
  }
  res.status(201).send({ message: `Created user with email ${email}` });
});

authRouter.post('/local/login', async (req, res) => {
  const { email, password } = await req.body;

  if (!passport || !email)
    return res.status(500).send('You must provide an email and password');

  const user = await JwtModel.findOne({ email });
  if (!user)
    return res.status(404).send('Failed to find user with the provided email');

  const valid = await compare(password, user.password);
  if (!valid) return res.status(401).send('Invalid password');

  await sendRefreshToken(res, createRefreshToken(user));
  await createAccessToken(user);

  return res.status(200).send(`Successfully logged in as ${user.email}`);
});
export default authRouter;
