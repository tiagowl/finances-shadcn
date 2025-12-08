import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { getTestApp, closeTestApp, cleanupDatabase } from '../helpers/test-setup';
import { createTestUser } from '../helpers/auth';
import { FastifyInstance } from 'fastify';

describe('Sprint 1 - US-008: Visualizar Lista de Despesas', () => {
  let app: FastifyInstance;
  let authToken: string;
  let userId: string;
  let categoryId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { user, token } = await createTestUser();
    userId = user.id;
    authToken = token;

    // Create a category for expenses
    const categoryResponse = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
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

  // TC-008-001: Lista exibe todas as despesas do usuário
  it('TC-008-001: should list all user expenses', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/expenses',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Supermercado',
        amount: 500,
        date: new Date().toISOString(),
        categoryId,
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/expenses',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].userId).toBe(userId);
  });
});

describe('Sprint 1 - US-009: Criar Despesa', () => {
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
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Transporte',
        budgetMax: 500,
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

  // TC-009-001: Criar despesa com dados válidos
  it('TC-009-001: should create expense with valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/expenses',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Uber',
        amount: 50,
        date: new Date().toISOString(),
        categoryId,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.name).toBe('Uber');
    expect(body.amount).toBe(50);
    expect(body.categoryId).toBe(categoryId);
  });

  // TC-009-002: Validação - categoria obrigatória
  it('TC-009-002: should reject expense without category', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/expenses',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Despesa',
        amount: 100,
        date: new Date().toISOString(),
      },
    });

    expect(response.statusCode).toBe(400);
  });
});

describe('Sprint 1 - US-010: Editar Despesa', () => {
  let app: FastifyInstance;
  let authToken: string;
  let expenseId: string;
  let categoryId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { token } = await createTestUser();
    authToken = token;

    const categoryResponse = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Categoria',
        budgetMax: 1000,
      },
    });
    categoryId = JSON.parse(categoryResponse.body).id;
  });

  beforeEach(async () => {
    await cleanupDatabase();
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/expenses',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Despesa Original',
        amount: 100,
        date: new Date().toISOString(),
        categoryId,
      },
    });
    expenseId = JSON.parse(createResponse.body).id;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await closeTestApp();
  });

  // TC-010-001: Editar despesa com dados válidos
  it('TC-010-001: should update expense with valid data', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/api/expenses/${expenseId}`,
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Despesa Atualizada',
        amount: 200,
        date: new Date().toISOString(),
        categoryId,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.name).toBe('Despesa Atualizada');
    expect(body.amount).toBe(200);
  });
});

describe('Sprint 1 - US-011: Excluir Despesa', () => {
  let app: FastifyInstance;
  let authToken: string;
  let expenseId: string;
  let categoryId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { token } = await createTestUser();
    authToken = token;

    const categoryResponse = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Categoria',
        budgetMax: 1000,
      },
    });
    categoryId = JSON.parse(categoryResponse.body).id;
  });

  beforeEach(async () => {
    await cleanupDatabase();
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/expenses',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Despesa para Excluir',
        amount: 100,
        date: new Date().toISOString(),
        categoryId,
      },
    });
    expenseId = JSON.parse(createResponse.body).id;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await closeTestApp();
  });

  // TC-011-001: Excluir despesa existente
  it('TC-011-001: should delete existing expense', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/api/expenses/${expenseId}`,
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(204);
  });
});



