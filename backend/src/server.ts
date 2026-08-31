import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';
import { logger } from './utils/logger.js';

async function bootstrap(): Promise<void> {
  // Start Express Server immediately
  app.listen(env.PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    logger.info(`👉 Health check: http://localhost:${env.PORT}/api/health`);
    logger.info(`👉 Auth endpoints: http://localhost:${env.PORT}/api/v1/auth/register`);
  });

  // Verify database connection asynchronously
  logger.info('Connecting to PostgreSQL database via Prisma...');
  prisma.$connect()
    .then(() => {
      logger.info('✅ Database connection established successfully.');
    })
    .catch((error) => {
      logger.warn('⚠️ Database connection unavailable:', (error as Error).message);
      logger.info('💡 Note: Set your PostgreSQL DATABASE_URL in backend/.env to connect to your database.');
    });
}

// Handle unhandled rejections and exceptions
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection at Promise:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', error);
  process.exit(1);
});

bootstrap();
