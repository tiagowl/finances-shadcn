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

// Log CORS configuration for debugging (always log in production to help debug)
console.log('CORS Configuration:', {
  corsOrigin,
  corsOrigins,
  isDevelopment,
  nodeEnv: process.env.NODE_ENV,
  vercelEnv: process.env.VERCEL_ENV,
  hasCorsOrigin: !!process.env.CORS_ORIGIN,
  corsOriginRaw: process.env.CORS_ORIGIN,
});

// Register CORS FIRST, before Helmet, to ensure CORS headers are set
app.register(cors, {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    // In development, allow all localhost origins
    if (isDevelopment) {
      const lowerOrigin = normalizedOrigin.toLowerCase();
      if (lowerOrigin.includes('localhost') || lowerOrigin.includes('127.0.0.1')) {
        console.log('CORS: Allowing localhost origin:', normalizedOrigin);
        return callback(null, true);
      }
    }

    // Check if origin is allowed
    if (isOriginAllowed(normalizedOrigin, corsOrigins)) {
      console.log('CORS: Allowing configured origin:', normalizedOrigin);
      return callback(null, true);
    }

    // Log rejected origin for debugging
    console.log('CORS: Rejecting origin:', normalizedOrigin);
    console.log('CORS: Allowed origins:', corsOrigins);
    console.log('CORS: Environment CORS_ORIGIN:', process.env.CORS_ORIGIN);
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
