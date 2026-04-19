import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C } from '../lib/constants';
import { useGym } from '../lib/store';
import { Card, MuscleTag, Pill, Toast } from '../components/ui';
import { CheckIcon, PlusIcon, XIcon } from '../components/Icons';
import type { Exercise, FinishResult } from '../types';
import { FinishModal } from '../components/FinishModal';

export function ActiveWorkout() {
  const nav = useNavigate();
  const activeId = useGym(s => s.activeSessionId);
  const session = useGym(s => activeId ? s.sessions.find(x => x.id === activeId) : undefined);
  const exercises = useGym(s => s.exercises.filter(e => !e.isArchived));
  const allExercises = useGym(s => s.exercises);
  const startActiveSession = useGym(s => s.startActiveSession);
  const addSetToActive = useGym(s => s.addSetToActive);
  const removeSetFromActive = useGym(s => s.removeSetFromActive);
  const discardActive = useGym(s => s.discardActive);
  const finishActive = useGym(s => s.finishActive);

  useEffect(() => {
    if (!activeId) startActiveSession();
  }, [activeId, startActiveSession]);

  const [picker, setPicker] = useState(false);
  const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [toast, setToast] = useState('');
  const [finishResult, setFinishResult] = useState<FinishResult | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number>(session?.startedAt ? new Date(session.startedAt).getTime() : Date.now());
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const grouped = useMemo(() => {
    if (!session) return [];
    const byEx: Record<string, typeof session.sets> = {};
    for (const s of session.sets) {
      byEx[s.exerciseId] = byEx[s.exerciseId] ?? [];
      byEx[s.exerciseId].push(s);
    }
    return Object.entries(byEx).map(([exId, sets]) => ({
      exercise: exercises.find(e => e.id === exId) ?? allExercises.find(e => e.id === exId)!,
      sets,
    })).filter(g => g.exercise);
  }, [session, exercises, allExercises]);

  const addSet = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    if (!selectedEx) return;
    if (isNaN(w) || w < 0) return setToast('Invalid weight');
    if (isNaN(r) || r <= 0) return setToast('Invalid reps');

    const res = addSetToActive(selectedEx.id, w, r);
    if (res) {
      setToast(res.isFirstLog
        ? `+${res.xpPreview.toFixed(1)} XP · 1.5× first-log bonus!`
        : `+${res.xpPreview.toFixed(1)} XP`);
      setWeight('');
      setReps('');
      setTimeout(() => setToast(''), 2200);
    }
  };

  const finish = () => {
    const res = finishActive();
    if (res) setFinishResult(res);
  };

  if (!session) return null;

  return (
    <div className="max-w-[680px] mx-auto">
      <Toast msg={toast} visible={!!toast} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, letterSpacing: 1 }}>Live Session</div>
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>
            {formatElapsed(elapsed)} · {session.sets.length} sets · +{Math.round(session.totalXp)} XP
          </div>
        </div>
        <button onClick={() => setConfirmDiscard(true)} style={{
          background: C.dangerDim, color: C.danger, border: `1px solid ${C.danger}33`,
          borderRadius: 999, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
        }}>Discard</button>
      </div>

      {selectedEx ? (
        <Card style={{ padding: 16, marginBottom: 14, border: `1px solid ${C.accentMid}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{selectedEx.name}</div>
              {selectedEx.muscleGroup && <MuscleTag group={selectedEx.muscleGroup} />}
              {selectedEx.personalBest && (
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                  PB: {selectedEx.personalBest.weightKg}kg × {selectedEx.personalBest.reps}
                </div>
              )}
            </div>
            <button onClick={() => setSelectedEx(null)} style={iconBtn}>
              <XIcon size={16} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8 }}>
            <LabeledInput label="Weight (kg)" value={weight} onChange={setWeight} />
            <LabeledInput label="Reps" value={reps} onChange={setReps} />
            <button onClick={addSet} style={{
              alignSelf: 'end', padding: '12px 14px', background: C.accent, color: '#05160A',
              border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer',
            }}>
              <PlusIcon size={18} color="#05160A" />
            </button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setPicker(true)} style={{
          width: '100%', padding: 14, background: C.card, color: C.accent,
          border: `1px dashed ${C.accentMid}`, borderRadius: 14,
          fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 14,
        }}>
          + Pick exercise
        </button>
      )}

      {grouped.length === 0 ? (
        <div style={{ textAlign: 'center', color: C.textDim, padding: '40px 20px', fontSize: 13 }}>
          No sets yet. Pick an exercise and start logging.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {grouped.map(g => (
            <Card key={g.exercise.id} style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{g.exercise.name}</div>
                  {g.exercise.muscleGroup && <MuscleTag group={g.exercise.muscleGroup} />}
                </div>
                <button onClick={() => setSelectedEx(g.exercise)} style={iconBtn}>
                  <PlusIcon size={16} color={C.accent} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {g.sets.map(s => (
                  <div key={s.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: 13, color: C.textDim, padding: '6px 0',
                    borderTop: `1px solid ${C.border}`,
                  }}>
                    <span style={{ color: C.textMuted, fontSize: 11 }}>Set {s.setNumber}</span>
                    <span style={{ color: C.text }}>{s.weightKg}kg × {s.reps}</span>
                    <span style={{ color: C.accent, fontSize: 12, fontWeight: 700 }}>
                      +{s.xpEarned.toFixed(1)} XP
                      {s.isFirstLog && <span title="First-log bonus" style={{ marginLeft: 4, color: C.gold }}>★</span>}
                    </span>
                    <button onClick={() => removeSetFromActive(s.id)} style={{
                      background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', padding: 2,
                    }}>
                      <XIcon size={14} color={C.textMuted} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {session.sets.length > 0 && (
        <>
          {/* Mobile: fixed bottom CTA above the tab bar */}
          <button
            onClick={finish}
            className="md:hidden fixed bottom-[96px] left-1/2 -translate-x-1/2 w-[calc(100%-44px)] max-w-[436px] py-4 bg-accent text-[#05160A] border-0 rounded-2xl text-base font-extrabold cursor-pointer flex items-center justify-center gap-2 z-[15]"
            style={{ boxShadow: `0 10px 30px ${C.accent}55` }}
          >
            <CheckIcon size={20} color="#05160A" />
            Finish — Bank +{Math.round(session.totalXp)} XP
          </button>

          {/* Desktop: inline CTA */}
          <button
            onClick={finish}
            className="hidden md:flex w-full mt-5 py-4 bg-accent text-[#05160A] border-0 rounded-2xl text-base font-extrabold cursor-pointer items-center justify-center gap-2"
            style={{ boxShadow: `0 10px 30px ${C.accent}55` }}
          >
            <CheckIcon size={20} color="#05160A" />
            Finish — Bank +{Math.round(session.totalXp)} XP
          </button>
        </>
      )}

      {picker && (
        <ExercisePicker
          onClose={() => setPicker(false)}
          onPick={(ex) => { setSelectedEx(ex); setPicker(false); }}
        />
      )}
      {finishResult && (
        <FinishModal result={finishResult} onClose={() => { setFinishResult(null); nav('/dashboard'); }} />
      )}
      {confirmDiscard && (
        <ConfirmDialog
          title="Discard session?"
          message="All logged sets for this session will be lost."
          onCancel={() => setConfirmDiscard(false)}
          onConfirm={() => { discardActive(); nav('/dashboard'); }}
        />
      )}
    </div>
  );
}

function formatElapsed(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const iconBtn: React.CSSProperties = {
  background: C.border, border: 'none', borderRadius: 999,
  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, fontWeight: 600 }}>{label}</div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        inputMode="decimal"
        style={{
          width: '100%', padding: 12, background: C.bg, border: `1px solid ${C.border}`,
          borderRadius: 10, color: C.text, fontSize: 15, outline: 'none',
          textAlign: 'center', fontWeight: 700,
        }}
      />
    </div>
  );
}

function ExercisePicker({ onClose, onPick }: { onClose: () => void; onPick: (ex: Exercise) => void }) {
  const exercises = useGym(s => s.exercises.filter(e => !e.isArchived));
  const createEx = useGym(s => s.createExercise);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const groups = ['chest','back','legs','shoulders','arms','core','other'];

  const filtered = exercises
    .filter(e => !filter || e.muscleGroup === filter)
    .filter(e => e.name.toLowerCase().includes(query.toLowerCase()));

  const canCreate = query.trim().length >= 2 && !exercises.some(e => e.name.toLowerCase() === query.trim().toLowerCase());

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalPanel} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: 1 }}>Pick exercise</div>
          <button onClick={onClose} style={iconBtn}><XIcon size={16} /></button>
        </div>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search or type to create…"
          style={{
            width: '100%', padding: 12, background: C.bg, border: `1px solid ${C.border}`,
            borderRadius: 12, color: C.text, fontSize: 15, outline: 'none', marginBottom: 10,
          }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          <Pill active={!filter} onClick={() => setFilter(null)}>All</Pill>
          {groups.map(g => (
            <Pill key={g} active={filter === g} onClick={() => setFilter(g)}>{g}</Pill>
          ))}
        </div>
        <div style={{ maxHeight: '50vh', overflowY: 'auto', marginLeft: -4, marginRight: -4 }}>
          {filtered.map(e => (
            <button key={e.id} onClick={() => onPick(e)} style={pickerRow}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{e.name}</div>
                {e.muscleGroup && <MuscleTag group={e.muscleGroup} />}
              </div>
              {e.personalBest && (
                <div style={{ fontSize: 11, color: C.textMuted }}>
                  {e.personalBest.weightKg}kg × {e.personalBest.reps}
                </div>
              )}
            </button>
          ))}
          {canCreate && (
            <button
              onClick={() => {
                const created = createEx(query.trim(), null);
                onPick(created);
              }}
              style={{ ...pickerRow, color: C.accent, fontWeight: 700 }}
            >
              + Create "{query.trim()}"
            </button>
          )}
          {filtered.length === 0 && !canCreate && (
            <div style={{ textAlign: 'center', padding: 20, color: C.textDim, fontSize: 13 }}>
              No matches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const pickerRow: React.CSSProperties = {
  width: '100%', textAlign: 'left', background: 'none', border: 'none',
  padding: '10px 6px', color: C.text, cursor: 'pointer',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  borderBottom: `1px solid ${C.border}`,
};

const modalBackdrop: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
  backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end',
  justifyContent: 'center', zIndex: 100,
};
const modalPanel: React.CSSProperties = {
  width: '100%', maxWidth: 480, background: C.surface,
  border: `1px solid ${C.border}`, borderRadius: '20px 20px 0 0',
  padding: 18,
};

function ConfirmDialog({ title, message, onCancel, onConfirm }: {
  title: string; message: string; onCancel: () => void; onConfirm: () => void;
}) {
  return (
    <div style={modalBackdrop} onClick={onCancel}>
      <div style={{ ...modalPanel, maxWidth: 360, margin: 'auto', borderRadius: 20 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, marginBottom: 8 }}>{title}</div>
        <div style={{ color: C.textDim, fontSize: 13, marginBottom: 16 }}>{message}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: 12, background: 'transparent', color: C.text,
            border: `1px solid ${C.border}`, borderRadius: 12, fontWeight: 600, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: 12, background: C.danger, color: '#111',
            border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer',
          }}>Discard</button>
        </div>
      </div>
    </div>
  );
}
