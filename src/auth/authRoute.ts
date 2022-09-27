import { Router } from 'express';
import passport from 'passport';
import Userdata from '../Database/Models/User';
import { UserDocumentType } from '../types/User.types';
export const router: Router = Router();

export const isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (req.user) {
    res.sendStatus(200);
    next();
  } else {
    res.sendStatus(401);
  }
};

router.get('/failed', (req, res) => res.send('You Failed to log in!'));
router.get('/good', isLoggedIn, (req, res) =>
  res.send(`Welcome mr ${req.user}!`)
);

router.get(
  '/google',

  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/* req.session.regenerate is not a function fix */
router.get(
  '/google/redirect',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function (req, res) {
    res.redirect('/good');
  }
);

router.get('/logout', (req, res) => {
  req.session = null;
  req.logout(function (err) {
    if (err) return res.send(err);
  });
  res.redirect('/');
});
