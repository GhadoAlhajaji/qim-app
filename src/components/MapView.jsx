import { useEffect, useRef, useState } from 'react';
import mapArt from '../assets/map/adventure-map.jpg';
import { LEVELS, getLevel } from '../data/levels';
import { isUnlocked } from '../lib/useProgress';
import { toAr } from '../lib/format';
import { Hero } from './Hero';

const SPOTS = {
  1: { x: 78, y: 78 },
  2: { x: 74, y: 60 },
  3: { x: 47, y: 76 },
  4: { x: 51, y: 58 },
  5: { x: 18, y: 58 },
  6: { x: 20, y: 34 },
  7: { x: 47, y: 42 },
  8: { x: 76, y: 36 },
  9: { x: 46, y: 22 },
};

function routePath(a, b) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 2.5;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

export function MapView({ completed, freshId, onOpen }) {
  const [hint, setHint] = useState('');
  const boardRef = useRef(null);

  useEffect(() => {
    const root = boardRef.current;
    if (!root) return;
    const scroller = root.closest('.map-stage');
    const target = freshId
      ? root.querySelector('.pin.fresh')
      : root.querySelector('.pin.current') || root.querySelector('.pin.done');
    if (!scroller || !target) return;
    if (scroller.scrollHeight <= scroller.clientHeight + 8 && scroller.scrollWidth <= scroller.clientWidth + 8) return;
    const pin = target.getBoundingClientRect();
    const box = scroller.getBoundingClientRect();
    scroller.scrollBy({
      left: pin.left - box.left - (box.width - pin.width) / 2,
      top: pin.top - box.top - (box.height - pin.height) / 2,
    });
  }, [freshId, completed]);

  return (
    <div className="map-page">
      <div className="map-head">
        <div>
          <p className="kicker">عالم المغامرة</p>
          <h1>خريطة المغامرة</h1>
        </div>
        <ul className="legend">
          <li><i className="dot open" /> مفتوحة</li>
          <li><i className="dot done" /> مكتملة</li>
          <li><i className="dot lock" /> بانتظاركِ</li>
        </ul>
      </div>

      <div className="map-stage">
        <div className="map-board" ref={boardRef}>
          <img src={mapArt} alt="" className="map-art" />
          <svg className="map-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {LEVELS.slice(0, -1).map((level) => {
              if (!completed.includes(level.id)) return null;
              const next = level.id + 1;
              return (
                <path
                  key={level.id}
                  d={routePath(SPOTS[level.id], SPOTS[next])}
                  className={freshId === next ? 'route draw' : 'route'}
                />
              );
            })}
          </svg>
          {LEVELS.map((level) => {
            const spot = SPOTS[level.id];
            const done = completed.includes(level.id);
            const open = isUnlocked(level.id, completed);
            const current = open && !done;
            const state = done ? 'done' : current ? 'current' : 'locked';
            return (
              <button
                key={level.id}
                type="button"
                className={`pin ${state} ${freshId === level.id ? 'fresh' : ''}`}
                style={{ left: `${spot.x}%`, top: `${spot.y}%`, zIndex: 3 + Math.round(spot.y) }}
                onClick={() => {
                  if (!open) {
                    const prev = getLevel(level.id - 1);
                    setHint(`أكملي مرحلة ${prev.value} أولاً، ثم تنفتح هذه المحطة.`);
                    return;
                  }
                  setHint('');
                  onOpen(level.id);
                }}
                aria-label={`${level.hero}، المستوى ${toAr(level.id)}، ${level.value}، ${done ? 'مكتمل' : open ? 'مفتوح' : 'مغلق'}`}
              >
                {level.id === 1 && !done ? <span className="start-hint">ابدئي الرحلة هنا</span> : null}
                <span className="pin-name">{level.value}</span>
                <span className="pin-num">{toAr(level.id)}</span>
                {done ? <span className="pin-check">✓</span> : null}
                <Hero id={level.id} size={96} />
                <span className="pin-glow" style={{ background: level.palette.accent }} />
              </button>
            );
          })}
        </div>
      </div>
      <p className="map-hint" role="status">{hint}</p>
    </div>
  );
}
