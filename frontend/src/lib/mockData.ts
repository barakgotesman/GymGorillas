import type { User, Exercise, WorkoutSession, Quest } from '../types';

export const MOCK_USER: User = {
  userId: 'mock-001',
  email: 'gorilla@example.com',
  displayName: 'GorillaBro',
  totalXp: 1240,
  coins: 124,
  currentRank: 'juvenile',
  currentStreak: 7,
  gender: 'male',
  age: 28,
  heightCm: 180,
  bodyweightKg: 72.5,
  fitnessLevel: 'intermediate',
  profileComplete: true,
};

export const MOCK_SESSIONS: WorkoutSession[] = [
  { id: '1', workoutDate: '2026-04-18', totalXp: 142, totalVolumeKg: 3200, durationMinutes: 55, exerciseCount: 4, setCount: 12, isRetroactive: false },
  { id: '2', workoutDate: '2026-04-17', totalXp: 98,  totalVolumeKg: 2400, durationMinutes: 45, exerciseCount: 3, setCount: 9,  isRetroactive: false },
  { id: '3', workoutDate: '2026-04-15', totalXp: 211, totalVolumeKg: 4100, durationMinutes: 70, exerciseCount: 5, setCount: 15, isRetroactive: true  },
  { id: '4', workoutDate: '2026-04-13', totalXp: 88,  totalVolumeKg: 1900, durationMinutes: 40, exerciseCount: 3, setCount: 8,  isRetroactive: false },
  { id: '5', workoutDate: '2026-04-11', totalXp: 175, totalVolumeKg: 3600, durationMinutes: 65, exerciseCount: 4, setCount: 14, isRetroactive: false },
];

export const MOCK_EXERCISES: Exercise[] = [
  { id: 'e1',  name: 'Bench Press',   muscleGroup: 'chest',     isArchived: false, timesLogged: 47, personalBest: { weightKg: 100, reps: 5  } },
  { id: 'e2',  name: 'Squat',         muscleGroup: 'legs',      isArchived: false, timesLogged: 38, personalBest: { weightKg: 130, reps: 5  } },
  { id: 'e3',  name: 'Deadlift',      muscleGroup: 'back',      isArchived: false, timesLogged: 29, personalBest: { weightKg: 160, reps: 3  } },
  { id: 'e4',  name: 'OHP',           muscleGroup: 'shoulders', isArchived: false, timesLogged: 22, personalBest: { weightKg: 70,  reps: 5  } },
  { id: 'e5',  name: 'Pull-ups',      muscleGroup: 'back',      isArchived: false, timesLogged: 31, personalBest: { weightKg: 0,   reps: 12 } },
  { id: 'e6',  name: 'Dips',          muscleGroup: 'chest',     isArchived: false, timesLogged: 18, personalBest: { weightKg: 20,  reps: 10 } },
  { id: 'e7',  name: 'Barbell Row',   muscleGroup: 'back',      isArchived: false, timesLogged: 25, personalBest: { weightKg: 100, reps: 6  } },
  { id: 'e8',  name: 'Lunges',        muscleGroup: 'legs',      isArchived: false, timesLogged: 12, personalBest: { weightKg: 60,  reps: 12 } },
  { id: 'e9',  name: 'Incline Press', muscleGroup: 'chest',     isArchived: false, timesLogged: 15, personalBest: { weightKg: 80,  reps: 6  } },
  { id: 'e10', name: 'Lat Pulldown',  muscleGroup: 'back',      isArchived: false, timesLogged: 20, personalBest: { weightKg: 75,  reps: 10 } },
];

export const MOCK_QUESTS: { daily: Quest[]; weekly: Quest[] } = {
  daily: [
    { id: 'q1', title: 'Log a workout today', progress: 1,   target: 1,   isCompleted: true,  xpReward: 50,  coinReward: 10 },
    { id: 'q2', title: 'Log 5 sets',           progress: 3,   target: 5,   isCompleted: false, xpReward: 30,  coinReward: 5  },
    { id: 'q3', title: 'Hit 500 kg volume',    progress: 380, target: 500, isCompleted: false, xpReward: 40,  coinReward: 8  },
  ],
  weekly: [
    { id: 'q4', title: 'Complete 3 workouts this week', progress: 2,    target: 3,    isCompleted: false, xpReward: 200, coinReward: 50 },
    { id: 'q5', title: 'Lift 5,000 kg total volume',    progress: 3200, target: 5000, isCompleted: false, xpReward: 150, coinReward: 30 },
    { id: 'q6', title: 'Maintain 5-day streak',         progress: 4,    target: 5,    isCompleted: false, xpReward: 300, coinReward: 75 },
  ],
};
