import { Link, useNavigate } from 'react-router-dom';
import { C } from '../lib/constants';
import { useGym } from '../lib/store';
import { Card, GorillaAvatar, RankBadge, SectionHeader, StatBubble, XPBar } from '../components/ui';
import { ChevronRightIcon, FlameIcon, PlusIcon } from '../components/Icons';

export function Dashboard() {
  const nav = useNavigate();
  const user = useGym(s => s.user);
  const summaries = useGym(s => s.sessionSummaries)();

  if (!user) return null;

  const recent = summaries.slice(0, 6);
  const weekXp = summaries.slice(0, 5).reduce((acc, s) => acc + s.totalXp, 0);
  const weekVolume = summaries.slice(0, 5).reduce((acc, s) => acc + s.totalVolumeKg, 0);

  const actions = (
    <div className="grid grid-cols-2 gap-2.5">
      <button
        onClick={() => nav('/workout/active')}
        className="flex items-center justify-center gap-2 py-3.5 bg-accent text-[#05160A] border-0 rounded-2xl text-[15px] font-extrabold cursor-pointer shadow-[0_6px_20px_rgba(46,232,122,0.27)]"
      >
        <PlusIcon size={18} color="#05160A" />
        <span>Start Workout</span>
      </button>
      <button
        onClick={() => nav('/workout/log')}
        className="py-3.5 bg-transparent text-gg-text border border-border rounded-2xl text-sm font-semibold cursor-pointer hover:bg-card"
      >
        Log past workout
      </button>
    </div>
  );

  const stats = (
    <div className="grid grid-cols-3 gap-2.5">
      <Card style={{ padding: 14 }}>
        <StatBubble
          label="Streak"
          color={C.orange}
          value={
            <span className="inline-flex items-center gap-1">
              <FlameIcon size={16} /> {user.currentStreak}
            </span>
          }
        />
      </Card>
      <Card style={{ padding: 14 }}>
        <StatBubble label="XP (5 days)" value={Math.round(weekXp).toLocaleString()} color={C.accent} />
      </Card>
      <Card style={{ padding: 14 }}>
        <StatBubble label="Volume kg" value={Math.round(weekVolume).toLocaleString()} color={C.silver} />
      </Card>
    </div>
  );

  const recentList = (
    <>
      <SectionHeader title="Recent Activity" action="See all" onAction={() => nav('/history')} />
      {recent.length === 0 && (
        <Card style={{ padding: 20, textAlign: 'center', color: C.textDim, fontSize: 13 }}>
          No workouts yet — tap Start Workout above.
        </Card>
      )}
      <div className="flex flex-col gap-2">
        {recent.slice(0, 3).map(s => (
          <SessionRow key={s.id} s={s} onClick={() => nav(`/history/${s.id}`)} />
        ))}
        <div className="hidden md:flex md:flex-col gap-2">
          {recent.slice(3).map(s => (
            <SessionRow key={s.id} s={s} onClick={() => nav(`/history/${s.id}`)} />
          ))}
        </div>
      </div>
    </>
  );

  const profileCard = (
    <Card className="p-4 md:p-5 flex gap-4 items-center">
      <div className="hidden md:block"><GorillaAvatar rank={user.currentRank} size={120} /></div>
      <div className="md:hidden"><GorillaAvatar rank={user.currentRank} size={90} /></div>
      <div className="flex-1 min-w-0">
        <div className="font-bebas tracking-[1px] text-[22px] md:text-[28px]">
          {user.displayName || 'Nameless Ape'}
        </div>
        <div className="my-1 mb-2.5">
          <span className="md:hidden"><RankBadge rank={user.currentRank} size="sm" /></span>
          <span className="hidden md:inline"><RankBadge rank={user.currentRank} size="md" /></span>
        </div>
        <XPBar totalXp={user.totalXp} rank={user.currentRank} />
      </div>
    </Card>
  );

  const nudge = !user.profileComplete && (
    <Link to="/onboarding" className="no-underline">
      <div className="px-3.5 py-2.5 bg-accent-dim border border-accent-mid rounded-xl text-accent text-[13px] font-semibold flex justify-between items-center">
        <span>Finish your profile for accurate XP</span>
        <ChevronRightIcon color={C.accent} />
      </div>
    </Link>
  );

  return (
    <div className="flex flex-col gap-3.5 md:gap-5 py-4 md:py-0">
      {nudge}
      {/* On mobile: single column stack. On desktop: 2-col grid — profile/stats/actions on left, recent on right */}
      <div className="md:grid md:grid-cols-[1.3fr_1fr] md:gap-5">
        <div className="flex flex-col gap-3.5 md:gap-3.5">
          {profileCard}
          {stats}
          {actions}
        </div>
        <div className="mt-4 md:mt-0">
          {recentList}
        </div>
      </div>
    </div>
  );
}

function SessionRow({ s, onClick }: { s: { id: string; workoutDate: string; totalXp: number; totalVolumeKg: number; exerciseCount: number; setCount: number; isRetroactive: boolean }; onClick: () => void }) {
  return (
    <Card onClick={onClick} style={{ padding: '12px 14px' }}>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm font-bold">
            {formatDate(s.workoutDate)}
            {s.isRetroactive && <span className="ml-1.5 text-purple text-[10px]">retroactive</span>}
          </div>
          <div className="text-xs text-text-dim mt-0.5">
            {s.exerciseCount} exercises · {s.setCount} sets · {s.totalVolumeKg.toLocaleString()} kg
          </div>
        </div>
        <div className="text-right">
          <div className="font-bebas text-accent text-[22px] leading-none">
            +{Math.round(s.totalXp)}
          </div>
          <div className="text-[10px] text-text-muted tracking-[0.5px] uppercase">XP</div>
        </div>
      </div>
    </Card>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  const today = new Date();
  today.setHours(0,0,0,0);
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
