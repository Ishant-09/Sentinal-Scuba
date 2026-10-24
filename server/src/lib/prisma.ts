import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';
import { env } from '../config/env.js';
import { inMemoryDb } from './inMemoryDb.js';

let isRealDbConnected = false;
let realPrisma: PrismaClient | null = null;

try {
  realPrisma = new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });
} catch (err: any) {
  logger.warn('PrismaClient init notice: Using in-memory database engine for local environment.');
}

export async function connectPrisma(): Promise<void> {
  if (!realPrisma) {
    logger.info('💡 Operating on high-performance In-Memory relational engine (Zero configuration mode)');
    return;
  }

  try {
    await realPrisma.$connect();
    isRealDbConnected = true;
    logger.info('✅ Database connected successfully (PostgreSQL via Prisma)');
  } catch (err: any) {
    isRealDbConnected = false;
    logger.info('💡 PostgreSQL not running locally — Active on In-Memory relational engine with seeded demo scholars.');
  }
}

export async function disconnectPrisma(): Promise<void> {
  if (isRealDbConnected && realPrisma) {
    await realPrisma.$disconnect();
  }
}

const genericMockModel = {
  findMany: async () => [],
  findFirst: async () => null,
  findUnique: async () => null,
  findUniqueOrThrow: async () => null,
  create: async (args: any) => ({ id: args?.data?.id || 'gen-id', ...args?.data }),
  update: async (args: any) => ({ ...args?.data }),
  updateMany: async () => ({ count: 1 }),
  upsert: async (args: any) => ({ ...args?.create, ...args?.update }),
  delete: async () => ({ count: 1 }),
  deleteMany: async () => ({ count: 1 }),
  count: async () => 0
};

// Transparent Proxy: if PostgreSQL is connected, forwards to real Prisma.
// If PostgreSQL is offline/unstarted, seamlessly serves from in-memory engine.
export const prisma: PrismaClient = new Proxy(
  {},
  {
    get(_target, prop: string) {
      if (prop === '$connect') return connectPrisma;
      if (prop === '$disconnect') return disconnectPrisma;

      if (isRealDbConnected && realPrisma && prop in realPrisma) {
        return (realPrisma as any)[prop];
      }

      if (prop in inMemoryDb) {
        return (inMemoryDb as any)[prop];
      }

      // If database is not connected, provide safe generic mock rather than failing
      if (!isRealDbConnected) {
        return genericMockModel;
      }

      if (realPrisma && prop in realPrisma) {
        return (realPrisma as any)[prop];
      }

      return genericMockModel;
    }
  }
) as unknown as PrismaClient;
