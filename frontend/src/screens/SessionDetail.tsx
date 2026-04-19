import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { C } from '../lib/constants';
import { useGym } from '../lib/store';
import { Card, MuscleTag } from '../components/ui';

export function SessionDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const session = useGym(s => s.sessions.find(x => x.id === id));
  const exercises = useGym(s => s.exercises);

  const grouped = useMemo(() => {
    if (!session) return [];
    const byEx: Record<string, typeof session.sets> = {};
    for (const s of session.sets) {
      byEx[s.exerciseId] = byEx[s.exerciseId] ?? [];
      byEx[s.exerciseId].push(s);
    }
    return Object.entries(byEx).map(([exId, sets]) => ({
      exercise: exercises.find(e => e.id === exId),
      sets,
    })).filter(g => g.exercise);
  }, [session, exercises]);

  if (!session) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: C.textDim }}>
        Session not found.
        <div><button onClick={() => nav('/history')} style={{ marginTop: 14, padding: '8px 16px', background: C.card, color: C.text, border: `1px solid ${C.border}`, borderRadius: 10, cursor: 'pointer' }}>Back</button></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 18px 24px' }}>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 26, letterSpacing: 1 }}>
        {new Date(session.workoutDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
      </div>
      <div style={{ fontSize: 12, color: C.textDim, marginBottom: 14 }}>
        {session.isRetroactive ? 'Retroactive log' : 'Live session'}
        {session.durationMinutes && ` · ${session.durationMinutes} min`}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        <Card style={statCard}>
          <div style={statVal(C.accent)}>+{Math.round(session.totalXp)}</div>
          <div style={statLbl}>XP earned</div>
        </Card>
        <Card style={statCard}>
          <div style={statVal(C.text)}>{session.totalVolumeKg.toLocaleString()}</div>
          <div style={statLbl}>Volume kg</div>
        </Card>
        <Card style={statCard}>
          <div style={statVal(C.silver)}>{session.sets.length}</div>
          <div style={statLbl}>Sets</div>
        </Card>
      </div>

      {session.notes && (
        <Card style={{ padding: 12, marginBottom: 14, fontSize: 13, color: C.textDim, fontStyle: 'italic' }}>
          "{session.notes}"
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {grouped.map(g => g.exercise && (
          <Card key={g.exercise.id} style={{ padding: 14 }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{g.exercise.name}</div>
              {g.exercise.muscleGroup && <MuscleTag group={g.exercise.muscleGroup} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {g.sets.map(s => (
                <div key={s.id} style={{
                  display: 'flex', justifyContent: 'space-between', fontSize: 13,
                  padding: '6px 0', borderTop: `1px solid ${C.border}`, color: C.textDim,
                }}>
                  <span style={{ color: C.textMuted, fontSize: 11 }}>Set {s.setNumber}</span>
                  <span style={{ color: C.text }}>{s.weightKg}kg × {s.reps}</span>
                  <span style={{ color: C.accent, fontWeight: 700 }}>
                    +{s.xpEarned.toFixed(1)} XP
                    {s.isFirstLog && <span style={{ marginLeft: 4, color: C.gold }}>★</span>}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const statCard: React.CSSProperties = { padding: 14, textAlign: 'center' };
const statLbl: React.CSSProperties = { fontSize: 10, color: C.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 3 };
function statVal(color: string): React.CSSProperties {
  return { fontFamily: "'Bebas Neue', cursive", fontSize: 26, color, lineHeight: 1 };
}
