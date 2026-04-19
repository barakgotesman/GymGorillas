import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C } from '../lib/constants';
import { useGym } from '../lib/store';
import { GorillaAvatar, Logo, Pill } from '../components/ui';
import type { FitnessLevel, Gender } from '../types';

type Step = 1 | 2 | 3 | 4;

export function Onboarding() {
  const nav = useNavigate();
  const { user, updateUser, finalizeOnboarding } = useGym();
  const [step, setStep] = useState<Step>(1);

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [gender, setGender] = useState<Gender | null>(user?.gender ?? null);
  const [age, setAge] = useState<string>(user?.age?.toString() ?? '');
  const [heightCm, setHeightCm] = useState<string>(user?.heightCm?.toString() ?? '');
  const [bodyweightKg, setBodyweightKg] = useState<string>(user?.bodyweightKg?.toString() ?? '');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel | null>(user?.fitnessLevel ?? null);
  const [nameError, setNameError] = useState('');

  const validateName = () => {
    if (displayName.length < 3 || displayName.length > 50) return setNameError('3–50 characters'), false;
    if (!/^[A-Za-z0-9_]+$/.test(displayName)) return setNameError('Letters, numbers, underscores only'), false;
    setNameError('');
    return true;
  };

  const next = () => {
    if (step === 2 && !validateName()) return;
    if (step === 2) updateUser({ displayName: displayName.trim(), gender });
    if (step === 3) updateUser({
      age: age ? Number(age) : null,
      heightCm: heightCm ? Number(heightCm) : null,
      bodyweightKg: bodyweightKg ? Number(bodyweightKg) : null,
      fitnessLevel,
    });
    if (step === 4) {
      finalizeOnboarding();
      nav('/dashboard', { replace: true });
      return;
    }
    setStep((s => (s + 1) as Step));
  };

  const skip = () => {
    finalizeOnboarding();
    nav('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen max-w-[520px] mx-auto bg-bg text-gg-text flex flex-col px-5 md:px-8 pt-5 pb-8">
      <div className="flex justify-center mt-2">
        <Logo size="md" />
      </div>

      <div style={{ display: 'flex', gap: 6, margin: '22px 0 24px' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 999,
            background: i <= step ? C.accent : C.border,
            transition: 'background 0.3s',
          }}/>
        ))}
      </div>

      {step === 1 && (
        <div className="gg-fadeup" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 24px' }}>
            <GorillaAvatar rank="chimp" size={140} />
          </div>
          <h2 style={bigTitle}>Welcome, ape.</h2>
          <p style={subtitle}>
            You start as a chimp. Lift, log, repeat — your gorilla grows with every set.
            The more consistent you are, the faster you evolve.
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="gg-fadeup">
          <h2 style={bigTitle}>Claim your name</h2>
          <p style={subtitle}>Your display name appears on the leaderboard.</p>

          <label style={label}>Display name</label>
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="e.g. SilverbackSam"
            style={input}
          />
          {nameError && <div style={errorMsg}>{nameError}</div>}

          <label style={label}>Gender (for gorilla art)</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Pill active={gender === 'male'} onClick={() => setGender('male')}>Male</Pill>
            <Pill active={gender === 'female'} onClick={() => setGender('female')}>Female</Pill>
            <Pill active={gender === 'prefer_not_to_say'} onClick={() => setGender('prefer_not_to_say')}>Prefer not to say</Pill>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="gg-fadeup">
          <h2 style={bigTitle}>Body stats</h2>
          <p style={subtitle}>Used to calibrate your XP formula. All optional — skip anything you'd rather not share.</p>

          <Row>
            <Field label="Age" value={age} onChange={setAge} suffix="yrs" type="number" />
            <Field label="Height" value={heightCm} onChange={setHeightCm} suffix="cm" type="number" />
          </Row>
          <Field label="Bodyweight" value={bodyweightKg} onChange={setBodyweightKg} suffix="kg" type="number" />

          <label style={label}>Fitness level</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Pill active={fitnessLevel === 'beginner'} onClick={() => setFitnessLevel('beginner')}>Beginner</Pill>
            <Pill active={fitnessLevel === 'intermediate'} onClick={() => setFitnessLevel('intermediate')}>Intermediate</Pill>
            <Pill active={fitnessLevel === 'advanced'} onClick={() => setFitnessLevel('advanced')}>Advanced</Pill>
          </div>

          <p style={{ fontSize: 11, color: C.textMuted, marginTop: 14 }}>
            Skipping keeps your profile incomplete. You can finish this later in Settings.
          </p>
        </div>
      )}

      {step === 4 && (
        <div className="gg-fadeup" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 24px' }}>
            <GorillaAvatar rank="chimp" size={140} />
          </div>
          <h2 style={bigTitle}>You're a chimp.</h2>
          <p style={subtitle}>
            Hit 500 XP to evolve into a juvenile gorilla. Log your first set to begin.
          </p>
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', gap: 10, paddingTop: 24 }}>
        {step > 1 && (
          <button onClick={() => setStep((s => (s - 1) as Step))} style={ghostBtn}>Back</button>
        )}
        {step === 3 && (
          <button onClick={skip} style={ghostBtn}>Skip</button>
        )}
        <button onClick={next} style={{ ...primaryBtn, flex: 1 }}>
          {step === 4 ? "Let's lift" : 'Continue'}
        </button>
      </div>
    </div>
  );
}

const bigTitle: React.CSSProperties = {
  fontFamily: "'Bebas Neue', cursive", fontSize: 36, letterSpacing: 1.5, margin: '4px 0 8px',
};
const subtitle: React.CSSProperties = { color: C.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 18 };
const label: React.CSSProperties = { display: 'block', fontSize: 12, color: C.textDim, margin: '14px 0 6px', fontWeight: 600 };
const input: React.CSSProperties = {
  width: '100%', padding: 12, background: C.card, border: `1px solid ${C.border}`,
  borderRadius: 12, color: C.text, fontSize: 15, outline: 'none',
};
const errorMsg: React.CSSProperties = { color: C.danger, fontSize: 12, marginTop: 6 };
const primaryBtn: React.CSSProperties = {
  padding: '13px 20px', background: C.accent, color: '#05160A',
  border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer',
};
const ghostBtn: React.CSSProperties = {
  padding: '13px 20px', background: 'transparent', color: C.textDim,
  border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer',
};

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>{children}</div>;
}

function Field({ label: l, value, onChange, suffix, type }: {
  label: string; value: string; onChange: (v: string) => void; suffix?: string; type?: string;
}) {
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={label}>{l}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={type ?? 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ ...input, paddingRight: suffix ? 46 : 12 }}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, fontSize: 12 }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
