import { describe, it, expect } from 'vitest';
import { calculateMaxXp, getCurrentIsoWeek } from '../src/modules/xp/xp.service.js';

describe('XP Progression & Level Curves', () => {
  it('calculates correct max XP for initial levels according to formula (500 + 250 * (level - 1))', () => {
    expect(calculateMaxXp(1)).toBe(500);
    expect(calculateMaxXp(2)).toBe(750);
    expect(calculateMaxXp(3)).toBe(1000);
    expect(calculateMaxXp(4)).toBe(1250);
    expect(calculateMaxXp(5)).toBe(1500);
    expect(calculateMaxXp(10)).toBe(2750);
  });

  it('correctly simulates single-level overflow carry-over', () => {
    let currentXp = 400;
    let level = 1;
    let maxXp = calculateMaxXp(level); // 500

    const grantAmount = 300;
    currentXp += grantAmount; // 700

    const levelUps: number[] = [];
    while (currentXp >= maxXp) {
      currentXp -= maxXp;
      level += 1;
      maxXp = calculateMaxXp(level);
      levelUps.push(level);
    }

    expect(levelUps).toEqual([2]);
    expect(level).toBe(2);
    expect(currentXp).toBe(200); // 700 - 500 = 200
    expect(maxXp).toBe(750);
  });

  it('correctly simulates multi-level overflow carry-over across multiple thresholds', () => {
    let currentXp = 0;
    let level = 1;
    let maxXp = calculateMaxXp(level); // 500

    // Grant 1400 XP at once
    // Lv 1 requires 500 -> remaining 900
    // Lv 2 requires 750 -> remaining 150
    // Lv 3 requires 1000 -> remaining 150, does not level up
    const grantAmount = 1400;
    currentXp += grantAmount;

    const levelUps: number[] = [];
    while (currentXp >= maxXp) {
      currentXp -= maxXp;
      level += 1;
      maxXp = calculateMaxXp(level);
      levelUps.push(level);
    }

    expect(levelUps).toEqual([2, 3]);
    expect(level).toBe(3);
    expect(currentXp).toBe(150);
    expect(maxXp).toBe(1000);
  });

  it('generates a valid ISO week string format (YYYY-Www)', () => {
    const week = getCurrentIsoWeek();
    expect(week).toMatch(/^\d{4}-W\d{2}$/);
  });
});
