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

  const recent = summaries.slice(0, 3);
  const weekXp = summaries.slice(0, 5).reduce((acc, s) => acc + s.totalXp, 0);
  const weekVolume = summaries.slice(0, 5).reduce((acc, s) => acc + s.totalVolumeKg, 0);

  return (
    <div style={{ padding: '18px 18px 8px' }}>
      {!user.profileComplete && (
        <Link to="/onboarding" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '10px 14px', background: C.accentDim, border: `1px solid ${C.accentMid}`,
            borderRadius: 12, color: C.accent, fontSize: 13, fontWeight: 600, marginBottom: 14,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>Finish your profile for accurate XP</span>
            <ChevronRightIcon color={C.accent} />
          </div>
        </Link>
      )}

      <Card style={{ padding: 18, display: 'flex', gap: 16, alignItems: 'center' }}>
        <GorillaAvatar rank={user.currentRank} size={90} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 1 }}>
            {user.displayName || 'Nameless Ape'}
          </div>
          <div style={{ margin: '4px 0 10px' }}>
            <RankBadge rank={user.currentRank} />
          </div>
          <XPBar totalXp={user.totalXp} rank={user.currentRank} />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, margin: '14px 0' }}>
        <Card style={{ padding: 14 }}>
          <StatBubble
            label="Streak"
            color={C.orange}
            value={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        <button onClick={() => nav('/workout/active')} style={bigBtn(C.accent)}>
          <PlusIcon size={18} color="#05160A" />
          <span>Start Workout</span>
        </button>
        <button onClick={() => nav('/workout/log')} style={bigBtnOutline}>
          Log past workout
        </button>
      </div>

      <SectionHeader title="Recent Activity" action="See all" onAction={() => nav('/history')} />
      {recent.length === 0 && (
        <Card style={{ padding: 20, textAlign: 'center', color: C.textDim, fontSize: 13 }}>
          No workouts yet — tap Start Workout above.
        </Card>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recent.map(s => (
          <Card key={s.id} onClick={() => nav(`/history/${s.id}`)} style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                  {formatDate(s.workoutDate)}
                  {s.isRetroactive && <span style={{ marginLeft: 6, color: C.purple, fontSize: 10 }}>retroactive</span>}
                </div>
                <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>
                  {s.exerciseCount} exercises · {s.setCount} sets · {s.totalVolumeKg.toLocaleString()} kg
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Bebas Neue', cursive", color: C.accent, fontSize: 22, lineHeight: 1 }}>
                  +{Math.round(s.totalXp)}
                </div>
                <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>XP</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
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

function bigBtn(color: string): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '14px', background: color, color: '#05160A', border: 'none',
    borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer',
    boxShadow: `0 6px 20px ${color}44`,
  };
}

const bigBtnOutline: React.CSSProperties = {
  padding: '14px', background: 'transparent', color: C.text,
  border: `1px solid ${C.border}`, borderRadius: 14,
  fontSize: 14, fontWeight: 600, cursor: 'pointer',
};
