import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { getTestApp, closeTestApp, cleanupDatabase } from '../helpers/test-setup';
import { createTestUser } from '../helpers/auth';
import { FastifyInstance } from 'fastify';

describe('Sprint 2 - US-023: Criar Categoria', () => {
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

  // TC-023-001: Criar categoria com dados válidos
  it('TC-023-001: should create category with valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Alimentação',
        budgetMax: 1000,
        color: '#3b82f6',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.name).toBe('Alimentação');
    expect(body.budgetMax).toBe(1000);
  });

  // TC-023-003: Validação - nome muito curto
  it('TC-023-003: should reject name shorter than 2 characters', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'A',
        budgetMax: 1000,
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // TC-023-004: Validação - orçamento negativo
  it('TC-023-004: should reject negative budget', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Categoria',
        budgetMax: -100,
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // TC-023-005: Criar categoria com orçamento zero
  it('TC-023-005: should create category with zero budget', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Sem Orçamento',
        budgetMax: 0,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.budgetMax).toBe(0);
  });
});

describe('Sprint 2 - US-022: Visualizar Categorias', () => {
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

  // TC-022-001: Lista exibe todas as categorias
  it('TC-022-001: should list all categories', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Categoria 1',
        budgetMax: 1000,
      },
    });

    await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Categoria 2',
        budgetMax: 500,
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data.length).toBeGreaterThanOrEqual(2);
  });

  // TC-022-002: Estatísticas totais exibidas
  it('TC-022-002: should display total statistics', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Categoria 1',
        budgetMax: 1000,
      },
    });

    await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Categoria 2',
        budgetMax: 500,
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.stats).toBeDefined();
    expect(body.stats.totalBudgetMax).toBe(1500);
    expect(body.stats.totalSpent).toBeDefined();
  });
});

describe('Sprint 2 - US-024: Status de Orçamento', () => {
  let app: FastifyInstance;
  let authToken: string;
  let categoryId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { token } = await createTestUser();
    authToken = token;
  });

  beforeEach(async () => {
    await cleanupDatabase();
    const categoryResponse = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Teste',
        budgetMax: 1000,
      },
    });
    categoryId = JSON.parse(categoryResponse.body).id;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await closeTestApp();
  });

  // TC-024-001: Cálculo de gasto total por categoria
  it('TC-024-001: should calculate total spent per category', async () => {
    // Create expenses
    await app.inject({
      method: 'POST',
      url: '/api/expenses',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Despesa 1',
        amount: 300,
        date: new Date().toISOString(),
        categoryId,
      },
    });

    await app.inject({
      method: 'POST',
      url: '/api/expenses',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Despesa 2',
        amount: 200,
        date: new Date().toISOString(),
        categoryId,
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    const category = body.data.find((c: any) => c.id === categoryId);
    expect(category.totalSpent).toBe(500);
    expect(category.remaining).toBe(500);
  });
});

describe('Sprint 3 - US-025: Editar Categoria', () => {
  let app: FastifyInstance;
  let authToken: string;
  let categoryId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { token } = await createTestUser();
    authToken = token;
  });

  beforeEach(async () => {
    await cleanupDatabase();
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Categoria Original',
        budgetMax: 1000,
      },
    });
    categoryId = JSON.parse(createResponse.body).id;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await closeTestApp();
  });

  // TC-025-001: Editar categoria com dados válidos
  it('TC-025-001: should update category with valid data', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/api/categories/${categoryId}`,
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Categoria Atualizada',
        budgetMax: 2000,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.name).toBe('Categoria Atualizada');
    expect(body.budgetMax).toBe(2000);
  });
});

describe('Sprint 3 - US-026: Excluir Categoria', () => {
  let app: FastifyInstance;
  let authToken: string;
  let categoryId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { token } = await createTestUser();
    authToken = token;
  });

  beforeEach(async () => {
    await cleanupDatabase();
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/categories',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Categoria para Excluir',
        budgetMax: 1000,
      },
    });
    categoryId = JSON.parse(createResponse.body).id;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await closeTestApp();
  });

  // TC-026-001: Excluir categoria existente
  it('TC-026-001: should delete existing category', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/api/categories/${categoryId}`,
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(204);
  });
});



