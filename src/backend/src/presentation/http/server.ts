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

// Helper function to normalize URLs (remove trailing slash, ensure consistent format)
function normalizeOrigin(origin: string): string {
  if (!origin) return '';
  return origin.trim().replace(/\/$/, ''); // Remove trailing slash only
}

// Helper function to check if origin is allowed (case-insensitive comparison)
function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  if (!origin) return false;
  
  const normalizedOrigin = normalizeOrigin(origin).toLowerCase();
  
  return allowedOrigins.some(allowed => {
    const normalizedAllowed = normalizeOrigin(allowed).toLowerCase();
    
    // Exact match
    if (normalizedOrigin === normalizedAllowed) {
      return true;
    }
    
    // Protocol-agnostic match
    const originWithoutProtocol = normalizedOrigin.replace(/^https?:\/\//, '');
    const allowedWithoutProtocol = normalizedAllowed.replace(/^https?:\/\//, '');
    
    if (originWithoutProtocol === allowedWithoutProtocol) {
      return true;
    }
    
    return false;
  });
}

// CORS configuration - supports multiple origins
const corsOrigin = (process.env.CORS_ORIGIN || 'http://localhost:5173').trim();
const corsOrigins = corsOrigin
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

// In development, allow all localhost origins
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development';

// Register CORS FIRST, before Helmet, to ensure CORS headers are set
app.register(cors, {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    // In development, allow all localhost origins
    if (isDevelopment) {
      const lowerOrigin = normalizedOrigin.toLowerCase();
      if (lowerOrigin.includes('localhost') || lowerOrigin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }

    // Check if origin is allowed
    if (isOriginAllowed(normalizedOrigin, corsOrigins)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

// Register Helmet AFTER CORS, and configure it to not interfere with CORS
// Temporarily disable Helmet in production to avoid CORS conflicts
// TODO: Re-enable with proper configuration after CORS is confirmed working
if (process.env.DISABLE_HELMET !== 'true') {
  app.register(helmet, {
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // Disable CSP to avoid conflicts
    crossOriginOpenerPolicy: false,
    originAgentCluster: false,
  });
}

// Add hook BEFORE routes to handle OPTIONS requests manually
app.addHook('onRequest', async (request, reply) => {
  const origin = request.headers.origin;
  
  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS' && origin) {
    const normalizedOrigin = normalizeOrigin(origin);
    const lowerOrigin = normalizedOrigin.toLowerCase();
    
    // Check if origin should be allowed
    const shouldAllow = isDevelopment && (lowerOrigin.includes('localhost') || lowerOrigin.includes('127.0.0.1')) ||
                       isOriginAllowed(normalizedOrigin, corsOrigins);
    
    if (shouldAllow) {
      reply.header('Access-Control-Allow-Origin', origin);
      reply.header('Access-Control-Allow-Credentials', 'true');
      reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      reply.header('Access-Control-Max-Age', '86400');
      return reply.code(204).send();
    }
  }
});

// Add hook to ensure CORS headers are always present (executes after all plugins)
app.addHook('onSend', async (request, reply, payload) => {
  const origin = request.headers.origin;
  
  if (origin) {
    const normalizedOrigin = normalizeOrigin(origin);
    const lowerOrigin = normalizedOrigin.toLowerCase();
    
    // Check if origin should be allowed
    const shouldAllow = isDevelopment && (lowerOrigin.includes('localhost') || lowerOrigin.includes('127.0.0.1')) ||
                       isOriginAllowed(normalizedOrigin, corsOrigins);
    
    if (shouldAllow) {
      // Force set CORS headers (this runs after Helmet, so it will override)
      reply.header('Access-Control-Allow-Origin', origin);
      reply.header('Access-Control-Allow-Credentials', 'true');
      reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
  }
  
  return payload;
});

// Add hook to ensure CORS headers are always present (even if Helmet tries to remove them)
app.addHook('onResponse', async (request, reply) => {
  const origin = request.headers.origin;
  
  if (origin) {
    const normalizedOrigin = normalizeOrigin(origin);
    const lowerOrigin = normalizedOrigin.toLowerCase();
    
    // Check if origin should be allowed
    const shouldAllow = isDevelopment && (lowerOrigin.includes('localhost') || lowerOrigin.includes('127.0.0.1')) ||
                       isOriginAllowed(normalizedOrigin, corsOrigins);
    
    if (shouldAllow) {
      // Ensure CORS headers are set
      if (!reply.getHeader('Access-Control-Allow-Origin')) {
        reply.header('Access-Control-Allow-Origin', origin);
      }
      if (!reply.getHeader('Access-Control-Allow-Credentials')) {
        reply.header('Access-Control-Allow-Credentials', 'true');
      }
      if (!reply.getHeader('Access-Control-Allow-Methods')) {
        reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      }
      if (!reply.getHeader('Access-Control-Allow-Headers')) {
        reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      }
    }
  }
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

