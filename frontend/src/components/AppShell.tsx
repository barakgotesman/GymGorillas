import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './ui';
import {
  DumbbellIcon, HomeIcon, LibraryIcon, ClockIcon, CoinIcon, FlameIcon, PlusIcon,
} from './Icons';
import { useGym } from '../lib/store';

export function AppShell() {
  const nav = useNavigate();
  const loc = useLocation();
  const user = useGym(s => s.user);
  const logout = useGym(s => s.logout);

  const showMobileBack = loc.pathname.startsWith('/workout') || loc.pathname.startsWith('/history/');

  return (
    <div className="min-h-screen bg-bg text-gg-text md:grid md:grid-cols-[240px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:sticky md:top-0 md:h-screen bg-surface border-r border-border">
        <div className="px-5 pt-5 pb-4">
          <Logo size="md" />
        </div>
        <nav className="flex flex-col gap-0.5 px-2.5 pt-2">
          <SideLink to="/dashboard"      label="Dashboard"     icon={<HomeIcon size={18} />} />
          <SideLink to="/workout/active" label="Start workout" icon={<PlusIcon size={18} color="currentColor" />} accent />
          <SideLink to="/workout/log"    label="Log past"      icon={<DumbbellIcon size={18} />} />
          <SideLink to="/history"        label="History"       icon={<ClockIcon size={18} />} />
          <SideLink to="/exercises"      label="Library"       icon={<LibraryIcon size={18} />} />
        </nav>
        <div className="mt-auto p-4 border-t border-border text-[11px] text-text-muted">
          <div className="mb-2 font-bold tracking-[1px] uppercase">Logged in</div>
          <div className="text-gg-text text-[13px] font-semibold">{user?.displayName || 'Nameless Ape'}</div>
          <div className="mb-2.5 break-all">{user?.email ?? '—'}</div>
          <button
            onClick={logout}
            className="w-full py-1.5 px-2.5 bg-transparent text-text-dim border border-border rounded-[10px] text-[11px] cursor-pointer hover:bg-card"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex flex-col min-h-screen md:min-h-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-10 bg-bg/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between max-w-[520px] w-full mx-auto">
          {showMobileBack ? (
            <button
              onClick={() => nav(-1)}
              aria-label="Back"
              className="bg-transparent border-0 text-gg-text text-[22px] leading-none cursor-pointer p-1"
            >←</button>
          ) : (
            <Logo size="sm" />
          )}
          <HeaderChips user={user} logout={logout} />
        </header>

        {/* Desktop header */}
        <header className="hidden md:flex sticky top-0 z-10 bg-bg/90 backdrop-blur-md border-b border-border px-8 py-3.5 justify-end items-center">
          <HeaderChips user={user} logout={logout} showLogout={false} />
        </header>

        <main className="flex-1 w-full max-w-[520px] md:max-w-[1040px] mx-auto px-4 md:px-8 pt-2 pb-24 md:pb-12">
          <Outlet />
        </main>

        {/* Mobile bottom tab bar */}
        <nav
          className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[520px] bg-surface/95 backdrop-blur-md border-t border-border grid grid-cols-5 gap-1 px-2.5 pt-2.5 z-20"
          style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' }}
        >
          <Tab to="/dashboard"      label="Home"    icon={<HomeIcon />} />
          <Tab to="/history"        label="History" icon={<ClockIcon />} />
          <CenterTab to="/workout/active" />
          <Tab to="/exercises"      label="Library" icon={<LibraryIcon />} />
          <Tab to="/workout/log"    label="Log"     icon={<DumbbellIcon />} />
        </nav>
      </div>
    </div>
  );
}

function HeaderChips({ user, logout, showLogout = true }: {
  user: ReturnType<typeof useGym.getState>['user'];
  logout: () => void;
  showLogout?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex items-center gap-1 text-orange text-[13px] font-bold">
        <FlameIcon size={14} /> {user?.currentStreak ?? 0}
      </div>
      <div className="inline-flex items-center gap-1 text-[13px] font-bold">
        <CoinIcon size={14} /> {user?.coins ?? 0}
      </div>
      {showLogout && (
        <button
          onClick={logout}
          title="Logout"
          className="bg-transparent border border-border text-text-dim rounded-full px-2.5 py-1 text-[11px] cursor-pointer hover:text-gg-text"
        >exit</button>
      )}
    </div>
  );
}

function Tab({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center py-1.5 px-1 text-[10px] font-semibold gap-[3px] no-underline ${
          isActive ? 'text-accent' : 'text-text-dim'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function CenterTab({ to }: { to: string }) {
  return (
    <NavLink to={to} className="flex items-center justify-center no-underline">
      <div
        className="w-[52px] h-[52px] rounded-full flex items-center justify-center -mt-6 border-[3px] border-bg"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent), #1ab05f)',
          boxShadow: '0 6px 20px rgba(46,232,122,0.4)',
        }}
      >
        <DumbbellIcon size={22} color="#05160A" />
      </div>
    </NavLink>
  );
}

function SideLink({ to, label, icon, accent }: {
  to: string; label: string; icon: React.ReactNode; accent?: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-3.5 py-2.5 rounded-xl no-underline text-sm font-semibold border border-transparent transition-colors',
          isActive
            ? 'text-accent bg-accent-dim'
            : accent
              ? 'text-accent bg-accent-dim/60 border-accent-mid hover:bg-accent-dim'
              : 'text-text-dim hover:bg-card',
        ].join(' ')
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
