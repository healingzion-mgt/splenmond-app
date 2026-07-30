# Splenmond — Play. Learn. Compete.

A blue-and-red game app with three games: Bible Trivia, Spelling Bee, and Puzzles (Word Scramble, Sliding Puzzle, Memory Match).

## What's included
- `index.html`, `assets/style.css`, `assets/app.js`, `assets/data.js` — the entire app (no backend needed to play)
- `assets/data.js` — 100 Bible trivia questions + spelling bee word list. Edit this file to add/change questions or words.
- `manifest.json` + `sw.js` — PWA install support (Android + iPhone)
- `assets/icon-192.png`, `assets/icon-512.png` — placeholder "SM" icons — swap for your real logo, same filenames

## How each game works
- **Bible Games**: pulls 10 random questions from the 100-question pool each round, free-text answers (a few accepted spelling variants per question), instant feedback, running score, high score saved on the device.
- **Spelling Bee**: speaks a word aloud (using the phone/browser's built-in text-to-speech), 30-second countdown per word, type the spelling before time runs out.
- **Puzzles**: three different styles —
  - *Word Scramble* — unscramble a shuffled word
  - *Sliding Puzzle* — classic 3×3 number slide, always shuffled to a solvable state
  - *Memory Match* — flip cards to find matching pairs

## Why no login/backend (for now)
This version keeps things fast and frictionless — anyone can open the link and play immediately, with high scores saved locally on their own device (localStorage). If you later want a **shared leaderboard** (so people can compete against each other, not just their own best score), that needs a backend (Worker + D1) similar to your other apps — just say the word and I'll add it.

## Deployment — same flow as your other apps
1. Push these files to a new GitHub repo (e.g. `splenmond-app`).
2. In Cloudflare: Workers & Pages → Create → Connect to Git → pick the repo.
3. Since there's no backend yet, this can deploy as a plain static site — no D1 database or `wrangler.jsonc` needed unless you add the shared leaderboard later.
4. Swap `assets/icon-192.png` / `icon-512.png` for your real Splenmond logo, same filenames.
5. Install it: Android → Chrome ⋮ menu → Add to Home screen. iPhone → Safari Share icon → Add to Home Screen.

## Easy ways to expand later
- Shared/global leaderboard (needs backend)
- Daily challenge mode (one question/word per day, streak tracking)
- More question categories inside Bible Games (people, places, miracles, numbers — already tagged loosely by content)
- Sound effects and haptic feedback on correct/incorrect answers
