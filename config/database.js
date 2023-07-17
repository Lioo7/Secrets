const mongoose = require('mongoose');
const logger = require('./logger');

let isConnected = false;
let connection = null;

async function connect(connectionString) {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isConnected = true;
    connection = mongoose.connection;
    logger.info(`Connected to MongoDB: ${connectionString}`);
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

async function disconnect() {
  if (!isConnected) {
    logger.error('No active MongoDB connection to disconnect from');
    return;
  }

  try {
    await connection.close();
    isConnected = false;
    connection = null;
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Failed to disconnect from MongoDB:', error);
    throw error;
  }
}

async function cleanupDatabase() {
  if (!isConnected) {
    logger.error('No active MongoDB connection to clean up');
    return;
  }

  try {
    await connection.dropDatabase();
    logger.info('Database cleaned up');
  } catch (error) {
    logger.error('Failed to clean up database:', error);
    throw error;
  }
}

module.exports = { connect, disconnect, cleanupDatabase };
