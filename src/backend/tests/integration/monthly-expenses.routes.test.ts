import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { getTestApp, closeTestApp, cleanupDatabase } from '../helpers/test-setup';
import { createTestUser } from '../helpers/auth';
import { FastifyInstance } from 'fastify';

describe('Sprint 4 - US-012: Despesas Mensais', () => {
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

  // TC-012-001: Lista exibe despesas mensais
  it('TC-012-001: should list monthly expenses', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/monthly-expenses',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Netflix',
        amount: 29.90,
        dayOfMonth: 10,
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/monthly-expenses',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data.length).toBeGreaterThan(0);
  });

  // TC-013-001: Criar despesa mensal
  it('TC-013-001: should create monthly expense', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/monthly-expenses',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Spotify',
        amount: 19.90,
        dayOfMonth: 15,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.name).toBe('Spotify');
    expect(body.dayOfMonth).toBe(15);
  });
});



