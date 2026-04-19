# Gym Gorillas — Frontend

Frontend for **Gym Gorillas**, a gamified lifting tracker where every set earns XP and your gorilla evolves from Chimp → Silverback → Legendary.

This is the **V1 MVP** — 7 screens, all business logic running client-side against a mock store so the app is fully navigable without a backend.

## Stack

- React 19 + TypeScript
- Vite 8
- React Router 7
- Zustand (persisted to `localStorage`)
- Tailwind CSS 4 (theme tokens) + inline styles (design system in `src/lib/constants.ts`)

## Running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint
```

## Screens (V1)

| Route | Screen |
|---|---|
| `/` | Landing / sign-in (Google OAuth stubbed) |
| `/onboarding` | 4-step profile onboarding |
| `/dashboard` | Gorilla, XP bar, streak, recent activity |
| `/workout/active` | Live session — pick exercise, log sets, live XP preview |
| `/workout/log` | Retroactive session logging (up to 7 days back) |
| `/history` | Paginated session history, filterable by exercise |
| `/history/:id` | Session detail — per-exercise set breakdown |
| `/exercises` | Exercise library with muscle-group filters and PBs |

V2–V5 screens (Templates, Quests, Achievements, Leaderboard, Friends/Crew, Cosmetics, Shop, Settings) are defined in the spec but not yet implemented.

## Architecture

- `src/lib/store.ts` — Zustand store that acts as the mock API. Implements the XP engine, streak logic, rank-up, and personal-best tracking per the spec. State is persisted to `localStorage` under `gg-state`.
- `src/lib/xp.ts` — Spec's XP engine: `setXP = (weight × reps) / bodyweight`, multipliers for gender / fitness / age / streak / first-log bonus, and `coins = floor(xp / 10)`.
- `src/lib/constants.ts` — Design system (colors, fonts, rank thresholds, muscle-group palette).
- `src/components/ui.tsx` — Reusable UI (`Card`, `XPBar`, `GorillaAvatar`, `RankBadge`, `Pill`, `MuscleTag`, `Toast`, `JungleCorner`, `StatBubble`).
- `src/components/AppShell.tsx` — Sticky top bar + bottom tab nav for authed routes.
- `src/screens/` — One file per screen above.

## Auth

Google OAuth is **stubbed** — the Landing page has two buttons that simulate a new vs. returning Google login. No network call is made. Replace `loginStub` in `src/lib/store.ts` with a real `POST /auth/google` call when the backend lands.

## Next steps

- Replace the mock store with a real Axios client hitting the spec'd endpoints at `https://api.gymgorillas.gg/v1`.
- Add V2 screens (Templates, Quests, Achievements).
- Add V3 social layer (Leaderboard, Friends, Crew).
- Hook up real Google OAuth + JWT refresh flow per spec §2.
