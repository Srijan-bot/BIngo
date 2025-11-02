// Create a single AudioContext to be reused
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

const playSound = (freq: number, duration: number, type: OscillatorType, vol: number = 0.5) => {
  if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx.resume();
  }
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  oscillator.type = type;

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
};

export const playClickSound = () => {
  playSound(440, 0.05, 'triangle', 0.3);
};

export const playCallSound = () => {
  playSound(660, 0.1, 'sine', 0.4);
  setTimeout(() => playSound(880, 0.1, 'sine', 0.4), 100);
};

export const playMarkSound = () => {
  playSound(220, 0.1, 'square', 0.2);
};

export const playTurnSound = () => {
  playSound(523.25, 0.15, 'sine', 0.3); // C5
};

export const playWinSound = () => {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((note, index) => {
    setTimeout(() => playSound(note, 0.2, 'sine', 0.5), index * 150);
  });
};

export const playLoseSound = () => {
    const notes = [523.25, 392.00, 329.63, 261.63];
    notes.forEach((note, index) => {
        setTimeout(() => playSound(note, 0.2, 'sine', 0.5), index * 150);
    });
};
