const express = require('express');
require('express-async-errors');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const pinoHttp = require('pino-http');
const config = require('./config');
const routes = require('./routes');
const logger = require('./config/logger');
const requestTiming = require('./middleware/requestTiming');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { attachDebugContext } = require('./middleware/authMiddleware');

const app = express();

app.use(
  pinoHttp({
    logger,
    autoLogging: config.enableRequestLogging
  })
);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(requestTiming);
app.use(attachDebugContext);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

