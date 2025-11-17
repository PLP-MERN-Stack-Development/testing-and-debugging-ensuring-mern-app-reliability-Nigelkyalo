const { verifyToken } = require('../utils/auth');
const config = require('../config');

function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const [, token] = header.split(' ');

  if (!token) {
    return res.status(401).json({ error: 'Invalid authorization header' });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    const status = error.name === 'TokenExpiredError' ? 401 : 403;
    return res.status(status).json({ error: 'Invalid or expired token' });
  }
}

function authorizeAuthor(req, res, next) {
  if (!req.user || !req.post) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.post.author.toString() !== req.user.id) {
    return res.status(403).json({ error: 'You do not have permission to modify this resource' });
  }

  return next();
}

function attachDebugContext(req, _res, next) {
  if (config.env === 'test' && req.headers['x-test-user']) {
    req.user = {
      id: req.headers['x-test-user'],
      email: `${req.headers['x-test-user']}@example.com`
    };
  }
  next();
}

module.exports = {
  authenticate,
  authorizeAuthor,
  attachDebugContext
};

