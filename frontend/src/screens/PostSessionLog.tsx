import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C } from '../lib/constants';
import { useGym } from '../lib/store';
import { Card, MuscleTag, Pill } from '../components/ui';
import { PlusIcon, XIcon } from '../components/Icons';
import type { Exercise, FinishResult } from '../types';
import { FinishModal } from '../components/FinishModal';

interface DraftSet {
  id: string;
  exerciseId: string;
  weightKg: string;
  reps: string;
}

export function PostSessionLog() {
  const nav = useNavigate();
  const exercises = useGym(s => s.exercises.filter(e => !e.isArchived));
  const logRetro = useGym(s => s.logRetroactive);

  const today = new Date().toISOString().slice(0, 10);
  const minDate = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

  const [workoutDate, setWorkoutDate] = useState(today);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [drafts, setDrafts] = useState<DraftSet[]>([]);
  const [picker, setPicker] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<FinishResult | null>(null);

  const addExercise = (ex: Exercise) => {
    setDrafts(prev => [...prev, { id: Math.random().toString(36).slice(2), exerciseId: ex.id, weightKg: '', reps: '' }]);
    setPicker(false);
  };

  const updateDraft = (id: string, patch: Partial<DraftSet>) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d));
  };

  const removeDraft = (id: string) => setDrafts(prev => prev.filter(d => d.id !== id));

  const submit = () => {
    setError('');
    if (workoutDate < minDate) return setError('Date must be within the last 7 days');
    if (drafts.length === 0) return setError('Add at least one set');
    const parsed = drafts.map(d => ({
      exerciseId: d.exerciseId,
      weightKg: parseFloat(d.weightKg),
      reps: parseInt(d.reps, 10),
    }));
    for (const s of parsed) {
      if (isNaN(s.weightKg) || s.weightKg < 0) return setError('Every set needs a weight');
      if (isNaN(s.reps) || s.reps <= 0) return setError('Every set needs reps');
    }
    const res = logRetro({
      workoutDate,
      durationMinutes: duration ? Number(duration) : undefined,
      notes: notes || undefined,
      sets: parsed,
    });
    setResult(res);
  };

  const grouped = drafts.reduce<Record<string, DraftSet[]>>((acc, d) => {
    acc[d.exerciseId] = acc[d.exerciseId] ?? [];
    acc[d.exerciseId].push(d);
    return acc;
  }, {});

  return (
    <div style={{ padding: '16px 18px 120px' }}>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, letterSpacing: 1 }}>Log past workout</div>
      <div style={{ color: C.textDim, fontSize: 12, marginBottom: 16 }}>
        Within the last 7 days. XP credits the same as a live session.
      </div>

      <Card style={{ padding: 14, marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <div style={label}>Date</div>
            <input type="date" value={workoutDate} min={minDate} max={today}
              onChange={e => setWorkoutDate(e.target.value)} style={input} />
          </div>
          <div>
            <div style={label}>Duration (min)</div>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} style={input} />
          </div>
        </div>
        <div style={label}>Notes (optional)</div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} style={{ ...input, resize: 'vertical' }} />
      </Card>

      {Object.entries(grouped).map(([exId, sets]) => {
        const ex = exercises.find(e => e.id === exId);
        if (!ex) return null;
        return (
          <Card key={exId} style={{ padding: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{ex.name}</div>
                {ex.muscleGroup && <MuscleTag group={ex.muscleGroup} />}
              </div>
              <button onClick={() => setDrafts(d => [...d, { id: Math.random().toString(36).slice(2), exerciseId: exId, weightKg: '', reps: '' }])}
                style={addSetBtn}>+ Add set</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sets.map((d, i) => (
                <div key={d.id} style={{
                  display: 'grid', gridTemplateColumns: '34px 1fr 1fr 32px', gap: 6, alignItems: 'center',
                }}>
                  <span style={{ fontSize: 11, color: C.textMuted, textAlign: 'center' }}>#{i + 1}</span>
                  <input placeholder="kg" value={d.weightKg} onChange={e => updateDraft(d.id, { weightKg: e.target.value })} inputMode="decimal" style={miniInput} />
                  <input placeholder="reps" value={d.reps} onChange={e => updateDraft(d.id, { reps: e.target.value })} inputMode="numeric" style={miniInput} />
                  <button onClick={() => removeDraft(d.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <XIcon size={14} color={C.textMuted} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      <button onClick={() => setPicker(true)} style={{
        width: '100%', padding: 14, background: C.card, color: C.accent,
        border: `1px dashed ${C.accentMid}`, borderRadius: 14,
        fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8,
      }}>
        <PlusIcon size={16} color={C.accent} />  Add exercise
      </button>

      {error && <div style={{ color: C.danger, fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</div>}

      {drafts.length > 0 && (
        <button onClick={submit} style={{
          position: 'fixed', bottom: 96, left: '50%', transform: 'translateX(-50%)',
          width: 'calc(100% - 44px)', maxWidth: 436,
          padding: 16, background: C.accent, color: '#05160A',
          border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer',
          boxShadow: `0 10px 30px ${C.accent}55`, zIndex: 15,
        }}>
          Save session
        </button>
      )}

      {picker && <InlinePicker onClose={() => setPicker(false)} onPick={addExercise} />}
      {result && <FinishModal result={result} onClose={() => { setResult(null); nav('/dashboard'); }} />}
    </div>
  );
}

function InlinePicker({ onClose, onPick }: { onClose: () => void; onPick: (e: Exercise) => void }) {
  const exercises = useGym(s => s.exercises.filter(e => !e.isArchived));
  const createEx = useGym(s => s.createExercise);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const groups = ['chest','back','legs','shoulders','arms','core','other'];
  const filtered = exercises
    .filter(e => !filter || e.muscleGroup === filter)
    .filter(e => e.name.toLowerCase().includes(q.toLowerCase()));
  const canCreate = q.trim().length >= 2 && !exercises.some(e => e.name.toLowerCase() === q.trim().toLowerCase());

  return (
    <div style={backdrop} onClick={onClose}>
      <div style={sheet} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22 }}>Add exercise</div>
          <button onClick={onClose} style={{ background: C.border, border: 'none', borderRadius: 999, width: 30, height: 30, cursor: 'pointer' }}>
            <XIcon size={14} />
          </button>
        </div>
        <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search or type to create…" style={{ ...input, marginBottom: 10 }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <Pill active={!filter} onClick={() => setFilter(null)}>All</Pill>
          {groups.map(g => <Pill key={g} active={filter === g} onClick={() => setFilter(g)}>{g}</Pill>)}
        </div>
        <div style={{ maxHeight: '40vh', overflowY: 'auto' }}>
          {filtered.map(e => (
            <button key={e.id} onClick={() => onPick(e)} style={row}>
              <span>{e.name}</span>
              {e.muscleGroup && <MuscleTag group={e.muscleGroup} />}
            </button>
          ))}
          {canCreate && (
            <button onClick={() => { const c = createEx(q.trim(), null); onPick(c); }} style={{ ...row, color: C.accent, fontWeight: 700 }}>
              + Create "{q.trim()}"
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const label: React.CSSProperties = { fontSize: 11, color: C.textMuted, marginTop: 10, marginBottom: 4, fontWeight: 600, letterSpacing: 0.3 };
const input: React.CSSProperties = {
  width: '100%', padding: 11, background: C.bg, border: `1px solid ${C.border}`,
  borderRadius: 10, color: C.text, fontSize: 14, outline: 'none',
};
const miniInput: React.CSSProperties = {
  width: '100%', padding: 10, background: C.bg, border: `1px solid ${C.border}`,
  borderRadius: 10, color: C.text, fontSize: 14, textAlign: 'center', fontWeight: 600, outline: 'none',
};
const addSetBtn: React.CSSProperties = {
  background: C.accentDim, color: C.accent, border: `1px solid ${C.accentMid}`,
  borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
};
const backdrop: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 };
const sheet: React.CSSProperties = { width: '100%', maxWidth: 480, background: C.surface, borderRadius: '20px 20px 0 0', padding: 18, border: `1px solid ${C.border}` };
const row: React.CSSProperties = { width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 6px', color: C.text, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}` };
