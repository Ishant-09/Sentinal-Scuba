import { describe, it, expect } from 'vitest';
import { calculateMaxXp } from '../src/modules/xp/xp.service.js';
import { ABILITIES } from '../src/modules/boss/boss.service.js';
import { registerSchema, loginSchema } from '../src/modules/auth/auth.controller.js';

describe('API Schema & Validation Logic', () => {
  it('registerSchema rejects invalid emails and short passwords', () => {
    const invalidEmailResult = registerSchema.safeParse({
      email: 'not-an-email',
      password: 'StrongPassword123!',
      name: 'Test Scholar',
      handle: 'testscholar'
    });
    expect(invalidEmailResult.success).toBe(false);

    const shortPasswordResult = registerSchema.safeParse({
      email: 'test@guildup.dev',
      password: '123',
      name: 'Test Scholar',
      handle: 'testscholar'
    });
    expect(shortPasswordResult.success).toBe(false);
  });

  it('registerSchema accepts valid registration payload', () => {
    const validResult = registerSchema.safeParse({
      email: 'test@guildup.dev',
      password: 'StrongPassword123!',
      name: 'Test Scholar',
      handle: 'testscholar'
    });
    expect(validResult.success).toBe(true);
  });

  it('loginSchema enforces email and password presence', () => {
    const emptyResult = loginSchema.safeParse({});
    expect(emptyResult.success).toBe(false);

    const validResult = loginSchema.safeParse({
      email: 'ishant@guildup.dev',
      password: 'ScholarPass123!'
    });
    expect(validResult.success).toBe(true);
  });
});
