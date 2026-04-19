import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { C } from '../lib/constants';
import { Logo } from './ui';
import { DumbbellIcon, HomeIcon, LibraryIcon, ClockIcon, CoinIcon, FlameIcon } from './Icons';
import { useGym } from '../lib/store';

export function AppShell() {
  const nav = useNavigate();
  const loc = useLocation();
  const user = useGym(s => s.user);
  const logout = useGym(s => s.logout);

  const showBack = loc.pathname.startsWith('/workout') || loc.pathname.startsWith('/history/');

  return (
    <div style={{
      minHeight: '100vh',
      maxWidth: 480,
      margin: '0 auto',
      background: C.bg,
      color: C.text,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: `${C.bg}ee`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {showBack ? (
          <button onClick={() => nav(-1)} style={{
            background: 'none', border: 'none', color: C.text, fontSize: 22,
            cursor: 'pointer', padding: 4, lineHeight: 1,
          }} aria-label="Back">←</button>
        ) : (
          <Logo size="sm" />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: C.orange, fontSize: 13, fontWeight: 700 }}>
            <FlameIcon size={14} color={C.orange} /> {user?.currentStreak ?? 0}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700 }}>
            <CoinIcon size={14} /> {user?.coins ?? 0}
          </div>
          <button onClick={logout} title="Logout" style={{
            background: 'none', border: `1px solid ${C.border}`, color: C.textDim,
            borderRadius: 999, padding: '4px 10px', fontSize: 11, cursor: 'pointer',
          }}>exit</button>
        </div>
      </header>

      <main style={{ flex: 1, paddingBottom: 90 }}>
        <Outlet />
      </main>

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: `${C.surface}f5`,
        backdropFilter: 'blur(14px)',
        borderTop: `1px solid ${C.border}`,
        padding: '10px 10px calc(10px + env(safe-area-inset-bottom))',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        gap: 4,
        zIndex: 20,
      }}>
        <Tab to="/dashboard" label="Home"    icon={<HomeIcon />} />
        <Tab to="/history"   label="History" icon={<ClockIcon />} />
        <CenterTab to="/workout/active" />
        <Tab to="/exercises" label="Library" icon={<LibraryIcon />} />
        <Tab to="/workout/log" label="Log"   icon={<DumbbellIcon />} />
      </nav>
    </div>
  );
}

function Tab({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <NavLink to={to} style={({ isActive }) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 4px',
      color: isActive ? C.accent : C.textDim,
      textDecoration: 'none',
      fontSize: 10,
      fontWeight: 600,
      gap: 3,
    })}>
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function CenterTab({ to }: { to: string }) {
  return (
    <NavLink to={to} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      textDecoration: 'none',
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.accent}, #1ab05f)`,
        boxShadow: `0 6px 20px ${C.accent}66`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: -22,
        border: `3px solid ${C.bg}`,
      }}>
        <DumbbellIcon size={22} color="#05160A" />
      </div>
    </NavLink>
  );
}
