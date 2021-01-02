var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
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
router.get('/', adminController.getall);
router.get('/:id', adminController.getDetail);
router.post('/register', adminController.register);
router.put('/update/:id', adminController.UpdatePassWord);
router.post('/login', adminController.login);
router.post('/google', adminController.google);
router.post('/facebook', adminController.facebook);
router.get('/logout', adminController.logout);


module.exports = router;