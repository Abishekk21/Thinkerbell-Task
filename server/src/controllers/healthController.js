import { getDatabaseState, isDatabaseConnected, getDatabaseName } from '../config/database.js';

/**
 * Health check endpoint
 */
export const getHealth = (req, res) => {
  const dbConnected = isDatabaseConnected();
  const dbState = getDatabaseState();
  const dbName = getDatabaseName();

  const health = {
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: dbConnected,
      state: dbState,
      name: dbName,
    },
  };

  const statusCode = dbConnected ? 200 : 503;

  res.status(statusCode).json(health);
};
