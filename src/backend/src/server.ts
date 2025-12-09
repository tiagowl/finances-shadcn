import app from './presentation/http/server';
import { logger } from './shared/logger';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    await app.listen({ port: PORT, host: HOST });
    logger.info(`Server listening on http://${HOST}:${PORT}`);
  } catch (error) {
    logger.error('Error starting server', error);
    process.exit(1);
  }
}

// Start server if not in Vercel serverless environment
// Vercel will handle the serverless function separately
if (process.env.VERCEL !== '1') {
  start();
}

export default app;





