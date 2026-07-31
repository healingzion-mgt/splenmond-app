@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --blue-deep: #0b1c3d;
  --blue-mid: #16305e;
  --blue-card: #142a52;
  --blue-line: #24417a;
  --red: #e8434e;
  --red-bright: #ff5a63;
  --text: #f4f6fb;
  --muted: #93a0bf;
  --gold: #ffcf4d;
  --radius: 18px;
  --shadow: 0 10px 26px rgba(0,0,0,0.35);
}

* { box-sizing: border-box; }
html, body { margin:0; padding:0; }

body {
  background: linear-gradient(180deg, #0e2049 0%, var(--blue-deep) 60%);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  -webkit-tap-highlight-color: transparent;
}

h1, h2, h3, .display { font-family: 'Baloo 2', sans-serif; font-weight: 700; }

a { color: inherit; text-decoration:none; }
button { font-family: inherit; cursor: pointer; }

#app { max-width: 480px; margin: 0 auto; min-height: 100vh; padding-bottom: 30px; }

.topbar { display:flex; align-items:center; justify-content:space-between; padding: 20px 20px 6px; }
.brand { display:flex; align-items:center; gap:10px; }
.brand-mark {
  width: 38px; height: 38px; border-radius: 12px;
  background: linear-gradient(135deg, var(--red-bright), var(--red));
  display:flex; align-items:center; justify-content:center;
  font-family:'Baloo 2'; font-weight:800; color:#fff; font-size:16px;
}
.brand-name { font-family:'Baloo 2'; font-size: 19px; }

.screen { padding: 10px 20px 30px; animation: fadeIn .25s ease; }
@keyframes fadeIn { from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:none;} }

.card {
  background: linear-gradient(160deg, var(--blue-mid), var(--blue-card));
  border: 1px solid var(--blue-line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 20px;
  margin-bottom: 16px;
}

.game-tile {
  display:flex; align-items:center; gap:14px;
  padding: 18px;
  border-radius: var(--radius);
  margin-bottom: 14px;
  box-shadow: var(--shadow);
  border: 1px solid var(--blue-line);
}
.game-tile.bible { background: linear-gradient(135deg, #1a3568, #142a52); }
.game-tile.spelling { background: linear-gradient(135deg, #6e1f28, #4a1620); }
.game-tile.puzzle { background: linear-gradient(135deg, #1a3568, #142a52); }
.game-tile .icon { font-size: 30px; }
.game-tile .title { font-family:'Baloo 2'; font-size:17px; margin-bottom:2px; }
.game-tile .sub { color: var(--muted); font-size:12.5px; }

.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  background: linear-gradient(135deg, var(--red-bright), var(--red));
  color: #fff; font-weight:700; border:none; border-radius: 14px;
  padding: 14px 18px; width:100%; font-size:15px;
  box-shadow: 0 6px 16px rgba(232,67,78,0.35);
  transition: transform .12s ease;
}
.btn:active { transform: scale(0.97); }
.btn:disabled { opacity:0.5; box-shadow:none; }
.btn-blue { background: linear-gradient(135deg, #2f57a8, #1c3d78); box-shadow: 0 6px 16px rgba(28,61,120,0.4); }
.btn-outline { background: transparent; border: 1.5px solid var(--red-bright); color: var(--red-bright); box-shadow:none; }
.btn-ghost { background: rgba(255,255,255,0.06); color: var(--text); box-shadow:none; }

input, select {
  width:100%; background: rgba(255,255,255,0.06); border: 1.5px solid var(--blue-line);
  color: var(--text); border-radius: 12px; padding: 13px 14px; font-size:16px;
  margin-bottom:12px; font-family:inherit; text-align:center;
}
input:focus { outline: 2px solid var(--red-bright); }

.question-card { text-align:center; padding: 26px 20px; }
.question-num { color: var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; }
.question-text { font-size: 19px; font-weight:600; line-height:1.4; margin-bottom: 22px; }

.timer-ring {
  width: 78px; height:78px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  margin: 0 auto 18px;
  font-family:'Baloo 2'; font-size:24px; font-weight:700;
  border: 5px solid var(--blue-line);
  color: var(--gold);
}
.timer-ring.danger { border-color: var(--red-bright); color: var(--red-bright); animation: pulse 0.6s infinite; }
@keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.06);} }

.feedback { font-weight:700; font-size:16px; margin-top:10px; min-height:22px; }
.feedback.correct { color: #6be08a; }
.feedback.wrong { color: var(--red-bright); }

.score-strip { display:flex; justify-content:space-between; align-items:center; padding: 10px 4px; margin-bottom: 4px;}
.score-badge { font-family:'Baloo 2'; color: var(--gold); font-size:15px; }

.result-card { text-align:center; padding: 34px 20px; }
.result-card .big-score { font-family:'Baloo 2'; font-size:48px; color: var(--gold); margin: 10px 0; }

/* puzzle: memory match */
.memory-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; margin: 14px 0; }
.memory-card {
  aspect-ratio:1; border-radius:14px; background: var(--blue-mid);
  border: 1px solid var(--blue-line);
  display:flex; align-items:center; justify-content:center; font-size:26px;
  transition: transform .25s ease;
}
.memory-card.flipped { background: linear-gradient(135deg, var(--red-bright), var(--red)); }
.memory-card.matched { background: #1e5a3a; opacity:0.6; }

/* puzzle: sliding tiles */
.slide-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin: 14px 0; }
.slide-tile {
  aspect-ratio:1; border-radius:12px; background: linear-gradient(135deg, var(--red-bright), var(--red));
  display:flex; align-items:center; justify-content:center;
  font-family:'Baloo 2'; font-size:26px; font-weight:700; color:#fff;
}
.slide-tile.empty { background: transparent; border: 1px dashed var(--blue-line); }

/* puzzle: word scramble */
.scramble-letters { font-family:'Baloo 2'; font-size:32px; letter-spacing:.15em; color: var(--gold); margin: 16px 0; }

.app-footer { text-align:center; font-size:11px; color: var(--muted); padding: 14px 20px 6px; }

.spinner { width:24px; height:24px; border-radius:50%; border:3px solid rgba(232,67,78,0.25); border-top-color: var(--red-bright); animation: spin .7s linear infinite; margin: 30px auto;}
@keyframes spin { to { transform: rotate(360deg); } }

.back-link { display:inline-block; margin-bottom:14px; color: var(--muted); font-size:14px; }

::-webkit-scrollbar { display:none; }
