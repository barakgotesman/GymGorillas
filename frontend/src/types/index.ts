import type { RankKey, MuscleGroup } from '../lib/constants';

export type { RankKey, MuscleGroup };

export type Gender = 'male' | 'female' | 'prefer_not_to_say';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  gender: Gender | null;
  age: number | null;
  heightCm: number | null;
  bodyweightKg: number | null;
  fitnessLevel: FitnessLevel | null;
  totalXp: number;
  coins: number;
  currentRank: RankKey;
  currentStreak: number;
  lastWorkoutDate: string | null;
  profileComplete: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup | null;
  isArchived: boolean;
  timesLogged: number;
  personalBest: { weightKg: number; reps: number; date: string } | null;
}

export interface WorkoutSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  xpEarned: number;
  isFirstLog: boolean;
  loggedAt: string;
}

export interface WorkoutSession {
  id: string;
  workoutDate: string;
  startedAt: string | null;
  endedAt: string | null;
  durationMinutes: number | null;
  isRetroactive: boolean;
  totalXp: number;
  totalVolumeKg: number;
  notes: string | null;
  sets: WorkoutSet[];
}

export interface SessionSummary {
  id: string;
  workoutDate: string;
  totalXp: number;
  totalVolumeKg: number;
  durationMinutes: number | null;
  exerciseCount: number;
  setCount: number;
  isRetroactive: boolean;
}

export interface Quest {
  id: string;
  title: string;
  type: 'daily' | 'weekly';
  progress: number;
  target: number;
  isCompleted: boolean;
  xpReward: number;
  coinReward: number;
}

export interface FinishResult {
  sessionId: string;
  totalXp: number;
  coinsEarned: number;
  newTotalXp: number;
  newCoins: number;
  rankUp: { from: RankKey; to: RankKey } | null;
}
