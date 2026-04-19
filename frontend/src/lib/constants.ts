export const C = {
  bg:         '#060A07',
  surface:    '#0D1410',
  card:       '#131D15',
  cardHover:  '#1A2B1D',
  border:     '#1E2E22',
  accent:     '#2EE87A',
  accentDim:  'rgba(46,232,122,0.12)',
  accentMid:  'rgba(46,232,122,0.28)',
  gold:       '#FFB700',
  goldDim:    'rgba(255,183,0,0.12)',
  silver:     '#94A3B8',
  danger:     '#FF6B6B',
  dangerDim:  'rgba(255,107,107,0.12)',
  text:       '#E8F0EA',
  textDim:    '#8FA893',
  textMuted:  '#4A6550',
  orange:     '#FF7A35',
  purple:     '#C084FC',
} as const;

export const RANKS = [
  { key: 'chimp',      label: 'Baby Chimp',    xpMin: 0,     xpMax: 500,   color: '#A0896A' },
  { key: 'juvenile',   label: 'Young Gorilla',  xpMin: 500,   xpMax: 1500,  color: '#3DDB81' },
  { key: 'gorilla',    label: 'Adult Gorilla',  xpMin: 1500,  xpMax: 4000,  color: '#60A5FA' },
  { key: 'silverback', label: 'Silverback',     xpMin: 4000,  xpMax: 10000, color: '#A78BFA' },
  { key: 'legendary',  label: 'Legendary',      xpMin: 10000, xpMax: 99999, color: '#F5A623' },
] as const;

export type RankKey = typeof RANKS[number]['key'];

export const MUSCLE_GROUPS = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'other'] as const;
export type MuscleGroup = typeof MUSCLE_GROUPS[number];

export const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  chest:     '#F87171',
  back:      '#60A5FA',
  legs:      '#34D399',
  shoulders: '#FBBF24',
  arms:      '#A78BFA',
  core:      '#F97316',
  other:     '#94A3B8',
};
