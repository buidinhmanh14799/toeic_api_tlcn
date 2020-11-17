var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController');
const {UserValidator} = require('../validators/validatoruser')

/* GET users listing. */
// router.get('/', vocabularyController.getAll);

function requiresLogout(req, res, next){
    if (req.session && req.session.user) {
        return res.json({err: 'You must be Logout in to Login continue'});        
    } else {
        return next();
    }
}
function requiresLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.json({err: 'You must be logged in to view this page.'});
    }
}
router.post('/register',UserValidator, adminController.register);
router.put('/update/:id', adminController.Update);
router.post('/test', requiresLogout, adminController.login);
router.get('/logout', requiresLogin, adminController.logout);

module.exports = router;