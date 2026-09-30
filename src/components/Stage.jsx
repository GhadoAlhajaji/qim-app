import { useId, useMemo } from 'react';

function Motes({ color }) {
  const motes = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: `${(index * 17) % 100}%`,
        delay: `${(index % 6) * 0.6}s`,
        duration: `${7 + (index % 5)}s`,
        size: `${4 + (index % 4) * 3}px`,
      })),
    [],
  );
  return (
    <div className="motes" aria-hidden="true">
      {motes.map((mote) => (
        <span
          key={mote.id}
          style={{
            left: mote.left,
            animationDelay: mote.delay,
            animationDuration: mote.duration,
            width: mote.size,
            height: mote.size,
            background: color,
          }}
        />
      ))}
    </div>
  );
}

function Landmark({ id }) {
  if (id === 1) {
    return (
      <g>
        <path d="M80 300 h220 l-20 70 h-180 z" fill="#f4efe4" />
        <path d="M90 300 l20 -28 h40 l20 28 h40 l20 -28 h40 l20 28" fill="none" stroke="#0e6b38" strokeWidth="8" />
        <rect x="150" y="250" width="16" height="70" fill="#8a6236" />
        <path d="M166 250 h70 l-14 18 14 18 h-70 z" fill="#0e7a46" />
        <path d="M250 250 q40 40 10 90" stroke="#1f8a4c" strokeWidth="8" fill="none" />
        <ellipse cx="300" cy="230" rx="46" ry="16" fill="#147243" transform="rotate(-20 300 230)" />
        <ellipse cx="250" cy="214" rx="40" ry="14" fill="#1c8a52" transform="rotate(20 250 214)" />
      </g>
    );
  }
  if (id === 2) {
    return (
      <g>
        <path d="M40 340 L180 160 L260 340 Z" fill="#8d5a3a" />
        <path d="M160 340 L300 140 L420 340 Z" fill="#a86b42" />
        <path d="M250 250 H430" stroke="#6b3e24" strokeWidth="6" />
        <path d="M270 250 v70 M350 250 v70 M430 250 v70" stroke="#e7d3b0" strokeWidth="3" />
        <circle cx="180" cy="150" r="18" fill="#fff" opacity="0.8" />
      </g>
    );
  }
  if (id === 3) {
    return (
      <g>
        <path d="M40 300 C160 250 240 360 400 280 C520 230 640 340 760 290 L760 380 L40 380 Z" fill="#49c2d6" opacity="0.9" />
        <path d="M120 300 q40 -30 80 0" stroke="#f7f4ea" strokeWidth="8" fill="none" />
        <path d="M250 310 q50 -36 100 0" stroke="#ffe08a" strokeWidth="8" fill="none" />
        <ellipse cx="180" cy="330" rx="28" ry="10" fill="#8ee0c2" />
        <ellipse cx="430" cy="324" rx="34" ry="12" fill="#b6f3d0" />
      </g>
    );
  }
  if (id === 4) {
    return (
      <g>
        <ellipse cx="230" cy="300" rx="70" ry="24" fill="#7fd0ea" />
        <ellipse cx="230" cy="294" rx="36" ry="12" fill="#fff" opacity="0.7" />
        <path d="M230 250 v40" stroke="#d07ab0" strokeWidth="6" />
        <circle cx="120" cy="280" r="16" fill="#ff8fb8" />
        <circle cx="150" cy="250" r="12" fill="#e7a0d4" />
        <circle cx="340" cy="270" r="18" fill="#c9a0ff" />
        <circle cx="380" cy="300" r="14" fill="#ffd1e8" />
        <path d="M80 250 Q200 180 360 240" stroke="#fff" strokeWidth="6" fill="none" opacity="0.5" />
      </g>
    );
  }
  if (id === 5) {
    return (
      <g>
        <rect x="90" y="230" width="220" height="120" rx="16" fill="#6d4cc4" />
        <rect x="120" y="180" width="70" height="50" fill="#f7f4ef" />
        <circle cx="300" cy="200" r="28" fill="#f0c14d" />
        <circle cx="300" cy="200" r="10" fill="#5436b0" />
        <rect x="140" y="270" width="120" height="16" rx="6" fill="#e6dcc8" />
        <circle cx="250" cy="278" r="10" fill="#ef6b5c" />
      </g>
    );
  }
  if (id === 6) {
    return (
      <g>
        <path d="M80 250 Q220 120 420 240" stroke="#ff8f3f" strokeWidth="10" fill="none" />
        <path d="M100 250 Q230 150 400 246" stroke="#ffe08a" strokeWidth="8" fill="none" />
        <path d="M120 252 Q236 170 380 248" stroke="#8fd38a" strokeWidth="6" fill="none" />
        <circle cx="160" cy="300" r="20" fill="#ffd24a" />
        <circle cx="210" cy="320" r="14" fill="#ff8fb8" />
        <circle cx="270" cy="300" r="18" fill="#fff" />
        <path d="M340 280 q20 20 -10 30 q20 0 10 24" fill="#7bc67e" />
      </g>
    );
  }
  if (id === 7) {
    return (
      <g>
        <ellipse cx="140" cy="300" rx="70" ry="18" fill="#8fe0cf" />
        <ellipse cx="300" cy="260" rx="80" ry="18" fill="#d9fff2" />
        <ellipse cx="430" cy="320" rx="60" ry="16" fill="#f3e6cf" />
        <path d="M250 180 v90" stroke="#3d6f66" strokeWidth="6" />
        <path d="M210 210 h80" stroke="#e7c56a" strokeWidth="6" />
        <path d="M210 210 l-16 28 h32 z" fill="#fff8ee" stroke="#3d6f66" />
        <path d="M290 210 l-16 28 h32 z" fill="#fff8ee" stroke="#3d6f66" />
      </g>
    );
  }
  if (id === 8) {
    return (
      <g>
        <rect x="70" y="250" width="70" height="90" rx="8" fill="#f7f4ef" />
        <rect x="160" y="230" width="80" height="110" rx="8" fill="#d7e4f8" />
        <rect x="260" y="250" width="90" height="90" rx="8" fill="#f4efe4" />
        <rect x="188" y="160" width="24" height="70" fill="#2f4f8a" />
        <circle cx="200" cy="168" r="22" fill="#f7f4ea" stroke="#1d3568" strokeWidth="4" />
        <path d="M200 168 v-10 M200 168 l8 6" stroke="#e15b4c" strokeWidth="2" />
        <rect x="90" y="300" width="240" height="10" rx="5" fill="#c9d7a5" />
      </g>
    );
  }
  return (
    <g>
      <path d="M120 320 L180 180 L230 240 L300 140 L360 320 Z" fill="#6d4ad4" opacity="0.85" />
      <path d="M150 320 V230 h40 v90" fill="#f7f4ef" />
      <path d="M150 230 h40 l-20 -28 z" fill="#ef5d52" />
      <rect x="250" y="250" width="46" height="70" fill="#fff1df" />
      <path d="M246 250 h54 l-27 -30 z" fill="#e15b4c" />
      <circle cx="430" cy="120" r="26" fill="#ffe7a8" />
      <path d="M80 120 l30 10 -30 8 18 -22 z" fill="#fff" opacity="0.8" />
    </g>
  );
}

export function Stage({ level, cheer = false, compact = false, children }) {
  const uid = useId().replace(/:/g, '');
  const { palette } = level;
  return (
    <section
      className={`stage ${compact ? 'compact' : ''}`}
      style={{
        '--sky1': palette.sky1,
        '--sky2': palette.sky2,
        '--land': palette.land,
        '--land2': palette.land2,
        '--accent': palette.accent,
        '--deep': palette.deep,
      }}
    >
      <svg className="stage-bg" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.sky1} />
            <stop offset="100%" stopColor={palette.sky2} />
          </linearGradient>
          <linearGradient id={`${uid}-land`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.land} />
            <stop offset="100%" stopColor={palette.land2} />
          </linearGradient>
        </defs>
        <rect width="800" height="460" fill={`url(#${uid}-sky)`} />
        <ellipse cx="640" cy="90" rx="46" ry="46" fill="#fff6d0" opacity="0.95" />
        <g className="drift">
          <ellipse cx="180" cy="80" rx="50" ry="18" fill="#fff" opacity="0.75" />
          <ellipse cx="210" cy="74" rx="36" ry="16" fill="#fff" opacity="0.8" />
          <ellipse cx="520" cy="120" rx="40" ry="14" fill="#fff" opacity="0.55" />
        </g>
        <path d="M0 300 C120 250 200 320 340 280 C480 240 560 320 800 260 L800 460 L0 460 Z" fill={palette.land2} opacity="0.35" />
        <Landmark id={level.id} />
        <path d="M0 360 C160 320 280 400 460 350 C620 310 700 390 800 340 L800 460 L0 460 Z" fill={`url(#${uid}-land)`} />
        <ellipse cx="430" cy="400" rx="180" ry="26" fill="rgba(255,255,255,0.16)" />
      </svg>
      <Motes color={palette.mote} />
      {cheer ? (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <i key={index} style={{ '--i': index }} />
          ))}
        </div>
      ) : null}
      <div className={`stage-content ${cheer ? 'cheer' : ''}`}>{children}</div>
    </section>
  );
}
