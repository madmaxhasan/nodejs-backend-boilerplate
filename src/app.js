const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const env = require('./config/env');
const routes = require('./routes');
const { limiter } = require('./middlewares/rate-limit.middleware');
const { sanitize } = require('./middlewares/sanitize.middleware');
const { errorConverter, errorHandler, notFound } = require('./middlewares/error.middleware');
const { specs, swaggerUi } = require('./docs/swagger');
const logger = require('./config/logger');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.cors.origin,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization (MongoDB injection & XSS protection)
app.use(sanitize());

// Compression
app.use(compression());

// Rate limiting
app.use(limiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API routes
app.use(env.apiPrefix, routes);

// 404 handler
app.use(notFound);

// Error handling
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
