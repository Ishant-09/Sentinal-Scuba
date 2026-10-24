import http from 'http';
import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { connectPrisma, disconnectPrisma } from './lib/prisma.js';
import { connectRedis, redis } from './lib/redis.js';
import { initSocketServer } from './realtime/socket.js';

const httpServer = http.createServer(app);

// Initialize Socket.IO real-time engine
initSocketServer(httpServer);

async function bootstrap() {
  try {
    await connectPrisma();
    await connectRedis();

    httpServer.listen(env.PORT, env.HOST, () => {
      logger.info(`🚀 GuildUp Production Backend running at http://${env.HOST}:${env.PORT}`);
      logger.info(`📡 Socket.IO Real-Time engine active on port ${env.PORT}`);
    });
  } catch (err: any) {
    logger.error({ err }, 'Failed to bootstrap server');
    process.exit(1);
  }
}

// Graceful Shutdown
async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  httpServer.close(async () => {
    logger.info('HTTP server closed.');
    await disconnectPrisma();
    await redis.quit();
    logger.info('Database and Redis connections closed. Exiting process.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

bootstrap();
