import type { User, RankKey } from '../types';
import { RANKS } from './constants';

const FALLBACK_SET_XP = 5;

export function computeSetXp(user: User, weightKg: number, reps: number, isFirstLog: boolean): number {
  const base = user.bodyweightKg ? (weightKg * reps) / user.bodyweightKg : FALLBACK_SET_XP;

  const genderMult = user.gender === 'female' ? 1.15 : 1.0;

  const fitnessMult =
    user.fitnessLevel === 'beginner'     ? 1.30 :
    user.fitnessLevel === 'advanced'     ? 0.85 :
    1.0;

  const ageMult = user.age && user.age >= 50 ? 1.20 : 1.0;

  const streakMult =
    user.currentStreak >= 5 ? 1.25 :
    user.currentStreak >= 3 ? 1.10 :
    1.0;

  const firstLogBonus = isFirstLog ? 1.50 : 1.0;

  return base * genderMult * fitnessMult * ageMult * streakMult * firstLogBonus;
}

export function coinsForXp(xp: number): number {
  return Math.floor(xp / 10);
}

export function rankForXp(totalXp: number): RankKey {
  let cur: RankKey = 'chimp';
  for (const r of RANKS) {
    if (totalXp >= r.xpMin) cur = r.key;
  }
  return cur;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((db - da) / 86400000);
}

export function nextStreak(user: User, workoutDate: string): number {
  if (!user.lastWorkoutDate) return 1;
  const gap = daysBetween(user.lastWorkoutDate, workoutDate);
  if (gap === 0) return user.currentStreak;
  if (gap === 1) return user.currentStreak + 1;
  return 1;
}
