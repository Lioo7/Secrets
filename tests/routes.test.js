const request = require('supertest');
const app = require('../app');

describe('Routes', () => {
    
  describe('GET /', () => {
    it('should render the home page', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Secrets');
    });
  });

});
