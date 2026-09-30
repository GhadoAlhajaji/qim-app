import { LEVELS } from '../data/levels';
import { toAr } from '../lib/format';
import { Hero } from './Hero';

const SHOW = [1, 2, 4, 6, 9];

export function Home({ progress, onStart, onMap, onFinale }) {
  const done = progress.completed.length;
  const all = done === LEVELS.length;

  return (
    <div className="wrap home">
      <section className="title-screen">
        <div className="diorama" aria-hidden="true">
          <div className="diorama-sky">
            <span className="sun" />
            <span className="cloud c1" />
            <span className="cloud c2" />
            <span className="far-mount m1" />
            <span className="far-mount m2" />
            <span className="castle-far" />
          </div>
          <div className="diorama-floor" />
          <div className="diorama-path" />
          <div className="cast">
            {SHOW.map((id) => (
              <div key={id} className="cast-figure">
                <Hero id={id} size={300} />
              </div>
            ))}
          </div>
        </div>
        <div className="title-block panel">
          <p className="school-name">مجمع حي الرياض</p>
          <p className="credit-line">إعداد الموجهة الطلابية: خديجة الكعبي</p>
          <h1 className="display">أبطال القيم</h1>
          <p className="lead">مغامرة صغيرة... وقيم عظيمة!</p>
          <p className="progress-line">
            أتممتِ <strong>{toAr(done)}</strong> من <strong>{toAr(9)}</strong>
          </p>
          <div className="bar" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={9} aria-label="عدد المراحل المكتملة">
            <span style={{ width: `${(done / 9) * 100}%` }} />
          </div>
          <div className="row-actions">
            <button type="button" className="btn-primary" onClick={onStart}>
              ابدئي المغامرة
            </button>
            <button type="button" className="btn-ghost" onClick={onMap}>
              خريطة المغامرة
            </button>
            {all ? (
              <button type="button" className="btn-ghost" onClick={onFinale}>
                شاهدي الاحتفال
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
