# BePresent — Screen Time & Focus Control App

> A gamified digital wellness app that helps you reclaim your attention, block distracting apps, and build lasting focus habits — inspired by BePresent, FocusFlight, and Focus Friend.

---

## 📱 Overview

BePresent is a mobile-first React application that gives users full visibility into their screen time, lets them run structured focus sessions, and rewards healthy digital habits with XP, achievements, and leaderboards.

Built as a single-file React component with no external dependencies beyond Google Fonts — just drop it in and run.

---

## ✨ Features

### 🏠 Home Dashboard
- Daily screen time ring with live goal tracking
- Color feedback — green when under limit, red when over
- One-tap app blocker for 8 popular apps
- Streak counter and today's top apps by usage

### ⏱ Focus Timer
- Pomodoro-style timer with 25 / 45 / 90 minute presets
- Animated countdown ring — glows green during focus, amber on break
- 4-session Pomodoro dot tracker with confetti on completion
- Per-app blocking toggles synced across the whole app

### 📊 Stats & Reports
- 7-day screen time bar chart (over-limit days highlighted in red)
- Weekly summary: total time, daily average, goal-met days
- Category breakdown — Social, Video, Games, Focus
- Full app-by-app usage vs. limit visualization

### 🏅 Rewards & Gamification
- XP system with animated level progress bar
- Daily challenges with individual progress tracking
- 6 achievements (unlocked / locked states)
- Friends leaderboard with medal rankings

### ⚙️ Settings
- Profile card with level and XP
- Adjustable daily screen time goal
- Toggle switches: focus reminders, weekly reports, bedtime mode, sounds, dark theme

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#080C12` |
| Surface | `#0F1521` |
| Primary accent | `#00E5A0` (electric green) |
| Warning | `#FFB547` (amber) |
| Danger | `#FF5A7E` (rose) |
| Display font | Syne (700, 800) |
| Body font | DM Sans (300, 400, 500) |

- Dark-first mobile shell (390px × 780px)
- Animated ring charts, staggered fade-up entrances
- Glowing timer card during active focus session
- Confetti burst on Pomodoro completion

---

## 🚀 Getting Started

### Run in any React environment

```bash
# 1. Copy BePresent.jsx into your project
# 2. Install nothing — zero extra dependencies

# If starting fresh with Vite:
npm create vite@latest bepresent -- --template react
cd bepresent
# Replace src/App.jsx with BePresent.jsx
npm run dev
```

Or paste directly into [stackblitz.com](https://stackblitz.com) or the Claude artifact viewer.

---

## 🛠 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 (hooks only) |
| Styling | Plain CSS-in-JS (injected `<style>` tag) |
| Charts | Custom SVG ring + CSS bar charts |
| Fonts | Google Fonts (Syne + DM Sans) |
| Animations | CSS keyframes + React state |
| State | `useState`, `useEffect`, `useRef`, `useCallback` |

No Redux. No Tailwind. No chart library. Everything is hand-crafted.

---

## 📁 File Structure

```
BePresent.jsx        ← entire app, single file
README.md            ← this file
```

---

## 🗺 Roadmap

- [ ] Real device app-usage API integration (iOS Screen Time / Android Digital Wellbeing)
- [ ] Push notification reminders
- [ ] Cloud sync for streaks and XP
- [ ] Social challenges between friends
- [ ] Custom app categories and limit rules
- [ ] Offline-first with localStorage persistence

---

## 🏆 Submission Notes

This project was built as a **BePresent clone** for a digital wellness app design challenge.  
Scoring criteria addressed:

| Criterion | Implementation |
|-----------|---------------|
| Tracking accuracy | Per-app usage bars vs. configurable limits |
| Gamification design | XP, levels, achievements, daily challenges, leaderboard |
| Habit-forming UX | Streaks, Pomodoro sessions, confetti rewards, bedtime mode |

---

## 📄 License

MIT — free to use, modify, and build upon.
