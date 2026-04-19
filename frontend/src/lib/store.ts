import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Exercise, SessionSummary, User, WorkoutSession, WorkoutSet, FinishResult, Quest } from '../types';
import { coinsForXp, computeSetXp, nextStreak, rankForXp, todayISO } from './xp';

const uid = () => Math.random().toString(36).slice(2, 10);

const SEED_EXERCISES: Exercise[] = [
  { id: 'e1',  name: 'Bench Press',   muscleGroup: 'chest',     isArchived: false, timesLogged: 47, personalBest: { weightKg: 100, reps: 5,  date: '2026-03-01' } },
  { id: 'e2',  name: 'Back Squat',    muscleGroup: 'legs',      isArchived: false, timesLogged: 38, personalBest: { weightKg: 130, reps: 5,  date: '2026-03-08' } },
  { id: 'e3',  name: 'Deadlift',      muscleGroup: 'back',      isArchived: false, timesLogged: 29, personalBest: { weightKg: 160, reps: 3,  date: '2026-03-12' } },
  { id: 'e4',  name: 'Overhead Press',muscleGroup: 'shoulders', isArchived: false, timesLogged: 22, personalBest: { weightKg: 70,  reps: 5,  date: '2026-03-15' } },
  { id: 'e5',  name: 'Pull-ups',      muscleGroup: 'back',      isArchived: false, timesLogged: 31, personalBest: { weightKg: 0,   reps: 12, date: '2026-03-20' } },
  { id: 'e6',  name: 'Dips',          muscleGroup: 'chest',     isArchived: false, timesLogged: 18, personalBest: { weightKg: 20,  reps: 10, date: '2026-03-22' } },
  { id: 'e7',  name: 'Barbell Row',   muscleGroup: 'back',      isArchived: false, timesLogged: 25, personalBest: { weightKg: 100, reps: 6,  date: '2026-03-25' } },
  { id: 'e8',  name: 'Walking Lunge', muscleGroup: 'legs',      isArchived: false, timesLogged: 12, personalBest: { weightKg: 60,  reps: 12, date: '2026-03-28' } },
  { id: 'e9',  name: 'Incline Press', muscleGroup: 'chest',     isArchived: false, timesLogged: 15, personalBest: { weightKg: 80,  reps: 6,  date: '2026-04-02' } },
  { id: 'e10', name: 'Lat Pulldown',  muscleGroup: 'back',      isArchived: false, timesLogged: 20, personalBest: { weightKg: 75,  reps: 10, date: '2026-04-04' } },
];

const SEED_SESSIONS: WorkoutSession[] = [
  {
    id: 's1', workoutDate: '2026-04-17',
    startedAt: '2026-04-17T18:00:00Z', endedAt: '2026-04-17T19:00:00Z',
    durationMinutes: 60, isRetroactive: false, notes: 'Felt strong.',
    totalXp: 142.5, totalVolumeKg: 2400,
    sets: [
      { id: 'st1', sessionId: 's1', exerciseId: 'e1', setNumber: 1, weightKg: 80, reps: 8, xpEarned: 9.7, isFirstLog: false, loggedAt: '2026-04-17T18:05:00Z' },
      { id: 'st2', sessionId: 's1', exerciseId: 'e1', setNumber: 2, weightKg: 80, reps: 7, xpEarned: 8.5, isFirstLog: false, loggedAt: '2026-04-17T18:08:00Z' },
      { id: 'st3', sessionId: 's1', exerciseId: 'e2', setNumber: 1, weightKg: 120, reps: 5, xpEarned: 10.2, isFirstLog: false, loggedAt: '2026-04-17T18:20:00Z' },
    ],
  },
  {
    id: 's2', workoutDate: '2026-04-15',
    startedAt: null, endedAt: null,
    durationMinutes: 70, isRetroactive: true, notes: null,
    totalXp: 211.0, totalVolumeKg: 4100,
    sets: [
      { id: 'st4', sessionId: 's2', exerciseId: 'e3', setNumber: 1, weightKg: 160, reps: 3, xpEarned: 8.9, isFirstLog: false, loggedAt: '2026-04-15T12:00:00Z' },
      { id: 'st5', sessionId: 's2', exerciseId: 'e7', setNumber: 1, weightKg: 90,  reps: 6, xpEarned: 9.3, isFirstLog: false, loggedAt: '2026-04-15T12:10:00Z' },
    ],
  },
  {
    id: 's3', workoutDate: '2026-04-13',
    startedAt: '2026-04-13T07:00:00Z', endedAt: '2026-04-13T07:40:00Z',
    durationMinutes: 40, isRetroactive: false, notes: null,
    totalXp: 88.0, totalVolumeKg: 1900,
    sets: [
      { id: 'st6', sessionId: 's3', exerciseId: 'e4', setNumber: 1, weightKg: 60, reps: 6, xpEarned: 7.1, isFirstLog: false, loggedAt: '2026-04-13T07:05:00Z' },
    ],
  },
];

const SEED_QUESTS: { daily: Quest[]; weekly: Quest[] } = {
  daily: [
    { id: 'q1', title: 'Log a workout today',    type: 'daily',  progress: 0, target: 1,   isCompleted: false, xpReward: 50,  coinReward: 10 },
    { id: 'q2', title: 'Log 5 sets',             type: 'daily',  progress: 0, target: 5,   isCompleted: false, xpReward: 30,  coinReward: 5  },
    { id: 'q3', title: 'Hit 500 kg volume',      type: 'daily',  progress: 0, target: 500, isCompleted: false, xpReward: 40,  coinReward: 8  },
  ],
  weekly: [
    { id: 'q4', title: 'Complete 3 workouts',    type: 'weekly', progress: 1, target: 3,    isCompleted: false, xpReward: 200, coinReward: 50 },
    { id: 'q5', title: 'Lift 5,000 kg volume',   type: 'weekly', progress: 2400, target: 5000, isCompleted: false, xpReward: 150, coinReward: 30 },
  ],
};

const DEFAULT_USER: User = {
  id: 'local-user',
  email: 'you@gymgorillas.gg',
  displayName: 'GorillaBro',
  avatarUrl: null,
  gender: 'male',
  age: 28,
  heightCm: 178,
  bodyweightKg: 78,
  fitnessLevel: 'intermediate',
  totalXp: 1240,
  coins: 124,
  currentRank: 'juvenile',
  currentStreak: 4,
  lastWorkoutDate: '2026-04-17',
  profileComplete: true,
};

export interface GymState {
  isAuthed: boolean;
  user: User | null;
  exercises: Exercise[];
  sessions: WorkoutSession[];
  quests: { daily: Quest[]; weekly: Quest[] };
  activeSessionId: string | null;

  loginStub: (newUser: boolean) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  finalizeOnboarding: () => void;

  createExercise: (name: string, muscleGroup: Exercise['muscleGroup']) => Exercise;
  updateExercise: (id: string, patch: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;

  sessionSummaries: () => SessionSummary[];
  getSession: (id: string) => WorkoutSession | undefined;

  startActiveSession: () => string;
  addSetToActive: (exerciseId: string, weightKg: number, reps: number) => { setId: string; xpPreview: number; isFirstLog: boolean } | null;
  removeSetFromActive: (setId: string) => void;
  discardActive: () => void;
  finishActive: (notes?: string) => FinishResult | null;

  logRetroactive: (payload: {
    workoutDate: string;
    durationMinutes?: number;
    notes?: string;
    sets: { exerciseId: string; weightKg: number; reps: number }[];
  }) => FinishResult;
}

function summarize(s: WorkoutSession): SessionSummary {
  const exSet = new Set(s.sets.map(x => x.exerciseId));
  return {
    id: s.id,
    workoutDate: s.workoutDate,
    totalXp: Math.round(s.totalXp * 10) / 10,
    totalVolumeKg: s.totalVolumeKg,
    durationMinutes: s.durationMinutes,
    exerciseCount: exSet.size,
    setCount: s.sets.length,
    isRetroactive: s.isRetroactive,
  };
}

export const useGym = create<GymState>()(
  persist(
    (set, get) => ({
      isAuthed: false,
      user: null,
      exercises: SEED_EXERCISES,
      sessions: SEED_SESSIONS,
      quests: SEED_QUESTS,
      activeSessionId: null,

      loginStub: (newUser) => {
        if (newUser) {
          set({
            isAuthed: true,
            user: {
              ...DEFAULT_USER,
              id: uid(),
              displayName: '',
              totalXp: 0,
              coins: 0,
              currentRank: 'chimp',
              currentStreak: 0,
              lastWorkoutDate: null,
              profileComplete: false,
              gender: null,
              age: null,
              heightCm: null,
              bodyweightKg: null,
              fitnessLevel: null,
            },
          });
        } else {
          set({ isAuthed: true, user: { ...DEFAULT_USER } });
        }
      },

      logout: () => set({ isAuthed: false, user: null, activeSessionId: null }),

      updateUser: (patch) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, ...patch } });
      },

      finalizeOnboarding: () => {
        const u = get().user;
        if (!u) return;
        const complete = !!(u.displayName && u.gender && u.age && u.heightCm && u.bodyweightKg && u.fitnessLevel);
        set({ user: { ...u, profileComplete: complete } });
      },

      createExercise: (name, muscleGroup) => {
        const ex: Exercise = {
          id: uid(),
          name: name.trim(),
          muscleGroup,
          isArchived: false,
          timesLogged: 0,
          personalBest: null,
        };
        set({ exercises: [...get().exercises, ex] });
        return ex;
      },

      updateExercise: (id, patch) => {
        set({ exercises: get().exercises.map(e => e.id === id ? { ...e, ...patch } : e) });
      },

      deleteExercise: (id) => {
        const ex = get().exercises.find(e => e.id === id);
        if (!ex) return;
        if (ex.timesLogged === 0) {
          set({ exercises: get().exercises.filter(e => e.id !== id) });
        } else {
          get().updateExercise(id, { isArchived: true });
        }
      },

      sessionSummaries: () =>
        [...get().sessions]
          .sort((a, b) => b.workoutDate.localeCompare(a.workoutDate))
          .map(summarize),

      getSession: (id) => get().sessions.find(s => s.id === id),

      startActiveSession: () => {
        const id = uid();
        const now = new Date().toISOString();
        const session: WorkoutSession = {
          id,
          workoutDate: todayISO(),
          startedAt: now,
          endedAt: null,
          durationMinutes: null,
          isRetroactive: false,
          totalXp: 0,
          totalVolumeKg: 0,
          notes: null,
          sets: [],
        };
        set({ sessions: [session, ...get().sessions], activeSessionId: id });
        return id;
      },

      addSetToActive: (exerciseId, weightKg, reps) => {
        const sid = get().activeSessionId;
        const user = get().user;
        if (!sid || !user) return null;
        const session = get().sessions.find(s => s.id === sid);
        if (!session) return null;

        const alreadyLoggedEx = get().sessions.some(s => s.id !== sid && s.sets.some(st => st.exerciseId === exerciseId));
        const inThis = session.sets.some(st => st.exerciseId === exerciseId);
        const isFirstLog = !alreadyLoggedEx && !inThis;

        const xp = computeSetXp(user, weightKg, reps, isFirstLog);
        const setNumber = session.sets.filter(st => st.exerciseId === exerciseId).length + 1;
        const newSet: WorkoutSet = {
          id: uid(),
          sessionId: sid,
          exerciseId,
          setNumber,
          weightKg,
          reps,
          xpEarned: xp,
          isFirstLog,
          loggedAt: new Date().toISOString(),
        };

        const updated: WorkoutSession = {
          ...session,
          sets: [...session.sets, newSet],
          totalXp: session.totalXp + xp,
          totalVolumeKg: session.totalVolumeKg + weightKg * reps,
        };
        set({ sessions: get().sessions.map(s => s.id === sid ? updated : s) });
        return { setId: newSet.id, xpPreview: xp, isFirstLog };
      },

      removeSetFromActive: (setId) => {
        const sid = get().activeSessionId;
        if (!sid) return;
        const session = get().sessions.find(s => s.id === sid);
        if (!session) return;
        const target = session.sets.find(s => s.id === setId);
        if (!target) return;
        const updated: WorkoutSession = {
          ...session,
          sets: session.sets.filter(s => s.id !== setId),
          totalXp: session.totalXp - target.xpEarned,
          totalVolumeKg: session.totalVolumeKg - target.weightKg * target.reps,
        };
        set({ sessions: get().sessions.map(s => s.id === sid ? updated : s) });
      },

      discardActive: () => {
        const sid = get().activeSessionId;
        if (!sid) return;
        set({
          sessions: get().sessions.filter(s => s.id !== sid),
          activeSessionId: null,
        });
      },

      finishActive: (notes) => {
        const sid = get().activeSessionId;
        const user = get().user;
        if (!sid || !user) return null;
        const session = get().sessions.find(s => s.id === sid);
        if (!session || session.sets.length === 0) return null;

        const now = new Date();
        const start = session.startedAt ? new Date(session.startedAt) : now;
        const duration = Math.max(1, Math.round((now.getTime() - start.getTime()) / 60000));

        const finished: WorkoutSession = {
          ...session,
          endedAt: now.toISOString(),
          durationMinutes: duration,
          notes: notes ?? null,
        };

        const coinsEarned = coinsForXp(finished.totalXp);
        const newTotalXp = user.totalXp + finished.totalXp;
        const newCoins = user.coins + coinsEarned;
        const prevRank = user.currentRank;
        const newRank = rankForXp(newTotalXp);
        const streak = nextStreak(user, finished.workoutDate);

        const updatedExercises = get().exercises.map(e => {
          const setsForEx = finished.sets.filter(s => s.exerciseId === e.id);
          if (setsForEx.length === 0) return e;
          const best = setsForEx.reduce((b, s) => (s.weightKg * s.reps > b.weightKg * b.reps ? s : b));
          const pb = e.personalBest;
          const newPb = !pb || best.weightKg * best.reps > pb.weightKg * pb.reps
            ? { weightKg: best.weightKg, reps: best.reps, date: finished.workoutDate }
            : pb;
          return { ...e, timesLogged: e.timesLogged + setsForEx.length, personalBest: newPb };
        });

        set({
          sessions: get().sessions.map(s => s.id === sid ? finished : s),
          activeSessionId: null,
          exercises: updatedExercises,
          user: {
            ...user,
            totalXp: newTotalXp,
            coins: newCoins,
            currentRank: newRank,
            currentStreak: streak,
            lastWorkoutDate: finished.workoutDate,
          },
        });

        return {
          sessionId: sid,
          totalXp: Math.round(finished.totalXp * 10) / 10,
          coinsEarned,
          newTotalXp: Math.round(newTotalXp * 10) / 10,
          newCoins,
          rankUp: prevRank !== newRank ? { from: prevRank, to: newRank } : null,
        };
      },

      logRetroactive: (payload) => {
        const user = get().user!;
        const sid = uid();
        const sets: WorkoutSet[] = [];
        let totalXp = 0;
        let totalVolume = 0;

        for (const s of payload.sets) {
          const alreadyLoggedEx = get().sessions.some(ss => ss.sets.some(st => st.exerciseId === s.exerciseId));
          const inThis = sets.some(st => st.exerciseId === s.exerciseId);
          const isFirstLog = !alreadyLoggedEx && !inThis;
          const xp = computeSetXp(user, s.weightKg, s.reps, isFirstLog);
          const setNumber = sets.filter(st => st.exerciseId === s.exerciseId).length + 1;
          sets.push({
            id: uid(),
            sessionId: sid,
            exerciseId: s.exerciseId,
            setNumber,
            weightKg: s.weightKg,
            reps: s.reps,
            xpEarned: xp,
            isFirstLog,
            loggedAt: payload.workoutDate + 'T12:00:00Z',
          });
          totalXp += xp;
          totalVolume += s.weightKg * s.reps;
        }

        const session: WorkoutSession = {
          id: sid,
          workoutDate: payload.workoutDate,
          startedAt: null,
          endedAt: null,
          durationMinutes: payload.durationMinutes ?? null,
          isRetroactive: true,
          totalXp,
          totalVolumeKg: totalVolume,
          notes: payload.notes ?? null,
          sets,
        };

        const coinsEarned = coinsForXp(totalXp);
        const newTotalXp = user.totalXp + totalXp;
        const newCoins = user.coins + coinsEarned;
        const prevRank = user.currentRank;
        const newRank = rankForXp(newTotalXp);
        const streak = nextStreak(user, payload.workoutDate);

        const updatedExercises = get().exercises.map(e => {
          const setsForEx = sets.filter(s => s.exerciseId === e.id);
          if (setsForEx.length === 0) return e;
          const best = setsForEx.reduce((b, s) => (s.weightKg * s.reps > b.weightKg * b.reps ? s : b));
          const pb = e.personalBest;
          const newPb = !pb || best.weightKg * best.reps > pb.weightKg * pb.reps
            ? { weightKg: best.weightKg, reps: best.reps, date: payload.workoutDate }
            : pb;
          return { ...e, timesLogged: e.timesLogged + setsForEx.length, personalBest: newPb };
        });

        set({
          sessions: [session, ...get().sessions],
          exercises: updatedExercises,
          user: {
            ...user,
            totalXp: newTotalXp,
            coins: newCoins,
            currentRank: newRank,
            currentStreak: streak,
            lastWorkoutDate:
              !user.lastWorkoutDate || payload.workoutDate > user.lastWorkoutDate
                ? payload.workoutDate
                : user.lastWorkoutDate,
          },
        });

        return {
          sessionId: sid,
          totalXp: Math.round(totalXp * 10) / 10,
          coinsEarned,
          newTotalXp: Math.round(newTotalXp * 10) / 10,
          newCoins,
          rankUp: prevRank !== newRank ? { from: prevRank, to: newRank } : null,
        };
      },
    }),
    {
      name: 'gg-state',
      partialize: (s) => ({
        isAuthed: s.isAuthed,
        user: s.user,
        exercises: s.exercises,
        sessions: s.sessions,
        quests: s.quests,
        activeSessionId: s.activeSessionId,
      }),
    }
  )
);
