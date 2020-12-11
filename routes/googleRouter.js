var express = require('express');
var router = express.Router();
var passport = require('passport');
router.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);
module.exports = router;