import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env if present
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().default('postgresql://guildup:guildup_password@localhost:5432/guildup_db?schema=public'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(16).default('dev_super_secret_jwt_access_token_key_change_in_prod_12345'),
  REFRESH_SECRET: z.string().min(16).default('dev_super_secret_jwt_refresh_token_key_change_in_prod_67890'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000'),
  LIVEKIT_URL: z.string().optional().default('http://localhost:7880'),
  LIVEKIT_API_KEY: z.string().optional().default('devkey'),
  LIVEKIT_API_SECRET: z.string().optional().default('secretdevkey12345678901234567890'),
  ASTRA_LLM_ENABLED: z.coerce.boolean().default(false),
  ASTRA_OPENAI_API_KEY: z.string().optional().default('')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

// Populate process.env with defaults if not set so Prisma Client and sub-modules always find them
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = env.DATABASE_URL;
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = env.JWT_SECRET;
}
if (!process.env.REDIS_URL) {
  process.env.REDIS_URL = env.REDIS_URL;
}

export const allowedCorsOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());
