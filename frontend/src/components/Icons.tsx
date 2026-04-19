interface IconProps { size?: number; color?: string; }

export function HomeIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 12.5L12 4L21 12.5V21C21 21.55 20.55 22 20 22H15V17H9V22H4C3.45 22 3 21.55 3 21V12.5Z" fill={color}/>
  </svg>;
}

export function DumbbellIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="1"    y="10.5" width="4.5" height="3" rx="1" fill={color}/>
    <rect x="18.5" y="10.5" width="4.5" height="3" rx="1" fill={color}/>
    <rect x="5.5"  y="7.5"  width="3"   height="9" rx="1.5" fill={color}/>
    <rect x="15.5" y="7.5"  width="3"   height="9" rx="1.5" fill={color}/>
    <rect x="8.5"  y="10.5" width="7"   height="3" rx="1" fill={color}/>
  </svg>;
}

export function LibraryIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4"    width="18" height="2.5" rx="1.25" fill={color}/>
    <rect x="3" y="10.75" width="18" height="2.5" rx="1.25" fill={color}/>
    <rect x="3" y="17.5" width="18" height="2.5" rx="1.25" fill={color}/>
  </svg>;
}

export function StarIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>;
}

export function TrophyIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M8 21H16M12 17V21M5 3H19V9C19 12.31 15.87 15 12 15C8.13 15 5 12.31 5 9V3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 5H2V8C2 9.66 3.34 11 5 11V5Z" fill={color} opacity="0.5"/>
    <path d="M19 5H22V8C22 9.66 20.66 11 19 11V5Z" fill={color} opacity="0.5"/>
  </svg>;
}

export function FlameIcon({ size = 16, color = '#F97316' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M13.5 2C13.5 2 9.5 7 9.5 12C9.5 14.76 11.24 17 13.5 17.5C15.76 17 17.5 14.76 17.5 12C17.5 9 15.5 5.5 14.5 3.5C14.5 3.5 14.5 7 13.5 9.5C12 7 13.5 2 13.5 2Z"/>
    <ellipse cx="13.5" cy="19.5" rx="4" ry="2.5" fill={color} opacity="0.4"/>
  </svg>;
}

export function PlusIcon({ size = 20, color = 'white' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>;
}

export function XIcon({ size = 18, color = '#4A6550' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>;
}

export function CheckIcon({ size = 16, color = '#2EE87A' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 13L9 17L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

export function ChevronRightIcon({ size = 16, color = '#4A6550' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

export function BackIcon({ size = 22, color = '#E8F0EA' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

export function CoinIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#F5A623"/>
    <circle cx="12" cy="12" r="7"  fill="#FBC842"/>
    <text x="12" y="16.5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#A06800">G</text>
  </svg>;
}

export function LightningIcon({ size = 14, color = '#2EE87A' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M13 2L4 14H11L10 22L20 8H13L13 2Z"/>
  </svg>;
}

export function ClockIcon({ size = 16, color = 'currentColor' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 8V12L15 15M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z"
      stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>;
}

export function GoogleIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>;
}
