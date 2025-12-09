// Vercel Serverless Function Entry Point
// Import all dependencies directly to ensure they are bundled
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { errorHandler } from '../dist/src/presentation/http/middleware/error.middleware.js';
import { authRoutes } from '../dist/src/presentation/http/routes/auth.routes.js';
import { revenueRoutes } from '../dist/src/presentation/http/routes/revenues.routes.js';
import { expenseRoutes } from '../dist/src/presentation/http/routes/expenses.routes.js';
import { categoryRoutes } from '../dist/src/presentation/http/routes/categories.routes.js';
import { dashboardRoutes } from '../dist/src/presentation/http/routes/dashboard.routes.js';
import { monthlyExpenseRoutes } from '../dist/src/presentation/http/routes/monthly-expenses.routes.js';
import { monthlyRevenueRoutes } from '../dist/src/presentation/http/routes/monthly-revenues.routes.js';
import { simulationRoutes } from '../dist/src/presentation/http/routes/simulation.routes.js';
import { wishRoutes } from '../dist/src/presentation/http/routes/wishes.routes.js';
import { shoppingListRoutes } from '../dist/src/presentation/http/routes/shopping-list.routes.js';
import { notificationRoutes } from '../dist/src/presentation/http/routes/notifications.routes.js';
import { logger } from '../dist/src/shared/logger.js';

dotenv.config();

const app = Fastify({
  logger: false,
});

// Register plugins
app.register(helmet);

// CORS configuration - supports multiple origins
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const corsOrigins = corsOrigin.split(',').map((origin) => origin.trim());

// In development, allow all localhost origins
const isDevelopment = process.env.NODE_ENV === 'development';

app.register(cors, {
  origin: isDevelopment
    ? (origin, callback) => {
        // In development, allow requests with no origin or from localhost/127.0.0.1
        if (!origin) {
          return callback(null, true);
        }
        // Allow any localhost or 127.0.0.1 origin in development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          return callback(null, true);
        }
        // Also check configured origins
        if (corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'), false);
      }
    : corsOrigins.length === 1
      ? corsOrigins[0]
      : corsOrigins,
  credentials: true,
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

// Export as default for Vercel serverless function
export default app;
