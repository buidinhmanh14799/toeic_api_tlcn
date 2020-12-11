var express = require('express');
var router = express.Router();
var passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
    new GoogleStrategy(
      {
        clientID: '457126058033-c4nb6s36lj0lc2c4tgndvap31efuft4f.apps.googleusercontent.com',
        clientSecret: '80BQHBeXdRhXJkoFHj5PK41z',
        callbackURL: 'google/auth/google/callback'
      },
      accessToken => {
        console.log(accessToken);
      }
    )
  );
router.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);
router.get('/auth/google/callback', passport.authenticate('google'));
module.exports = router;