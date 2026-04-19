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
    <div
      className="min-h-screen text-gg-text relative overflow-hidden"
      style={{ background: `radial-gradient(circle at 50% 20%, #0d2216, ${C.bg} 60%)` }}
    >
      <div className="hidden md:block">
        <JungleCorner position="tl" size={320} />
        <JungleCorner position="br" size={340} />
      </div>
      <div className="md:hidden">
        <JungleCorner position="tl" size={200} />
        <JungleCorner position="br" size={220} />
      </div>

      <div className="relative z-10 min-h-screen max-w-[480px] md:max-w-[1080px] mx-auto px-5 md:px-8 py-10 md:py-8 flex flex-col">
        <div className="flex justify-center md:justify-start">
          <Logo size="lg" />
        </div>

        <div className="flex-1 flex flex-col md:flex-row items-center md:justify-between md:gap-12 mt-10 md:mt-6">
          <div className="md:flex-1 text-center md:text-left md:max-w-[520px]">
            <div className="gg-fadeup flex justify-center md:hidden mb-8">
              <GorillaAvatar rank="silverback" size={160} />
            </div>

            <h1 className="gg-fadeup font-bebas text-[44px] md:text-[72px] leading-[1.02] tracking-[2px] md:tracking-[3px]">
              Train hard.<br/>
              <span className="text-accent">Evolve your gorilla.</span>
            </h1>

            <p className="text-text-dim mt-3.5 md:mt-4 max-w-[420px] mx-auto md:mx-0 text-[15px] md:text-[17px] leading-relaxed">
              Every set earns XP. Every streak grows your gorilla. Log workouts, climb the ranks, and unlock the silverback inside.
            </p>

            <div className="mt-9 flex flex-col md:flex-row gap-2.5 flex-wrap">
              <button
                onClick={() => onGoogle('new')}
                className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white text-[#111] border-0 rounded-2xl text-[15px] font-bold cursor-pointer shadow-[0_6px_20px_rgba(255,255,255,0.08)]"
              >
                <GoogleIcon size={18} />
                Sign up with Google
              </button>
              <button
                onClick={() => onGoogle('returning')}
                className="px-5 py-3 bg-transparent text-gg-text border border-border rounded-2xl text-sm font-semibold cursor-pointer hover:bg-card"
              >
                I already have a gorilla
              </button>
            </div>
          </div>

          <div className="hidden md:flex md:flex-1 justify-center">
            <GorillaAvatar rank="silverback" size={320} />
          </div>
        </div>

        <div className="mt-9 pt-7 grid grid-cols-3 gap-3 border-t border-border">
          <PublicStat label="Gorillas evolved" value="12,847" />
          <PublicStat label="Workouts logged" value="384,912" />
          <PublicStat label="Total kg lifted" value="9.2M" />
        </div>

        <p className="text-center text-text-muted text-[11px] mt-4.5">
          Demo mode — Google OAuth is stubbed. State persists locally in your browser.
        </p>
      </div>
    </div>
  );
}

function PublicStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-bebas text-[28px] text-accent">{value}</div>
      <div className="text-[10px] text-text-muted uppercase tracking-[0.5px]">{label}</div>
    </div>
  );
}
