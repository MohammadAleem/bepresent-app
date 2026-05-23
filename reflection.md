# Reflection — BePresent Clone Submission

**Project:** BePresent: Screen Time & Focus Control  
**Developer:** Alex Johnson  
**Submitted:** May 2026

---

## What Was Easy

**UI structure came naturally.**  
Breaking the app into five tabs (Home, Focus, Stats, Rewards, Settings) mirrored how I personally think about a wellness app — what do I check first thing, what do I want to control, and what motivates me to keep going. That mental model translated directly into the component hierarchy.

**The gamification layer.**  
XP, levels, achievements, and a friends leaderboard are well-understood patterns from games. Mapping them to screen time habits — earning XP for finishing a Pomodoro session, losing a streak if you miss a day — felt intuitive. The hardest part was restraint: not adding too many mechanics at once.

**Visual design decisions.**  
Committing early to a dark theme with a single electric-green accent (#00E5A0) made every other decision easier. The color either means "good / on track" or it doesn't appear. That constraint created visual consistency without a design system document.

---

## What Was Difficult

**The Pomodoro timer state machine.**  
Managing the transitions between Focus → Break → Focus, while keeping the ring animation, dot tracker, and XP counter in sync, required careful use of `useEffect` and `useRef`. Race conditions between the interval and state updates caused the timer to skip seconds early on — fixed by always reading from the functional updater form of `setSecs`.

**Making charts without a library.**  
The bar chart (7-day view) and ring charts are pure SVG + CSS. Calculating `stroke-dashoffset` for the ring and animating bar heights with CSS keyframes took iteration. The payoff was a 0-dependency chart that renders perfectly and animates smoothly.

**Responsive feel inside a fixed phone shell.**  
The 390×780px shell needed to feel like a real mobile app — scrollable content, a sticky nav, smooth tab switching — without React Native. Using `overflow-y: auto` with hidden scrollbars and `flex-direction: column` on the shell got 90% of the way there. The remaining polish (momentum scrolling, tap highlights) required `-webkit-overflow-scrolling` and careful `active` state management.

**Avoiding generic AI aesthetics.**  
The brief specifically called out "tracking accuracy, gamification design, and habit-forming UX" as scoring criteria — not just "make it look nice." That pushed me to think about *why* each component exists in terms of behavior change, not just visual appeal. The streak counter, the confetti burst, the leaderboard — each one targets a specific psychological lever (loss aversion, reward, social comparison).

---

## What I Learned

**State architecture matters more than pixel polish.**  
The blocked-apps state being shared between the Home tab and the Focus tab (via a `Set` lifted to the root) was a small decision that made the whole app feel coherent. Users toggle Instagram off on Home and it's already blocked when they start a Focus session. That kind of invisible consistency is what separates a demo from a product.

**Animations should be purposeful, not decorative.**  
The glowing timer ring during an active session, the confetti on completion, the staggered `fadeUp` on tab switch — each animation signals something meaningful. The glow says "you're in focus mode, don't get distracted." The confetti says "you earned this." Animations that don't communicate anything were cut.

**A single strong constraint unlocks creativity.**  
"No external dependencies" was a self-imposed rule. It forced every chart, every toggle, every ring to be hand-crafted. The result is a codebase I understand completely and can explain line by line — which matters more than using the trendiest library.

---

## If I Had More Time

- Integrate the iOS Screen Time API / Android UsageStatsManager for real usage data
- Add a proper backend (streaks, XP, leaderboard) with user accounts
- Build a native app with React Native / Expo for actual app blocking
- Add audio: ambient focus sounds, a gentle chime at session end
- Weekly email digest with personalized insights

---

## Final Thought

Digital wellness is a hard UX problem because the competition — TikTok, Instagram, YouTube — has billion-dollar teams optimizing for the opposite outcome. The only way a focus app wins is by making *restraint* feel as rewarding as scrolling. That's what this project tried to do: make the green ring, the XP bar, and the streak flame feel as satisfying as a notification badge. Whether it succeeds is for the user to decide.
