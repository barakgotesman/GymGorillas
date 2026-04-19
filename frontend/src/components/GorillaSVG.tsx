interface Props { size?: number; eyeColor?: string; }

export function GorillaSVG({ size = 48, eyeColor = '#2EE87A' }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="48" r="13" fill="#1C1C25"/>
      <circle cx="88" cy="48" r="13" fill="#1C1C25"/>
      <circle cx="12" cy="48" r="8"  fill="#252532"/>
      <circle cx="88" cy="48" r="8"  fill="#252532"/>
      <ellipse cx="50" cy="52" rx="36" ry="40" fill="#1C1C25"/>
      <rect x="17" y="26" width="66" height="20" rx="10" fill="#13131A"/>
      <ellipse cx="50" cy="18" rx="18" ry="10" fill="#1C1C25"/>
      <circle cx="35" cy="42" r="9"   fill={eyeColor} opacity="0.95"/>
      <circle cx="65" cy="42" r="9"   fill={eyeColor} opacity="0.95"/>
      <circle cx="35" cy="42" r="5.5" fill="#0B0B0E"/>
      <circle cx="65" cy="42" r="5.5" fill="#0B0B0E"/>
      <circle cx="37" cy="39.5" r="2" fill="white" opacity="0.55"/>
      <circle cx="67" cy="39.5" r="2" fill="white" opacity="0.55"/>
      <ellipse cx="50" cy="72" rx="21" ry="16" fill="#252532"/>
      <ellipse cx="44" cy="68" rx="4.5" ry="3.5" fill="#13131A"/>
      <ellipse cx="56" cy="68" rx="4.5" ry="3.5" fill="#13131A"/>
      <path d="M40 80 Q50 86 60 80" stroke="#13131A" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
