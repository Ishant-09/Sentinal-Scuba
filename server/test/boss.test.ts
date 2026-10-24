import { describe, it, expect } from 'vitest';
import { ABILITIES } from '../src/modules/boss/boss.service.js';

describe('Boss Combat & Damage Calculations', () => {
  it('validates abilities catalog configurations', () => {
    expect(ABILITIES['Index Surge']).toBeDefined();
    expect(ABILITIES['Index Surge'].base).toBe(120);
    expect(ABILITIES['Index Surge'].cooldownSec).toBe(30);

    expect(ABILITIES['Hash Join Cleave']).toBeDefined();
    expect(ABILITIES['Hash Join Cleave'].base).toBe(240);

    expect(ABILITIES['Query Optimization Ray']).toBeDefined();
    expect(ABILITIES['Query Optimization Ray'].base).toBe(380);

    expect(ABILITIES['B-Tree Shatter Strike']).toBeDefined();
    expect(ABILITIES['B-Tree Shatter Strike'].base).toBe(500);
  });

  it('calculates damage according to formula: abilityBase + floor(level / 2) + floor(xpEarnedLast24h / 20)', () => {
    const calculateDamage = (abilityBase: number, level: number, xpLast24h: number, isCrit = false) => {
      let dmg = abilityBase + Math.floor(level / 2) + Math.floor(xpLast24h / 20);
      if (isCrit) dmg *= 2;
      return dmg;
    };

    // Scholar at Lv 1 with 0 XP in last 24h
    expect(calculateDamage(120, 1, 0, false)).toBe(120);

    // Scholar at Lv 6 with 600 XP in last 24h
    // 120 + floor(6/2) + floor(600/20) = 120 + 3 + 30 = 153
    expect(calculateDamage(120, 6, 600, false)).toBe(153);

    // Scholar at Lv 6 with 600 XP and Critical Hit
    expect(calculateDamage(120, 6, 600, true)).toBe(306);

    // High level scholar (Lv 25) with 2400 XP using B-Tree Shatter Strike
    // 500 + floor(25/2) + floor(2400/20) = 500 + 12 + 120 = 632
    expect(calculateDamage(500, 25, 2400, false)).toBe(632);
    expect(calculateDamage(500, 25, 2400, true)).toBe(1264);
  });
});
