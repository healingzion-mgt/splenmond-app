const $ = (sel) => document.querySelector(sel);
const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; };

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(str) {
  return (str || "").toLowerCase().trim().replace(/[.,!?'"]/g, "").replace(/\s+/g, " ");
}

function getHighScore(key) {
  return parseInt(localStorage.getItem(`splenmond_hs_${key}`) || "0", 10);
}
function setHighScore(key, score) {
  const current = getHighScore(key);
  if (score > current) localStorage.setItem(`splenmond_hs_${key}`, String(score));
  return Math.max(current, score);
}

// ---------------- SHELL ----------------
function renderShell(innerHTML) {
  $("#app").innerHTML = `
    <div class="topbar">
      <div class="brand"><div class="brand-mark">SM</div><span class="brand-name">Splenmond</span></div>
      <button id="sound-toggle" class="btn-ghost" style="width:auto;padding:8px 12px;border-radius:10px;font-size:16px;">${GameAudio.isMusicOn() ? "🔊" : "🔇"}</button>
    </div>
    <div class="screen">${innerHTML}</div>
    <div class="app-footer">Splenmond is owned and operated by HZ</div>
  `;
  $("#sound-toggle").onclick = () => {
    const on = GameAudio.toggleMusic();
    GameAudio.toggleSfx();
    $("#sound-toggle").textContent = on ? "🔊" : "🔇";
  };
}

function goHome() { renderHome(); }

// ---------------- HOME ----------------
function renderHome() {
  renderShell(`
    <div class="card" style="text-align:center;">
      <h2 style="margin:0 0 4px;">Play. Learn. Compete.</h2>
      <p style="color:var(--muted);margin:0;font-size:13px;">Three games, one app. Pick one to begin.</p>
    </div>
    <div class="game-tile bible" id="tile-bible">
      <div class="icon">📖</div>
      <div><div class="title">Bible Games</div><div class="sub">Best score: ${getHighScore("bible")} · 100+ questions</div></div>
    </div>
    <div class="game-tile spelling" id="tile-spelling">
      <div class="icon">🐝</div>
      <div><div class="title">Spelling Bee</div><div class="sub">Best score: ${getHighScore("spelling")} · Beat the 30s clock</div></div>
    </div>
    <div class="game-tile puzzle" id="tile-puzzle">
      <div class="icon">🧩</div>
      <div><div class="title">Puzzles</div><div class="sub">3 puzzle styles to try</div></div>
    </div>
  `);
  $("#tile-bible").onclick = () => { GameAudio.click(); startBibleGame(); };
  $("#tile-spelling").onclick = () => { GameAudio.click(); startSpellingGame(); };
  $("#tile-puzzle").onclick = () => { GameAudio.click(); renderPuzzleHub(); };
}

// ================= BIBLE TRIVIA =================
let bibleState = {};

function startBibleGame() {
  const pool = shuffleArray(BIBLE_QUESTIONS).slice(0, 10);
  bibleState = { questions: pool, index: 0, score: 0 };
  renderBibleQuestion();
}

function renderBibleQuestion() {
  const { questions, index, score } = bibleState;
  if (index >= questions.length) return renderBibleResult();
  const q = questions[index];
  renderShell(`
    <a class="back-link" id="back-home">← Home</a>
    <div class="score-strip">
      <span class="score-badge">Question ${index + 1} / ${questions.length}</span>
      <span class="score-badge">Score: ${score}</span>
    </div>
    <div class="card question-card">
      <div class="question-num">Bible Trivia</div>
      <div class="question-text">${q.q}</div>
      <input id="bible-answer" placeholder="Type your answer" autocomplete="off">
      <button class="btn" id="bible-submit">Submit Answer</button>
      <div class="feedback" id="bible-feedback"></div>
    </div>
  `);
  $("#back-home").onclick = goHome;
  const input = $("#bible-answer");
  input.focus();
  const submit = () => {
    const given = normalize(input.value);
    const correct = q.a.some((acc) => normalize(acc) === given);
    const fb = $("#bible-feedback");
    if (correct) {
      bibleState.score += 1;
      fb.textContent = "Correct! ✅";
      fb.className = "feedback correct";
      GameAudio.correct();
    } else {
      fb.textContent = `Not quite — answer: ${q.a[0]}`;
      fb.className = "feedback wrong";
      GameAudio.wrong();
    }
    $("#bible-submit").disabled = true;
    input.disabled = true;
    setTimeout(() => { bibleState.index += 1; renderBibleQuestion(); }, 1400);
  };
  $("#bible-submit").onclick = submit;
  input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
}

function renderBibleResult() {
  const { score, questions } = bibleState;
  const best = setHighScore("bible", score);
  GameAudio.win();
  renderShell(`
    <div class="card result-card">
      <div class="question-num">Round Complete</div>
      <div class="big-score">${score}/${questions.length}</div>
      <p style="color:var(--muted);">Best score: ${best}</p>
      <button class="btn" id="play-again">Play Again</button>
      <button class="btn btn-ghost" id="back-home2" style="margin-top:10px;">Back to Home</button>
    </div>
  `);
  $("#play-again").onclick = startBibleGame;
  $("#back-home2").onclick = goHome;
}

// ================= SPELLING BEE =================
let spellState = {};
let spellTimerHandle = null;

function startSpellingGame() {
  const words = shuffleArray(SPELLING_WORDS).slice(0, 10);
  spellState = { words, index: 0, score: 0 };
  renderSpellingWord();
}

function speakWord(word) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(word);
  utter.rate = 0.85;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function renderSpellingWord() {
  clearInterval(spellTimerHandle);
  const { words, index, score } = spellState;
  if (index >= words.length) return renderSpellingResult();
  const word = words[index];
  let timeLeft = 30;
  renderShell(`
    <a class="back-link" id="back-home">← Home</a>
    <div class="score-strip">
      <span class="score-badge">Word ${index + 1} / ${words.length}</span>
      <span class="score-badge">Score: ${score}</span>
    </div>
    <div class="card question-card">
      <div class="timer-ring" id="timer-ring">${timeLeft}</div>
      <div class="question-num">Spelling Bee</div>
      <div class="question-text">Listen and type the word</div>
      <button class="btn btn-blue" id="hear-word" style="margin-bottom:14px;">🔊 Hear Word Again</button>
      <input id="spell-answer" placeholder="Type the spelling" autocomplete="off">
      <button class="btn" id="spell-submit">Submit</button>
      <div class="feedback" id="spell-feedback"></div>
    </div>
  `);
  $("#back-home").onclick = () => { clearInterval(spellTimerHandle); goHome(); };
  speakWord(word);
  $("#hear-word").onclick = () => speakWord(word);
  const input = $("#spell-answer");
  input.focus();

  const finish = (timedOut) => {
    clearInterval(spellTimerHandle);
    const given = normalize(input.value);
    const correct = !timedOut && given === normalize(word);
    const fb = $("#spell-feedback");
    if (correct) {
      spellState.score += 1;
      fb.textContent = "Correct! ✅";
      fb.className = "feedback correct";
      GameAudio.correct();
    } else {
      fb.textContent = timedOut ? `Time's up — it was "${word}"` : `Not quite — it was "${word}"`;
      fb.className = "feedback wrong";
      GameAudio.wrong();
    }
    $("#spell-submit").disabled = true;
    input.disabled = true;
    setTimeout(() => { spellState.index += 1; renderSpellingWord(); }, 1500);
  };

  $("#spell-submit").onclick = () => finish(false);
  input.onkeydown = (e) => { if (e.key === "Enter") finish(false); };

  spellTimerHandle = setInterval(() => {
    timeLeft -= 1;
    const ring = $("#timer-ring");
    if (ring) {
      ring.textContent = timeLeft;
      if (timeLeft <= 10) { ring.classList.add("danger"); GameAudio.tick(); }
    }
    if (timeLeft <= 0) finish(true);
  }, 1000);
}

function renderSpellingResult() {
  const { score, words } = spellState;
  const best = setHighScore("spelling", score);
  GameAudio.win();
  renderShell(`
    <div class="card result-card">
      <div class="question-num">Round Complete</div>
      <div class="big-score">${score}/${words.length}</div>
      <p style="color:var(--muted);">Best score: ${best}</p>
      <button class="btn" id="play-again">Play Again</button>
      <button class="btn btn-ghost" id="back-home2" style="margin-top:10px;">Back to Home</button>
    </div>
  `);
  $("#play-again").onclick = startSpellingGame;
  $("#back-home2").onclick = goHome;
}

// ================= PUZZLES HUB =================
function renderPuzzleHub() {
  renderShell(`
    <a class="back-link" id="back-home">← Home</a>
    <h2 style="margin-top:0;">Puzzles</h2>
    <div class="game-tile puzzle" id="tile-scramble">
      <div class="icon">🔤</div>
      <div><div class="title">Word Scramble</div><div class="sub">Best: ${getHighScore("scramble")} · Unscramble the word</div></div>
    </div>
    <div class="game-tile puzzle" id="tile-slide">
      <div class="icon">🔢</div>
      <div><div class="title">Sliding Puzzle</div><div class="sub">Best moves: ${getHighScore("slide") || "—"} · Classic number slide</div></div>
    </div>
    <div class="game-tile puzzle" id="tile-memory">
      <div class="icon">🃏</div>
      <div><div class="title">Memory Match</div><div class="sub">Best moves: ${getHighScore("memory") || "—"} · Flip and find pairs</div></div>
    </div>
  `);
  $("#back-home").onclick = goHome;
  $("#tile-scramble").onclick = () => { GameAudio.click(); startScrambleGame(); };
  $("#tile-slide").onclick = () => { GameAudio.click(); startSlideGame(); };
  $("#tile-memory").onclick = () => { GameAudio.click(); startMemoryGame(); };
}

// ---- Word Scramble ----
let scrambleState = {};
function scrambleWord(word) {
  let letters;
  do { letters = shuffleArray(word.split("")); } while (letters.join("") === word);
  return letters.join("").toUpperCase();
}

function startScrambleGame() {
  const words = shuffleArray(SPELLING_WORDS.filter((w) => w.length <= 9)).slice(0, 8);
  scrambleState = { words, index: 0, score: 0 };
  renderScrambleWord();
}

function renderScrambleWord() {
  const { words, index, score } = scrambleState;
  if (index >= words.length) return renderScrambleResult();
  const word = words[index];
  renderShell(`
    <a class="back-link" id="back-home">← Home</a>
    <div class="score-strip">
      <span class="score-badge">Word ${index + 1} / ${words.length}</span>
      <span class="score-badge">Score: ${score}</span>
    </div>
    <div class="card question-card">
      <div class="question-num">Word Scramble</div>
      <div class="scramble-letters">${scrambleWord(word)}</div>
      <input id="scramble-answer" placeholder="Unscramble it" autocomplete="off">
      <button class="btn" id="scramble-submit">Submit</button>
      <div class="feedback" id="scramble-feedback"></div>
    </div>
  `);
  $("#back-home").onclick = goHome;
  const input = $("#scramble-answer");
  input.focus();
  const submit = () => {
    const correct = normalize(input.value) === normalize(word);
    const fb = $("#scramble-feedback");
    if (correct) { scrambleState.score += 1; fb.textContent = "Correct! ✅"; fb.className = "feedback correct"; GameAudio.correct(); }
    else { fb.textContent = `Answer: ${word}`; fb.className = "feedback wrong"; GameAudio.wrong(); }
    $("#scramble-submit").disabled = true;
    input.disabled = true;
    setTimeout(() => { scrambleState.index += 1; renderScrambleWord(); }, 1300);
  };
  $("#scramble-submit").onclick = submit;
  input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
}

function renderScrambleResult() {
  const { score, words } = scrambleState;
  const best = setHighScore("scramble", score);
  GameAudio.win();
  renderShell(`
    <div class="card result-card">
      <div class="question-num">Round Complete</div>
      <div class="big-score">${score}/${words.length}</div>
      <p style="color:var(--muted);">Best score: ${best}</p>
      <button class="btn" id="play-again">Play Again</button>
      <button class="btn btn-ghost" id="back-hub" style="margin-top:10px;">Back to Puzzles</button>
    </div>
  `);
  $("#play-again").onclick = startScrambleGame;
  $("#back-hub").onclick = renderPuzzleHub;
}

// ---- Sliding Puzzle (3x3) ----
let slideState = {};

function isSolvable(tiles) {
  // count inversions among the numbered tiles (ignore blank=9)
  const nums = tiles.filter((n) => n !== 9);
  let inv = 0;
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++) if (nums[i] > nums[j]) inv++;
  return inv % 2 === 0;
}

function newSlidePuzzle() {
  let tiles;
  do { tiles = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]); } while (!isSolvable(tiles) || tiles.join(",") === "1,2,3,4,5,6,7,8,9");
  return tiles;
}

function startSlideGame() {
  slideState = { tiles: newSlidePuzzle(), moves: 0 };
  renderSlideGame();
}

function renderSlideGame() {
  const { tiles, moves } = slideState;
  const solved = tiles.join(",") === "1,2,3,4,5,6,7,8,9";
  renderShell(`
    <a class="back-link" id="back-home">← Home</a>
    <div class="score-strip">
      <span class="score-badge">Sliding Puzzle</span>
      <span class="score-badge">Moves: ${moves}</span>
    </div>
    <div class="card">
      <div class="slide-grid" id="slide-grid"></div>
      ${solved ? `<div class="feedback correct" style="text-align:center;">Solved! 🎉</div>` : `<p style="color:var(--muted);font-size:12px;text-align:center;">Tap a tile next to the empty space to slide it.</p>`}
      <button class="btn btn-blue" id="shuffle-again" style="margin-top:12px;">New Puzzle</button>
    </div>
  `);
  $("#back-home").onclick = goHome;
  $("#shuffle-again").onclick = startSlideGame;
  const grid = $("#slide-grid");
  tiles.forEach((num, i) => {
    const tile = el(`<div class="slide-tile ${num === 9 ? "empty" : ""}">${num === 9 ? "" : num}</div>`);
    if (num !== 9 && !solved) {
      tile.onclick = () => {
        const blankIdx = tiles.indexOf(9);
        const row = Math.floor(i / 3), col = i % 3;
        const brow = Math.floor(blankIdx / 3), bcol = blankIdx % 3;
        const adjacent = (Math.abs(row - brow) === 1 && col === bcol) || (Math.abs(col - bcol) === 1 && row === brow);
        if (adjacent) {
          [tiles[i], tiles[blankIdx]] = [tiles[blankIdx], tiles[i]];
          slideState.moves += 1;
          GameAudio.click();
          if (tiles.join(",") === "1,2,3,4,5,6,7,8,9") { setHighScore("slide", 1); GameAudio.win(); }
          renderSlideGame();
        }
      };
    }
    grid.appendChild(tile);
  });
}

// ---- Memory Match ----
let memoryState = {};
const MEMORY_EMOJIS = ["⚡", "🔥", "⭐", "🎯", "🏆", "💎", "🎵", "🌙"];

function startMemoryGame() {
  const pairs = shuffleArray([...MEMORY_EMOJIS, ...MEMORY_EMOJIS]);
  memoryState = { cards: pairs.map((e) => ({ emoji: e, flipped: false, matched: false })), moves: 0, first: null, busy: false };
  renderMemoryGame();
}

function renderMemoryGame() {
  const { cards, moves } = memoryState;
  const won = cards.every((c) => c.matched);
  renderShell(`
    <a class="back-link" id="back-home">← Home</a>
    <div class="score-strip">
      <span class="score-badge">Memory Match</span>
      <span class="score-badge">Moves: ${moves}</span>
    </div>
    <div class="card">
      <div class="memory-grid" id="memory-grid"></div>
      ${won ? `<div class="feedback correct" style="text-align:center;">All matched! 🎉</div>` : ""}
      <button class="btn btn-blue" id="restart-memory" style="margin-top:12px;">New Game</button>
    </div>
  `);
  $("#back-home").onclick = goHome;
  $("#restart-memory").onclick = startMemoryGame;
  if (won) setHighScore("memory", 1);
  const grid = $("#memory-grid");
  cards.forEach((card, i) => {
    const el2 = el(`<div class="memory-card ${card.flipped || card.matched ? "flipped" : ""} ${card.matched ? "matched" : ""}">${card.flipped || card.matched ? card.emoji : ""}</div>`);
    el2.onclick = () => handleMemoryClick(i);
    grid.appendChild(el2);
  });
}

function handleMemoryClick(i) {
  const { cards, busy } = memoryState;
  if (busy || cards[i].flipped || cards[i].matched) return;
  cards[i].flipped = true;
  GameAudio.click();
  if (memoryState.first === null) {
    memoryState.first = i;
    renderMemoryGame();
  } else {
    memoryState.moves += 1;
    const firstIdx = memoryState.first;
    if (cards[firstIdx].emoji === cards[i].emoji) {
      cards[firstIdx].matched = true;
      cards[i].matched = true;
      memoryState.first = null;
      GameAudio.correct();
      if (cards.every((c) => c.matched)) GameAudio.win();
      renderMemoryGame();
    } else {
      memoryState.busy = true;
      GameAudio.wrong();
      renderMemoryGame();
      setTimeout(() => {
        cards[firstIdx].flipped = false;
        cards[i].flipped = false;
        memoryState.first = null;
        memoryState.busy = false;
        renderMemoryGame();
      }, 700);
    }
  }
}

// ---------------- BOOT ----------------
renderHome();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
