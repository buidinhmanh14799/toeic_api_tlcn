
const passport = require('passport');
exports.GoogleLogin = function (req, res) {
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
}
exports.GoogleCallback = function (req, res) {
    passport.authenticate('google').then(res.send('oke'))
}