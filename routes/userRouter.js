var express = require('express');
var router = express.Router();
const vocabularyController = require('../controllers/userController');

/* GET users listing. */
// router.get('/', vocabularyController.getAll);
router.post('/create', vocabularyController.create);
router.put('/checkIDGoogle', vocabularyController.checkIDGoogle);
router.put('/checkIDFacebook', vocabularyController.checkIDFaceBook);

module.exports = router;
