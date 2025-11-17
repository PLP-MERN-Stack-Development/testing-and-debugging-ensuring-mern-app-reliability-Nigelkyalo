const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const asyncHandler = require('../utils/asyncHandler');

const authValidationRules = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

const loginValidationRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }

  const existing = await User.findOne({ email: req.body.email });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  const token = generateToken(user);

  return res.status(201).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    },
    token
  });
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user);

  return res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    },
    token
  });
});

module.exports = {
  authValidationRules,
  loginValidationRules,
  register,
  login
};

