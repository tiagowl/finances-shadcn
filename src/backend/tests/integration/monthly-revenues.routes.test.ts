import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { getTestApp, closeTestApp, cleanupDatabase } from '../helpers/test-setup';
import { createTestUser } from '../helpers/auth';
import { FastifyInstance } from 'fastify';

describe('Sprint 4 - US-018: Receitas Mensais', () => {
  let app: FastifyInstance;
  let authToken: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { token } = await createTestUser();
    authToken = token;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await closeTestApp();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  // TC-018-001: Lista exibe receitas mensais
  it('TC-018-001: should list monthly revenues', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/monthly-revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Salário',
        amount: 5000,
        dayOfMonth: 5,
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/monthly-revenues',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data.length).toBeGreaterThan(0);
  });
});



