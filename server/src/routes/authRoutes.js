const express = require('express');
const {
  authValidationRules,
  loginValidationRules,
  register,
  login
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', authValidationRules, register);
router.post('/login', loginValidationRules, login);

module.exports = router;

