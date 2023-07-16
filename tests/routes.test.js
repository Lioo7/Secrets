const request = require('supertest');
const server = require('../app').server;
const database = require('../config/database');
const logger = require('../config/logger');

describe('Routes', () => {
    beforeAll(async () => {
      // Connect to the separate test database
      await database.connect('mongodb://localhost:27017/testDB');
    });
  
    describe('GET /', () => {
      it('should render the home page', async () => {
        logger.debug('Test: GET / should render the home page');
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Secrets');
      });
    });
  
    describe('GET /register', () => {
      it('should render the registration form', async () => {
        logger.debug('Test: GET /register should render the registration form');
        const response = await request(server).get('/register');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Register');
      });
    });
  
    describe('POST /register', () => {
      it('should register a new user', async () => {
        logger.debug('Test: POST /register should register a new user');
        const response = await request(server)
          .post('/register')
          .send({ username: 'testuser@gmail.com', password: 'testpassword' });
  
        // Follow the redirect
        const redirectedResponse = await request(server).get(response.header.location);
  
        expect(redirectedResponse.status).toBe(200);
        expect(redirectedResponse.text).toContain('Secret');
      });
  
      it('should handle registration errors', async () => {
        logger.debug('Test: POST /register should handle registration errors');
        const response = await request(server)
          .post('/register')
          .send({ username: '', password: 'testpassword' });
  
        expect(response.status).toBe(302); // Expecting a redirect status code
        expect(response.header.location).toBe('/register'); // Expecting redirection to the same route
      });
    });
  
    describe('GET /login', () => {
      it('should render the login form', async () => {
        logger.debug('Test: GET /login should render the login form');
        const response = await request(server).get('/login');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Login');
      });
    });

//   describe('POST /login', () => {
//     logger.debug('describe("POST /login")');
//     it('should log in a user', async () => {
//         const response = await request(server)
//           .post('/login')
//           .send({ username: 'testuser@gmail.com', password: 'testpassword' });
      
//         expect(response.status).toBe(302);
//         expect(response.header.location).toBe('/secrets');
//       });
      
//     it('should handle login errors', async () => {
//       const response = await request(server)
//         .post('/login')
//         .send({ username: 'testuser', password: 'wrongpassword' });
  
//       expect(response.status).toBe(302); // Expecting a redirect status code
//       expect(response.header.location).toBe('/login'); // Expecting redirection back to the login route
//     });
//   });  

//   describe('POST /logout', () => {
//     logger.debug('describe("POST /logout")');
//     it('should log out a user', async () => {
//       const response = await request(server).post('/logout');
//       expect(response.status).toBe(200);
//       expect(response.text).toContain('Logout successful');
//     });
//   });

//   describe('GET /google', () => {
//     logger.debug('describe("GET /google")');
//     it('should authenticate with Google', async () => {
//       const response = await request(server).get('/google');
//       expect(response.status).toBe(200);
//       // Add further assertions based on your application's behavior
//     });
//   });

//   describe('GET /google/secrets', () => {
//     logger.debug('GET /google/secrets")');
//     it('should handle Google authentication callback', async () => {
//       const response = await request(server).get('/google/secrets');
//       expect(response.status).toBe(200);
//       // Add further assertions based on your application's behavior
//     });
//   });

  afterAll(async () => {
      logger.debug('afterAll');
      // Close the database connection and server
      await database.disconnect();
      // Close the server after all tests are done
      server.close();
  });

});