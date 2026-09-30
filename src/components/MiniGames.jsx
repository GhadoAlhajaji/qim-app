import { useMemo, useState } from 'react';
import { playSound } from '../lib/audio';
import { toAr } from '../lib/format';

function shuffle(list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function Note({ note }) {
  if (!note) return null;
  return (
    <p className={`note ${note.tone}`} role="status">
      {note.text}
    </p>
  );
}

function WinBar({ text, onWin }) {
  return (
    <div className="winbar">
      <p>{text}</p>
      <button type="button" className="btn-primary" onClick={onWin}>
        تابعي إلى المهمة
      </button>
    </div>
  );
}

function ChooseGame({ game, sound, onWin }) {
  const items = useMemo(() => shuffle(game.items), [game]);
  const [picked, setPicked] = useState([]);
  const [note, setNote] = useState(null);
  const [won, setWon] = useState(false);

  function toggle(id) {
    if (won) return;
    playSound('tap', sound);
    setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setNote(null);
  }

  function submit() {
    const needed = game.items.filter((item) => item.ok).map((item) => item.id).sort();
    const have = [...picked].sort();
    const same = needed.length === have.length && needed.every((id, index) => id === have[index]);
    if (!same) {
      playSound('hint', sound);
      setNote({
        tone: 'hint',
        text: 'لنفكّر معاً: بعض البطاقات لا تُظهر القيمة، وربما نسيتِ فعلاً لطيفاً. راجعي اختياركِ بهدوء.',
      });
      return;
    }
    playSound('ok', sound);
    setWon(true);
    setNote(null);
  }

  return (
    <div className="game">
      <div className="card-grid">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`pick ${picked.includes(item.id) ? 'on' : ''}`}
            aria-pressed={picked.includes(item.id)}
            onClick={() => toggle(item.id)}
          >
            {item.text}
          </button>
        ))}
      </div>
      <Note note={note} />
      {won ? <WinBar text={game.success} onWin={onWin} /> : (
        <button type="button" className="btn-primary" onClick={submit}>أتحقق من اختياري</button>
      )}
    </div>
  );
}

function OrderGame({ game, sound, onWin }) {
  const [pool, setPool] = useState(() => shuffle(game.items));
  const [seq, setSeq] = useState([]);
  const [note, setNote] = useState(null);
  const [won, setWon] = useState(false);

  function take(item) {
    if (won) return;
    playSound('tap', sound);
    setPool((current) => current.filter((entry) => entry.id !== item.id));
    setSeq((current) => [...current, item]);
    setNote(null);
  }

  function drop(item) {
    if (won) return;
    playSound('tap', sound);
    setSeq((current) => current.filter((entry) => entry.id !== item.id));
    setPool((current) => [...current, item]);
    setNote(null);
  }

  function submit() {
    if (seq.length !== game.items.length) {
      playSound('hint', sound);
      setNote({ tone: 'hint', text: 'ضعي كل الخطوات في الطريق أولاً، ثم راجعي ترتيبها.' });
      return;
    }
    const wrong = seq.findIndex((item, index) => item.id !== game.items[index].id);
    if (wrong !== -1) {
      playSound('hint', sound);
      setNote({
        tone: 'hint',
        text: `الخطوة رقم ${['الأولى', 'الثانية', 'الثالثة', 'الرابعة'][wrong] || wrong + 1} تحتاج نظرة أخرى. ما الذي يحدث قبلها؟`,
      });
      return;
    }
    playSound('ok', sound);
    setWon(true);
    setNote(null);
  }

  return (
    <div className="game">
      <ol className="seq">
        {seq.length === 0 ? <li className="ghost">اضغطي البطاقات بالترتيب الصحيح</li> : null}
        {seq.map((item, index) => (
          <li key={item.id}>
            <button type="button" className="pick on" onClick={() => drop(item)}>
              <span className="num">{toAr(index + 1)}</span>
              {item.text}
            </button>
          </li>
        ))}
      </ol>
      <div className="card-grid">
        {pool.map((item) => (
          <button key={item.id} type="button" className="pick" onClick={() => take(item)}>
            {item.text}
          </button>
        ))}
      </div>
      <Note note={note} />
      {won ? <WinBar text={game.success} onWin={onWin} /> : (
        <button type="button" className="btn-primary" onClick={submit}>أتحقق من الترتيب</button>
      )}
    </div>
  );
}

function MatchGame({ game, sound, onWin }) {
  const rights = useMemo(() => shuffle(game.pairs), [game]);
  const [leftId, setLeftId] = useState(null);
  const [rightId, setRightId] = useState(null);
  const [done, setDone] = useState([]);
  const [note, setNote] = useState(null);
  const [won, setWon] = useState(false);

  function choose(side, id) {
    if (won || done.includes(id)) return;
    playSound('tap', sound);
    const nextLeft = side === 'left' ? id : leftId;
    const nextRight = side === 'right' ? id : rightId;
    if (side === 'left') setLeftId(id);
    else setRightId(id);
    if (nextLeft && nextRight) {
      if (nextLeft === nextRight) {
        playSound('ok', sound);
        const merged = [...done, nextLeft];
        setDone(merged);
        setLeftId(null);
        setRightId(null);
        setNote({ tone: 'ok', text: 'وُجد جسر مناسب. واصلي.' });
        if (merged.length === game.pairs.length) setWon(true);
      } else {
        playSound('hint', sound);
        setNote({ tone: 'hint', text: 'هذان لا يلتقيان. ابحثي عن حل يحافظ على الهدف نفسه.' });
        setLeftId(null);
        setRightId(null);
      }
    }
  }

  return (
    <div className="game">
      <div className="match">
        <div>
          {game.pairs.map((pair) => (
            <button
              key={pair.id}
              type="button"
              className={`pick ${done.includes(pair.id) ? 'done' : ''} ${leftId === pair.id ? 'on' : ''}`}
              onClick={() => choose('left', pair.id)}
              disabled={done.includes(pair.id)}
            >
              {pair.left}
            </button>
          ))}
        </div>
        <div>
          {rights.map((pair) => (
            <button
              key={pair.id}
              type="button"
              className={`pick ${done.includes(pair.id) ? 'done' : ''} ${rightId === pair.id ? 'on' : ''}`}
              onClick={() => choose('right', pair.id)}
              disabled={done.includes(pair.id)}
            >
              {pair.right}
            </button>
          ))}
        </div>
      </div>
      <Note note={won ? null : note} />
      {won ? <WinBar text={game.success} onWin={onWin} /> : null}
    </div>
  );
}

function AssignGame({ game, sound, onWin }) {
  const cards = useMemo(() => shuffle(game.items), [game]);
  const [placed, setPlaced] = useState({});
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState(null);
  const [won, setWon] = useState(false);
  const used = new Set(Object.values(placed));

  function place(binId) {
    if (!selected || won) return;
    playSound('tap', sound);
    setPlaced((current) => {
      const next = { ...current };
      Object.keys(next).forEach((key) => {
        if (next[key] === selected) delete next[key];
      });
      next[`${binId}::${selected}`] = selected;
      return next;
    });
    setSelected(null);
    setNote(null);
  }

  function itemsIn(binId) {
    return cards.filter((card) => placed[`${binId}::${card.id}`] === card.id);
  }

  function submit() {
    const misplaced = game.items.filter((item) => {
      if (item.bin == null) return used.has(item.id);
      return placed[`${item.bin}::${item.id}`] !== item.id;
    });
    if (misplaced.length) {
      playSound('hint', sound);
      const trap = misplaced.find((item) => item.bin == null);
      setNote({
        tone: 'hint',
        text: trap
          ? `«${trap.text}» لا مكان لها في يوم متوازن. أعيديها إلى الخارج، وراجعي بقية البطاقات.`
          : 'بعض البطاقات في غير مكانها. اقرئي كل تصرف واسألي: هل يخدم هذه القيمة حقاً؟',
      });
      return;
    }
    playSound('ok', sound);
    setWon(true);
    setNote(null);
  }

  const study = itemsIn('study').length;
  const rest = itemsIn('rest').length;
  const tilt = game.presentation === 'scale' ? (study - rest) * 7 : 0;

  return (
    <div className="game">
      {game.presentation === 'scale' ? (
        <div className="scale-wrap" aria-hidden="true">
          <div className="beam" style={{ transform: `rotate(${tilt}deg)` }}>
            <span />
            <i />
            <span />
          </div>
        </div>
      ) : null}
      <div className={`bins bins-${game.bins.length}`}>
        {game.bins.map((bin) => (
          <button key={bin.id} type="button" className="bin" onClick={() => place(bin.id)}>
            <strong>{bin.label}</strong>
            <span className="bin-items">
              {itemsIn(bin.id).map((item) => (
                <em key={item.id}>{item.text}</em>
              ))}
            </span>
          </button>
        ))}
      </div>
      <div className="card-grid">
        {cards.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`pick ${selected === item.id ? 'on' : ''} ${used.has(item.id) ? 'faint' : ''}`}
            aria-pressed={selected === item.id}
            onClick={() => {
              playSound('tap', sound);
              setSelected(item.id);
            }}
          >
            {item.text}
          </button>
        ))}
      </div>
      <Note note={note} />
      {won ? <WinBar text={game.success} onWin={onWin} /> : (
        <button type="button" className="btn-primary" onClick={submit}>أتحقق من التوزيع</button>
      )}
    </div>
  );
}

function SpotsGame({ game, sound, onWin }) {
  const [picked, setPicked] = useState([]);
  const [note, setNote] = useState(null);
  const [won, setWon] = useState(false);

  function toggle(id) {
    if (won) return;
    playSound('tap', sound);
    setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setNote(null);
  }

  function submit() {
    const needed = game.spots.filter((spot) => spot.fix).map((spot) => spot.id).sort();
    const have = [...picked].sort();
    const same = needed.length === have.length && needed.every((id, index) => id === have[index]);
    if (!same) {
      playSound('hint', sound);
      setNote({
        tone: 'hint',
        text: 'الإتقان يصلح ما يغيّر جودة العمل، ويترك الجزء السليم. انظري مرة أخرى إلى المشغل.',
      });
      return;
    }
    playSound('ok', sound);
    setWon(true);
  }

  return (
    <div className="game">
      <div className="workshop">
        <div className="bench" />
        <div className="lamp" />
        <div className="gear" />
        {game.spots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            className={`spot ${picked.includes(spot.id) ? 'on' : ''}`}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            aria-pressed={picked.includes(spot.id)}
            onClick={() => toggle(spot.id)}
          >
            {spot.label}
          </button>
        ))}
      </div>
      <Note note={note} />
      {won ? <WinBar text={game.success} onWin={onWin} /> : (
        <button type="button" className="btn-primary" onClick={submit}>هذه الأجزاء تحتاج عناية</button>
      )}
    </div>
  );
}

function SlotsGame({ game, sound, onWin }) {
  const cards = useMemo(() => shuffle(game.cards), [game]);
  const [placed, setPlaced] = useState({});
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState(null);
  const [won, setWon] = useState(false);
  const used = new Set(Object.values(placed));

  function place(slotId) {
    if (!selected || won) return;
    playSound('tap', sound);
    setPlaced((current) => {
      const next = { ...current };
      Object.entries(next).forEach(([key, value]) => {
        if (value === selected) delete next[key];
      });
      next[slotId] = selected;
      return next;
    });
    setSelected(null);
    setNote(null);
  }

  function submit() {
    const trap = game.cards.find((card) => !game.slots.some((slot) => slot.correct === card.id));
    if (trap && Object.values(placed).includes(trap.id)) {
      playSound('hint', sound);
      setNote({ tone: 'hint', text: `«${trap.text}» تؤخر اليوم. أخرجيها من الجدول.` });
      return;
    }
    const bad = game.slots.some((slot) => placed[slot.id] !== slot.correct);
    if (bad || game.slots.some((slot) => !placed[slot.id])) {
      playSound('hint', sound);
      setNote({ tone: 'hint', text: 'الجدول لم يكتمل بحكمة. فكّري: ما الذي يحدث قبل العمل، وما الذي يأتي قبل التسليم؟' });
      return;
    }
    playSound('ok', sound);
    setWon(true);
  }

  return (
    <div className="game">
      <div className="slots">
        {game.slots.map((slot) => {
          const card = cards.find((item) => item.id === placed[slot.id]);
          return (
            <button key={slot.id} type="button" className="slot" onClick={() => place(slot.id)}>
              <small>{slot.label}</small>
              <strong>{card ? card.text : 'اضغطي بعد اختيار بطاقة'}</strong>
            </button>
          );
        })}
      </div>
      <div className="card-grid">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`pick ${selected === card.id ? 'on' : ''} ${used.has(card.id) ? 'faint' : ''}`}
            aria-pressed={selected === card.id}
            onClick={() => {
              playSound('tap', sound);
              setSelected(card.id);
            }}
          >
            {card.text}
          </button>
        ))}
      </div>
      <Note note={note} />
      {won ? <WinBar text={game.success} onWin={onWin} /> : (
        <button type="button" className="btn-primary" onClick={submit}>أتحقق من يومي</button>
      )}
    </div>
  );
}

function GardenSky({ step }) {
  return (
    <div className="garden-sky" aria-hidden="true">
      <span className="garden-sun" />
      <span className={`rainbow r${step + 1}`} />
      <span className="butterfly b1" />
      <span className="butterfly b2" />
    </div>
  );
}

function SummitCompass({ step, total }) {
  const turn = (step / Math.max(total - 1, 1)) * 70 - 30;
  return (
    <div className="compass-sky" aria-hidden="true">
      <div className="compass-rose">
        <b>ق</b>
        <i style={{ transform: `rotate(${turn}deg)` }} />
      </div>
      <div className="climb">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={index <= step ? 'lit' : ''} />
        ))}
      </div>
    </div>
  );
}

function RouteGame({ game, sound, onWin }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [note, setNote] = useState(null);
  const [won, setWon] = useState(false);
  const current = game.steps[step];

  function choose(option) {
    if (won) return;
    setPicked(option.id);
    if (!option.ok) {
      playSound('hint', sound);
      setNote({ tone: 'hint', text: option.feedback });
      return;
    }
    playSound('ok', sound);
    setNote({ tone: 'ok', text: option.feedback });
  }

  function next() {
    if (step + 1 >= game.steps.length) {
      setWon(true);
      return;
    }
    setStep((value) => value + 1);
    setPicked(null);
    setNote(null);
  }

  const chosen = current?.options.find((option) => option.id === picked);

  const sunny = game.style === 'sun';

  return (
    <div className="game">
      {won ? (
        <WinBar text={game.success} onWin={onWin} />
      ) : (
        <>
          {sunny ? <GardenSky step={step} /> : <SummitCompass step={step} total={game.steps.length} />}
          <p className="route-kicker">
            {sunny ? 'موقف' : 'محطة'} {toAr(step + 1)} من {toAr(game.steps.length)}: {current.title}
          </p>
          <p className="lead">{current.prompt}</p>
          <div className={sunny ? 'lanterns' : 'stones'}>
            {current.options.map((option, index) => (
              <button
                key={option.id}
                type="button"
                className={`${sunny ? 'lantern' : 'stone'} ${picked === option.id ? (option.ok ? 'ok' : 'no') : ''}`}
                onClick={() => choose(option)}
              >
                <span className="mark" aria-hidden="true">{sunny ? '☀' : ['ش', 'غ', 'ق', 'و'][index] || '•'}</span>
                {option.text}
              </button>
            ))}
          </div>
          <Note note={note} />
          {chosen?.ok ? (
            <button type="button" className="btn-primary" onClick={next}>
              {step + 1 === game.steps.length ? 'أتممت الطريق' : 'إلى المحطة التالية'}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

export function MiniGame({ game, sound, onWin }) {
  if (game.type === 'choose') return <ChooseGame game={game} sound={sound} onWin={onWin} />;
  if (game.type === 'order') return <OrderGame game={game} sound={sound} onWin={onWin} />;
  if (game.type === 'match') return <MatchGame game={game} sound={sound} onWin={onWin} />;
  if (game.type === 'assign') return <AssignGame game={game} sound={sound} onWin={onWin} />;
  if (game.type === 'spots') return <SpotsGame game={game} sound={sound} onWin={onWin} />;
  if (game.type === 'slots') return <SlotsGame game={game} sound={sound} onWin={onWin} />;
  return <RouteGame game={game} sound={sound} onWin={onWin} />;
}
