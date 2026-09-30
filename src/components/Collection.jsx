import { useRef } from 'react';
import { LEVELS } from '../data/levels';
import { toAr } from '../lib/format';
import { isUnlocked } from '../lib/useProgress';
import { Badge } from './Badge';
import { Hero } from './Hero';

export function Collection({ progress, onOpen, onFinale, onReset }) {
  const resetRef = useRef(null);
  const done = progress.completed.length;

  return (
    <div className="wrap collection">
      <header className="page-head">
        <div>
          <p className="kicker">الإنجازات</p>
          <h1>مجموعة البطلات</h1>
          <p>كل شارة تذكّركِ بقيمة عشتِها داخل حكاية، لا بدرجة حفظتِها.</p>
        </div>
        <div className="panel progress-card">
          <strong>{toAr(done)} / {toAr(9)}</strong>
          <div className="bar" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={9} aria-label="تقدم الرحلة">
            <span style={{ width: `${(done / 9) * 100}%` }} />
          </div>
          {done === 9 ? (
            <button type="button" className="btn-primary" onClick={onFinale}>الشهادة والاحتفال</button>
          ) : null}
        </div>
      </header>

      <ul className="gallery">
        {LEVELS.map((level) => {
          const complete = progress.completed.includes(level.id);
          const open = isUnlocked(level.id, progress.completed);
          const tried = !!progress.missionTried[level.id];
          return (
            <li key={level.id}>
              <button
                type="button"
                className={`hero-card ${complete ? 'complete' : ''} ${open ? '' : 'locked'}`}
                onClick={() => open && onOpen(level.id)}
                aria-disabled={!open}
                title={open ? level.value : 'أكملي العالم السابق أولاً'}
              >
                <Hero id={level.id} size={120} cheer={complete} />
                <Badge levelId={level.id} earned={complete} title={level.badge} />
                <h2>{level.hero}</h2>
                <p>{level.value}</p>
                <small>
                  {!open ? 'البوابة مغلقة' : complete ? (tried ? 'أكّدتِ أنكِ جرّبتِ المهمة' : 'تأمّلتِ في المهمة') : 'العالم مفتوح'}
                </small>
              </button>
            </li>
          );
        })}
      </ul>

      <button type="button" className="text-btn" onClick={() => resetRef.current?.showModal()}>
        بدء رحلة جديدة
      </button>
      <dialog ref={resetRef} className="modal">
        <form method="dialog" className="panel">
          <h2>هل تريدين البدء من جديد؟</h2>
          <p>ستُخفى الشارات المحفوظة على هذا الجهاز، ويمكنكِ إعادة المغامرة وقتما تشائين.</p>
          <div className="row-actions">
            <button type="submit" className="btn-ghost">إلغاء</button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onReset();
                resetRef.current?.close();
              }}
            >
              ابدئي من الواحة
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
