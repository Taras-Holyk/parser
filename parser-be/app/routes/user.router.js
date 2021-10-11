const express = require('express');
const controller = require('../controllers/user.controller');
const validator = require('../validators/user.validator');
const router = express.Router();

router.post('/login', validator.login, controller.login);
router.post('', validator.register, controller.register);

module.exports = router;
