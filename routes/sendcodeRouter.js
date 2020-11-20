var express = require('express');
var router = express.Router();
const sencode = require('../controllers/sendcodeController');

router.post('/sendcode', sencode.sendmail);

module.exports = router;