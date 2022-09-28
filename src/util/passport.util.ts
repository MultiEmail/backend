import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import 'dotenv/config';
import UserModel from '../models/user.model';
import logger from './logger.util';

passport.use(
  new Strategy(
    {
      clientID: process.env.clientId,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callbackURL,
      scope: ['profile', 'email'],
    },

    async function (accessToken, refreshToken, profile, done) {
      const user = await UserModel.findOne({ email: profile.emails[0].value });
      if (user) {
        logger.info(`Email ${user.email} already exists`);
        return done(null, profile);
      }
      await UserModel.create({
        email: profile.emails[0].value,
        username: profile.displayName,
        googleId: profile.id,
      }).then(() =>
        logger.info(
          `Inserted email ${profile.emails[0].value} into the database`
        )
      );
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
