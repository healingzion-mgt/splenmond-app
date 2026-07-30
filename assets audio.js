const GameAudio = (() => {
  let ctx = null;
  let musicOn = localStorage.getItem("splenmond_music") !== "off";
  let sfxOn = localStorage.getItem("splenmond_sfx") !== "off";
  let musicTimer = null;
  let musicStep = 0;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, duration, type = "sine", gainVal = 0.12, delay = 0) {
    if (!sfxOn) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, c.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(gainVal, c.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + duration);
    osc.connect(gain).connect(c.destination);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + duration + 0.05);
  }

  function musicTone(freq, duration, delay) {
    if (!musicOn) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, c.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.045, c.currentTime + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + duration);
    osc.connect(gain).connect(c.destination);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + duration + 0.1);
  }

  // gentle looping arpeggio, blue/red "game lobby" feel
  const PATTERN = [261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 440.0, 349.23];

  function startMusic() {
    if (musicTimer || !musicOn) return;
    musicStep = 0;
    musicTimer = setInterval(() => {
      musicTone(PATTERN[musicStep % PATTERN.length], 0.5, 0);
      musicStep++;
    }, 420);
  }

  function stopMusic() {
    clearInterval(musicTimer);
    musicTimer = null;
  }

  return {
    click: () => tone(600, 0.08, "square", 0.05),
    correct: () => { tone(523.25, 0.12, "sine", 0.12); tone(783.99, 0.16, "sine", 0.1, 0.1); },
    wrong: () => tone(170, 0.28, "sawtooth", 0.08),
    win: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.22, "sine", 0.12, i * 0.11)),
    tick: () => tone(880, 0.05, "square", 0.035),
    startMusic,
    stopMusic,
    unlock: () => getCtx(),
    isMusicOn: () => musicOn,
    isSfxOn: () => sfxOn,
    toggleMusic() {
      musicOn = !musicOn;
      localStorage.setItem("splenmond_music", musicOn ? "on" : "off");
      if (musicOn) startMusic(); else stopMusic();
      return musicOn;
    },
    toggleSfx() {
      sfxOn = !sfxOn;
      localStorage.setItem("splenmond_sfx", sfxOn ? "on" : "off");
      return sfxOn;
    },
  };
})();

// Browsers block audio until a user gesture — unlock + start music on first tap anywhere.
window.addEventListener("click", function unlockOnce() {
  GameAudio.unlock();
  GameAudio.startMusic();
  window.removeEventListener("click", unlockOnce);
}, { once: true });
