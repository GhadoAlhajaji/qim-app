import { useState } from 'react';
import { LEVELS } from '../data/levels';
import { arabicDate } from '../lib/format';
import { Hero } from './Hero';

export function Finale({ progress, onName, onMap }) {
  const [shown, setShown] = useState(false);
  const name = progress.heroName.trim();
  return (
    <div className="wrap finale">
      <section className="summit">
        <p className="kicker">اكتمال الرحلة</p>
        <h1 className="display">تهانينا! لقد أصبحتِ بطلة القيم!</h1>
        <p className="lead">هذه شهادتكِ. استعرضيها، ثم أرسلي صورتها.</p>
        <div className="cast finale-cast">
          {LEVELS.map((level) => (
            <div key={level.id} className="cast-figure">
              <Hero id={level.id} size={210} cheer />
              <span>{level.hero}</span>
            </div>
          ))}
        </div>
      </section>

      {shown && name ? (
        <article className="certificate" aria-label="شهادة شكر وتقدير">
          <div className="cert-frame">
            <p className="official-line">المملكة العربية السعودية</p>
            <p className="official-line">وزارة التعليم</p>
            <p className="official-line">الإدارة العامة للتعليم بمنطقة مكة المكرمة</p>
            <p className="cert-school">مجمع حي الرياض</p>
            <p className="cert-kicker">إعداد الموجهة الطلابية: خديجة الكعبي</p>
            <p className="cert-kicker">مديرة المدرسة: ابتسام سفر الغامدي</p>
            <p className="cert-kicker">أبطال القيم</p>
            <h2>شهادة شكر وتقدير</h2>
            <p className="cert-name">{name}</p>
            <p className="cert-body">
              شكرًا لكِ على إتمام رحلة القيم، وعلى تعرّفكِ على الانتماء والمثابرة والمرونة والتسامح والإتقان والإيجابية والوسطية والانضباط والعزيمة.
            </p>
            <ul className="cert-values">
              {LEVELS.map((level) => (
                <li key={level.id} style={{ background: level.palette.accent }}>
                  {level.value}
                </li>
              ))}
            </ul>
            <p className="cert-sign">مع خالص الشكر والتقدير</p>
            <p className="fine">{arabicDate()}</p>
          </div>
        </article>
      ) : (
        <form
          className="name-step panel"
          onSubmit={(event) => {
            event.preventDefault();
            if (name) setShown(true);
          }}
        >
          <input
            value={progress.heroName}
            onChange={(event) => onName(event.target.value)}
            placeholder="اكتبي اسمكِ"
            maxLength={40}
            aria-label="اسمكِ"
          />
          <button type="submit" className="btn-primary" disabled={!name}>
            استعرض الشهادة
          </button>
        </form>
      )}

      <p className="counselor-note">
        أبهري الموجهة الطلابية خديجة الكعبي بالتقدم الذي وصلتِ إليه، وأرسلي لها صورة من الشهادة كي تفتخر بالقيم التي تعرفتِ عليها.
      </p>
      <div className="row-actions">
        <button type="button" className="btn-ghost" onClick={onMap}>العودة إلى الخريطة</button>
      </div>
    </div>
  );
}
