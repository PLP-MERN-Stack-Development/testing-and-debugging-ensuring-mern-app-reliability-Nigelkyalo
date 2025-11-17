const logger = require('../config/logger');

function notFound(_req, res, _next) {
  res.status(404).json({ error: 'Resource not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error(
    {
      err,
      stack: err.stack,
      status
    },
    'Unhandled error captured by middleware'
  );

  res.status(status).json({
    error: message,
    details: err.errors || undefined
  });
}

module.exports = {
  notFound,
  errorHandler
};

