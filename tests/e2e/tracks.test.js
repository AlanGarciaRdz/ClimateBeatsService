const request = require('supertest');
const { app, server } = require('../../src/app'); // Import app and server

describe('ClimateBeatsService E2E Tests', () => {
  // Set reasonable timeout for external API calls
  jest.setTimeout(30000);
  afterAll((done) => {
    // Close the server after all tests
    server.close(done);
  });

  describe('Application Health', () => {
    it('should return health check message', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /text/)
        .expect(200);

      expect(response.text).toBe('ClimateBeatsService is running!');
    });
  });

  describe('GET /api/tracks', () => {
    it('should get tracks by city name', async () => {
      const response = await request(app)
        .get('/api/tracks?city=Zapopan')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          temperature: expect.any(Number),
          tracks: expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              album: expect.any(String),
              artist: expect.any(Array),
            }),
          ]),
        })
      );
    });

    it('should get tracks by coordinates', async () => {
      const response = await request(app)
        .get('/api/tracks?lat=20.7167&lon=-103.4')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          temperature: expect.any(Number),
          tracks: expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              album: expect.any(String),
              artist: expect.any(Array),
            }),
          ]),
        })
      );
    });

    it('should return 400 when no location is provided', async () => {
      await request(app)
        .get('/api/tracks')
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
          expect(response.body).toHaveProperty('error');
        });
    });

    it('should return 400 for invalid coordinates', async () => {
      await request(app)
        .get('/api/tracks?lat=invalid&lon=-99.1332')
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });

  describe('GET /api/stats', () => {
    it('should return statistics', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect('Content-Type', /json/)
        .expect(200);

      //Validate I have the totalRequests
      expect(response.body).toEqual(
        expect.objectContaining({
          totalRequests: expect.any(Number),
          requests: expect.any(Array),
        })
      );

      // Verify stats structure if any exist
      if (response.body.requests.length > 0) {
        expect(response.body.requests[0]).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            endpoint: expect.any(String),
            duration: expect.any(Number),
            tracks: expect.any(Array),
          })
        );
      }
    });
  });
});
