import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { getTestApp, closeTestApp, cleanupDatabase } from '../helpers/test-setup';
import { createTestUser } from '../helpers/auth';
import { FastifyInstance } from 'fastify';

describe('Sprint 1 - US-004: Visualizar Lista de Receitas', () => {
  let app: FastifyInstance;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { user, token } = await createTestUser();
    userId = user.id;
    authToken = token;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await closeTestApp();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  // TC-004-001: Lista exibe todas as receitas do usuário
  it('TC-004-001: should list all user revenues', async () => {
    // Create some revenues
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

    await app.inject({
      method: 'POST',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Freelance',
        amount: 1500,
        date: new Date().toISOString(),
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data).toHaveLength(2);
    expect(body.data[0].userId).toBe(userId);
  });

  // TC-004-002: Exibição de estatística de total de receitas
  it('TC-004-002: should calculate total revenues correctly', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Receita 1',
        amount: 1000,
        date: new Date().toISOString(),
      },
    });

    await app.inject({
      method: 'POST',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Receita 2',
        amount: 2000,
        date: new Date().toISOString(),
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    const total = body.data.reduce((sum: number, r: any) => sum + r.amount, 0);
    expect(total).toBe(3000);
  });

  // TC-004-003: Lista vazia - mensagem apropriada
  it('TC-004-003: should return empty array when no revenues', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data).toEqual([]);
  });

  // TC-004-004: Formatação de valores monetários
  it('TC-004-004: should format monetary values correctly', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Teste',
        amount: 10.5,
        date: new Date().toISOString(),
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data[0].amount).toBe(10.5);
  });
});

describe('Sprint 1 - US-005: Criar Receita', () => {
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

  // TC-005-001: Criar receita com dados válidos
  it('TC-005-001: should create revenue with valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Salário',
        amount: 5000,
        date: new Date().toISOString(),
        notes: 'Salário mensal',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.name).toBe('Salário');
    expect(body.amount).toBe(5000);
  });

  // TC-005-002: Validação - nome muito curto
  it('TC-005-002: should reject name shorter than 2 characters', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'A',
        amount: 1000,
        date: new Date().toISOString(),
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // TC-005-003: Validação - valor negativo
  it('TC-005-003: should reject negative amount', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Receita',
        amount: -100,
        date: new Date().toISOString(),
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // TC-005-004: Validação - data futura
  it('TC-005-004: should reject future date', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const response = await app.inject({
      method: 'POST',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Receita',
        amount: 1000,
        date: futureDate.toISOString(),
      },
    });

    expect(response.statusCode).toBe(400);
  });
});

describe('Sprint 1 - US-006: Editar Receita', () => {
  let app: FastifyInstance;
  let authToken: string;
  let revenueId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { token } = await createTestUser();
    authToken = token;
  });

  beforeEach(async () => {
    await cleanupDatabase();
    // Create a revenue
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Receita Original',
        amount: 1000,
        date: new Date().toISOString(),
      },
    });
    revenueId = JSON.parse(createResponse.body).id;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await closeTestApp();
  });

  // TC-006-001: Editar receita com dados válidos
  it('TC-006-001: should update revenue with valid data', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/api/revenues/${revenueId}`,
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Receita Atualizada',
        amount: 2000,
        date: new Date().toISOString(),
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.name).toBe('Receita Atualizada');
    expect(body.amount).toBe(2000);
  });
});

describe('Sprint 1 - US-007: Excluir Receita', () => {
  let app: FastifyInstance;
  let authToken: string;
  let revenueId: string;

  beforeAll(async () => {
    app = await getTestApp();
    const { token } = await createTestUser();
    authToken = token;
  });

  beforeEach(async () => {
    await cleanupDatabase();
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/revenues',
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Receita para Excluir',
        amount: 1000,
        date: new Date().toISOString(),
      },
    });
    revenueId = JSON.parse(createResponse.body).id;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await closeTestApp();
  });

  // TC-007-001: Excluir receita existente
  it('TC-007-001: should delete existing revenue', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/api/revenues/${revenueId}`,
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(response.statusCode).toBe(204);

    // Verify it's deleted
    const getResponse = await app.inject({
      method: 'GET',
      url: `/api/revenues/${revenueId}`,
      headers: { authorization: `Bearer ${authToken}` },
    });

    expect(getResponse.statusCode).toBe(404);
  });
});



