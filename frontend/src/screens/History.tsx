import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C } from '../lib/constants';
import { useGym } from '../lib/store';
import { Card, Pill } from '../components/ui';

export function History() {
  const nav = useNavigate();
  const sessions = useGym(s => s.sessions);
  const summaries = useGym(s => s.sessionSummaries)();
  const exercises = useGym(s => s.exercises);
  const [exerciseFilter, setExerciseFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filtered = useMemo(() => {
    if (!exerciseFilter) return summaries;
    return summaries.filter(sum => {
      const s = sessions.find(x => x.id === sum.id);
      return s && s.sets.some(st => st.exerciseId === exerciseFilter);
    });
  }, [summaries, sessions, exerciseFilter]);

  const paged = filtered.slice(0, page * pageSize);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof paged> = {};
    for (const s of paged) {
      const key = monthKey(s.workoutDate);
      groups[key] = groups[key] ?? [];
      groups[key].push(s);
    }
    return Object.entries(groups);
  }, [paged]);

  return (
    <div className="max-w-[760px] mx-auto pb-6">
      <div className="font-bebas text-[28px] tracking-[1px] mb-2.5">
        History
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14, overflowX: 'auto' }}>
        <Pill active={!exerciseFilter} onClick={() => setExerciseFilter(null)}>All</Pill>
        {exercises.slice(0, 8).map(e => (
          <Pill key={e.id} active={exerciseFilter === e.id} onClick={() => setExerciseFilter(e.id)}>
            {e.name}
          </Pill>
        ))}
      </div>

      {grouped.length === 0 && (
        <div style={{ textAlign: 'center', color: C.textDim, padding: 40, fontSize: 13 }}>
          No sessions match.
        </div>
      )}

      {grouped.map(([month, list]) => (
        <div key={month} style={{ marginBottom: 18 }}>
          <div style={{
            fontSize: 11, color: C.textMuted, letterSpacing: 1.5, textTransform: 'uppercase',
            fontWeight: 700, marginBottom: 8,
          }}>
            {month}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {list.map(s => (
              <Card key={s.id} onClick={() => nav(`/history/${s.id}`)} style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>
                      {formatDate(s.workoutDate)}
                      {s.isRetroactive && <span style={{ marginLeft: 6, color: C.purple, fontSize: 10 }}>retroactive</span>}
                    </div>
                    <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>
                      {s.exerciseCount} exercises · {s.setCount} sets · {s.totalVolumeKg.toLocaleString()} kg
                      {s.durationMinutes && ` · ${s.durationMinutes}m`}
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
      ))}

      {paged.length < filtered.length && (
        <button onClick={() => setPage(p => p + 1)} style={{
          width: '100%', padding: 12, background: 'transparent', color: C.accent,
          border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          marginTop: 8,
        }}>
          Load more ({filtered.length - paged.length} remaining)
        </button>
      )}
    </div>
  );
}

function monthKey(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}
function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
