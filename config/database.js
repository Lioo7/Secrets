const mongoose = require('mongoose');
const logger = require('./logger');

let isConnected = false;
let cachedConnection = null;

async function connect(testing = false) {
  if (isConnected && cachedConnection && cachedConnection.name !== (testing ? 'testDB' : 'userDB')) {
    // Close the existing connection if a different connection string is provided
    await cachedConnection.close();
    isConnected = false;
    cachedConnection = null;
    logger.info('Closed existing MongoDB connection');
  }

  if (isConnected) {
    // If a connection already exists, return without attempting to connect again
    logger.info('Using existing MongoDB connection');
    return;
  }

  const dbUri = testing ? 'mongodb://localhost:27017/testDB' : process.env.MONGODB_URI || 'mongodb://localhost:27017/userDB';

  try {
    // Create a new connection and store it in cachedConnection
    cachedConnection = await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isConnected = true;
    logger.info(`Connected to MongoDB (${dbUri})`);
  } catch (error) {
    logger.error(`Failed to connect to MongoDB (${dbUri}):`, error);
  }
}

async function disconnect() {
  if (!isConnected) {
    // If no connection is established, return
    logger.info('No active MongoDB connection to disconnect from');
    return;
  }

  try {
    // Close the connection and clean up the variables
    await cachedConnection.close();
    isConnected = false;
    cachedConnection = null;
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Failed to disconnect from MongoDB:', error);
  }
}

module.exports = { connect, disconnect };