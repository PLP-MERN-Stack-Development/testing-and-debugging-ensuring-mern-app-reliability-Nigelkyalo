const logger = require('../config/logger');

function requestTiming(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    if (durationMs > 500) {
      logger.warn({ path: req.path, method: req.method, durationMs }, 'Slow request detected');
    }
  });

  next();
}

module.exports = requestTiming;

