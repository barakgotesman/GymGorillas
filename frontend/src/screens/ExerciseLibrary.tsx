import { useMemo, useState } from 'react';
import { C, MUSCLE_GROUPS } from '../lib/constants';
import { useGym } from '../lib/store';
import { Card, MuscleTag, Pill } from '../components/ui';
import { PlusIcon, XIcon } from '../components/Icons';
import type { Exercise, MuscleGroup } from '../types';

export function ExerciseLibrary() {
  const exercises = useGym(s => s.exercises);
  const create = useGym(s => s.createExercise);
  const update = useGym(s => s.updateExercise);
  const remove = useGym(s => s.deleteExercise);

  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<MuscleGroup | 'all'>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);

  const filtered = useMemo(() => {
    return exercises
      .filter(e => showArchived ? e.isArchived : !e.isArchived)
      .filter(e => filter === 'all' || e.muscleGroup === filter)
      .filter(e => e.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => b.timesLogged - a.timesLogged);
  }, [exercises, q, filter, showArchived]);

  return (
    <div style={{ padding: '16px 18px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, letterSpacing: 1 }}>Library</div>
        <button onClick={() => setCreating(true)} style={addBtn}>
          <PlusIcon size={16} color="#05160A" /> New
        </button>
      </div>

      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search exercises…"
        style={{
          width: '100%', padding: 12, background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 12, color: C.text, fontSize: 14, outline: 'none', marginBottom: 10,
        }}
      />

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        <Pill active={filter === 'all'} onClick={() => setFilter('all')}>All</Pill>
        {MUSCLE_GROUPS.map(g => (
          <Pill key={g} active={filter === g} onClick={() => setFilter(g as MuscleGroup)}>{g}</Pill>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: C.textMuted }}>{filtered.length} exercises</span>
        <button onClick={() => setShowArchived(v => !v)} style={{
          background: 'none', border: 'none', color: C.textDim, fontSize: 11, cursor: 'pointer',
        }}>
          {showArchived ? 'Show active' : 'Show archived'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: C.textDim, padding: 40, fontSize: 13 }}>
          No exercises. Tap + New to create one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(e => (
            <Card key={e.id} onClick={() => setEditing(e)} style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    {e.name}
                    {e.isArchived && <span style={{ marginLeft: 6, fontSize: 10, color: C.textMuted, fontStyle: 'italic' }}>archived</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 3, alignItems: 'center' }}>
                    {e.muscleGroup && <MuscleTag group={e.muscleGroup} />}
                    <span style={{ fontSize: 11, color: C.textMuted }}>{e.timesLogged} sets</span>
                  </div>
                </div>
                {e.personalBest && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>
                      {e.personalBest.weightKg}kg × {e.personalBest.reps}
                    </div>
                    <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>PB</div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {creating && (
        <ExerciseForm
          onClose={() => setCreating(false)}
          onSubmit={(name, group) => {
            if (exercises.some(e => e.name.toLowerCase() === name.toLowerCase())) return 'EXERCISE_NAME_DUPLICATE';
            create(name, group);
            setCreating(false);
          }}
        />
      )}
      {editing && (
        <ExerciseForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={(name, group) => {
            if (name !== editing.name && exercises.some(e => e.name.toLowerCase() === name.toLowerCase())) return 'EXERCISE_NAME_DUPLICATE';
            update(editing.id, { name, muscleGroup: group });
            setEditing(null);
          }}
          onDelete={() => {
            remove(editing.id);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

const addBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
  background: C.accent, color: '#05160A', border: 'none', borderRadius: 999,
  fontSize: 13, fontWeight: 800, cursor: 'pointer',
};

function ExerciseForm({ initial, onClose, onSubmit, onDelete }: {
  initial?: Exercise;
  onClose: () => void;
  onSubmit: (name: string, group: MuscleGroup | null) => void | string;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [group, setGroup] = useState<MuscleGroup | null>(initial?.muscleGroup ?? null);
  const [error, setError] = useState('');

  const submit = () => {
    const n = name.trim();
    if (n.length < 2 || n.length > 100) return setError('Name must be 2–100 characters');
    const err = onSubmit(n, group);
    if (err === 'EXERCISE_NAME_DUPLICATE') setError('Name already used');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end',
      justifyContent: 'center', zIndex: 100,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, background: C.surface, borderRadius: '20px 20px 0 0',
        padding: 20, border: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22 }}>
            {initial ? 'Edit exercise' : 'New exercise'}
          </div>
          <button onClick={onClose} style={{ background: C.border, border: 'none', borderRadius: 999, width: 30, height: 30, cursor: 'pointer' }}>
            <XIcon size={14} />
          </button>
        </div>
        <label style={{ display: 'block', fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Name</label>
        <input autoFocus value={name} onChange={e => setName(e.target.value)} style={{
          width: '100%', padding: 12, background: C.bg, border: `1px solid ${C.border}`,
          borderRadius: 10, color: C.text, fontSize: 15, marginBottom: 14, outline: 'none',
        }}/>
        <label style={{ display: 'block', fontSize: 11, color: C.textMuted, marginBottom: 6 }}>Muscle group</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          <Pill active={!group} onClick={() => setGroup(null)}>None</Pill>
          {MUSCLE_GROUPS.map(g => (
            <Pill key={g} active={group === g} onClick={() => setGroup(g as MuscleGroup)}>{g}</Pill>
          ))}
        </div>
        {error && <div style={{ color: C.danger, fontSize: 12, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          {onDelete && (
            <button onClick={onDelete} style={{
              padding: 12, background: C.dangerDim, color: C.danger,
              border: `1px solid ${C.danger}33`, borderRadius: 12, fontWeight: 700, cursor: 'pointer',
            }}>
              {initial && initial.timesLogged > 0 ? 'Archive' : 'Delete'}
            </button>
          )}
          <button onClick={submit} style={{
            flex: 1, padding: 12, background: C.accent, color: '#05160A',
            border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer',
          }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
