const request = require('supertest');
const { app, server } = require('../app');
const database = require('../config/database');
const logger = require('../config/logger');

describe('Routes', () => {
    beforeAll(async () => {
      // Connect to the separate test database
      await database.connect('mongodb://localhost:27017/testDB');
      // Clean up the database
      await database.cleanupDatabase();
    });
  
    describe('GET /', () => {
      it('should render the home page', async () => {
        logger.debug('Test: GET / should render the home page');
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Secrets');
      });
    });
  
    describe('GET /register', () => {
      it('should render the registration form', async () => {
        logger.debug('Test: GET /register should render the registration form');
        const response = await request(app).get('/register');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Register');
      });
    });
  
    describe('POST /register', () => {
        it('should register a new user', async () => {
            logger.debug('Test: POST /register should register a new user');
            const response = await request(app)
              .post('/register')
              .send({ username: 'testuser@gmail.com', password: 'testpassword' });
          
            // Assert the status code and the redirection location
            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/secrets');
          });          
  
    //   it('should handle registration errors', async () => {
    //     logger.debug('Test: POST /register should handle registration errors');
    //     const response = await request(app)
    //       .post('/register')
    //       .send({ username: '', password: 'testpassword' });
  
    //     expect(response.status).toBe(302); // Expecting a redirect status code
    //     expect(response.header.location).toBe('/register'); // Expecting redirection to the same route
    //   });
    });
  
    // describe('GET /login', () => {
    //   it('should render the login form', async () => {
    //     logger.debug('Test: GET /login should render the login form');
    //     const response = await request(app).get('/login');
    //     expect(response.status).toBe(200);
    //     expect(response.text).toContain('Login');
    //   });
    // });

//   describe('POST /login', () => {
//     logger.debug('describe("POST /login")');
//     it('should log in a user', async () => {
//         const response = await request(app)
//           .post('/login')
//           .send({ username: 'testuser@gmail.com', password: 'testpassword' });
      
//         expect(response.status).toBe(302);
//         expect(response.header.location).toBe('/secrets');
//       });
      
//     it('should handle login errors', async () => {
//       const response = await request(app)
//         .post('/login')
//         .send({ username: 'testuser', password: 'wrongpassword' });
  
//       expect(response.status).toBe(302); // Expecting a redirect status code
//       expect(response.header.location).toBe('/login'); // Expecting redirection back to the login route
//     });
//   });  

//   describe('POST /logout', () => {
//     logger.debug('describe("POST /logout")');
//     it('should log out a user', async () => {
//       const response = await request(app).post('/logout');
//       expect(response.status).toBe(200);
//       expect(response.text).toContain('Logout successful');
//     });
//   });

//   describe('GET /google', () => {
//     logger.debug('describe("GET /google")');
//     it('should authenticate with Google', async () => {
//       const response = await request(app).get('/google');
//       expect(response.status).toBe(200);
//       // Add further assertions based on your application's behavior
//     });
//   });

//   describe('GET /google/secrets', () => {
//     logger.debug('GET /google/secrets")');
//     it('should handle Google authentication callback', async () => {
//       const response = await request(app).get('/google/secrets');
//       expect(response.status).toBe(200);
//       // Add further assertions based on your application's behavior
//     });
//   });

  afterAll(async () => {
      logger.debug('afterAll');
      // Close the database connection 
      await database.disconnect();
      // Close the server after all tests are done
      server.close();
  });

});