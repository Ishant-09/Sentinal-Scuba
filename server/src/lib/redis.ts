import { Redis } from 'ioredis';
import { env } from '../config/env.js';
import { logger } from './logger.js';

// In-memory fallback mock engine for zero-configuration development and tests
export class InMemoryRedis {
  private kv = new Map<string, { val: string; exp?: number }>();
  private sets = new Map<string, Set<string>>();
  private sortedSets = new Map<string, Map<string, number>>();
  public status = 'ready';

  private cleanKey(key: string) {
    const item = this.kv.get(key);
    if (item?.exp && Date.now() > item.exp) {
      this.kv.delete(key);
    }
  }

  async get(key: string): Promise<string | null> {
    this.cleanKey(key);
    const item = this.kv.get(key);
    return item ? item.val : null;
  }

  async set(key: string, val: string, ...args: any[]): Promise<'OK' | null> {
    let exp: number | undefined;
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'string') {
        const flag = args[i].toUpperCase();
        if (flag === 'EX' && args[i + 1]) exp = Date.now() + parseInt(args[i + 1], 10) * 1000;
        if (flag === 'PX' && args[i + 1]) exp = Date.now() + parseInt(args[i + 1], 10);
        if (flag === 'NX' && this.kv.has(key)) return null;
      }
    }
    this.kv.set(key, { val, exp });
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const k of keys) {
      if (this.kv.delete(k) || this.sets.delete(k) || this.sortedSets.delete(k)) count++;
    }
    return count;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.kv.get(key);
    if (item) {
      item.exp = Date.now() + seconds * 1000;
      return 1;
    }
    return 0;
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    if (!this.sets.has(key)) this.sets.set(key, new Set());
    const s = this.sets.get(key)!;
    let added = 0;
    for (const m of members) {
      if (!s.has(m)) {
        s.add(m);
        added++;
      }
    }
    return added;
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    const s = this.sets.get(key);
    if (!s) return 0;
    let removed = 0;
    for (const m of members) {
      if (s.delete(m)) removed++;
    }
    return removed;
  }

  async smembers(key: string): Promise<string[]> {
    const s = this.sets.get(key);
    return s ? Array.from(s) : [];
  }

  async scard(key: string): Promise<number> {
    const s = this.sets.get(key);
    return s ? s.size : 0;
  }

  async zincrby(key: string, increment: number, member: string): Promise<string> {
    if (!this.sortedSets.has(key)) this.sortedSets.set(key, new Map());
    const z = this.sortedSets.get(key)!;
    const current = z.get(member) || 0;
    const next = current + increment;
    z.set(member, next);
    return next.toString();
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    if (!this.sortedSets.has(key)) this.sortedSets.set(key, new Map());
    const z = this.sortedSets.get(key)!;
    const isNew = !z.has(member);
    z.set(member, score);
    return isNew ? 1 : 0;
  }

  async zrevrange(key: string, start: number, stop: number, ...args: any[]): Promise<string[]> {
    const z = this.sortedSets.get(key);
    if (!z) return [];

    const sorted = Array.from(z.entries()).sort((a, b) => b[1] - a[1]);
    const sliced = stop === -1 ? sorted.slice(start) : sorted.slice(start, stop + 1);

    const withScores = args.some((a) => typeof a === 'string' && a.toUpperCase() === 'WITHSCORES');
    if (withScores) {
      const res: string[] = [];
      for (const [m, s] of sliced) {
        res.push(m, s.toString());
      }
      return res;
    }
    return sliced.map(([m]) => m);
  }

  async ping(): Promise<string> {
    return 'PONG';
  }

  async quit(): Promise<void> {}
  async disconnect(): Promise<void> {}
  on() { return this; }
}

const fallbackStore = new InMemoryRedis();
let activeTarget: any = fallbackStore;
let isRealRedis = false;
let realClientInstance: Redis | null = null;

// Create proxy handler that dynamically dispatches to active target with safe fallback
export const redis: any = new Proxy({}, {
  get(_target, prop: string | symbol) {
    if (prop === 'isReal') return isRealRedis;
    if (prop === 'target') return activeTarget;

    const member = activeTarget[prop];
    if (typeof member === 'function') {
      return async (...args: any[]) => {
        try {
          return await member.apply(activeTarget, args);
        } catch (err: any) {
          if (isRealRedis) {
            logger.warn({ err: err?.message }, 'Active Redis command failed, falling back to in-memory store');
            isRealRedis = false;
            activeTarget = fallbackStore;
            const fallbackFn = (fallbackStore as any)[prop];
            if (typeof fallbackFn === 'function') {
              return await fallbackFn.apply(fallbackStore, args);
            }
          }
          throw err;
        }
      };
    }
    return member;
  }
});

export async function connectRedis(): Promise<void> {
  try {
    const client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 1000,
      retryStrategy(times) {
        if (times > 1) return null;
        return 100;
      },
      lazyConnect: true
    });

    client.on('error', (err) => {
      if (isRealRedis) {
        logger.warn({ err: err.message }, 'Redis connection error. Reverting to in-memory fallback.');
      }
      isRealRedis = false;
      activeTarget = fallbackStore;
    });

    await client.connect();
    realClientInstance = client;
    activeTarget = client;
    isRealRedis = true;
    logger.info('✅ Standalone Redis connected successfully on ' + env.REDIS_URL);
  } catch {
    isRealRedis = false;
    activeTarget = fallbackStore;
    logger.info('ℹ️ Redis operating in seamless in-memory fallback mode.');
  }
}

export function getRedisClient(): any {
  return activeTarget;
}
