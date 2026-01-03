const request = require('supertest');
const app = require('../src/app');

describe('Server basic routes', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('POST /api/v1/auth/login requires body', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});
    // Validation should fail
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});