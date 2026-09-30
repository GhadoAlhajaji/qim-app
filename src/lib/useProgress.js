import { useEffect, useState } from 'react';

const KEY = 'qiyam-heroes-progress-v1';

export const emptyProgress = {
  completed: [],
  heroName: '',
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...emptyProgress };
    const parsed = JSON.parse(raw);
    return {
      ...emptyProgress,
      heroName: typeof parsed.heroName === 'string' ? parsed.heroName : '',
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((id) => id >= 1 && id <= 9) : [],
    };
  } catch {
    return { ...emptyProgress };
  }
}

export function isUnlocked(id, completed) {
  return id === 1 || completed.includes(id - 1);
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      /* التخزين قد يكون محظوراً في بعض المتصفحات */
    }
  }, [progress]);

  function completeLevel(id) {
    setProgress((current) => ({
      ...current,
      completed: current.completed.includes(id)
        ? current.completed
        : [...current.completed, id].sort((a, b) => a - b),
    }));
  }

  function setHeroName(heroName) {
    setProgress((current) => ({ ...current, heroName }));
  }

  return { progress, completeLevel, setHeroName };
}
