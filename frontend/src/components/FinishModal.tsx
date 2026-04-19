import { C, RANKS } from '../lib/constants';
import type { FinishResult } from '../types';
import { GorillaAvatar } from './ui';
import { CoinIcon } from './Icons';

export function FinishModal({ result, onClose }: { result: FinishResult; onClose: () => void }) {
  const rankUp = result.rankUp;
  const newRankMeta = rankUp ? RANKS.find(r => r.key === rankUp.to) : null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 200, padding: 20,
    }} onClick={onClose}>
      <div
        className="gg-swing"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 360,
          background: `linear-gradient(180deg, ${C.card}, ${C.surface})`,
          border: `1px solid ${C.accentMid}`,
          borderRadius: 24, padding: 24, textAlign: 'center',
          boxShadow: `0 20px 60px ${C.accent}44`,
        }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <GorillaAvatar rank={rankUp ? rankUp.to : 'gorilla'} size={120} />
        </div>

        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 36, letterSpacing: 1, color: C.accent, marginBottom: 4 }}>
          Session saved
        </div>

        <div style={{ color: C.textDim, fontSize: 13, marginBottom: 20 }}>
          Nicely done, ape.
        </div>

        {rankUp && newRankMeta && (
          <div style={{
            padding: '12px 14px', background: `${newRankMeta.color}18`,
            border: `1px solid ${newRankMeta.color}44`, borderRadius: 14, marginBottom: 18,
          }}>
            <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>
              Rank up
            </div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: newRankMeta.color }}>
              → {newRankMeta.label}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <div style={box}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 30, color: C.accent }}>
              +{result.totalXp}
            </div>
            <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>XP earned</div>
          </div>
          <div style={box}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 30, color: C.gold, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <CoinIcon size={20} /> +{result.coinsEarned}
            </div>
            <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>Coins</div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: C.textDim, marginBottom: 18 }}>
          Total XP · {result.newTotalXp.toLocaleString()}
        </div>

        <button onClick={onClose} style={{
          width: '100%', padding: 13, background: C.accent, color: '#05160A',
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer',
        }}>
          Continue
        </button>
      </div>
    </div>
  );
}

const box: React.CSSProperties = {
  padding: 14, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14,
};
