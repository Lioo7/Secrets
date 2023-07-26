const mongoose = require('mongoose')
const database = require('../config/database')

// Define a mock logger for testing purposes
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}

// Mock the logger module used in the database.js file
jest.mock('../config/logger', () => mockLogger)

describe('database.js', () => {
  const testConnectionString = 'mongodb://localhost:27017/test_db'

  beforeAll(async () => {
    await database.connect(testConnectionString)
  })

  afterAll(async () => {
    await database.disconnect()
  })

  it('should connect to MongoDB', () => {
    expect(mongoose.connect).toHaveBeenCalledWith(testConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    expect(mockLogger.info).toHaveBeenCalledWith(`Connected to MongoDB: ${testConnectionString}`)
    expect(database.isConnected).toBe(true)
  })

  it('should disconnect from MongoDB', async () => {
    await database.disconnect()
    expect(database.isConnected).toBe(false)
    expect(mongoose.connection.close).toHaveBeenCalled()
    expect(mockLogger.info).toHaveBeenCalledWith('Disconnected from MongoDB')
  })

  it('should clean up the database', async () => {
    await database.cleanupDatabase()
    expect(mongoose.connection.dropDatabase).toHaveBeenCalled()
    expect(mockLogger.info).toHaveBeenCalledWith('Database cleaned up')
  })

  it('should handle errors when connecting to MongoDB', async () => {
    const invalidConnectionString = 'invalid_connection_string'
    // Use a try-catch block to catch the error thrown by the connect function
    try {
      await database.connect(invalidConnectionString)
    } catch (error) {
      expect(error).toBeDefined()
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to connect to MongoDB:',
        expect.any(Error)
      )
    }
  })

  it('should handle errors when disconnecting from MongoDB', async () => {
    // Manually set isConnected to true to simulate an active connection
    database.isConnected = true
    // Mock the connection.close function to throw an error
    mongoose.connection.close.mockRejectedValue(new Error('Failed to close connection'))

    // Use a try-catch block to catch the error thrown by the disconnect function
    try {
      await database.disconnect()
    } catch (error) {
      expect(error).toBeDefined()
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to disconnect from MongoDB:',
        expect.any(Error)
      )
    }
  })

  it('should handle errors when cleaning up the database', async () => {
    // Manually set isConnected to true to simulate an active connection
    database.isConnected = true
    // Mock the connection.dropDatabase function to throw an error
    mongoose.connection.dropDatabase.mockRejectedValue(new Error('Failed to drop database'))

    // Use a try-catch block to catch the error thrown by the cleanupDatabase functions
    try {
      await database.cleanupDatabase()
    } catch (error) {
      expect(error).toBeDefined()
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to clean up database:',
        expect.any(Error)
      )
    }
  })
})
