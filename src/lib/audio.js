let context;

function audioContext() {
  if (!context) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    context = new Ctx();
  }
  return context;
}

function tone(ctx, freq, time, duration, type = 'sine', volume = 0.07) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(volume, time + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(time);
  oscillator.stop(time + duration + 0.02);
}

const TUNES = {
  tap: [[523, 0, 0.08, 'triangle', 0.04]],
  ok: [
    [523, 0, 0.12, 'sine', 0.06],
    [659, 0.09, 0.14, 'sine', 0.06],
    [784, 0.18, 0.18, 'triangle', 0.05],
  ],
  hint: [[349, 0, 0.16, 'sine', 0.04], [311, 0.1, 0.18, 'sine', 0.035]],
  fanfare: [
    [523, 0, 0.16, 'triangle', 0.06],
    [659, 0.12, 0.16, 'triangle', 0.06],
    [784, 0.24, 0.16, 'triangle', 0.06],
    [1046, 0.36, 0.28, 'sine', 0.05],
  ],
  unlock: [
    [392, 0, 0.14, 'triangle', 0.05],
    [494, 0.1, 0.14, 'triangle', 0.05],
    [587, 0.2, 0.16, 'triangle', 0.05],
    [784, 0.32, 0.26, 'sine', 0.05],
  ],
};

export function playSound(kind, enabled) {
  if (!enabled) return;
  const ctx = audioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  const now = ctx.currentTime + 0.01;
  (TUNES[kind] || TUNES.tap).forEach(([freq, offset, duration, type, volume]) => {
    tone(ctx, freq, now + offset, duration, type, volume);
  });
}
