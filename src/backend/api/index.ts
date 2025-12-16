// Vercel Serverless Function Entry Point
// Import all dependencies directly to ensure they are bundled
import Fastify from 'fastify';
import cors from '@fastify/cors';
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

dotenv.config();

const app = Fastify({
  logger: false,
  // Configure for serverless environment
  disableRequestLogging: true,
});

// Register CORS plugin FIRST - must be registered before other plugins and routes
// Configured to allow all origins without restrictions for Vercel production
app.register(cors, {
  origin: true, // Allow all origins (no restrictions)
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  preflight: true, // Enable preflight requests
  strictPreflight: false, // Don't require preflight for all requests
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

// Serverless handler for Vercel
// This handler ensures CORS headers are properly set in serverless environment
export default async function handler(req: any, res: any) {
  // Get origin from request headers (case-insensitive)
  const origin = req.headers?.origin || req.headers?.Origin || req.headers?.ORIGIN;
  
  // Set CORS headers before processing request (important for serverless)
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  
  // Handle preflight OPTIONS requests immediately
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  try {
    // Ensure app is ready before handling request
    await app.ready();
    
    // Handle the request through Fastify
    app.server.emit('request', req, res);
  } catch (error) {
    // If Fastify fails, still return a response with CORS headers
    console.error('Error handling request:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
}

// Also export app for direct usage if needed
export { app };
