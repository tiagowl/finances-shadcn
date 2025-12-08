import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';

// Increase timeout for database operations
jest.setTimeout(30000);

// Cleanup after all tests
afterAll(async () => {
  // Add any cleanup logic here
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
});



