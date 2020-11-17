var express = require('express');
var router = express.Router();
const vocabularyController = require('../controllers/vocabularyController');

/* GET users listing. */
router.get('/', vocabularyController.getAll);
router.put('/create', vocabularyController.create);
router.put('/check', vocabularyController.check);

module.exports = router;
