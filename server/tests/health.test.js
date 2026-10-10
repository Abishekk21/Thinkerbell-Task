import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import { createApp } from '../src/app.js';

describe('Health Check API', () => {
  let app;
  let request;

  before(() => {
    app = createApp();
    request = supertest(app);
  });

  test('GET /api/health should return health status', async () => {
    const response = await request.get('/api/health');
    
    assert.strictEqual(response.status === 200 || response.status === 503, true);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(typeof response.body.message, 'string');
    assert.strictEqual(typeof response.body.timestamp, 'string');
    assert.strictEqual(typeof response.body.uptime, 'number');
    assert.strictEqual(typeof response.body.database, 'object');
    assert.strictEqual(typeof response.body.database.connected, 'boolean');
  });

  test('GET / should return API info', async () => {
    const response = await request.get('/');
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.success, true);
    assert.strictEqual(typeof response.body.message, 'string');
  });

  test('GET /api/nonexistent should return 404', async () => {
    const response = await request.get('/api/nonexistent');
    
    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.success, false);
    assert.strictEqual(typeof response.body.message, 'string');
  });
});
