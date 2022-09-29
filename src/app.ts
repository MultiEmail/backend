import { config } from 'dotenv';
import express, { Application } from 'express';
import passport from 'passport';
import cors from 'cors';
import mongoose from 'mongoose';
import logger from './util/logger.util';
import './util/passport.util';

import authRouter from './routes/auth.routes';
import cookieSession from 'cookie-session';
import { Adminrouter } from './routes/Admin/admin.route';

config();

const app: Application = express();

app.use(
  cookieSession({
    maxAge: 60 * 60 * 24 * 1000,
    keys: ['secret'],
    secret: 'secret',
  })
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authRouter);
app.use('/api', Adminrouter);

mongoose.connect(process.env.DB_URI as string, () => {
  const PORT = process.env.PORT || 3001;

  logger.info('Connected to Database!');

  app.listen(PORT, () => {
    logger.info(`Server listening on http://localhost:${PORT}`);
  });
});
