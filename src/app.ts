import { config } from 'dotenv';
import express, { Application } from 'express';
import cookieSession from 'cookie-session';
import passport from 'passport';
import connectDB from './Database/database';
import { router } from './auth/authRoute';
import cors from 'cors';
import bodyParser from 'body-parser';
import './passport/passportSetup';

config();
connectDB(process.env.DB_URI);

const app: Application = express();

app.use(
  cookieSession({
    maxAge: 60 * 60 * 24 * 1000,
    keys: [process.env.COOKIE_KEY],
    secret: process.env.COOKIE_KEY,
    httpOnly: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
