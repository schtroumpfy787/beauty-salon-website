const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/beauty_salon',
  sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  salonEmail: process.env.SALON_EMAIL || '',
  adminInitialPassword: process.env.ADMIN_INITIAL_PASSWORD || 'admin123',
};
