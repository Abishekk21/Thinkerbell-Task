import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connect to MongoDB using Mongoose
 * @returns {Promise<void>}
 */
export const connectDatabase = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      dbName: 'project_dev', // Explicitly set database name
    };

    await mongoose.connect(mongoUri, options);
    isConnected = true;
    console.log('✓ MongoDB connected successfully');
    console.log('✓ Using database:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
export const disconnectDatabase = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection error:', error.message);
    throw error;
  }
};

/**
 * Get database connection status
 * @returns {boolean}
 */
export const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get database connection state
 * @returns {string}
 */
export const getDatabaseState = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

/**
 * Get current database name
 * @returns {string}
 */
export const getDatabaseName = () => {
  return mongoose.connection.db?.databaseName || 'not connected';
};

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
  isConnected = false;
});

// Handle application termination
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});
