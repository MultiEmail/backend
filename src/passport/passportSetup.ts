const passport = require('passport');
import { Strategy } from 'passport-google-oauth20';
import { config } from 'dotenv';
config();

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new Strategy(
    {
      clientID: process.env.clientId,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callbackURL,
      scope: ['profile', 'email'],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      return done(null, profile);
    }
  )
);
