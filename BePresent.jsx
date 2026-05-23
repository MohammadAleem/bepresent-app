import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #080C12;
    --surface:   #0F1521;
    --card:      #151D2E;
    --card2:     #1A2338;
    --border:    rgba(255,255,255,0.07);
    --green:     #00E5A0;
    --green-dim: rgba(0,229,160,0.12);
    --amber:     #FFB547;
    --amber-dim: rgba(255,181,71,0.12);
    --rose:      #FF5A7E;
    --rose-dim:  rgba(255,90,126,0.12);
    --blue:      #3B82F6;
    --blue-dim:  rgba(59,130,246,0.12);
    --violet:    #A78BFA;
    --text:      #E8EDF5;
    --muted:     #6B7A99;
    --font-h:    'Syne', sans-serif;
    --font-b:    'DM Sans', sans-serif;
    --r:         16px;
    --r-sm:      10px;
  }

  html, body, #root { height: 100%; background: var(--bg); }

  body { font-family: var(--font-b); color: var(--text); -webkit-font-smoothing: antialiased; }

  /* ── Phone shell ── */
  .shell {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; padding: 24px;
    background: radial-gradient(ellipse 70% 60% at 50% -10%, rgba(0,229,160,0.08) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 90% 80%, rgba(59,130,246,0.06) 0%, transparent 60%), var(--bg);
  }

  .phone {
    width: 390px; min-height: 780px; max-height: 900px;
    background: var(--surface);
    border-radius: 44px;
    border: 1.5px solid var(--border);
    box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset,
                0 60px 120px rgba(0,229,160,0.04);
    display: flex; flex-direction: column; overflow: hidden;
    position: relative;
  }

  /* ── Status bar ── */
  .status-bar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 28px 6px;
    font-family: var(--font-h); font-size: 12px; font-weight: 600; color: var(--muted);
    flex-shrink: 0;
  }
  .status-bar .notch {
    width: 120px; height: 6px; background: #0a0a0a;
    border-radius: 4px;
  }

  /* ── Screen area ── */
  .screen {
    flex: 1; overflow-y: auto; overflow-x: hidden;
    scrollbar-width: none; padding: 0 20px 20px;
  }
  .screen::-webkit-scrollbar { display: none; }

  /* ── Bottom nav ── */
  .nav {
    display: flex; justify-content: space-around; align-items: center;
    padding: 14px 20px 22px;
    background: rgba(15,21,33,0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  .nav-btn {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-family: var(--font-b); font-size: 10px;
    transition: color .2s; padding: 0;
  }
  .nav-btn.active { color: var(--green); }
  .nav-btn svg { width: 22px; height: 22px; }
  .nav-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--green); opacity: 0; margin: 0 auto; transition: opacity .2s; }
  .nav-btn.active .nav-dot { opacity: 1; }

  /* ── Shared components ── */
  .tag {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 500; font-family: var(--font-h);
  }
  .tag-green { background: var(--green-dim); color: var(--green); }
  .tag-amber { background: var(--amber-dim); color: var(--amber); }
  .tag-rose  { background: var(--rose-dim);  color: var(--rose);  }
  .tag-blue  { background: var(--blue-dim);  color: var(--blue);  }

  .card {
    background: var(--card); border-radius: var(--r);
    border: 1px solid var(--border);
    padding: 18px;
  }
  .card + .card { margin-top: 12px; }

  .section-title {
    font-family: var(--font-h); font-size: 18px; font-weight: 700;
    letter-spacing: -0.4px; color: var(--text);
  }
  .section-sub {
    font-size: 13px; color: var(--muted); margin-top: 2px;
  }

  /* ── Progress ring ── */
  .ring-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; }
  .ring-text { position: absolute; text-align: center; }

  /* ── Bar ── */
  .bar-track {
    height: 6px; border-radius: 6px; background: rgba(255,255,255,0.06); overflow: hidden;
  }
  .bar-fill {
    height: 100%; border-radius: 6px;
    transition: width .6s cubic-bezier(.4,0,.2,1);
  }

  /* ── Btn ── */
  .btn {
    border: none; cursor: pointer; border-radius: 14px;
    font-family: var(--font-h); font-weight: 700;
    transition: transform .15s, opacity .15s, box-shadow .15s;
  }
  .btn:active { transform: scale(0.96); }
  .btn-green {
    background: linear-gradient(135deg, #00E5A0, #00C980);
    color: #020E07;
    box-shadow: 0 8px 24px rgba(0,229,160,0.3);
  }
  .btn-green:hover { box-shadow: 0 12px 30px rgba(0,229,160,0.4); }
  .btn-outline {
    background: transparent; border: 1.5px solid var(--border);
    color: var(--muted);
  }
  .btn-rose {
    background: linear-gradient(135deg, #FF5A7E, #E03060);
    color: #fff;
    box-shadow: 0 8px 24px rgba(255,90,126,0.3);
  }

  /* ── Animations ── */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
  @keyframes pulse    { 0%,100% { opacity:1 } 50% { opacity:.5 } }
  @keyframes breathe  { 0%,100% { transform:scale(1) } 50% { transform:scale(1.04) } }
  @keyframes spin     { to { transform:rotate(360deg) } }
  @keyframes shimmer  { 0% { background-position:-400px 0 } 100% { background-position:400px 0 } }
  @keyframes confetti { 0% { transform:translateY(0) rotate(0); opacity:1 } 100% { transform:translateY(-200px) rotate(720deg); opacity:0 } }
  @keyframes growIn   { from { transform:scaleX(0) } to { transform:scaleX(1) } }
  @keyframes glow     { 0%,100% { box-shadow:0 0 20px rgba(0,229,160,.3) } 50% { box-shadow:0 0 40px rgba(0,229,160,.6) } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:none } }

  .fade-up  { animation: fadeUp .4s ease both; }
  .slide-in { animation: slideIn .35s ease both; }

  /* ─── HOME tab ─────────────────────────────────────────────────── */
  .hero-greeting { font-family:var(--font-h); font-size:13px; color:var(--muted); margin-bottom:2px; }
  .hero-name { font-family:var(--font-h); font-size:26px; font-weight:800; letter-spacing:-0.6px; }
  .hero-streak {
    display:flex; align-items:center; gap:6px;
    padding: 8px 14px; border-radius: 30px;
    background: linear-gradient(135deg, rgba(255,181,71,0.15), rgba(255,90,126,0.08));
    border: 1px solid rgba(255,181,71,0.2);
    font-family:var(--font-h); font-size:13px; font-weight:700; color:var(--amber);
  }

  .big-ring-card {
    background: linear-gradient(145deg, #151D2E, #111827);
    border-radius: var(--r);
    border: 1px solid var(--border);
    padding: 24px 18px;
    display: flex; flex-direction: column; align-items: center; gap: 16px;
    position: relative; overflow: hidden;
  }
  .big-ring-card::before {
    content:''; position:absolute; top:-60px; right:-60px;
    width:200px; height:200px; border-radius:50%;
    background: radial-gradient(circle, rgba(0,229,160,0.08) 0%, transparent 70%);
  }

  .ring-stats { display:flex; gap:24px; }
  .ring-stat { text-align:center; }
  .ring-stat-val { font-family:var(--font-h); font-size:18px; font-weight:800; }
  .ring-stat-lbl { font-size:11px; color:var(--muted); margin-top:2px; }

  .quick-apps { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-top:4px; }
  .quick-app-btn {
    display:flex; flex-direction:column; align-items:center; gap:6px;
    background:var(--card2); border:1px solid var(--border);
    border-radius:14px; padding:12px 6px; cursor:pointer;
    transition: border-color .2s, background .2s;
  }
  .quick-app-btn:hover { border-color:rgba(0,229,160,0.3); background:rgba(0,229,160,0.05); }
  .quick-app-btn.blocked { border-color:rgba(255,90,126,0.3); background:var(--rose-dim); }
  .app-icon { font-size:24px; }
  .app-label { font-size:10px; color:var(--muted); font-family:var(--font-h); }

  /* ─── FOCUS tab ─────────────────────────────────────────────────── */
  .focus-timer-card {
    background: linear-gradient(160deg, #0D1A14, #0F1521);
    border: 1px solid rgba(0,229,160,0.15);
    border-radius: 24px;
    padding: 28px 20px;
    display:flex; flex-direction:column; align-items:center; gap:20px;
    position:relative; overflow:hidden;
  }
  .focus-timer-card.running {
    animation: glow 3s ease-in-out infinite;
    border-color: rgba(0,229,160,0.35);
  }
  .focus-timer-card::after {
    content:''; position:absolute; bottom:-80px; left:50%; transform:translateX(-50%);
    width:240px; height:160px;
    background: radial-gradient(ellipse, rgba(0,229,160,0.12) 0%, transparent 70%);
    pointer-events:none;
  }

  .timer-display {
    font-family:var(--font-h); font-size:64px; font-weight:800;
    letter-spacing:-2px; color:var(--green);
    text-shadow: 0 0 40px rgba(0,229,160,0.4);
  }
  .timer-display.breaking { color:var(--amber); text-shadow:0 0 40px rgba(255,181,71,0.4); }
  .timer-label { font-family:var(--font-h); font-size:13px; color:var(--muted); letter-spacing:2px; text-transform:uppercase; }

  .focus-controls { display:flex; gap:12px; width:100%; }

  .session-presets { display:flex; gap:8px; }
  .preset-chip {
    padding:6px 14px; border-radius:20px; border:1.5px solid var(--border);
    background:transparent; color:var(--muted); font-family:var(--font-h); font-size:12px; font-weight:600;
    cursor:pointer; transition:all .2s;
  }
  .preset-chip.active {
    border-color:var(--green); color:var(--green); background:var(--green-dim);
  }

  .pomodoro-dots { display:flex; gap:8px; }
  .p-dot { width:10px; height:10px; border-radius:50%; background:rgba(255,255,255,0.1); transition:all .3s; }
  .p-dot.done { background:var(--green); box-shadow:0 0 8px rgba(0,229,160,0.5); }
  .p-dot.current { background:var(--green); animation:pulse 1.5s ease-in-out infinite; }

  .blocked-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .blocked-app-row {
    display:flex; align-items:center; gap:10px;
    background:var(--card2); border-radius:var(--r-sm); padding:10px 12px;
    border: 1px solid var(--border);
  }
  .blocked-app-row.is-blocked { border-color:rgba(255,90,126,0.3); background:var(--rose-dim); }

  /* ─── STATS tab ─────────────────────────────────────────────────── */
  .chart-bar-row { display:flex; align-items:flex-end; gap:5px; height:80px; }
  .chart-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
  .chart-bar {
    width:100%; border-radius:5px 5px 0 0;
    min-height:4px;
    background: linear-gradient(to top, var(--green), rgba(0,229,160,0.5));
    transition:height .5s cubic-bezier(.4,0,.2,1);
  }
  .chart-bar.today { background: linear-gradient(to top, #00E5A0, #00FFB3); box-shadow:0 -4px 12px rgba(0,229,160,0.4); }
  .chart-bar.over  { background: linear-gradient(to top, var(--rose), rgba(255,90,126,0.5)); }
  .chart-label { font-size:10px; color:var(--muted); }

  .app-stat-row { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
  .app-stat-row:last-child { border-bottom:none; }
  .app-stat-icon { font-size:22px; width:38px; height:38px; display:flex; align-items:center; justify-content:center; background:var(--card2); border-radius:10px; }
  .app-stat-info { flex:1; }
  .app-stat-name { font-family:var(--font-h); font-size:13px; font-weight:600; }
  .app-stat-time { font-size:11px; color:var(--muted); margin-top:2px; }
  .app-stat-bar { flex:1; }

  /* ─── REWARDS tab ─────────────────────────────────────────────────── */
  .xp-bar-wrap {
    background: var(--card); border-radius:var(--r); padding:16px 18px;
    border:1px solid var(--border);
  }
  .xp-numbers { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px; }
  .xp-current { font-family:var(--font-h); font-size:28px; font-weight:800; color:var(--amber); }
  .xp-next { font-size:12px; color:var(--muted); }
  .xp-track { height:10px; border-radius:10px; background:rgba(255,255,255,0.06); overflow:hidden; }
  .xp-fill {
    height:100%; border-radius:10px;
    background: linear-gradient(90deg, #FFB547, #FF8C42);
    box-shadow:0 0 16px rgba(255,181,71,0.4);
    animation: growIn .8s cubic-bezier(.4,0,.2,1) both;
    transform-origin:left;
  }
  .level-badge {
    display:inline-flex; align-items:center; gap:6px;
    padding:4px 12px; border-radius:20px;
    background:linear-gradient(135deg,rgba(255,181,71,0.2),rgba(255,140,66,0.1));
    border:1px solid rgba(255,181,71,0.3);
    font-family:var(--font-h); font-size:12px; font-weight:700; color:var(--amber);
  }

  .achievement-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .achievement {
    background:var(--card2); border-radius:14px; padding:14px;
    border:1px solid var(--border);
    display:flex; flex-direction:column; gap:8px;
    transition:border-color .2s;
  }
  .achievement.unlocked { border-color:rgba(0,229,160,0.3); background:rgba(0,229,160,0.04); }
  .achievement.locked   { opacity:0.55; }
  .ach-icon { font-size:28px; }
  .ach-title { font-family:var(--font-h); font-size:12px; font-weight:700; }
  .ach-desc  { font-size:11px; color:var(--muted); line-height:1.4; }
  .ach-xp    { font-family:var(--font-h); font-size:11px; color:var(--amber); font-weight:700; }

  .challenge-card {
    border-radius:var(--r); padding:16px;
    border:1px solid var(--border);
    background: linear-gradient(135deg, var(--card), var(--card2));
    display:flex; gap:14px; align-items:center;
    margin-bottom:10px;
  }
  .challenge-icon { font-size:32px; flex-shrink:0; }
  .challenge-info { flex:1; }
  .challenge-title { font-family:var(--font-h); font-size:13px; font-weight:700; margin-bottom:4px; }
  .challenge-sub   { font-size:12px; color:var(--muted); margin-bottom:8px; }

  /* confetti pieces */
  .confetti-piece {
    position:fixed; pointer-events:none; z-index:9999;
    width:8px; height:8px; border-radius:2px;
    animation: confetti 1.2s ease-in forwards;
  }

  /* toggle */
  .toggle {
    width:42px; height:24px; border-radius:12px; cursor:pointer;
    background:rgba(255,255,255,0.08); border:none; position:relative;
    transition:background .25s; flex-shrink:0;
  }
  .toggle.on { background:var(--green); }
  .toggle::after {
    content:''; position:absolute; top:3px; left:3px;
    width:18px; height:18px; border-radius:50%; background:#fff;
    transition:left .25s; box-shadow:0 1px 4px rgba(0,0,0,0.3);
  }
  .toggle.on::after { left:21px; }

  /* misc */
  .divider { height:1px; background:var(--border); margin:16px 0; }
  .row { display:flex; align-items:center; gap:10px; }
  .row-between { display:flex; align-items:center; justify-content:space-between; }
`;

// ─── Data ──────────────────────────────────────────────────────────────────
const APPS = [
  { id:"instagram", label:"Instagram", icon:"📸", color:"#E1306C", category:"social",   time:87, limit:60  },
  { id:"tiktok",    label:"TikTok",    icon:"🎵", color:"#FF0050", category:"social",   time:112,limit:45  },
  { id:"twitter",   label:"Twitter",   icon:"🐦", color:"#1DA1F2", category:"social",   time:34, limit:30  },
  { id:"youtube",   label:"YouTube",   icon:"📺", color:"#FF0000", category:"video",    time:56, limit:90  },
  { id:"whatsapp",  label:"WhatsApp",  icon:"💬", color:"#25D366", category:"social",   time:28, limit:60  },
  { id:"reddit",    label:"Reddit",    icon:"🔴", color:"#FF4500", category:"social",   time:19, limit:30  },
  { id:"netflix",   label:"Netflix",   icon:"🎬", color:"#E50914", category:"video",    time:45, limit:120 },
  { id:"games",     label:"Games",     icon:"🎮", color:"#A78BFA", category:"games",    time:67, limit:60  },
];

const WEEK_DATA = [
  { day:"M",  mins:180 },
  { day:"T",  mins:210 },
  { day:"W",  mins:140 },
  { day:"T",  mins:260 },
  { day:"F",  mins:310 },
  { day:"S",  mins:195 },
  { day:"S",  mins:160 },  // today
];

const ACHIEVEMENTS = [
  { id:"a1", icon:"🔥", title:"7-Day Streak",  desc:"Stay focused 7 days in a row",   xp:200, unlocked:true  },
  { id:"a2", icon:"🏆", title:"Focus Master",  desc:"Complete 10 Pomodoro sessions",   xp:300, unlocked:true  },
  { id:"a3", icon:"🌙", title:"Night Owl",      desc:"No phone after 10 PM for 5 days", xp:250, unlocked:false },
  { id:"a4", icon:"⚡", title:"Speed Limiter",  desc:"Stay under daily limit 3 days",  xp:150, unlocked:true  },
  { id:"a5", icon:"🧘", title:"Zen Mode",       desc:"Complete 5 mindful breaks",       xp:100, unlocked:false },
  { id:"a6", icon:"📵", title:"Unplugged",      desc:"No social media for 24 hours",    xp:400, unlocked:false },
];

const CHALLENGES = [
  { icon:"🌅", title:"Morning No-Phone Zone", sub:"No apps for 1hr after waking", progress:70, xp:50,  color:"var(--amber)" },
  { icon:"📚", title:"Deep Work Sprint",       sub:"2hr uninterrupted focus today", progress:40, xp:100, color:"var(--green)" },
  { icon:"🚶", title:"Walk & Talk",            sub:"15 min walk without your phone", progress:0,  xp:75,  color:"var(--violet)" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
const fmtTime = (mins) => {
  const h = Math.floor(mins / 60), m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

const fmtSecs = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ─── Ring SVG ─────────────────────────────────────────────────────────────
function Ring({ pct, size=120, stroke=9, color="var(--green)", bg="rgba(255,255,255,0.06)", children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 1));
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="ring-text">{children}</div>
    </div>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────
function spawnConfetti() {
  const colors = ["#00E5A0","#FFB547","#FF5A7E","#A78BFA","#3B82F6"];
  const container = document.getElementById("confetti-root");
  if (!container) return;
  for (let i = 0; i < 24; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.cssText = `
      left:${30 + Math.random()*40}vw; top:${40+Math.random()*20}vh;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-delay:${Math.random()*0.4}s;
      animation-duration:${0.8+Math.random()*0.6}s;
      transform:rotate(${Math.random()*360}deg);
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: HOME
// ═══════════════════════════════════════════════════════════════════════════
function HomeTab({ blockedApps, toggleBlock }) {
  const todayTotal = APPS.reduce((s, a) => s + a.time, 0);
  const dailyGoal = 240;
  const pct = todayTotal / dailyGoal;
  const overLimit = APPS.filter(a => a.time > a.limit).length;

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Header */}
      <div className="row-between fade-up" style={{ marginBottom: 18 }}>
        <div>
          <div className="hero-greeting">Good morning 👋</div>
          <div className="hero-name">Alex</div>
        </div>
        <div className="hero-streak">🔥 14 days</div>
      </div>

      {/* Big ring */}
      <div className="big-ring-card fade-up" style={{ animationDelay: ".05s", marginBottom: 12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:24 }}>
          <Ring pct={pct} size={130} stroke={11} color={pct > 1 ? "var(--rose)" : "var(--green)"}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font-h)", fontSize:22, fontWeight:800, color: pct>1?"var(--rose)":"var(--green)" }}>
                {fmtTime(todayTotal)}
              </div>
              <div style={{ fontSize:10, color:"var(--muted)" }}>of {fmtTime(dailyGoal)}</div>
            </div>
          </Ring>
          <div className="ring-stats">
            <div className="ring-stat">
              <div className="ring-stat-val" style={{ color:"var(--amber)" }}>{overLimit}</div>
              <div className="ring-stat-lbl">Over limit</div>
            </div>
            <div className="ring-stat">
              <div className="ring-stat-val" style={{ color:"var(--green)" }}>14</div>
              <div className="ring-stat-lbl">Streak</div>
            </div>
            <div className="ring-stat">
              <div className="ring-stat-val" style={{ color:"var(--violet)" }}>1240</div>
              <div className="ring-stat-lbl">Points</div>
            </div>
          </div>
        </div>
        <div style={{ width:"100%" }}>
          <div className="row-between" style={{ marginBottom:6, fontSize:12, color:"var(--muted)" }}>
            <span style={{ fontFamily:"var(--font-h)", fontWeight:600 }}>Daily Goal</span>
            <span>{Math.round(pct*100)}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{
              width:`${Math.min(pct*100,100)}%`,
              background: pct>1?"linear-gradient(90deg,var(--rose),#FF8C9E)":"linear-gradient(90deg,var(--green),#00FFBA)"
            }} />
          </div>
        </div>
      </div>

      {/* Quick app toggles */}
      <div className="card fade-up" style={{ animationDelay:".1s", marginBottom:12 }}>
        <div className="row-between" style={{ marginBottom:14 }}>
          <div>
            <div className="section-title" style={{ fontSize:15 }}>App Limits</div>
            <div className="section-sub">Tap to block during focus</div>
          </div>
          <span className="tag tag-rose">{blockedApps.size} blocked</span>
        </div>
        <div className="quick-apps">
          {APPS.map(app => (
            <button key={app.id}
              className={`quick-app-btn ${blockedApps.has(app.id) ? "blocked" : ""}`}
              onClick={() => toggleBlock(app.id)}
            >
              <span className="app-icon">{app.icon}</span>
              <span className="app-label">{app.label}</span>
              {app.time > app.limit && (
                <span style={{ fontSize:9, color:"var(--rose)", fontFamily:"var(--font-h)" }}>OVER</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Today's top apps */}
      <div className="card fade-up" style={{ animationDelay:".15s" }}>
        <div className="section-title" style={{ fontSize:15, marginBottom:14 }}>Top Apps Today</div>
        {APPS.sort((a,b)=>b.time-a.time).slice(0,4).map((app, i) => (
          <div key={app.id} className="app-stat-row" style={{ animationDelay:`${.2+i*.06}s` }}>
            <div className="app-stat-icon">{app.icon}</div>
            <div className="app-stat-info">
              <div className="app-stat-name">{app.label}</div>
              <div className="app-stat-time">{fmtTime(app.time)} · limit {fmtTime(app.limit)}</div>
            </div>
            <div style={{ width:70 }}>
              <div className="bar-track">
                <div className="bar-fill" style={{
                  width:`${Math.min((app.time/app.limit)*100,100)}%`,
                  background: app.time>app.limit ? "var(--rose)" : app.color
                }} />
              </div>
            </div>
            {app.time > app.limit && <span className="tag tag-rose" style={{ fontSize:9 }}>!</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: FOCUS
// ═══════════════════════════════════════════════════════════════════════════
const PRESETS = [
  { label:"25m", work:25*60, break:5*60 },
  { label:"45m", work:45*60, break:10*60 },
  { label:"90m", work:90*60, break:20*60 },
];

function FocusTab({ blockedApps, toggleBlock }) {
  const [preset, setPreset] = useState(0);
  const [running, setRunning] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [secs, setSecs] = useState(PRESETS[0].work);
  const [sessions, setSessions] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(2);
  const timerRef = useRef(null);

  const totalSecs = breaking ? PRESETS[preset].break : PRESETS[preset].work;
  const pct = secs / totalSecs;

  const startStop = () => {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
    } else {
      setRunning(true);
    }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setRunning(false); setBreaking(false);
    setSecs(PRESETS[preset].work);
  };

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            if (!breaking) {
              setBreaking(true);
              setCompletedSessions(c => c + 1);
              spawnConfetti();
              setSecs(PRESETS[preset].break);
              setSessions(n => n + 1);
            } else {
              setBreaking(false);
              setSecs(PRESETS[preset].work);
            }
            setRunning(false);
            return s;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running, breaking, preset]);

  const changePreset = (i) => {
    if (running) return;
    setPreset(i); setBreaking(false);
    setSecs(PRESETS[i].work);
  };

  return (
    <div style={{ paddingTop:8 }}>
      <div className="row-between fade-up" style={{ marginBottom:18 }}>
        <div>
          <div className="section-title">Focus Session</div>
          <div className="section-sub">Stay locked in, earn rewards</div>
        </div>
        <div className="level-badge" style={{ background:"rgba(0,229,160,0.1)", border:"1px solid rgba(0,229,160,0.3)", color:"var(--green)" }}>
          🧠 Flow state
        </div>
      </div>

      {/* Timer card */}
      <div className={`focus-timer-card fade-up ${running?"running":""}`} style={{ animationDelay:".05s", marginBottom:12 }}>
        <div className="session-presets">
          {PRESETS.map((p,i) => (
            <button key={p.label} className={`preset-chip ${preset===i?"active":""}`} onClick={() => changePreset(i)}>
              {p.label}
            </button>
          ))}
        </div>

        <Ring pct={1-pct} size={160} stroke={10}
          color={breaking?"var(--amber)":"var(--green)"}
          bg="rgba(255,255,255,0.05)"
        >
          <div style={{ textAlign:"center" }}>
            <div className={`timer-display ${breaking?"breaking":""}`}>{fmtSecs(secs)}</div>
            <div className="timer-label">{breaking ? "☕ Break" : running ? "⚡ Focus" : "Ready"}</div>
          </div>
        </Ring>

        {/* Pomodoro dots */}
        <div className="pomodoro-dots">
          {[0,1,2,3].map(i => (
            <div key={i} className={`p-dot ${i < completedSessions % 4 ? "done" : i === completedSessions % 4 && running && !breaking ? "current" : ""}`} />
          ))}
        </div>

        <div className="focus-controls">
          <button className={`btn ${running?"btn-rose":"btn-green"}`}
            style={{ flex:1, padding:"14px", fontSize:15 }}
            onClick={startStop}
          >
            {running ? "⏸ Pause" : breaking ? "▶ Start Break" : "▶ Start Focus"}
          </button>
          <button className="btn btn-outline" style={{ width:52, fontSize:18, padding:"14px" }} onClick={reset}>↺</button>
        </div>

        <div style={{ display:"flex", gap:20, fontSize:13, color:"var(--muted)" }}>
          <span>Sessions today: <strong style={{ color:"var(--green)" }}>{completedSessions}</strong></span>
          <span>XP earned: <strong style={{ color:"var(--amber)" }}>{completedSessions * 25}</strong></span>
        </div>
      </div>

      {/* App blocking */}
      <div className="card fade-up" style={{ animationDelay:".1s", marginBottom:12 }}>
        <div className="row-between" style={{ marginBottom:12 }}>
          <div>
            <div className="section-title" style={{ fontSize:15 }}>Block During Focus</div>
            <div className="section-sub">Tap to toggle blocking</div>
          </div>
          {running && <span className="tag tag-rose" style={{ animation:"pulse 2s infinite" }}>🔴 Active</span>}
        </div>
        <div className="blocked-grid">
          {APPS.map(app => (
            <div key={app.id} className={`blocked-app-row ${blockedApps.has(app.id)?"is-blocked":""}`}>
              <span style={{ fontSize:18 }}>{app.icon}</span>
              <span style={{ flex:1, fontSize:12, fontFamily:"var(--font-h)", fontWeight:600 }}>{app.label}</span>
              <button className={`toggle ${blockedApps.has(app.id)?"on":""}`}
                onClick={() => toggleBlock(app.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Focus tip */}
      <div style={{
        background:"linear-gradient(135deg,rgba(167,139,250,0.1),rgba(59,130,246,0.08))",
        border:"1px solid rgba(167,139,250,0.2)",
        borderRadius:14, padding:"14px 16px",
        fontSize:13, color:"var(--muted)", lineHeight:1.6,
        animation:"fadeUp .4s .2s both"
      }}>
        <span style={{ color:"var(--violet)", fontWeight:700 }}>💡 Tip: </span>
        The Pomodoro technique improves focus by working in 25-minute sprints.
        After 4 sessions, take a longer 15–30 minute break.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: STATS
// ═══════════════════════════════════════════════════════════════════════════
function StatsTab() {
  const [period, setPeriod] = useState("week");
  const maxMins = Math.max(...WEEK_DATA.map(d => d.mins));
  const dailyGoal = 240;
  const totalWeek = WEEK_DATA.reduce((s,d)=>s+d.mins,0);
  const avgDaily  = Math.round(totalWeek / 7);

  return (
    <div style={{ paddingTop:8 }}>
      <div className="row-between fade-up" style={{ marginBottom:18 }}>
        <div>
          <div className="section-title">Usage Report</div>
          <div className="section-sub">Your digital habits at a glance</div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {["week","month"].map(p => (
            <button key={p} className={`preset-chip ${period===p?"active":""}`}
              style={{ fontSize:11 }} onClick={() => setPeriod(p)}>
              {p === "week" ? "7D" : "30D"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
        {[
          { label:"Total", val:fmtTime(totalWeek), color:"var(--text)" },
          { label:"Daily avg", val:fmtTime(avgDaily), color:avgDaily>dailyGoal?"var(--rose)":"var(--green)" },
          { label:"Goal days", val:"5/7", color:"var(--amber)" },
        ].map(s => (
          <div key={s.label} className="card fade-up" style={{ textAlign:"center", padding:"12px 8px" }}>
            <div style={{ fontFamily:"var(--font-h)", fontSize:17, fontWeight:800, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:10, color:"var(--muted)", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="card fade-up" style={{ animationDelay:".08s", marginBottom:12 }}>
        <div className="row-between" style={{ marginBottom:16 }}>
          <span style={{ fontFamily:"var(--font-h)", fontSize:14, fontWeight:700 }}>Screen Time</span>
          <span className="tag tag-amber">Goal: {fmtTime(dailyGoal)}</span>
        </div>
        <div className="chart-bar-row">
          {WEEK_DATA.map((d, i) => {
            const isToday = i === 6;
            const isOver  = d.mins > dailyGoal;
            const h = Math.round((d.mins / maxMins) * 72);
            return (
              <div key={d.day} className="chart-bar-col">
                <div style={{ height:72, display:"flex", alignItems:"flex-end", width:"100%" }}>
                  <div className={`chart-bar ${isToday?"today":""} ${isOver?"over":""}`}
                    style={{ height:h, animationDelay:`${i*.07}s`, animation:`growIn .6s ${i*.07}s cubic-bezier(.4,0,.2,1) both`, transformOrigin:"bottom" }}
                  />
                </div>
                <span className="chart-label" style={{ color: isToday?"var(--green)":"var(--muted)" }}>{d.day}</span>
              </div>
            );
          })}
        </div>
        {/* Goal line indicator */}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>
          <div style={{ width:16, height:2, background:"var(--amber)", borderRadius:1 }} />
          <span style={{ fontSize:10, color:"var(--muted)" }}>Daily goal ({fmtTime(dailyGoal)})</span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="card fade-up" style={{ animationDelay:".12s", marginBottom:12 }}>
        <div style={{ fontFamily:"var(--font-h)", fontSize:14, fontWeight:700, marginBottom:14 }}>By Category</div>
        {[
          { name:"Social", mins:280, color:"var(--rose)", icon:"💬" },
          { name:"Video",  mins:101, color:"var(--blue)", icon:"📺" },
          { name:"Games",  mins:67,  color:"var(--violet)", icon:"🎮" },
          { name:"Focus",  mins:95,  color:"var(--green)", icon:"⚡" },
        ].map(cat => (
          <div key={cat.name} style={{ marginBottom:12 }}>
            <div className="row-between" style={{ marginBottom:6 }}>
              <div className="row" style={{ gap:8 }}>
                <span>{cat.icon}</span>
                <span style={{ fontSize:13, fontFamily:"var(--font-h)", fontWeight:600 }}>{cat.name}</span>
              </div>
              <span style={{ fontSize:12, color:"var(--muted)" }}>{fmtTime(cat.mins)}</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{
                width:`${(cat.mins/280)*100}%`, background:cat.color,
                animation:"growIn .7s ease both"
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* App breakdown */}
      <div className="card fade-up" style={{ animationDelay:".16s" }}>
        <div style={{ fontFamily:"var(--font-h)", fontSize:14, fontWeight:700, marginBottom:14 }}>App Breakdown</div>
        {APPS.sort((a,b)=>b.time-a.time).map((app, i) => (
          <div key={app.id} className="app-stat-row" style={{ animationDelay:`${.2+i*.06}s` }}>
            <div className="app-stat-icon">{app.icon}</div>
            <div style={{ flex:1 }}>
              <div className="row-between" style={{ marginBottom:4 }}>
                <span className="app-stat-name">{app.label}</span>
                <span style={{ fontSize:12, color: app.time>app.limit?"var(--rose)":"var(--muted)" }}>{fmtTime(app.time)}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{
                  width:`${Math.min((app.time/app.limit)*100,100)}%`,
                  background: app.time>app.limit ? "var(--rose)" : app.color
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: REWARDS
// ═══════════════════════════════════════════════════════════════════════════
function RewardsTab() {
  const xp = 1240, nextLevel = 1500, level = 8;
  const pct = (xp - 1000) / (nextLevel - 1000);

  return (
    <div style={{ paddingTop:8 }}>
      <div className="row-between fade-up" style={{ marginBottom:18 }}>
        <div>
          <div className="section-title">Rewards</div>
          <div className="section-sub">Level up your focus game</div>
        </div>
        <div className="level-badge">⭐ Level {level}</div>
      </div>

      {/* XP bar */}
      <div className="xp-bar-wrap fade-up" style={{ marginBottom:12 }}>
        <div className="xp-numbers">
          <div>
            <div style={{ fontSize:11, color:"var(--muted)", marginBottom:2 }}>TOTAL XP</div>
            <div className="xp-current">{xp.toLocaleString()}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div className="xp-next" style={{ marginBottom:2 }}>Next level</div>
            <div style={{ fontFamily:"var(--font-h)", fontWeight:700, color:"var(--text)" }}>{nextLevel.toLocaleString()}</div>
          </div>
        </div>
        <div className="xp-track">
          <div className="xp-fill" style={{ width:`${pct*100}%` }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:"var(--muted)" }}>
          <span>Level {level}</span>
          <span>{Math.round(pct*100)}% to Level {level+1}</span>
        </div>
      </div>

      {/* Daily challenges */}
      <div className="fade-up" style={{ animationDelay:".07s", marginBottom:4 }}>
        <div style={{ fontFamily:"var(--font-h)", fontSize:14, fontWeight:700, marginBottom:10 }}>
          🎯 Daily Challenges
        </div>
        {CHALLENGES.map((ch, i) => (
          <div key={ch.title} className="challenge-card" style={{ animationDelay:`${.1+i*.07}s`, animation:"fadeUp .4s both" }}>
            <span className="challenge-icon">{ch.icon}</span>
            <div className="challenge-info">
              <div className="challenge-title">{ch.title}</div>
              <div className="challenge-sub">{ch.sub}</div>
              <div className="bar-track" style={{ height:5 }}>
                <div className="bar-fill" style={{ width:`${ch.progress}%`, background:ch.color }} />
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontFamily:"var(--font-h)", fontSize:13, fontWeight:800, color:"var(--amber)" }}>+{ch.xp}</div>
              <div style={{ fontSize:10, color:"var(--muted)" }}>XP</div>
              <div style={{ fontSize:11, color:"var(--muted)", marginTop:4 }}>{ch.progress}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="fade-up" style={{ animationDelay:".15s" }}>
        <div style={{ fontFamily:"var(--font-h)", fontSize:14, fontWeight:700, margin:"8px 0 10px" }}>
          🏅 Achievements
        </div>
        <div className="achievement-grid">
          {ACHIEVEMENTS.map((ach, i) => (
            <div key={ach.id} className={`achievement ${ach.unlocked?"unlocked":"locked"}`}
              style={{ animation:`fadeUp .4s ${.2+i*.06}s both` }}>
              <div className="ach-icon">{ach.icon}</div>
              <div className="ach-title">{ach.title}</div>
              <div className="ach-desc">{ach.desc}</div>
              <div className="ach-xp">+{ach.xp} XP{!ach.unlocked ? " 🔒" : " ✓"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card fade-up" style={{ animationDelay:".28s", marginTop:12 }}>
        <div style={{ fontFamily:"var(--font-h)", fontSize:14, fontWeight:700, marginBottom:12 }}>
          🌍 Friends Leaderboard
        </div>
        {[
          { name:"Maya R.",   xp:1840, rank:1, avatar:"🧑🏽", you:false },
          { name:"You",       xp:1240, rank:2, avatar:"👤",   you:true  },
          { name:"Chris K.",  xp:990,  rank:3, avatar:"👦🏻",  you:false },
          { name:"Priya S.",  xp:740,  rank:4, avatar:"👩🏾",  you:false },
        ].map((u, i) => (
          <div key={u.name} style={{
            display:"flex", alignItems:"center", gap:12,
            padding:"10px 0", borderBottom: i<3?"1px solid var(--border)":"none",
            background: u.you?"rgba(0,229,160,0.04)":"transparent",
            borderRadius: u.you?8:0, padding: u.you?"10px 8px":"10px 0"
          }}>
            <span style={{ fontFamily:"var(--font-h)", fontSize:12, fontWeight:800,
              color:i===0?"var(--amber)":i===1?"var(--muted)":i===2?"#CD7F32":"var(--muted)",
              width:20, textAlign:"center" }}>
              {i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}
            </span>
            <span style={{ fontSize:22 }}>{u.avatar}</span>
            <span style={{ flex:1, fontFamily:"var(--font-h)", fontSize:13, fontWeight: u.you?700:400,
              color:u.you?"var(--green)":"var(--text)" }}>
              {u.name}
            </span>
            <span style={{ fontFamily:"var(--font-h)", fontSize:13, fontWeight:700, color:"var(--amber)" }}>
              {u.xp.toLocaleString()} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB: SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
function SettingsTab() {
  const [settings, setSettings] = useState({
    focusNotif: true, weekReport: true, bedtimeMode: true,
    screenShake: false, darkMode: true, sounds: true,
  });
  const toggle = (k) => setSettings(s => ({...s, [k]:!s[k]}));

  const rows = [
    { group:"Notifications", items:[
      { key:"focusNotif", label:"Focus reminders",    icon:"🔔" },
      { key:"weekReport", label:"Weekly reports",      icon:"📊" },
    ]},
    { group:"Focus Mode", items:[
      { key:"bedtimeMode", label:"Bedtime mode",      icon:"🌙" },
      { key:"screenShake", label:"Screen shake alert", icon:"📳" },
      { key:"sounds",      label:"Focus sounds",       icon:"🎵" },
    ]},
    { group:"Display", items:[
      { key:"darkMode", label:"Dark theme",            icon:"🌑" },
    ]},
  ];

  return (
    <div style={{ paddingTop:8 }}>
      <div className="fade-up" style={{ marginBottom:18 }}>
        <div className="section-title">Settings</div>
        <div className="section-sub">Personalise your focus journey</div>
      </div>

      {/* Profile */}
      <div className="card fade-up" style={{ animationDelay:".05s", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{
            width:56, height:56, borderRadius:18,
            background:"linear-gradient(135deg,var(--green),var(--blue))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:26, boxShadow:"0 8px 24px rgba(0,229,160,0.3)"
          }}>👤</div>
          <div>
            <div style={{ fontFamily:"var(--font-h)", fontSize:17, fontWeight:800 }}>Alex Johnson</div>
            <div style={{ fontSize:13, color:"var(--muted)" }}>alex@example.com</div>
            <div className="level-badge" style={{ marginTop:6 }}>⭐ Level 8 · 1240 XP</div>
          </div>
        </div>
      </div>

      {/* Daily goal */}
      <div className="card fade-up" style={{ animationDelay:".08s", marginBottom:12 }}>
        <div style={{ fontFamily:"var(--font-h)", fontSize:14, fontWeight:700, marginBottom:12 }}>Daily Screen Goal</div>
        {[120,180,240,300].map(g => (
          <button key={g}
            style={{
              display:"block", width:"100%", textAlign:"left",
              background:"transparent", border:"none", cursor:"pointer",
              padding:"10px 0", borderBottom:"1px solid var(--border)",
              color:g===240?"var(--green)":"var(--muted)",
              fontFamily:"var(--font-h)", fontSize:13, fontWeight:g===240?700:400,
              transition:"color .2s"
            }}
          >
            {g===240 ? "✓ " : "  "}{fmtTime(g)}{g===240?" (current)":""}
          </button>
        ))}
      </div>

      {/* Toggles */}
      {rows.map((group, gi) => (
        <div key={group.group} className="card fade-up" style={{ animationDelay:`${.1+gi*.06}s`, marginBottom:12 }}>
          <div style={{ fontFamily:"var(--font-h)", fontSize:12, fontWeight:700, color:"var(--muted)",
            letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>
            {group.group}
          </div>
          {group.items.map((item, ii) => (
            <div key={item.key} className="row-between" style={{ padding:"10px 0", borderBottom:ii<group.items.length-1?"1px solid var(--border)":"none" }}>
              <div className="row">
                <span style={{ fontSize:18 }}>{item.icon}</span>
                <span style={{ fontSize:13, fontFamily:"var(--font-h)", fontWeight:500 }}>{item.label}</span>
              </div>
              <button className={`toggle ${settings[item.key]?"on":""}`} onClick={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      ))}

      {/* Sign out */}
      <button className="btn btn-outline" style={{
        width:"100%", padding:"14px", fontSize:14,
        border:"1px solid rgba(255,90,126,0.3)", color:"var(--rose)",
        marginTop:4, animation:"fadeUp .4s .3s both"
      }}>
        Sign out
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════════════════
const TABS = [
  { id:"home",    label:"Home",    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id:"focus",   label:"Focus",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg> },
  { id:"stats",   label:"Stats",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { id:"rewards", label:"Rewards", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> },
  { id:"settings",label:"Settings",icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [blockedApps, setBlockedApps] = useState(new Set(["tiktok","instagram"]));

  const toggleBlock = useCallback((id) => {
    setBlockedApps(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;

  return (
    <>
      <style>{CSS}</style>
      <div id="confetti-root" style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999 }} />

      <div className="shell">
        <div className="phone">
          {/* Status bar */}
          <div className="status-bar">
            <span>{timeStr}</span>
            <div className="notch" />
            <span>●●● 5G 🔋</span>
          </div>

          {/* Screen */}
          <div className="screen">
            {tab === "home"     && <HomeTab blockedApps={blockedApps} toggleBlock={toggleBlock} />}
            {tab === "focus"    && <FocusTab blockedApps={blockedApps} toggleBlock={toggleBlock} />}
            {tab === "stats"    && <StatsTab />}
            {tab === "rewards"  && <RewardsTab />}
            {tab === "settings" && <SettingsTab />}
          </div>

          {/* Bottom nav */}
          <nav className="nav">
            {TABS.map(t => (
              <button key={t.id} className={`nav-btn ${tab===t.id?"active":""}`}
                onClick={() => setTab(t.id)}>
                {t.icon}
                <span>{t.label}</span>
                <div className="nav-dot" />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
