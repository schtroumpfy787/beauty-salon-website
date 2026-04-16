const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const config = require('./config');
const db = require('./db/pool');

// Routes
const contactRoutes = require('./routes/contact');
const servicesRoutes = require('./routes/services');
const giftOrderRoutes = require('./routes/giftOrder');
const adminRoutes = require('./routes/admin');

const app = express();

// Trust proxy (behind Nginx)
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // CSP handled by Nginx
}));

// CORS
app.use(cors({
  origin: config.nodeEnv === 'production' ? false : true,
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  store: new pgSession({
    pool: db.pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
  },
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/contact', contactRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/gift-order', giftOrderRoutes);
app.use('/api/admin', adminRoutes);

// Admin UI - serve static HTML
app.get('/admin', (req, res) => {
  res.sendFile(require('path').join(__dirname, 'admin', 'index.html'));
});
app.use('/admin', express.static(require('path').join(__dirname, 'admin')));

// 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
