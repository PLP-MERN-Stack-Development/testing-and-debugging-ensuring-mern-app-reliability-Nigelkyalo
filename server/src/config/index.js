const path = require('path');
const fs = require('fs');

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const envPath = path.resolve(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config();
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_app',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
  jwtExpiry: process.env.JWT_EXPIRY || '1d',
  enableRequestLogging: process.env.REQUEST_LOGGING !== 'false'
};

module.exports = config;

