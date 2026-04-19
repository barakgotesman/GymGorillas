import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { C } from '../lib/constants';
import { useGym } from '../lib/store';
import { GorillaAvatar, JungleCorner, Logo } from '../components/ui';
import { GoogleIcon } from '../components/Icons';

export function Landing() {
  const nav = useNavigate();
  const { isAuthed, user, loginStub } = useGym();

  useEffect(() => {
    if (isAuthed && user) {
      nav(user.profileComplete ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [isAuthed, user, nav]);

  const onGoogle = (kind: 'new' | 'returning') => {
    loginStub(kind === 'new');
    nav(kind === 'new' ? '/onboarding' : '/dashboard', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      maxWidth: 480,
      margin: '0 auto',
      background: `radial-gradient(circle at 50% 20%, #0d2216, ${C.bg} 60%)`,
      color: C.text,
      position: 'relative',
      overflow: 'hidden',
      padding: '48px 22px 32px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <JungleCorner position="tl" size={200} />
      <JungleCorner position="br" size={220} />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Logo size="lg" />
      </div>

      <div className="gg-fadeup" style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
        <GorillaAvatar rank="silverback" size={160} />
      </div>

      <h1 className="gg-fadeup" style={{
        fontFamily: "'Bebas Neue', cursive",
        fontSize: 44, letterSpacing: 2,
        textAlign: 'center', marginTop: 32, lineHeight: 1.05,
      }}>
        Train hard.<br/>
        <span style={{ color: C.accent }}>Evolve your gorilla.</span>
      </h1>

      <p style={{
        color: C.textDim, textAlign: 'center', margin: '14px auto 0',
        maxWidth: 320, fontSize: 15, lineHeight: 1.5,
      }}>
        Every set earns XP. Every streak grows your gorilla. Log workouts, climb the ranks, and unlock the silverback inside.
      </p>

      <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => onGoogle('new')} style={primaryBtn}>
          <GoogleIcon size={18} />
          Sign up with Google (new user)
        </button>
        <button onClick={() => onGoogle('returning')} style={secondaryBtn}>
          I already have a gorilla
        </button>
      </div>

      <div style={{
        marginTop: 'auto', paddingTop: 36,
        display: 'flex', justifyContent: 'space-around',
        borderTop: `1px solid ${C.border}`,
      }}>
        <PublicStat label="Gorillas evolved" value="12,847" />
        <PublicStat label="Workouts logged" value="384,912" />
        <PublicStat label="Total kg lifted" value="9.2M" />
      </div>

      <p style={{ textAlign: 'center', color: C.textMuted, fontSize: 10, marginTop: 18 }}>
        Demo mode — Google OAuth is stubbed. State persists locally.
      </p>
    </div>
  );
}

function PublicStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, color: C.accent }}>{value}</div>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  padding: '14px', background: '#fff', color: '#111', border: 'none',
  borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer',
  boxShadow: '0 6px 20px rgba(255,255,255,0.08)',
};

const secondaryBtn: React.CSSProperties = {
  padding: '13px', background: 'transparent', color: C.text,
  border: `1px solid ${C.border}`, borderRadius: 14,
  fontSize: 14, fontWeight: 600, cursor: 'pointer',
};
