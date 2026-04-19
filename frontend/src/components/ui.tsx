import { useState } from 'react';
import { C, RANKS } from '../lib/constants';
import { GorillaSVG } from './GorillaSVG';
import type { RankKey } from '../types';

// ── Logo ─────────────────────────────────────────────────────────
export function Logo({ size = 'md', noText = false }: { size?: 'sm' | 'md' | 'lg'; noText?: boolean }) {
  const s     = size === 'lg' ? 52 : size === 'sm' ? 28 : 36;
  const title = size === 'lg' ? 28 : size === 'sm' ? 17 : 20;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <GorillaSVG size={s} eyeColor={C.accent} />
      {!noText && (
        <div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: title, color: C.text, letterSpacing: 3, lineHeight: 1 }}>
            GYM GORILLAS
          </div>
          {size !== 'sm' && (
            <div style={{ fontSize: 10, color: C.accent, letterSpacing: 3, fontFamily: 'Inter, sans-serif', fontWeight: 700, textTransform: 'uppercase', marginTop: 3 }}>
              Level Up Your Lifting
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Rank Badge ───────────────────────────────────────────────────
export function RankBadge({ rank, size = 'sm' }: { rank: RankKey; size?: 'sm' | 'md' }) {
  const r = RANKS.find(x => x.key === rank) || RANKS[0];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: `${r.color}18`, color: r.color,
      padding: size === 'sm' ? '3px 9px' : '5px 13px',
      borderRadius: 999, fontSize: size === 'sm' ? 11 : 13,
      fontFamily: 'Inter, sans-serif', fontWeight: 700,
      border: `1px solid ${r.color}35`, letterSpacing: 0.3,
      whiteSpace: 'nowrap',
    }}>
      {r.label}
    </span>
  );
}

// ── Gorilla Avatar (floating, glowing) ───────────────────────────
export function GorillaAvatar({ rank = 'juvenile', size = 110 }: { rank?: RankKey; size?: number }) {
  const r = RANKS.find(x => x.key === rank) || RANKS[1];
  return (
    <div className="gg-float" style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: -16, background: `radial-gradient(circle, ${r.color}30 0%, transparent 70%)`, borderRadius: '50%' }}/>
      <div className="gg-glow" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${r.color}40` }}/>
      <GorillaSVG size={size} eyeColor={r.color} />
    </div>
  );
}

// ── XP Bar ───────────────────────────────────────────────────────
export function XPBar({ totalXp, rank }: { totalXp: number; rank: RankKey }) {
  const rankData = RANKS.find(r => r.key === rank) || RANKS[0];
  const idx      = RANKS.indexOf(rankData);
  const nextRank = RANKS[idx + 1];
  const pct      = nextRank
    ? Math.min(100, ((totalXp - rankData.xpMin) / (nextRank.xpMin - rankData.xpMin)) * 100)
    : 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: 12, color: rankData.color, fontFamily: 'Inter', fontWeight: 600 }}>{rankData.label}</span>
        {nextRank && <span style={{ fontSize: 12, color: C.textDim, fontFamily: 'Inter' }}>{nextRank.label} →</span>}
      </div>
      <div style={{ height: 10, background: C.border, borderRadius: 999, overflow: 'hidden' }}>
        <div className="gg-bar" style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${rankData.color}, ${nextRank?.color || rankData.color})`,
          borderRadius: 999, boxShadow: `0 0 14px ${rankData.color}70`,
        }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontSize: 11, color: C.textMuted, fontFamily: 'Inter' }}>{totalXp.toLocaleString()} XP</span>
        {nextRank && <span style={{ fontSize: 11, color: C.textMuted, fontFamily: 'Inter' }}>{nextRank.xpMin.toLocaleString()} XP</span>}
      </div>
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────
export function Card({ children, style = {}, onClick, className = '' }: {
  children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; className?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={className}
      style={{
        background: hov ? C.cardHover : C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        transition: 'background 0.15s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20, color: C.text, letterSpacing: 1, margin: 0 }}>{title}</h3>
      {action && (
        <button onClick={onAction} style={{ background: 'none', border: 'none', color: C.accent, fontSize: 13, fontFamily: 'Inter', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
          {action}
        </button>
      )}
    </div>
  );
}

// ── Pill button ──────────────────────────────────────────────────
export function Pill({ children, active, onClick, color, style = {} }: {
  children: React.ReactNode; active?: boolean; onClick?: () => void; color?: string; style?: React.CSSProperties;
}) {
  const col = color || C.accent;
  return (
    <button onClick={onClick} style={{
      background: active ? `${col}20` : 'transparent',
      border: `1px solid ${active ? col : C.border}`,
      color: active ? col : C.textDim,
      borderRadius: 999, padding: '5px 14px',
      fontSize: 12, fontFamily: 'Inter', fontWeight: 600,
      cursor: 'pointer', whiteSpace: 'nowrap',
      transition: 'all 0.15s', ...style,
    }}>
      {children}
    </button>
  );
}

// ── Muscle tag ───────────────────────────────────────────────────
export function MuscleTag({ group }: { group: string }) {
  const colors: Record<string, string> = {
    chest: '#F87171', back: '#60A5FA', legs: '#34D399',
    shoulders: '#FBBF24', arms: '#A78BFA', core: '#F97316', other: '#94A3B8',
  };
  const color = colors[group] || C.textMuted;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color, fontSize: 11, fontFamily: 'Inter', fontWeight: 600, textTransform: 'capitalize' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }}/>
      {group}
    </span>
  );
}

// ── Toast ────────────────────────────────────────────────────────
export function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', top: 60, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : -20}px)`,
      background: C.accent, color: C.bg, padding: '10px 20px', borderRadius: 12,
      fontFamily: 'Inter', fontWeight: 700, fontSize: 13,
      opacity: visible ? 1 : 0, transition: 'all 0.3s', zIndex: 9999,
      whiteSpace: 'nowrap', pointerEvents: 'none',
    }}>
      {msg}
    </div>
  );
}

// ── Jungle Decorations ───────────────────────────────────────────
export function JungleLeaf({ size = 120, color, style = {} }: { size?: number; color?: string; style?: React.CSSProperties }) {
  const col = color || C.accent;
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 80 130" fill="none" style={{ display: 'block', ...style }}>
      <path d="M40 128 C40 128 2 90 1 52 C0 18 18 2 40 0 C62 2 80 18 79 52 C78 90 40 128 40 128Z" fill={col} opacity="0.18"/>
      <path d="M40 110 C40 110 10 78 9 50 C8 28 22 12 40 8 C58 12 72 28 71 50 C70 78 40 110 40 110Z" fill={col} opacity="0.12"/>
      <path d="M40 0 C40 0 38 60 40 128" stroke={col} strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
      <path d="M40 25 C30 45 12 58 4 68"  stroke={col} strokeWidth="1" opacity="0.2" strokeLinecap="round"/>
      <path d="M40 25 C50 45 68 58 76 68"  stroke={col} strokeWidth="1" opacity="0.2" strokeLinecap="round"/>
    </svg>
  );
}

export function JungleCorner({ position = 'tl', size = 200, color, style = {} }: {
  position?: 'tl' | 'tr' | 'bl' | 'br'; size?: number; color?: string; style?: React.CSSProperties;
}) {
  const col     = color || C.accent;
  const isRight  = position.includes('r');
  const isBottom = position.includes('b');
  return (
    <div style={{
      position: 'absolute',
      top:    isBottom ? 'auto' : 0,
      bottom: isBottom ? 0 : 'auto',
      left:   isRight  ? 'auto' : 0,
      right:  isRight  ? 0 : 'auto',
      width: size, height: size,
      pointerEvents: 'none', overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute',
        top:    isBottom ? 'auto' : -20,
        bottom: isBottom ? -20 : 'auto',
        left:   isRight  ? 'auto' : -20,
        right:  isRight  ? -20 : 'auto',
        transformOrigin: isRight ? 'top right' : 'top left',
        transform: `rotate(${isRight ? -30 : 30}deg)${isBottom ? ' scaleY(-1)' : ''}`,
        animation: `${isRight ? 'gg-leaf-sway-r' : 'gg-leaf-sway'} 5s ease-in-out infinite`,
      }}>
        <JungleLeaf size={size * 0.7} color={col} />
      </div>
      <div style={{
        position: 'absolute',
        top:    isBottom ? 'auto' : 10,
        bottom: isBottom ? 10 : 'auto',
        left:   isRight  ? 'auto' : size * 0.15,
        right:  isRight  ? size * 0.15 : 'auto',
        transformOrigin: 'top center',
        transform: `rotate(${isRight ? -55 : 55}deg)${isBottom ? ' scaleY(-1)' : ''}`,
        animation: `${isRight ? 'gg-leaf-sway-r' : 'gg-leaf-sway'} 4s ease-in-out infinite 0.8s`,
      }}>
        <JungleLeaf size={size * 0.45} color={col} />
      </div>
    </div>
  );
}

// ── Stat Bubble ──────────────────────────────────────────────────
export function StatBubble({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 26, color: color || C.text, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 10, color: C.textMuted, fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
    </div>
  );
}
