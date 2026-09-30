import { useEffect, useState } from 'react';
import { Finale } from './components/Finale';
import { Home } from './components/Home';
import { LevelPlay } from './components/LevelPlay';
import { MapView } from './components/MapView';
import { getLevel, LEVELS } from './data/levels';
import { toAr } from './lib/format';
import { isUnlocked, useProgress } from './lib/useProgress';

const TITLES = {
  home: 'أبطال القيم',
  map: 'خريطة المغامرة',
  finale: 'بطلة القيم',
};

export default function App() {
  const { progress, completeLevel, setHeroName } = useProgress();
  const [view, setView] = useState('home');
  const [levelId, setLevelId] = useState(1);
  const [freshId, setFreshId] = useState(null);
  const level = getLevel(levelId);

  useEffect(() => {
    const name = view === 'level' && level ? level.value : TITLES[view];
    document.title = !name || name === 'أبطال القيم' ? 'أبطال القيم' : `${name} · أبطال القيم`;
    window.scrollTo(0, 0);
  }, [view, level]);

  function openLevel(id) {
    if (!isUnlocked(id, progress.completed)) return;
    setLevelId(id);
    setView('level');
    setFreshId(null);
  }

  function finishLevel(id) {
    const already = progress.completed.includes(id);
    completeLevel(id);
    if (id >= LEVELS.length) {
      setFreshId(null);
      setView('finale');
      return;
    }
    setFreshId(already ? null : id + 1);
    setView('map');
  }

  const done = progress.completed.length;

  return (
    <div className="app">
      <a className="skip" href="#main">تجاوزي إلى المحتوى</a>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <button type="button" className="brand" onClick={() => setView('home')}>
            <span className="logo" aria-hidden="true" />
            أبطال القيم
          </button>
          <nav aria-label="التنقل">
            <button type="button" className={view === 'map' ? 'on' : ''} onClick={() => setView('map')}>
              خريطة المغامرة
            </button>
          </nav>
          <div className="top-tools">
            <p className="progress-pill">
              {toAr(done)}/{toAr(LEVELS.length)}
            </p>
          </div>
        </div>
      </header>
      <main id="main" className="view-enter" key={`${view}-${view === 'level' ? levelId : ''}`}>
        {view === 'home' ? (
          <Home
            progress={progress}
            onStart={() => setView('map')}
            onMap={() => setView('map')}
            onFinale={() => setView('finale')}
          />
        ) : null}
        {view === 'map' ? (
          <MapView
            completed={progress.completed}
            freshId={freshId}
            onOpen={openLevel}
          />
        ) : null}
        {view === 'level' && level ? (
          <LevelPlay level={level} onExit={() => setView('map')} onNext={finishLevel} />
        ) : null}
        {view === 'finale' ? (
          <Finale progress={progress} onName={setHeroName} onMap={() => setView('map')} />
        ) : null}
      </main>
    </div>
  );
}
