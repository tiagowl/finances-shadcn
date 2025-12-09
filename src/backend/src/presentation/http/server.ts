import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
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
import { logger } from '@/shared/logger';

dotenv.config();

const app = Fastify({
  logger: false,
});

// Register plugins
app.register(helmet);

// Helper function to normalize URLs (remove trailing slash, ensure consistent format)
function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, ''); // Remove trailing slash
}

// CORS configuration - supports multiple origins
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const corsOrigins = corsOrigin.split(',').map(normalizeOrigin);

// In development, allow all localhost origins
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development';

app.register(cors, {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    // In development, allow all localhost origins
    if (isDevelopment) {
      if (normalizedOrigin.includes('localhost') || normalizedOrigin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }

    // Check if origin is in the configured list (exact match)
    if (corsOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Also check if origin matches any configured origin (protocol-agnostic)
    const originMatches = corsOrigins.some((allowedOrigin) => {
      const normalizedAllowed = normalizeOrigin(allowedOrigin);
      // Compare without protocol for flexibility
      const originWithoutProtocol = normalizedOrigin.replace(/^https?:\/\//, '');
      const allowedWithoutProtocol = normalizedAllowed.replace(/^https?:\/\//, '');
      
      return originWithoutProtocol === allowedWithoutProtocol;
    });

    if (originMatches) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

