const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./config/logger');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors());

// Body parsing
app.use(express.json());

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Vrindaban Backend is running.'
  });
});

// Mount all API routes under /api
app.use('/api', apiRoutes);

// Centralized JSON error handler (must be last)
app.use(errorHandler);

module.exports = app;