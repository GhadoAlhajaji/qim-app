const ICONS = {
  1: (c) => <path d="M32 40c0-10 8-16 14-22 6 6 14 12 14 22 0 12-14 22-14 22S32 52 32 40z" fill={c} />,
  2: (c) => <path d="M18 50 L32 22 L40 34 L50 16 L62 50 Z" fill={c} />,
  3: (c) => <path d="M16 40c8 8 14 8 22 0s14-8 22 0 8 10 0 14H22c-10-2-12-8-6-14z" fill={c} />,
  4: (c) => <path d="M40 50 28 38a10 10 0 1 1 12-14 10 10 0 1 1 12 14z" fill={c} />,
  5: (c) => <path d="M40 14l6 14 15 2-11 10 3 15-13-8-13 8 3-15-11-10 15-2z" fill={c} />,
  6: (c) => (
    <g fill={c}>
      <circle cx="40" cy="40" r="10" />
      <g stroke={c} strokeWidth="3" strokeLinecap="round">
        <path d="M40 22v-6M40 64v-6M22 40h-6M64 40h-6M27 27l-4-4M57 57l-4-4M53 27l4-4M27 57l-4 4" />
      </g>
    </g>
  ),
  7: (c) => (
    <g fill="none" stroke={c} strokeWidth="3">
      <path d="M40 22v28M24 30h32" />
      <path d="M24 30l-6 12h12zM56 30l-6 12h12z" fill={c} />
    </g>
  ),
  8: (c) => (
    <g fill="none" stroke={c} strokeWidth="3">
      <circle cx="40" cy="40" r="16" />
      <path d="M40 30v12l8 4" strokeLinecap="round" />
    </g>
  ),
  9: (c) => (
    <g fill="none" stroke={c} strokeWidth="3">
      <circle cx="40" cy="40" r="16" />
      <path d="M40 24v32M24 40h32" />
      <circle cx="40" cy="40" r="3" fill={c} />
    </g>
  ),
};

export function Badge({ levelId, earned = false, title, size = 86 }) {
  const tone = earned ? '#fff6d8' : '#efe6d8';
  const metal = earned ? '#e2b657' : '#b7aa9a';
  const icon = earned ? '#8a5a12' : '#9a8d7c';
  return (
    <svg className={`badge ${earned ? 'earned' : ''}`} width={size} height={size} viewBox="0 0 80 80" role="img" aria-label={title || 'شارة'}>
      <defs>
        <radialGradient id={`b${levelId}`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="55%" stopColor={tone} />
          <stop offset="100%" stopColor={metal} />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="30" fill={`url(#b${levelId})`} stroke={metal} strokeWidth="4" />
      <circle cx="40" cy="40" r="24" fill="none" stroke={earned ? '#fff' : '#e7dccb'} strokeWidth="2" />
      <g transform="translate(0 2)">{ICONS[levelId]?.(icon)}</g>
    </svg>
  );
}
