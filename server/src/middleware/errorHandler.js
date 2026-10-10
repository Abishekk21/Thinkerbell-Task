import { config } from '../config/environment.js';

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: 'Not Found',
  });
};

/**
 * Centralized error handling middleware
 */
export const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    message,
    error: err.name || 'Error',
  };

  // Include stack trace only in development
  if (config.isDevelopment && err.stack) {
    response.stack = err.stack;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    response.errors = Object.values(err.errors).map(e => e.message);
  }

  res.status(statusCode).json(response);
};

/**
 * Async handler wrapper to catch promise rejections
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
