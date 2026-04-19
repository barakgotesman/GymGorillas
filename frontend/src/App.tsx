import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useGym } from './lib/store';
import { Landing } from './screens/Landing';
import { Onboarding } from './screens/Onboarding';
import { Dashboard } from './screens/Dashboard';
import { ActiveWorkout } from './screens/ActiveWorkout';
import { PostSessionLog } from './screens/PostSessionLog';
import { History } from './screens/History';
import { SessionDetail } from './screens/SessionDetail';
import { ExerciseLibrary } from './screens/ExerciseLibrary';
import { AppShell } from './components/AppShell';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthed, user } = useGym();
  const location = useLocation();
  if (!isAuthed) return <Navigate to="/" replace state={{ from: location }} />;
  if (user && !user.profileComplete && location.pathname !== '/onboarding') {
    // soft nudge only — do not redirect; onboarding handles the redirect when user chooses.
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />

      <Route element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workout/active" element={<ActiveWorkout />} />
        <Route path="/workout/log" element={<PostSessionLog />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<SessionDetail />} />
        <Route path="/exercises" element={<ExerciseLibrary />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
