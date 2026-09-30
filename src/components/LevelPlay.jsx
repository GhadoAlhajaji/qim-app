import { useState } from 'react';
import { Hero } from './Hero';
import { Stage } from './Stage';

export function LevelPlay({ level, onExit, onNext }) {
  const [picked, setPicked] = useState(null);
  const [hint, setHint] = useState('');
  const [solved, setSolved] = useState(false);

  function choose(choice) {
    setPicked(choice.id);
    if (!choice.ok) {
      setHint(choice.hint);
      return;
    }
    setHint('');
    setSolved(true);
  }

  return (
    <div className="wrap level-screen">
      <div className="level-bar">
        <button type="button" className="btn-ghost" onClick={onExit}>
          رجوع
        </button>
        <div className="level-title">
          <strong>{level.hero}</strong>
          <span>{level.value}</span>
        </div>
      </div>

      {solved ? (
        <div className="result-layout">
          <Stage level={level} cheer>
            <div className="story-layout">
              <Hero id={level.id} size={360} cheer />
              <div className="bubble celebrate">
                <p className="kicker">{level.hero}</p>
                <h2>أحسنتِ الاختيار</h2>
                <p>{level.praise}</p>
              </div>
            </div>
          </Stage>
          <article className="panel lesson-card">
            <p className="kicker">القيمة</p>
            <h2>{level.value}</h2>
            <p className="definition">{level.definition}</p>
            <p>{level.explanation}</p>
            <h3>كيف أنمّي هذه القيمة؟</h3>
            <ul className="tips">
              {level.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <button type="button" className="btn-primary" onClick={() => onNext(level.id)}>
              الانتقال إلى المرحلة التالية
            </button>
          </article>
        </div>
      ) : (
        <div className="play-grid">
          <Stage level={level}>
            <div className="story-layout">
              <Hero id={level.id} size={340} />
              <div className="bubble">
                <h2 className="hero-name">{level.hero}</h2>
                <p>{level.welcome}</p>
                <p>{level.situation}</p>
              </div>
            </div>
          </Stage>
          <div className="panel choices-panel">
            <h2>ما التصرف الصحيح في هذا الموقف؟</h2>
            <div className="choices">
              {level.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  className={`choice ${picked === choice.id && !choice.ok ? 'no' : ''}`}
                  onClick={() => choose(choice)}
                >
                  {choice.text}
                </button>
              ))}
            </div>
            {hint ? (
              <p className="note hint" role="status">
                <strong>لنفكّر معاً</strong>
                {hint}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
