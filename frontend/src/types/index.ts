import type { RankKey, MuscleGroup } from '../lib/constants';

export type { RankKey, MuscleGroup };

export interface User {
  userId: string;
  email: string;
  displayName: string;
  totalXp: number;
  coins: number;
  currentRank: RankKey;
  currentStreak: number;
  gender: 'male' | 'female' | 'prefer_not_to_say' | null;
  age: number | null;
  heightCm: number | null;
  bodyweightKg: number | null;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | null;
  profileComplete: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  isArchived: boolean;
  timesLogged: number;
  personalBest: { weightKg: number; reps: number } | null;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  weightKg: number;
  reps: number;
  xpEarned: number;
}

export interface WorkoutSession {
  id: string;
  workoutDate: string;
  totalXp: number;
  totalVolumeKg: number;
  durationMinutes: number;
  exerciseCount: number;
  setCount: number;
  isRetroactive: boolean;
}

export interface Quest {
  id: string;
  title: string;
  progress: number;
  target: number;
  isCompleted: boolean;
  xpReward: number;
  coinReward: number;
}

// In-progress workout types (client-only)
export interface LiveSet {
  id: number;
  weightKg: number;
  reps: number;
  xpPreview: number;
}

export interface LiveExercise extends Exercise {
  sets: LiveSet[];
}
