const mongoose = require('mongoose')
const database = require('../config/database')

// Mock the logger (optional)
const logger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}

// Mock the mongoose.connect function to avoid connecting to a real database
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    close: jest.fn(),
    dropDatabase: jest.fn()
  }
}))

beforeAll(async () => {
  // Connect to the separate test database
  await database.connect(process.env.TEST_MONGODB_URI)
})

afterAll(async () => {
  // Close the database connection
  await database.disconnect()
})

describe('Database Functions', () => {
  afterEach(() => {
    jest.clearAllMocks() // Clear all mock functions after each test
  })

  describe('connect', () => {
    it('should connect to MongoDB', async () => {
      expect(mongoose.connect).toHaveBeenCalledWith(process.env.TEST_MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      expect(logger.info).toHaveBeenCalledWith(`Connected to MongoDB: ${process.env.TEST_MONGODB_URI}`)
    })

    it('should throw an error when failed to connect to MongoDB', async () => {
      // Mock mongoose.connect to throw an error
      mongoose.connect.mockRejectedValueOnce(new Error('Failed to connect'))

      await expect(database.connect('invalid_connection_string')).rejects.toThrow(
        'Failed to connect'
      )

      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('disconnect', () => {
    it('should disconnect from MongoDB', async () => {
      await database.disconnect()

      expect(mongoose.connection.close).toHaveBeenCalled()
      expect(logger.info).toHaveBeenCalledWith('Disconnected from MongoDB')
    })

    it('should log an error when there is no active MongoDB connection to disconnect from', async () => {
      await database.disconnect()

      expect(logger.error).toHaveBeenCalledWith('No active MongoDB connection to disconnect from')
    })
  })

  describe('cleanupDatabase', () => {
    it('should clean up the database', async () => {
      await database.cleanupDatabase()

      expect(mongoose.connection.dropDatabase).toHaveBeenCalled()
      expect(logger.info).toHaveBeenCalledWith('Database cleaned up')
    })

    it('should log an error when there is no active MongoDB connection to clean up', async () => {
      await database.cleanupDatabase()

      expect(logger.error).toHaveBeenCalledWith('No active MongoDB connection to clean up')
    })
  })
})
