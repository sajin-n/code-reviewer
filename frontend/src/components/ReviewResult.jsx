import { useEffect, useRef } from "react";
import {
  FiAlertTriangle, FiClock, FiDatabase, FiCheckCircle,
  FiZap, FiCode, FiHelpCircle, FiBookOpen, FiTrendingUp,
  FiArrowRight
} from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const LANG_MAP = {
  javascript: "javascript", typescript: "typescript", python: "python",
  java: "java", cpp: "cpp", c: "c", go: "go", rust: "rust",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;500;600;700&display=swap');

  :root {
    --bg:         #07070d;
    --surface:    #0c0c14;
    --surface2:   #111119;
    --border:     rgba(255,255,255,0.06);
    --border2:    rgba(255,255,255,0.10);
    --text:       rgba(255,255,255,0.78);
    --muted:      rgba(255,255,255,0.32);
    --dim:        rgba(255,255,255,0.12);
    --radius:     14px;
    --font:       'Syne', system-ui, sans-serif;
    --mono:       'IBM Plex Mono', 'Fira Code', monospace;
  }

  .rr-root { font-family: var(--font); }

  @keyframes up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .rr-card { animation: up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .rr-card:nth-child(1) { animation-delay: 0.03s; }
  .rr-card:nth-child(2) { animation-delay: 0.08s; }
  .rr-card:nth-child(3) { animation-delay: 0.14s; }
  .rr-card:nth-child(4) { animation-delay: 0.20s; }
  .rr-card:nth-child(5) { animation-delay: 0.26s; }
  .rr-card:nth-child(6) { animation-delay: 0.31s; }
  .rr-card:nth-child(7) { animation-delay: 0.35s; }
  .rr-card:nth-child(8) { animation-delay: 0.39s; }

  /* ── Panel ── */
  .rr-panel {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: visible;
    transform: translateZ(0) scale(1);
    transform-origin: center center;
    transform-style: preserve-3d;
    transition:
      border-color 0.28s ease,
      box-shadow   0.35s ease,
      transform    0.42s cubic-bezier(0.34, 1.56, 0.64, 1);
    will-change: transform;
    z-index: 0;
  }
  .rr-panel:hover {
    transform: translateZ(60px) scale(1.18);
    z-index: 20;
    border-color: var(--border2);
    box-shadow:
      0 36px 80px rgba(0,0,0,0.75),
      0 0 0 1px rgba(255,255,255,0.08),
      0 0 50px rgba(99,102,241,0.10);
  }

  /* Accent line */
  .rr-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    z-index: 1;
  }
  .acc-indigo::before { background: linear-gradient(90deg, transparent 8%, #6366f1 50%, transparent 92%); opacity: 0.6; }
  .acc-red::before    { background: linear-gradient(90deg, transparent 8%, #f87171 50%, transparent 92%); opacity: 0.6; }
  .acc-yellow::before { background: linear-gradient(90deg, transparent 8%, #fbbf24 50%, transparent 92%); opacity: 0.6; }
  .acc-blue::before   { background: linear-gradient(90deg, transparent 8%, #60a5fa 50%, transparent 92%); opacity: 0.6; }
  .acc-purple::before { background: linear-gradient(90deg, transparent 8%, #a78bfa 50%, transparent 92%); opacity: 0.6; }
  .acc-cyan::before   { background: linear-gradient(90deg, transparent 8%, #22d3ee 50%, transparent 92%); opacity: 0.6; }
  .acc-amber::before  { background: linear-gradient(90deg, transparent 8%, #f59e0b 50%, transparent 92%); opacity: 0.6; }
  .acc-teal::before   { background: linear-gradient(90deg, transparent 8%, #2dd4bf 50%, transparent 92%); opacity: 0.6; }

  /* Header */
  .rr-panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 18px;
    border-bottom: 1px solid var(--border);
    position: relative;
    z-index: 4;
    background: var(--surface);
    border-radius: var(--radius) var(--radius) 0 0;
  }
  .rr-panel-title {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .rr-icon-wrap {
    width: 24px; height: 24px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .rr-body { padding: 18px; }

  /* ── Score ── */
  .rr-score-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 12px;
  }
  @media (max-width: 520px) { .rr-score-grid { grid-template-columns: 1fr; } }

  .rr-score-cell {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .rr-score-label {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .rr-track {
    height: 2px;
    background: rgba(255,255,255,0.05);
    border-radius: 99px;
    overflow: hidden;
  }
  .rr-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 1.1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .rr-score-num {
    font-family: var(--mono);
    font-size: 22px;
    font-weight: 400;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .rr-overall {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .rr-overall-num {
    font-family: var(--mono);
    font-size: 48px;
    font-weight: 400;
    letter-spacing: -3px;
    line-height: 1;
  }
  .rr-badge {
    font-family: var(--mono);
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid;
  }

  /* ── Items ── */
  .rr-item {
    display: flex; gap: 11px;
    padding: 11px 13px;
    border-radius: 9px;
    background: var(--surface2);
    border: 1px solid var(--border);
    font-size: 13.5px;
    line-height: 1.68;
    color: var(--text);
    transition: background 0.15s, border-color 0.15s;
  }
  .rr-item:hover { background: rgba(255,255,255,0.03); border-color: var(--border2); }
  .rr-num {
    font-family: var(--mono);
    font-size: 9.5px;
    font-weight: 500;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid;
    flex-shrink: 0;
    margin-top: 2px;
    letter-spacing: 0.06em;
  }

  /* ── Complexity ── */
  .rr-cx {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    transition: border-color 0.18s;
  }
  .rr-cx:hover { border-color: var(--border2); }
  .rr-cx-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 15px;
  }
  .rr-cx-body {
    padding: 0 15px 15px;
    border-top: 1px solid var(--border);
    padding-top: 13px;
  }
  .rr-notation {
    font-family: var(--mono);
    font-size: 20px;
    font-weight: 400;
    letter-spacing: -0.5px;
    line-height: 1;
  }
  .rr-arrow-pill {
    display: inline-flex; align-items: center; gap: 4px;
    font-family: var(--mono);
    font-size: 10px; font-weight: 500;
    padding: 3px 9px; border-radius: 999px; border: 1px solid;
  }

  /* ── Point list ── */
  .rr-pt { display: flex; gap: 11px; font-size: 13.5px; line-height: 1.68; color: var(--text); }
  .rr-pt + .rr-pt { margin-top: 9px; }
  .rr-pt-num {
    font-family: var(--mono);
    font-size: 9.5px; font-weight: 500;
    padding: 2px 6px; border-radius: 4px; border: 1px solid;
    flex-shrink: 0; margin-top: 2px; letter-spacing: 0.06em;
  }

  /* ── Code block ── */
  .rr-code-wrap {
    background: #05050b;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .rr-code-bar {
    display: flex; align-items: center; gap: 5px;
    padding: 9px 13px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    background: rgba(255,255,255,0.015);
    flex-shrink: 0;
  }
  .rr-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .rr-code-scroll {
    overflow-y: auto;
    overflow-x: auto;
  }
  .rr-code-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
  .rr-code-scroll::-webkit-scrollbar-track { background: transparent; }
  .rr-code-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
  .rr-code-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }
  .rr-code-inner { padding: 14px 16px; }
  .rr-code-inner pre { margin: 0 !important; background: transparent !important; }
  .rr-code-inner code { font-family: var(--mono) !important; font-size: 12.5px !important; line-height: 1.75 !important; }

  /* ── Optimized layout ── */
  .rr-opt-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    align-items: start;
  }
  @media (max-width: 860px) { .rr-opt-grid { grid-template-columns: 1fr; } }

  /* ── Walkthrough ── */
  .rr-walk {
    background: rgba(167,139,250,0.03);
    border: 1px solid rgba(167,139,250,0.08);
    border-radius: 10px;
    padding: 15px;
    height: 100%;
    box-sizing: border-box;
  }
  .rr-walk-head {
    display: flex; align-items: center; gap: 6px;
    font-family: var(--mono);
    font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(167,139,250,0.5);
    margin-bottom: 13px;
  }

  /* ── Hint ── */
  .rr-hint {
    display: flex; gap: 11px;
    padding: 12px 14px;
    background: rgba(245,158,11,0.03);
    border: 1px solid rgba(245,158,11,0.07);
    border-radius: 9px;
    font-size: 13.5px; line-height: 1.65; color: var(--text);
    transition: background 0.15s, border-color 0.15s;
  }
  .rr-hint:hover { background: rgba(245,158,11,0.06); border-color: rgba(245,158,11,0.14); }

  /* ── Similar problems ── */
  .rr-prob {
    display: flex; align-items: center; gap: 9px;
    padding: 10px 13px; border-radius: 9px;
    background: var(--surface2);
    border: 1px solid var(--border);
    font-size: 13.5px; color: var(--text);
    transition: background 0.15s, border-color 0.15s, padding-left 0.18s;
    cursor: default;
  }
  .rr-prob:hover {
    background: rgba(99,102,241,0.05);
    border-color: rgba(99,102,241,0.16);
    padding-left: 16px;
  }
  .rr-prob:hover .rr-prob-arrow { color: rgba(99,102,241,0.5) !important; }

  /* ── Expand overlay — covers card body & extends wider ────── */
  .rr-expand {
    position: absolute;
    top: 42px;               /* just below header */
    left: -5%;              /* extend wider than card on both sides */
    right: -5%;
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: var(--radius);
    z-index: 3;
    padding: 18px 22px;
    max-height: 420px;
    overflow-y: auto;
    opacity: 0;
    pointer-events: none;
    transform: scale(0.85) translateZ(0px);
    transform-origin: center top;
    transition:
      opacity   0.22s ease,
      transform 0.36s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .rr-panel:hover .rr-expand {
    opacity: 1;
    pointer-events: auto;
    transform: scale(1) translateZ(20px);
  }
  .rr-expand > div { padding: 0; }
  /* Scrollbar */
  .rr-expand::-webkit-scrollbar { width: 4px; }
  .rr-expand::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }
  .rr-expand::-webkit-scrollbar-track { background: transparent; }

  /* ── Hover hint ─────────────────────────────────────────── */
  .rr-hover-hint {
    transition: opacity 0.15s ease;
    opacity: 1;
  }
  .rr-panel:hover .rr-hover-hint { opacity: 0; pointer-events: none; }
  .rr-hover-hint-text {
    display: block;
    padding-top: 9px;
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    opacity: 0.38;
  }

  /* Badge used in card headers for counts */
  .rr-count-badge {
    font-family: var(--mono);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 999px;
    border: 1px solid;
  }

  /* ── Bento Grid ─────────────────────────────────── */
  .rr-bento {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    align-items: start;
    overflow: visible;
    perspective: 1200px;    /* enables real Z-axis depth on children */
    position: relative;
    z-index: 10;            /* bento hovers float above siblings below */
  }
  .rr-s2 { grid-column: span 2; }
  .rr-s3 { grid-column: span 3; }

  /* Large bg icon watermark for compact tiles */
  .rr-tile-icon {
    position: absolute;
    bottom: 6px; right: 10px;
    opacity: 0.04;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .rr-panel:hover .rr-tile-icon { opacity: 0.1; }

  @media (max-width: 920px) {
    .rr-bento { grid-template-columns: repeat(2, 1fr); }
    .rr-s2 { grid-column: span 2; }
    .rr-s3 { grid-column: span 2; }
  }
  @media (max-width: 540px) {
    .rr-bento { grid-template-columns: 1fr; }
    .rr-s2, .rr-s3 { grid-column: span 1; }
  }
`;

/* ── Utils ── */
function normalizeCode(str) {
  if (!str || typeof str !== "string") return str;
  if (str.includes("\n") && str.split("\n").length > 3) return str;
  let r = str.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
  if (r.split("\n").length <= 3) {
    r = r.replace(/;\s*/g, ";\n").replace(/\{\s*/g, "{\n").replace(/\}\s*/g, "\n}\n").replace(/\n\n+/g, "\n");
  }
  return r.trim();
}
function toPoints(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return val.split(/(?<=[.!?])\s+(?=[A-Z])/).map(s => s.trim()).filter(Boolean);
}

/* ── Sub-components ── */
function PanelHead({ icon: Icon, label, iconBg, iconColor, right }) {
  return (
    <div className="rr-panel-head">
      <div className="rr-panel-title">
        <div className="rr-icon-wrap" style={{ background: iconBg }}>
          <Icon size={12} style={{ color: iconColor }} />
        </div>
        {label}
      </div>
      {right}
    </div>
  );
}

function Panel({ accent, icon, label, iconBg, iconColor, right, children, cls }) {
  return (
    <div className={`rr-panel rr-card acc-${accent}${cls ? " "+cls : ""}`}>
      <PanelHead icon={icon} label={label} iconBg={iconBg} iconColor={iconColor} right={right} />
      <div className="rr-body">{children}</div>
    </div>
  );
}

function ItemList({ items, ac, ab, abr }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
      {items.map((item, i) => (
        <div key={i} className="rr-item">
          <span className="rr-num" style={{ color:ac, background:ab, borderColor:abr }}>{String(i+1).padStart(2,"0")}</span>
          {item}
        </div>
      ))}
    </div>
  );
}

function PointList({ items, ac, ab, abr }) {
  const pts = toPoints(items);
  if (!pts.length) return null;
  return (
    <div>
      {pts.map((pt, i) => (
        <div key={i} className="rr-pt">
          <span className="rr-pt-num" style={{ color:ac, background:ab, borderColor:abr }}>{String(i+1).padStart(2,"0")}</span>
          <span>{pt}</span>
        </div>
      ))}
    </div>
  );
}

function CodeBlock({ code, language, label, maxHeight }) {
  return (
    <div className="rr-code-wrap" style={maxHeight ? { maxHeight } : {}}>
      <div className="rr-code-bar">
        <div className="rr-dot" style={{ background:"#ff5f57" }} />
        <div className="rr-dot" style={{ background:"#ffbd2e" }} />
        <div className="rr-dot" style={{ background:"#28c840" }} />
        {label && (
          <span style={{ fontFamily:"var(--mono)", fontSize:9.5, color:"rgba(255,255,255,0.18)", marginLeft:6, letterSpacing:"0.06em" }}>
            {label}
          </span>
        )}
      </div>
      <div className="rr-code-scroll" style={maxHeight ? { maxHeight: `calc(${maxHeight} - 35px)` } : {}}>
        <div className="rr-code-inner">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{ background:"transparent", padding:0, margin:0 }}
            wrapLongLines={false}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}

function ScoreCell({ label, value, max = 10 }) {
  const pct = (value / max) * 100;
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.width = "0%";
    const t = setTimeout(() => { el.style.width = `${pct}%`; }, 120);
    return () => clearTimeout(t);
  }, [pct]);
  const color = pct >= 70 ? "#a78bfa" : pct >= 40 ? "#fbbf24" : "#f87171";
  const grad  = pct >= 70
    ? "linear-gradient(90deg,#6366f1,#a78bfa)"
    : pct >= 40
    ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
    : "linear-gradient(90deg,#ef4444,#f87171)";
  return (
    <div className="rr-score-cell">
      <span className="rr-score-label">{label}</span>
      <div className="rr-track"><div ref={ref} className="rr-fill" style={{ background:grad }} /></div>
      <span className="rr-score-num" style={{ color }}>
        {value}<span style={{ fontSize:12, color:"var(--muted)", letterSpacing:0 }}>/{max}</span>
      </span>
    </div>
  );
}

/* ══ MAIN ══ */
export default function ReviewResult({ feedback, language = "javascript" }) {
  if (!feedback) return null;
  const lang = LANG_MAP[language?.toLowerCase()] || "javascript";
  const {
    logicErrors, timeComplexity, spaceComplexity, cleanCodeSuggestions,
    optimizedCode: rawOpt, optimizedCodeExplanation, optimalApproach,
    similarProblems, unitTests: rawTests, score, hints,
  } = feedback;
  const optimizedCode = normalizeCode(rawOpt);
  const unitTests = rawTests?.map(normalizeCode);
  const optimalPts = toPoints(optimalApproach);
  const scoreColor = score ? (score.overall >= 70 ? "#a78bfa" : score.overall >= 40 ? "#fbbf24" : "#f87171") : "#a78bfa";

  return (
    <>
      <style>{STYLES}</style>
      <div className="rr-root" style={{ display:"flex", flexDirection:"column", gap:12, marginTop:20 }}>

        {/* ── BENTO GRID ── */}
        <div className="rr-bento">

          {/* Score — 2 cols */}
          {score && (
            <div className="rr-panel rr-card acc-indigo rr-s2" style={{ position:"relative" }}>
              <PanelHead
                icon={FiZap} label="Quality Score"
                iconBg="rgba(99,102,241,0.1)" iconColor="#a78bfa"
                right={
                  <div className="rr-badge" style={
                    score.overall >= 70
                      ? { color:"#a78bfa", background:"rgba(99,102,241,0.08)", borderColor:"rgba(99,102,241,0.22)" }
                      : score.overall >= 40
                      ? { color:"#fbbf24", background:"rgba(245,158,11,0.07)", borderColor:"rgba(245,158,11,0.2)" }
                      : { color:"#f87171", background:"rgba(239,68,68,0.07)", borderColor:"rgba(239,68,68,0.2)" }
                  }>
                    {score.overall >= 70 ? "SOLID" : score.overall >= 40 ? "NEEDS WORK" : "POOR"}
                  </div>
                }
              />
            <div className="rr-body">
              <div className="rr-overall">
                <div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--muted)", marginBottom:5 }}>Overall</div>
                  <div style={{ display:"flex", alignItems:"flex-end", gap:3 }}>
                    <span className="rr-overall-num" style={{ color:scoreColor }}>{score.overall}</span>
                    <span style={{ fontFamily:"var(--mono)", fontSize:14, color:"var(--muted)", marginBottom:7 }}>/100</span>
                  </div>
                </div>
                <FiTrendingUp size={36} style={{ color: score.overall >= 70 ? "rgba(99,102,241,0.14)" : "rgba(255,255,255,0.04)" }} />
              </div>
              <div className="rr-hover-hint"><div><span className="rr-hover-hint-text">▾ hover for breakdown</span></div></div>
              <div className="rr-expand"><div>
                <div className="rr-overall" style={{ marginBottom:12 }}>
                  <div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--muted)", marginBottom:5 }}>Overall</div>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:3 }}>
                      <span className="rr-overall-num" style={{ color:scoreColor }}>{score.overall}</span>
                      <span style={{ fontFamily:"var(--mono)", fontSize:14, color:"var(--muted)", marginBottom:7 }}>/100</span>
                    </div>
                  </div>
                  <FiTrendingUp size={36} style={{ color: score.overall >= 70 ? "rgba(99,102,241,0.14)" : "rgba(255,255,255,0.04)" }} />
                </div>
                <div className="rr-score-grid">
                  <ScoreCell label="Readability" value={score.readability} />
                  <ScoreCell label="Efficiency"  value={score.efficiency} />
                  <ScoreCell label="Structure"   value={score.structure} />
                </div>
              </div></div>
            </div>
            <FiZap className="rr-tile-icon" size={72} style={{ color:"#a78bfa" }} />
          </div>
          )}

          {/* Logic Errors — 1 col */}
          {logicErrors?.length > 0 ? (
            <Panel accent="red" icon={FiAlertTriangle} label="Logic Errors"
              iconBg="rgba(248,113,113,0.1)" iconColor="#f87171"
              right={<span className="rr-count-badge" style={{ color:"#f87171", background:"rgba(248,113,113,0.07)", borderColor:"rgba(248,113,113,0.2)" }}>{logicErrors.length} ERROR{logicErrors.length !== 1 ? "S" : ""}</span>}>
              <FiAlertTriangle className="rr-tile-icon" size={56} style={{ color:"#f87171" }} />
              <div className="rr-hover-hint"><div><span className="rr-hover-hint-text">▾ hover to view errors</span></div></div>
              <div className="rr-expand"><div>
                <ItemList items={logicErrors} ac="#f87171" ab="rgba(248,113,113,0.07)" abr="rgba(248,113,113,0.18)" />
              </div></div>
            </Panel>
          ) : (
            <div className="rr-panel rr-card acc-red" style={{ position:"relative" }}>
              <PanelHead icon={FiAlertTriangle} label="Logic Errors" iconBg="rgba(248,113,113,0.1)" iconColor="#f87171"
                right={<span className="rr-count-badge" style={{ color:"#4ade80", background:"rgba(34,197,94,0.07)", borderColor:"rgba(34,197,94,0.2)" }}>CLEAN</span>} />
              <div className="rr-body">
                <FiAlertTriangle className="rr-tile-icon" size={56} style={{ color:"#f87171" }} />
                <p style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--muted)", margin:0 }}>No logic errors — great work!</p>
              </div>
            </div>
          )}

          {/* Hints — 1 col */}
          {hints?.length > 0 && (
            <Panel accent="amber" icon={FiHelpCircle} label="Hints"
              iconBg="rgba(245,158,11,0.1)" iconColor="#f59e0b"
              right={<span className="rr-count-badge" style={{ color:"#f59e0b", background:"rgba(245,158,11,0.07)", borderColor:"rgba(245,158,11,0.2)" }}>{hints.length} HINT{hints.length !== 1 ? "S" : ""}</span>}>
              <FiHelpCircle className="rr-tile-icon" size={56} style={{ color:"#f59e0b" }} />
              <div className="rr-hover-hint"><div><span className="rr-hover-hint-text">▾ hover to reveal hints</span></div></div>
              <div className="rr-expand"><div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {hints.map((h, i) => (
                    <div key={i} className="rr-hint">
                      <span className="rr-num" style={{ color:"#f59e0b", background:"rgba(245,158,11,0.07)", borderColor:"rgba(245,158,11,0.2)" }}>{String(i+1).padStart(2,"0")}</span>
                      {h}
                    </div>
                  ))}
                </div>
              </div></div>
            </Panel>
          )}

          {/* Complexity — 2 cols */}
          {(timeComplexity || spaceComplexity) && (
            <Panel accent="yellow" icon={FiClock} label="Complexity"
              iconBg="rgba(251,191,36,0.1)" iconColor="#fbbf24" cls="rr-s2">
              {/* Always-visible: just the Big-O notations */}
              <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                {[
                  { data:timeComplexity,  Icon:FiClock,    label:"Time",  c:"#fbbf24", bg:"rgba(251,191,36,0.07)", br:"rgba(251,191,36,0.18)" },
                  { data:spaceComplexity, Icon:FiDatabase, label:"Space", c:"#60a5fa", bg:"rgba(96,165,250,0.07)", br:"rgba(96,165,250,0.18)" },
                ].filter(x => x.data).map(({ data, Icon, label, c }) => (
                  <div key={label} className="rr-cx">
                    <div className="rr-cx-head">
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <Icon size={12} style={{ color:c }} />
                        <span style={{ fontFamily:"var(--mono)", fontSize:9.5, letterSpacing:"0.13em", textTransform:"uppercase", color:"var(--muted)" }}>{label}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                        <span className="rr-notation" style={{ color:c }}>{data.current}</span>
                        {data.optimal && data.optimal !== data.current && (
                          <span className="rr-arrow-pill" style={{ color:"#4ade80", background:"rgba(34,197,94,0.06)", borderColor:"rgba(34,197,94,0.18)" }}>
                            <FiArrowRight size={9} />{data.optimal}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rr-hover-hint"><div><span className="rr-hover-hint-text">▾ hover for explanations</span></div></div>
              {/* Single popup with Big-O values + explanations */}
              <div className="rr-expand"><div>
                {[
                  { data:timeComplexity,  Icon:FiClock,    label:"Time",  c:"#fbbf24", bg:"rgba(251,191,36,0.07)", br:"rgba(251,191,36,0.18)" },
                  { data:spaceComplexity, Icon:FiDatabase, label:"Space", c:"#60a5fa", bg:"rgba(96,165,250,0.07)", br:"rgba(96,165,250,0.18)" },
                ].filter(x => x.data).map(({ data, Icon, label, c, bg, br }) => (
                  <div key={label} style={{ marginBottom:14 }}>
                    <div className="rr-cx-head" style={{ marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <Icon size={12} style={{ color:c }} />
                        <span style={{ fontFamily:"var(--mono)", fontSize:9.5, letterSpacing:"0.13em", textTransform:"uppercase", color:"var(--muted)" }}>{label}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                        <span className="rr-notation" style={{ color:c }}>{data.current}</span>
                        {data.optimal && data.optimal !== data.current && (
                          <span className="rr-arrow-pill" style={{ color:"#4ade80", background:"rgba(34,197,94,0.06)", borderColor:"rgba(34,197,94,0.18)" }}>
                            <FiArrowRight size={9} />{data.optimal}
                          </span>
                        )}
                      </div>
                    </div>
                    {data.explanation && (
                      <div className="rr-cx-body">
                        <PointList items={data.explanation} ac={c} ab={bg} abr={br} />
                      </div>
                    )}
                  </div>
                ))}
              </div></div>
            </Panel>
          )}

          {/* Clean Code — 1 col */}
          {cleanCodeSuggestions?.length > 0 && (
            <Panel accent="blue" icon={FiCheckCircle} label="Clean Code"
              iconBg="rgba(96,165,250,0.1)" iconColor="#60a5fa"
              right={<span className="rr-count-badge" style={{ color:"#60a5fa", background:"rgba(96,165,250,0.07)", borderColor:"rgba(96,165,250,0.2)" }}>{cleanCodeSuggestions.length} TIP{cleanCodeSuggestions.length !== 1 ? "S" : ""}</span>}>
              <FiCheckCircle className="rr-tile-icon" size={56} style={{ color:"#60a5fa" }} />
              <div className="rr-hover-hint"><div><span className="rr-hover-hint-text">▾ hover to view suggestions</span></div></div>
              <div className="rr-expand"><div>
                <ItemList items={cleanCodeSuggestions} ac="#60a5fa" ab="rgba(96,165,250,0.07)" abr="rgba(96,165,250,0.18)" />
              </div></div>
            </Panel>
          )}

          {/* Similar Problems — 1 col */}
          {similarProblems?.length > 0 && (
            <Panel accent="indigo" icon={FiBookOpen} label="Similar Problems"
              iconBg="rgba(99,102,241,0.1)" iconColor="#6366f1"
              right={<span className="rr-count-badge" style={{ color:"#6366f1", background:"rgba(99,102,241,0.07)", borderColor:"rgba(99,102,241,0.2)" }}>{similarProblems.length} PROBLEM{similarProblems.length !== 1 ? "S" : ""}</span>}>
              <FiBookOpen className="rr-tile-icon" size={56} style={{ color:"#6366f1" }} />
              <div className="rr-hover-hint"><div><span className="rr-hover-hint-text">▾ hover to view problems</span></div></div>
              <div className="rr-expand"><div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {similarProblems.map((p, i) => (
                    <div key={i} className="rr-prob">
                      <span style={{ fontFamily:"var(--mono)", fontSize:9.5, color:"rgba(99,102,241,0.5)", fontWeight:500, flexShrink:0 }}>{String(i+1).padStart(2,"0")}</span>
                      <span style={{ width:1, height:12, background:"rgba(99,102,241,0.18)", flexShrink:0 }} />
                      {p}
                      <FiArrowRight className="rr-prob-arrow" size={11} style={{ color:"var(--dim)", marginLeft:"auto", flexShrink:0, transition:"color 0.18s" }} />
                    </div>
                  ))}
                </div>
              </div></div>
            </Panel>
          )}

          {/* Optimal Approach — 3 cols */}
          {optimalApproach && (
            <Panel accent="cyan" icon={FiBookOpen} label="Optimal Approach"
              iconBg="rgba(34,211,238,0.08)" iconColor="#22d3ee" cls="rr-s3">
              <div style={{ background:"rgba(34,211,238,0.025)", border:"1px solid rgba(34,211,238,0.07)", borderRadius:10, padding:14 }}>
                {optimalPts[0] && (
                  <div className="rr-pt">
                    <span className="rr-pt-num" style={{ color:"#22d3ee", background:"rgba(34,211,238,0.06)", borderColor:"rgba(34,211,238,0.18)" }}>01</span>
                    <span>{optimalPts[0]}</span>
                  </div>
                )}
                {optimalPts.length > 1 && (
                  <>
                    <div className="rr-hover-hint"><div><span className="rr-hover-hint-text">▾ hover for full approach</span></div></div>
                    <div className="rr-expand"><div>
                      {optimalPts.map((pt, i) => (
                        <div key={i} className="rr-pt" style={{ marginTop: i > 0 ? 9 : 0 }}>
                          <span className="rr-pt-num" style={{ color:"#22d3ee", background:"rgba(34,211,238,0.06)", borderColor:"rgba(34,211,238,0.18)" }}>{String(i+1).padStart(2,"0")}</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div></div>
                  </>
                )}
              </div>
            </Panel>
          )}

          {/* Unit Tests — 1 col */}
          {unitTests?.length > 0 && (
            <Panel accent="teal" icon={FiCheckCircle} label="Unit Tests"
              iconBg="rgba(45,212,191,0.08)" iconColor="#2dd4bf"
              right={<span className="rr-count-badge" style={{ color:"#2dd4bf", background:"rgba(45,212,191,0.07)", borderColor:"rgba(45,212,191,0.2)" }}>{unitTests.length} TEST{unitTests.length !== 1 ? "S" : ""}</span>}>
              <FiCheckCircle className="rr-tile-icon" size={56} style={{ color:"#2dd4bf" }} />
              <div className="rr-hover-hint"><div><span className="rr-hover-hint-text">▾ hover to view tests</span></div></div>
              <div className="rr-expand"><div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {unitTests.map((t, i) => (
                    <div key={i}>
                      <div style={{ fontFamily:"var(--mono)", fontSize:9.5, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(45,212,191,0.45)", marginBottom:7 }}>
                        test_{String(i+1).padStart(2,"0")}
                      </div>
                      <CodeBlock code={t} language={lang} maxHeight="220px" />
                    </div>
                  ))}
                </div>
              </div></div>
            </Panel>
          )}

        </div>{/* end bento grid */}

        {/* ── Optimized Code — full width, always shown ── */}
        {optimizedCode && (
          <Panel accent="purple" icon={FiCode} label="Optimized Code"
            iconBg="rgba(167,139,250,0.1)" iconColor="#a78bfa">
            <div className="rr-opt-grid">
              <CodeBlock
                code={optimizedCode}
                language={lang}
                label="solution"
                maxHeight="380px"
              />
              <div className="rr-walk">
                <div className="rr-walk-head">
                  <FiBookOpen size={10} />
                  Walkthrough
                </div>
                {optimizedCodeExplanation
                  ? <PointList items={optimizedCodeExplanation} ac="#a78bfa" ab="rgba(167,139,250,0.08)" abr="rgba(167,139,250,0.2)" />
                  : <p style={{ fontStyle:"italic", fontSize:12.5, color:"var(--muted)", margin:0 }}>Step through the solution on the left.</p>
                }
              </div>
            </div>
          </Panel>
        )}

      </div>
    </>
  );
}