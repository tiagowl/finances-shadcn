import { FastifyInstance } from 'fastify';
import app from '@/presentation/http/server';
import { db } from '@/infrastructure/database/knex';

let testApp: FastifyInstance | null = null;

export async function getTestApp(): Promise<FastifyInstance> {
  if (!testApp) {
    testApp = app;
    await testApp.ready();
  }
  return testApp;
}

export async function cleanupDatabase() {
  // Clean up test data (be careful with order due to foreign keys)
  try {
    await db('expenses').where('name', 'like', 'Test %').delete();
    await db('revenues').where('name', 'like', 'Test %').delete();
    await db('wishes').where('name', 'like', 'Test %').delete();
    await db('categories').where('name', 'like', 'Test %').delete();
    await db('users').where('email', 'like', 'test-%@test.com').delete();
  } catch (error) {
    console.error('Error cleaning up database:', error);
  }
}

export async function closeTestApp() {
  if (testApp) {
    await testApp.close();
    testApp = null;
  }
}



