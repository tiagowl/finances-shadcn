import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { getTestApp, closeTestApp, cleanupDatabase } from '../helpers/test-setup';
import { createTestUser } from '../helpers/auth';
import { FastifyInstance } from 'fastify';

describe('Sprint 1 - US-003: Dashboard', () => {
  let app: FastifyInstance;
  let authToken: string;
  let categoryId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { token } = await createTestUser();
    authToken = token;

    // Create category and expenses/revenues for dashboard
    const categoryResponse = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        name: 'Alimentação',
        budgetMax: 1000,
      },
    });
    categoryId = JSON.parse(categoryResponse.body).id;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await closeTestApp();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  // TC-003-001: Dashboard exibe estatísticas corretas
  it('TC-003-001: should display correct statistics', async () => {
    // Create revenues
    await app.inject({
      method: 'POST',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Salário',
        amount: 5000,
        date: new Date().toISOString(),
      },
    });

    // Create expenses
    await app.inject({
      method: 'POST',
      url: '/api/expenses',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Despesa',
        amount: 500,
        date: new Date().toISOString(),
        categoryId,
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/dashboard',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.totalRevenue).toBeDefined();
    expect(body.totalExpense).toBeDefined();
    expect(body.balance).toBeDefined();
  });
});



