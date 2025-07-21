require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_for_development',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  cors: {
    origin: process.env.ALLOWED_ORIGINS ?
      process.env.ALLOWED_ORIGINS.split(',') :
      (process.env.NODE_ENV === 'production' ? false : true),
    credentials: true,
  },
};
