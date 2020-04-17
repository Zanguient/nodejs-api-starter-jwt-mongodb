const express = require('express');
const router = express.Router();
const {sayHi, register, login, protectedTest} = require('../controllers/auth');
const {protect} = require('../middleware/auth');
const {validateRegister, validateLogin} = require('../middleware/validation/auth');

router.get('/test', sayHi);
router.get('/protected', protect, protectedTest);
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

module.exports = router;
