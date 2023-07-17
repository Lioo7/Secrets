// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest')
const { app, server } = require('../app')
const database = require('../config/database')
const logger = require('../config/logger')

beforeAll(async () => {
  logger.debug('beforeAll')
  // Connect to the separate test database
  await database.connect(process.env.TEST_MONGODB_URI)
  // Clean up the database
  await database.cleanupDatabase()
})

afterAll(async () => {
  logger.debug('afterAll')
  // Close the database connection
  await database.disconnect()
  // Close the server after all tests are done
  server.close()
})

describe('Routes', () => {
  describe('GET /', () => {
    it('should render the home page', async () => {
      logger.debug('Test: GET / should render the home page')
      const response = await request(app).get('/')
      expect(response.status).toBe(200)
      expect(response.text).toContain('Secrets')
    })
  })

  describe('GET /register', () => {
    it('should render the registration form', async () => {
      logger.debug('Test: GET /register should render the registration form')
      const response = await request(app).get('/register')
      expect(response.status).toBe(200)
      expect(response.text).toContain('Register')
    })
  })

  describe('POST /register', () => {
    it('should register a new user', async () => {
      logger.debug('Test: POST /register should register a new user')
      const response = await request(app)
        .post('/register')
        .send({ username: 'testuser@gmail.com', password: 'testpassword' })

      // Assert the status code and the redirection location
      expect(response.status).toBe(302)
      expect(response.header.location).toBe('/secrets')
    })

    it('should handle registration errors', async () => {
      logger.debug('Test: POST /register should handle registration errors')
      const response = await request(app)
        .post('/register')
        .send({ username: '', password: 'testpassword' })

      expect(response.status).toBe(302) // Expecting a redirect status code
      expect(response.header.location).toBe('/register') // Expecting redirection to the same route
    })
  })

  describe('GET /login', () => {
    it('should render the login form', async () => {
      logger.debug('Test: GET /login should render the login form')
      const response = await request(app).get('/login')
      expect(response.status).toBe(200)
      expect(response.text).toContain('Login')
    })
  })

  describe('POST /login', () => {
    it('should log in a user with correct credentials', async () => {
      logger.debug('Test: POST /login should log in a user with correct credentials')
      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser@gmail.com', password: 'testpassword' })

      expect(response.status).toBe(302)
      expect(response.header.location).toBe('/secrets')
    })

    it('should handle login errors with incorrect credentials', async () => {
      logger.debug('Test: POST /login should handle login errors with incorrect credentials')
      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'wrongpassword' })

      expect(response.status).toBe(401) // Expecting an unauthorized status code
    })
  })

  describe('POST /logout', () => {
    it('should log out a user', async () => {
      logger.debug('Test: POST /logout should log out a user')
      const response = await request(app).post('/logout')
      expect(response.status).toBe(302)
      expect(response.header.location).toBe('/')
    })
  })
})
