const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  databaseUrl: process.env.DATABASE_URL || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('DATABASE_URL is required in production'); })() : 'postgresql://postgres:postgres@localhost:5432/beauty_salon'),
  sessionSecret: process.env.SESSION_SECRET || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('SESSION_SECRET is required in production'); })() : 'dev-only-secret-do-not-use-in-production'),
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  salonEmail: process.env.SALON_EMAIL || '',
  adminInitialPassword: process.env.ADMIN_INITIAL_PASSWORD || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('ADMIN_INITIAL_PASSWORD is required in production'); })() : 'dev-admin-password'),
};
