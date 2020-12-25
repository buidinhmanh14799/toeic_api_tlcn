var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const { UserValidator } = require('../validators/validatoruser')


function requiresLogout(req, res, next) {
    if (req.session && req.session.user) {
        return res.json({ err: 'You must be Logout in to Login continue' });
    } else {
        return next();
    }
}
function requiresLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.json({ err: 'You must be logged in to view this page.' });
    }
}
/* GET users listing. */
// router.get('/', vocabularyController.getAll);
router.get('/', userController.getall);
router.post('/register', userController.register);
router.post('/update/:id', userController.update);
router.get('/checkIDGoogle/:id', userController.checkIDGoogle);
router.post('/disable/:id', userController.delete);
router.get('/checkIDFacebook/:id', userController.checkIDFaceBook);

router.post('/login', userController.login);
router.get('/logout', userController.logout);


module.exports = router;
