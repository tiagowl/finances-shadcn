import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { getTestApp, closeTestApp, cleanupDatabase } from '../helpers/test-setup';
import { createTestUser } from '../helpers/auth';
import { FastifyInstance } from 'fastify';

describe('Sprint 6 - US-027: Visualizar Lista de Desejos', () => {
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

  // TC-027-001: Lista exibe todos os desejos
  it('TC-027-001: should list all wishes', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/wishes',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'iPhone 15',
        purchaseLink: 'https://example.com',
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/wishes',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data.length).toBeGreaterThan(0);
  });
});

describe('Sprint 6 - US-028: Criar Desejo', () => {
  let app: FastifyInstance;
  let authToken: string;
  let categoryId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { token } = await createTestUser();
    authToken = token;

    const categoryResponse = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        name: 'Eletrônicos',
        budgetMax: 10000,
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

  // TC-028-001: Criar desejo com dados válidos
  it('TC-028-001: should create wish with valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/wishes',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'iPhone 15',
        purchaseLink: 'https://example.com',
        categoryId,
        amount: 5000,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.name).toBe('iPhone 15');
    expect(body.categoryId).toBe(categoryId);
    expect(body.amount).toBe(5000);
  });
});

describe('Sprint 6 - Purchase Wish', () => {
  let app: FastifyInstance;
  let authToken: string;
  let categoryId: string;
  let wishId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { token } = await createTestUser();
    authToken = token;

    const categoryResponse = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        name: 'Eletrônicos',
        budgetMax: 10000,
      },
    });
    categoryId = JSON.parse(categoryResponse.body).id;
  });

  beforeEach(async () => {
    await cleanupDatabase();
    const wishResponse = await app.inject({
      method: 'POST',
      url: '/api/wishes',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'iPhone 15',
        categoryId,
        amount: 5000,
      },
    });
    wishId = JSON.parse(wishResponse.body).id;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await closeTestApp();
  });

  // Purchase wish test
  it('should purchase wish and create expense', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/api/wishes/${wishId}/purchase`,
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.expense).toBeDefined();
    expect(body.expense.name).toBe('iPhone 15');
    expect(body.expense.amount).toBe(5000);

    // Verify wish is deleted
    const getWishResponse = await app.inject({
      method: 'GET',
      url: '/api/wishes',
      headers: { authorization: `Bearer ${authToken}` },
    });
    const wishes = JSON.parse(getWishResponse.body).data;
    expect(wishes.find((w: any) => w.id === wishId)).toBeUndefined();
  });
});



