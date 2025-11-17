const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');

async function connectDatabase(mongoUri) {
  mongoose.set('strictQuery', false);
  await mongoose.connect(mongoUri, {
    autoIndex: true
  });
  logger.info('Connected to MongoDB');
}

async function startServer({
  port = config.port,
  mongoUri = config.mongoUri
} = {}) {
  await connectDatabase(mongoUri);

  const server = app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });

  const shutdown = async () => {
    logger.info('Gracefully shutting down server');
    await mongoose.disconnect();
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  return server;
}

if (require.main === module) {
  startServer().catch((err) => {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  });
}

module.exports = {
  startServer
};

