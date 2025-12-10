import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware';
import { authRoutes } from './routes/auth.routes';
import { revenueRoutes } from './routes/revenues.routes';
import { expenseRoutes } from './routes/expenses.routes';
import { categoryRoutes } from './routes/categories.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { monthlyExpenseRoutes } from './routes/monthly-expenses.routes';
import { monthlyRevenueRoutes } from './routes/monthly-revenues.routes';
import { simulationRoutes } from './routes/simulation.routes';
import { wishRoutes } from './routes/wishes.routes';
import { shoppingListRoutes } from './routes/shopping-list.routes';
import { notificationRoutes } from './routes/notifications.routes';

dotenv.config();

const app = Fastify({
  logger: false,
});

// CORS: Allow all origins without restrictions
app.addHook('onRequest', async (request, reply) => {
  const origin = request.headers.origin;
  
  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    if (origin) {
      reply.header('Access-Control-Allow-Origin', origin);
    } else {
      reply.header('Access-Control-Allow-Origin', '*');
    }
    reply.header('Access-Control-Allow-Credentials', 'true');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    reply.header('Access-Control-Max-Age', '86400');
    return reply.code(204).send();
  }
});

// CORS: Add headers to all responses
app.addHook('onSend', async (request, reply, payload) => {
  const origin = request.headers.origin;
  
  if (origin) {
    reply.header('Access-Control-Allow-Origin', origin);
  } else {
    reply.header('Access-Control-Allow-Origin', '*');
  }
  reply.header('Access-Control-Allow-Credentials', 'true');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  return payload;
});

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key',
});

// Error handler
app.setErrorHandler(errorHandler);

// Health check
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes
const apiPrefix = process.env.API_PREFIX || '/api';

app.register(authRoutes, { prefix: `${apiPrefix}/auth` });
app.register(revenueRoutes, { prefix: apiPrefix });
app.register(expenseRoutes, { prefix: apiPrefix });
app.register(categoryRoutes, { prefix: apiPrefix });
app.register(dashboardRoutes, { prefix: apiPrefix });
app.register(monthlyExpenseRoutes, { prefix: apiPrefix });
app.register(monthlyRevenueRoutes, { prefix: apiPrefix });
app.register(simulationRoutes, { prefix: apiPrefix });
app.register(wishRoutes, { prefix: apiPrefix });
app.register(shoppingListRoutes, { prefix: apiPrefix });
app.register(notificationRoutes, { prefix: apiPrefix });

export default app;

