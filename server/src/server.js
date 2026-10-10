import { validateEnvironment, config } from './config/environment.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { createApp } from './app.js';

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Step 1: Validate environment variables
    console.log('Starting server...');
    validateEnvironment();

    // Step 2: Create Express application
    const app = createApp();

    // Step 3: Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await connectDatabase();

    // Step 4: Start HTTP server
    const server = app.listen(config.port, () => {
      console.log('=================================');
      console.log(`✓ Server is running on port ${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
      console.log(`✓ API: http://localhost:${config.port}/api`);
      console.log(`✓ Health: http://localhost:${config.port}/api/health`);
      console.log('=================================');
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('HTTP server closed');
        
        try {
          await disconnectDatabase();
          console.log('✓ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    console.error('\nPlease check your configuration and ensure:');
    console.error('1. MongoDB is running (local) or credentials are correct (Atlas)');
    console.error('2. All required environment variables are set in .env');
    console.error('3. Dependencies are installed (npm install)');
    process.exit(1);
  }
};

// Start the server
startServer();
