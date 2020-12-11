var express = require('express');
var router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel')
passport.use(
    new GoogleStrategy({
        clientID: '457126058033-c4nb6s36lj0lc2c4tgndvap31efuft4f.apps.googleusercontent.com',
        clientSecret: '80BQHBeXdRhXJkoFHj5PK41z',
        callbackURL: '/google/auth/google/callback'
    }, (profile, done) => {

        // Check if google profile exist.
        if (profile.id) {

            User.findOne({ googleId: profile.id })
                .then((existingUser) => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        new User({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            name: profile.name.familyName + ' ' + profile.name.givenName
                        })
                            .save()
                            .then(user => done(null, user));
                    }
                })
        }
    })
);
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
});

router.get('/auth/google/', passport.authenticate('google', {
    scope: ['profile', 'email']
}))
router.get('/auth/google/callback', passport.authenticate('google'), (req, res)=>{
    res.send(req.user)
});
module.exports = router;