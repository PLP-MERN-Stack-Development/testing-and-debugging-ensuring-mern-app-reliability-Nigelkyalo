const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

const SALT_ROUNDS = 10;

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiry }
  );
}

function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword
};

