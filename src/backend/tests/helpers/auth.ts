import { db } from '@/infrastructure/database/knex';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function createTestUser() {
  const email = `test-${Date.now()}@test.com`;
  const passwordHash = await bcrypt.hash('password123', 10);
  const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const [user] = await db('users')
    .insert({
      id: userId,
      email,
      password_hash: passwordHash,
      name: 'Test User',
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*');

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'test-secret-key-for-testing-only',
    { expiresIn: '24h' }
  );

  return { user, token };
}

export async function getAuthToken(userId: string): Promise<string> {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'test-secret-key-for-testing-only',
    { expiresIn: '24h' }
  );
}

export async function cleanupTestUsers() {
  await db('users').where('email', 'like', 'test-%@test.com').delete();
}



