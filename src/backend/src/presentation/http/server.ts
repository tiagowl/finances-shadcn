import { Hono } from 'hono';
import { cors } from 'hono/cors';
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

const app = new Hono();

// CORS middleware - configured to allow all origins without restrictions
app.use(
  '*',
  cors({
    origin: '*', // Allow all origins (no restrictions)
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposeHeaders: ['Content-Length', 'Content-Type'],
    credentials: false, // Set to false when origin is '*'
  })
);

// Rate limiting - removed for now, can be added later with a custom middleware or external package

// Error handler
app.onError(errorHandler);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register routes
const apiPrefix = process.env.API_PREFIX || '/api';

app.route(`${apiPrefix}/auth`, authRoutes);
app.route(apiPrefix, revenueRoutes);
app.route(apiPrefix, expenseRoutes);
app.route(apiPrefix, categoryRoutes);
app.route(apiPrefix, dashboardRoutes);
app.route(apiPrefix, monthlyExpenseRoutes);
app.route(apiPrefix, monthlyRevenueRoutes);
app.route(apiPrefix, simulationRoutes);
app.route(apiPrefix, wishRoutes);
app.route(apiPrefix, shoppingListRoutes);
app.route(apiPrefix, notificationRoutes);

export default app;

