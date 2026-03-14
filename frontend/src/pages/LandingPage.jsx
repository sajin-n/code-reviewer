import { Link } from "react-router-dom";
import {
  FiZap, FiActivity, FiCpu, FiCheckSquare,
  FiHelpCircle, FiBarChart2, FiArrowRight,
  FiGitMerge, FiLayers,
} from "react-icons/fi";

/* ─── Replace this import with your actual gecko image ─── */
/* import GeckoLogo from "../assets/gecko.png"; */
/* Then use <img src={GeckoLogo} ... /> in the logo slot   */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400&display=swap');

  :root {
    --bg:       #08080f;
    --surface:  #0c0c16;
    --border:   rgba(255,255,255,0.07);
    --text:     rgba(255,255,255,0.82);
    --muted:    rgba(255,255,255,0.35);
    --dim:      rgba(255,255,255,0.14);
    --indigo:   #6366f1;
    --violet:   #8b5cf6;
    --font-d:   'Fraunces', Georgia, serif;
    --font-m:   'DM Mono', 'Fira Code', monospace;
  }

  .lp { font-family: var(--font-d); background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }
  .mono { font-family: var(--font-m); }

  /* ── noise grain overlay ── */
  .lp::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 100; opacity: 0.35;
  }

  /* ── hero mesh gradient ── */
  .hero-mesh {
    position: absolute; inset: 0; overflow: hidden; pointer-events: none;
  }
  .hero-mesh::before {
    content: '';
    position: absolute;
    width: 800px; height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 65%);
    top: -200px; left: -100px;
  }
  .hero-mesh::after {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 65%);
    top: 100px; right: -100px;
  }

  /* ── fine dot grid ── */
  .dot-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%);
  }

  /* ── entrance animations ── */
  @keyframes up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim        { animation: up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.15s; }
  .d3 { animation-delay: 0.25s; }
  .d4 { animation-delay: 0.35s; }
  .d5 { animation-delay: 0.45s; }

  /* ── pill badge ── */
  .pill {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-m);
    font-size: 9.5px; font-weight: 400; letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(167,139,250,0.8);
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.18);
    border-radius: 999px;
    padding: 5px 12px;
  }
  .pill-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(167,139,250,0.7);
    animation: pulse 2.2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:.4;transform:scale(.9)} 50%{opacity:1;transform:scale(1.2)} }

  /* ── hero title ── */
  .hero-h {
    font-size: clamp(42px, 7vw, 86px);
    font-weight: 300;
    font-style: italic;
    line-height: 1.08;
    letter-spacing: -1.5px;
    color: rgba(255,255,255,0.92);
  }
  .hero-h em {
    font-style: normal;
    font-weight: 600;
    background: linear-gradient(125deg, #e0d7ff 0%, #a78bfa 45%, #6366f1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── CTA buttons ── */
  .btn-main {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-m); font-size: 12px; letter-spacing: 0.07em;
    color: rgba(255,255,255,0.92);
    background: rgba(99,102,241,0.14);
    border: 1px solid rgba(99,102,241,0.4);
    padding: 12px 24px; border-radius: 10px;
    text-decoration: none;
    transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .btn-main:hover {
    background: rgba(99,102,241,0.24);
    border-color: rgba(99,102,241,0.65);
    box-shadow: 0 4px 28px rgba(99,102,241,0.22);
    transform: translateY(-1px);
  }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-m); font-size: 12px; letter-spacing: 0.07em;
    color: rgba(255,255,255,0.38);
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    padding: 12px 24px; border-radius: 10px;
    text-decoration: none;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .btn-ghost:hover {
    color: rgba(255,255,255,0.72);
    border-color: rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.03);
  }

  /* ── demo panel ── */
  .demo-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
  }
  .demo-bar {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 14px;
    background: rgba(255,255,255,0.02);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .demo-dot { width: 9px; height: 9px; border-radius: 50%; }

  /* ── section title ── */
  .sec-label {
    font-family: var(--font-m);
    font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(99,102,241,0.6);
    margin-bottom: 12px;
  }
  .sec-title {
    font-size: clamp(26px, 3.5vw, 40px);
    font-weight: 300; font-style: italic;
    letter-spacing: -0.5px;
    color: rgba(255,255,255,0.88);
    line-height: 1.2;
  }
  .sec-title strong { font-style: normal; font-weight: 600; }

  /* ── feature card ── */
  .feat-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 24px;
    transition: border-color 0.22s, background 0.22s, transform 0.22s, box-shadow 0.22s;
    position: relative; overflow: hidden;
  }
  .feat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    opacity: 0; transition: opacity 0.22s;
  }
  .feat-card:hover {
    border-color: rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.035);
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(0,0,0,0.3);
  }
  .feat-card:hover::before { opacity: 1; }

  .feat-icon {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px; border: 1px solid;
  }
  .feat-title {
    font-size: 15px; font-weight: 600; font-style: normal;
    color: rgba(255,255,255,0.88); margin-bottom: 8px;
    letter-spacing: -0.2px;
  }
  .feat-desc {
    font-family: var(--font-m);
    font-size: 12px; line-height: 1.7;
    color: var(--muted);
  }

  /* ── stat cards ── */
  .stat-card {
    text-align: center;
    padding: 28px 16px;
    border-radius: 14px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
  }
  .stat-val {
    font-size: 38px; font-weight: 300; font-style: italic;
    letter-spacing: -2px; line-height: 1;
    background: linear-gradient(125deg, #c4b5fd, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .stat-label {
    font-family: var(--font-m);
    font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--dim); margin-top: 6px;
  }

  /* ── step row ── */
  .step-row {
    display: flex; align-items: flex-start; gap: 18px;
    padding: 18px 20px; border-radius: 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    transition: border-color 0.2s, background 0.2s;
  }
  .step-row:hover {
    border-color: rgba(255,255,255,0.09);
    background: rgba(255,255,255,0.035);
  }
  .step-num {
    font-family: var(--font-m); font-size: 11px; font-weight: 500;
    color: rgba(99,102,241,0.6); letter-spacing: 0.08em;
    padding: 6px 10px; border-radius: 7px;
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.15);
    flex-shrink: 0; margin-top: 1px;
    min-width: 40px; text-align: center;
  }
  .step-title {
    font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.85);
    margin-bottom: 4px; font-style: normal; letter-spacing: -0.2px;
  }
  .step-desc {
    font-family: var(--font-m); font-size: 12px;
    color: var(--muted); line-height: 1.6;
  }

  /* ── divider ── */
  .hr { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); }

  /* ── CTA section ── */
  .cta-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.1), transparent);
  }

  /* ── footer ── */
  .footer-logo {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-bottom: 10px;
  }
  .footer-gecko {
    width: 20px; height: 20px;
    border-radius: 5px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.2);
    display: flex; align-items: center; justify-content: center;
  }

  /* ── sample code colors ── */
  .tok-kw  { color: #9d80f0; }
  .tok-fn  { color: #7aadec; }
  .tok-str { color: #5ecba8; }
  .tok-num { color: #d4a84b; }
  .tok-cm  { color: #3d4a5c; font-style: italic; }
  .tok-op  { color: #d67ab1; }
  .tok-pl  { color: #cdd6e8; }
`;

const FEATURES = [
  {
    icon: <FiZap size={18} />, color: "#a78bfa",
    bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)",
    title: "Full AI Code Review",
    desc: "Logic errors, edge cases, and code quality — explained like a senior engineer giving feedback.",
  },
  {
    icon: <FiActivity size={18} />, color: "#34d399",
    bg: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.16)",
    title: "Complexity Analysis",
    desc: "Understand why your code is O(n²) with step-by-step explanations across loops, recursion, and data structures.",
  },
  {
    icon: <FiCpu size={18} />, color: "#60a5fa",
    bg: "rgba(96,165,250,0.07)", border: "rgba(96,165,250,0.16)",
    title: "Optimized Rewrite",
    desc: "Production-quality rewrite with clean names, inline comments, and proper edge case handling.",
  },
  {
    icon: <FiCheckSquare size={18} />, color: "#2dd4bf",
    bg: "rgba(45,212,191,0.07)", border: "rgba(45,212,191,0.16)",
    title: "Unit Test Generator",
    desc: "Auto-generate 5 targeted unit tests covering edge cases, formatted and ready for your test suite.",
  },
  {
    icon: <FiHelpCircle size={18} />, color: "#fbbf24",
    bg: "rgba(251,191,36,0.07)", border: "rgba(251,191,36,0.16)",
    title: "Progressive Hints",
    desc: "Three escalating hints that guide you toward the solution without spoiling the answer.",
  },
  {
    icon: <FiBarChart2 size={18} />, color: "#f472b6",
    bg: "rgba(244,114,182,0.07)", border: "rgba(244,114,182,0.16)",
    title: "Submission History",
    desc: "Every review saved with full feedback, scores, and optimized solutions for later reference.",
  },
];

const STEPS = [
  { num: "01", title: "Paste your code", desc: "Drop any snippet into the editor and select your language." },
  { num: "02", title: "Name the problem", desc: "Optionally add the problem title for context-aware feedback." },
  { num: "03", title: "Hit Review",       desc: "The AI analyzes your code in seconds and returns a full report." },
  { num: "04", title: "Learn & improve",  desc: "Read through errors, complexity breakdowns, and the optimized rewrite." },
];

const FEEDBACK_ROWS = [
  { label: "Time Complexity",  value: "O(n²) → O(n)", color: "#f87171" },
  { label: "Space Complexity", value: "O(1) → O(n)",  color: "#60a5fa" },
  { label: "Logic Errors",     value: "1 found",       color: "#fbbf24" },
  { label: "Score",            value: "62 / 100",      color: "#a78bfa" },
];

export default function LandingPage() {
  return (
    <div className="lp">
      <style>{STYLES}</style>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section style={{ position: "relative", padding: "clamp(60px,10vw,120px) 16px clamp(70px,10vw,120px)", textAlign: "center" }}>
        <div className="hero-mesh" />
        <div className="dot-grid" />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 860, margin: "0 auto" }}>
          <div className="anim d1" style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <span className="pill">
              <span className="pill-dot" />
              Powered by Llama 3.3 · 70B
            </span>
          </div>

          <h1 className="hero-h anim d2">
            Code review that thinks<br />
            like a <em>senior engineer</em>
          </h1>

          <p className="anim d3 mono" style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", maxWidth: 480, margin: "22px auto 36px", lineHeight: 1.75, letterSpacing: "0.02em" }}>
            Paste code. Get logic errors, complexity analysis, an optimized rewrite,
            and unit tests — in under 5 seconds.
          </p>

          <div className="anim d4" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Link to="/register" className="btn-main">
              Start for free <FiArrowRight size={13} />
            </Link>
            <Link to="/login" className="btn-ghost">Sign in</Link>
          </div>
        </div>
      </section>

      {/* ══ DEMO PREVIEW ══════════════════════════════════ */}
      <section style={{ padding: "0 16px 80px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          {/* Label */}
          <div className="anim d5" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>Live Preview</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="demo-grid">
            <style>{`@media(max-width:640px){.demo-grid{grid-template-columns:1fr !important;}}`}</style>

            {/* Code side */}
            <div className="demo-panel">
              <div className="demo-bar">
                <div className="demo-dot" style={{ background:"#ff5f57" }} />
                <div className="demo-dot" style={{ background:"#ffbd2e" }} />
                <div className="demo-dot" style={{ background:"#28c840" }} />
                <span className="mono" style={{ fontSize:10, color:"rgba(255,255,255,0.2)", marginLeft:8 }}>twoSum.js</span>
              </div>
              <pre className="mono" style={{ padding:"20px", fontSize:12, lineHeight:1.8, margin:0, overflowX:"auto", color:"rgba(255,255,255,0.65)" }}>
{`function `}<span className="tok-fn">twoSum</span>{`(`}<span className="tok-pl">nums, target</span>{`) {
  `}<span className="tok-cm">{"// O(n²) — brute force"}</span>{`
  `}<span className="tok-kw">for</span>{` (`}<span className="tok-kw">let</span>{` i `}<span className="tok-op">=</span>{` `}<span className="tok-num">0</span>{`; i `}<span className="tok-op">&lt;</span>{` nums.length; i`}<span className="tok-op">++</span>{`) {
    `}<span className="tok-kw">for</span>{` (`}<span className="tok-kw">let</span>{` j `}<span className="tok-op">=</span>{` i `}<span className="tok-op">+</span>{` `}<span className="tok-num">1</span>{`; j `}<span className="tok-op">&lt;</span>{` nums.length; j`}<span className="tok-op">++</span>{`) {
      `}<span className="tok-kw">if</span>{` (nums[i] `}<span className="tok-op">+</span>{` nums[j] `}<span className="tok-op">===</span>{` target)
        `}<span className="tok-kw">return</span>{` [i, j];
    }
  }
}`}
              </pre>
            </div>

            {/* Feedback side */}
            <div className="demo-panel" style={{ display:"flex", flexDirection:"column" }}>
              <div className="demo-bar">
                <FiZap size={11} style={{ color:"#a78bfa" }} />
                <span className="mono" style={{ fontSize:10, color:"rgba(255,255,255,0.22)", letterSpacing:"0.1em" }}>AI FEEDBACK</span>
              </div>
              <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:8, flex:1 }}>
                {FEEDBACK_ROWS.map((r) => (
                  <div key={r.label} style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"9px 12px", borderRadius:8,
                    background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)",
                  }}>
                    <span className="mono" style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{r.label}</span>
                    <span className="mono" style={{ fontSize:11, fontWeight:500, color:r.color }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ marginTop:"auto", padding:"12px", borderRadius:9, background:"rgba(99,102,241,0.05)", border:"1px solid rgba(99,102,241,0.12)" }}>
                  <div className="mono" style={{ fontSize:10, color:"rgba(167,139,250,0.6)", marginBottom:6, letterSpacing:"0.06em" }}>{"// optimal approach"}</div>
                  <p className="mono" style={{ fontSize:11, color:"rgba(255,255,255,0.35)", lineHeight:1.7, margin:0 }}>
                    Use a HashMap to store each number and its index. Check if the complement exists in O(1) per lookup — O(n) total.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hr" style={{ maxWidth:880, margin:"0 auto 0", padding:"0 16px" }} />

      {/* ══ STATS ═════════════════════════════════════════ */}
      <section style={{ padding:"72px 16px" }}>
        <div style={{ maxWidth:880, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }} className="stats-grid">
          <style>{`@media(max-width:600px){.stats-grid{grid-template-columns:repeat(2,1fr) !important;}}`}</style>
          {[
            { val:"6+",     label:"Languages"     },
            { val:"10+",    label:"Feedback Fields"},
            { val:"< 5s",   label:"Review Time"   },
            { val:"100%",   label:"AI-Powered"    },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-val">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="hr" style={{ maxWidth:880, margin:"0 auto", padding:"0 16px" }} />

      {/* ══ FEATURES ══════════════════════════════════════ */}
      <section style={{ padding:"80px 16px" }}>
        <div style={{ maxWidth:920, margin:"0 auto" }}>
          <div style={{ marginBottom:52 }}>
            <div className="sec-label" style={{ display:"flex", alignItems:"center", gap:6 }}>
              <FiLayers size={10} /> Features
            </div>
            <h2 className="sec-title">
              Everything you need to<br />
              <strong>level up fast</strong>
            </h2>
            <p className="mono" style={{ fontSize:12, color:"var(--muted)", marginTop:12, maxWidth:420, lineHeight:1.75 }}>
              One submission. An entire suite of interview prep tools — not just a linter.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }} className="feat-grid">
            <style>{`@media(max-width:700px){.feat-grid{grid-template-columns:1fr !important;}} @media(max-width:960px) and (min-width:700px){.feat-grid{grid-template-columns:repeat(2,1fr) !important;}}`}</style>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="feat-card" style={{ animationDelay: `${0.06 * i}s` }}>
                <style>{`.feat-card:nth-child(${i+1})::before { background: linear-gradient(90deg, transparent, ${f.color}44, transparent); }`}</style>
                <div className="feat-icon" style={{ background:f.bg, borderColor:f.border, color:f.color }}>
                  {f.icon}
                </div>
                <div className="feat-title">{f.title}</div>
                <p className="feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="hr" style={{ maxWidth:880, margin:"0 auto", padding:"0 16px" }} />

      {/* ══ HOW IT WORKS ══════════════════════════════════ */}
      <section style={{ padding:"80px 16px" }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <div style={{ marginBottom:44 }}>
            <div className="sec-label" style={{ display:"flex", alignItems:"center", gap:6 }}>
              <FiGitMerge size={10} /> How it works
            </div>
            <h2 className="sec-title">From code to<br /><strong>insight in seconds</strong></h2>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {STEPS.map(s => (
              <div key={s.num} className="step-row">
                <div className="step-num">{s.num}</div>
                <div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="hr" style={{ maxWidth:880, margin:"0 auto", padding:"0 16px" }} />

      {/* ══ CTA ═══════════════════════════════════════════ */}
      <section style={{ position:"relative", padding:"clamp(70px,10vw,120px) 16px", textAlign:"center", overflow:"hidden" }}>
        <div className="cta-glow" />
        <div style={{ position:"relative", zIndex:2, maxWidth:560, margin:"0 auto" }}>
          <span className="pill" style={{ marginBottom:24, display:"inline-flex" }}>Free to use</span>
          <h2 className="hero-h" style={{ fontSize:"clamp(32px,5vw,58px)", marginBottom:16 }}>
            Ready to write<br /><em>better code?</em>
          </h2>
          <p className="mono" style={{ fontSize:12, color:"rgba(255,255,255,0.28)", marginBottom:36, lineHeight:1.75, letterSpacing:"0.02em" }}>
            Create a free account and get your first AI review in under a minute.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:10 }}>
            <Link to="/register" className="btn-main">
              Create free account <FiArrowRight size={13} />
            </Link>
            <Link to="/login" className="btn-ghost">Already have an account</Link>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════ */}
      <footer style={{ padding:"28px 16px 36px", borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
        <div className="footer-logo">
          {/*
            ── GECKO IMAGE SLOT ──────────────────────────────
            When you have your gecko asset, replace the placeholder
            below with: <img src={GeckoLogo} alt="Gekko" style={{width:20,height:20,borderRadius:4}} />
            ─────────────────────────────────────────────────
          */}
          <div className="footer-gecko">
            <img src="/gecko.svg" alt="GEKKO" style={{ width: 18, height: 18, filter: "brightness(0) invert(1)", opacity: 0.6 }} />
          </div>
          <span className="mono" style={{ fontSize:11, letterSpacing:"0.22em", color:"rgba(255,255,255,0.45)", textTransform:"uppercase" }}>GEKKO</span>
          <span className="mono" style={{ fontSize:10, color:"rgba(99,102,241,0.4)" }}>/AI</span>
        </div>
        <p className="mono" style={{ fontSize:10, color:"rgba(255,255,255,0.15)", letterSpacing:"0.04em", lineHeight:1.7 }}>
          AI-powered code review for developers who care about quality.
        </p>
      </footer>
    </div>
  );
}