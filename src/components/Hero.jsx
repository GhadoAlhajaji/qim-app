import azoum from '../assets/characters/azoum.png';
import bashayer from '../assets/characters/bashayer.png';
import himma from '../assets/characters/himma.png';
import itqan from '../assets/characters/itqan.png';
import lina from '../assets/characters/lina.png';
import mizan from '../assets/characters/mizan.png';
import nizam from '../assets/characters/nizam.png';
import raya from '../assets/characters/raya.png';
import widad from '../assets/characters/widad.png';

const LOOKS = {
  1: { name: 'راية', src: raya },
  2: { name: 'لمى', src: himma },
  3: { name: 'لينة', src: lina },
  4: { name: 'وداد', src: widad },
  5: { name: 'جود', src: itqan },
  6: { name: 'بشاير', src: bashayer },
  7: { name: 'تالا', src: mizan },
  8: { name: 'ريم', src: nizam },
  9: { name: 'ليلى', src: azoum },
};

export function Hero({ id = 1, size = 280, cheer = false, className = '' }) {
  const look = LOOKS[id] || LOOKS[1];
  return (
    <img
      className={`hero ${cheer ? 'cheer' : ''} ${className}`.trim()}
      src={look.src}
      alt={look.name}
      style={{ height: size }}
      draggable="false"
    />
  );
}
