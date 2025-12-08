import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { getTestApp, closeTestApp, cleanupDatabase } from '../helpers/test-setup';
import { createTestUser, cleanupTestUsers } from '../helpers/auth';
import { FastifyInstance } from 'fastify';
import { db } from '@/infrastructure/database/knex';

describe('Sprint 0 - US-001: Login de Usuário', () => {
  let app: FastifyInstance;
  let testUser: { email: string; password: string; name: string };

  beforeAll(async () => {
    app = await getTestApp();
    testUser = {
      email: 'usuario@teste.com',
      password: 'senha123456',
      name: 'Usuário Teste',
    };
  });

  afterAll(async () => {
    await cleanupDatabase();
    await cleanupTestUsers();
    await closeTestApp();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  // TC-001-001: Login com credenciais válidas
  it('TC-001-001: should login with valid credentials', async () => {
    // First register user
    const registerResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      },
    });

    expect(registerResponse.statusCode).toBe(201);

    // Then login
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    expect(loginResponse.statusCode).toBe(200);
    const body = JSON.parse(loginResponse.body);
    expect(body.token).toBeDefined();
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(testUser.email);
  });

  // TC-001-002: Login com credenciais inválidas
  it('TC-001-002: should reject login with invalid credentials', async () => {
    // Register user first
    await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      },
    });

    // Try login with wrong password
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: testUser.email,
        password: 'senhaErrada',
      },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.message).toContain('Credenciais inválidas');
  });

  // TC-001-003: Login com email inválido
  it('TC-001-003: should reject login with invalid email format', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'email-invalido',
        password: 'senha123',
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBeDefined();
  });

  // TC-001-004: Login com campos vazios
  it('TC-001-004: should reject login with empty fields', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: '',
        password: '',
      },
    });

    expect(response.statusCode).toBe(400);
  });
});

describe('Sprint 0 - US-002: Cadastro de Usuário', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await getTestApp();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await cleanupTestUsers();
    await closeTestApp();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  // TC-002-001: Cadastro com dados válidos
  it('TC-002-001: should register user with valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'novo@teste.com',
        password: 'senha123456',
        name: 'Novo Usuário',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.user).toBeDefined();
    expect(body.token).toBeDefined();
    expect(body.user.email).toBe('novo@teste.com');
  });

  // TC-002-002: Cadastro com email duplicado
  it('TC-002-002: should reject duplicate email', async () => {
    // Register first time
    await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'duplicado@teste.com',
        password: 'senha123456',
        name: 'Usuário 1',
      },
    });

    // Try to register again
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'duplicado@teste.com',
        password: 'senha123456',
        name: 'Usuário 2',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // TC-002-003: Cadastro com senha muito curta
  it('TC-002-003: should reject password shorter than 8 characters', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'teste@teste.com',
        password: '1234567', // 7 characters
        name: 'Teste',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  // TC-002-004: Cadastro com email inválido
  it('TC-002-004: should reject invalid email format', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email: 'email-invalido',
        password: 'senha123456',
        name: 'Teste',
      },
    });

    expect(response.statusCode).toBe(400);
  });
});



