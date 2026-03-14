import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";

const LANGUAGE_MAP = {
  javascript: "javascript", python: "python", java: "java",
  cpp: "cpp", c: "c", typescript: "typescript", go: "go", rust: "rust",
};

const LANG_META = {
  javascript: { label: "JS",  color: "#F7DF1E", glow: "rgba(247,223,30,0.15)",  dim: "rgba(247,223,30,0.06)",  ext: ".js"  },
  typescript: { label: "TS",  color: "#4FC3F7", glow: "rgba(79,195,247,0.15)",  dim: "rgba(79,195,247,0.06)",  ext: ".ts"  },
  python:     { label: "PY",  color: "#69F0AE", glow: "rgba(105,240,174,0.15)", dim: "rgba(105,240,174,0.06)", ext: ".py"  },
  java:       { label: "JV",  color: "#FFB74D", glow: "rgba(255,183,77,0.15)",  dim: "rgba(255,183,77,0.06)",  ext: ".java"},
  cpp:        { label: "C++", color: "#CE93D8", glow: "rgba(206,147,216,0.15)", dim: "rgba(206,147,216,0.06)", ext: ".cpp" },
  c:          { label: "C",   color: "#80CBC4", glow: "rgba(128,203,196,0.15)", dim: "rgba(128,203,196,0.06)", ext: ".c"   },
  go:         { label: "GO",  color: "#4DD0E1", glow: "rgba(77,208,225,0.15)",  dim: "rgba(77,208,225,0.06)",  ext: ".go"  },
  rust:       { label: "RS",  color: "#FF8A65", glow: "rgba(255,138,101,0.15)", dim: "rgba(255,138,101,0.06)", ext: ".rs"  },
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --ce-bg:      #080810;
    --ce-surface: #0d0d18;
    --ce-raised:  #111120;
    --ce-border:  rgba(255,255,255,0.055);
    --ce-border2: rgba(255,255,255,0.10);
    --ce-text:    rgba(255,255,255,0.75);
    --ce-muted:   rgba(255,255,255,0.28);
    --ce-mono:    'JetBrains Mono', 'Fira Code', monospace;
    --ce-sans:    'Outfit', system-ui, sans-serif;
  }

  /* ── Outer shell ── */
  .ce-shell {
    font-family: var(--ce-sans);
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    background: var(--ce-bg);
    border: 1px solid var(--ce-border);
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .ce-shell::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    background:
      radial-gradient(ellipse 60% 30% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .ce-shell.focused {
    border-color: rgba(255,255,255,0.10);
    box-shadow:
      0 0 0 1px rgba(99,102,241,0.12),
      0 0 60px rgba(99,102,241,0.06),
      0 32px 80px rgba(0,0,0,0.7);
  }

  /* Noise texture overlay */
  .ce-noise {
    position: absolute;
    inset: 0;
    border-radius: 18px;
    opacity: 0.025;
    pointer-events: none;
    z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 128px 128px;
  }

  /* ── Title bar ── */
  .ce-titlebar {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 52px;
    background: linear-gradient(180deg, rgba(255,255,255,0.035) 0%, transparent 100%);
    border-bottom: 1px solid var(--ce-border);
  }

  /* Accent rule on titlebar bottom */
  .ce-titlebar::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px;
    z-index: 3;
  }

  .ce-left  { display: flex; align-items: center; gap: 14px; }
  .ce-right { display: flex; align-items: center; gap: 8px; }

  /* Traffic lights */
  .ce-lights { display: flex; gap: 6px; align-items: center; }
  .ce-light {
    width: 11px; height: 11px;
    border-radius: 50%;
    position: relative;
    cursor: default;
    transition: filter 0.2s;
  }
  .ce-light:hover { filter: brightness(1.25); }
  .ce-light::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 50%;
    background: rgba(255,255,255,0.18);
  }
  .ce-l-r { background: #FF5F57; box-shadow: 0 0 8px rgba(255,95,87,0.35); }
  .ce-l-y { background: #FFBD2E; box-shadow: 0 0 8px rgba(255,189,46,0.35); }
  .ce-l-g { background: #28C840; box-shadow: 0 0 8px rgba(40,200,64,0.35); }

  /* Separator pipe */
  .ce-pipe {
    width: 1px; height: 20px;
    background: var(--ce-border);
    flex-shrink: 0;
  }

  /* Language badge */
  .ce-lang {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px 4px 5px;
    border-radius: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--ce-border);
    transition: background 0.2s, border-color 0.2s;
    cursor: default;
  }
  .ce-lang:hover {
    background: rgba(255,255,255,0.05);
    border-color: var(--ce-border2);
  }
  .ce-lang-chip {
    width: 26px; height: 26px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--ce-mono);
    font-size: 8.5px;
    font-weight: 600;
    letter-spacing: -0.3px;
    border: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  }
  .ce-lang-name {
    font-family: var(--ce-mono);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
  }
  .ce-lang-ext {
    font-family: var(--ce-mono);
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.05em;
  }

  /* Filepath hint */
  .ce-filepath {
    font-family: var(--ce-mono);
    font-size: 10px;
    font-weight: 300;
    color: rgba(255,255,255,0.18);
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .ce-filepath-seg { color: rgba(255,255,255,0.26); }

  /* Action buttons */
  .ce-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 7px;
    border: 1px solid var(--ce-border);
    background: rgba(255,255,255,0.03);
    color: var(--ce-muted);
    font-family: var(--ce-mono);
    font-size: 10.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
  .ce-btn:hover {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.75);
    border-color: var(--ce-border2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  .ce-btn:active { transform: translateY(0); box-shadow: none; }
  .ce-btn svg { width: 11px; height: 11px; flex-shrink: 0; }

  .ce-btn-copied {
    background: rgba(40,200,64,0.08) !important;
    color: #28C840 !important;
    border-color: rgba(40,200,64,0.2) !important;
  }
  .ce-btn-clear:hover {
    background: rgba(255,95,87,0.07) !important;
    color: #ff8a85 !important;
    border-color: rgba(255,95,87,0.18) !important;
  }

  /* ── Editor area ── */
  .ce-editor-area {
    position: relative;
    background: var(--ce-surface);
    z-index: 2;
  }

  /* Left gutter accent bar */
  .ce-gutter-bar {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    z-index: 10;
    pointer-events: none;
    transition: opacity 0.3s;
  }
  .ce-gutter-bar.active { opacity: 1; }
  .ce-gutter-bar.inactive { opacity: 0.3; }

  /* ── Status bar ── */
  .ce-statusbar {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 34px;
    background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.02) 100%);
    border-top: 1px solid var(--ce-border);
    overflow: hidden;
  }

  .ce-status-left  { display: flex; align-items: center; gap: 16px; }
  .ce-status-right { display: flex; align-items: center; gap: 10px; }

  .ce-stat {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: var(--ce-mono);
    font-size: 10px;
    font-weight: 400;
    color: rgba(255,255,255,0.22);
    letter-spacing: 0.04em;
  }
  .ce-stat b { color: rgba(255,255,255,0.42); font-weight: 500; }

  .ce-stat-sep {
    width: 1px; height: 10px;
    background: rgba(255,255,255,0.07);
    flex-shrink: 0;
  }

  /* Ready indicator */
  .ce-ready {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: var(--ce-mono);
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.2);
  }
  .ce-ready-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    transition: all 0.3s;
    flex-shrink: 0;
  }
  .ce-ready-dot.on {
    background: #28C840;
    box-shadow: 0 0 6px rgba(40,200,64,0.6), 0 0 12px rgba(40,200,64,0.2);
    animation: ce-beat 2.4s ease-in-out infinite;
  }
  @keyframes ce-beat {
    0%, 100% { box-shadow: 0 0 6px rgba(40,200,64,0.6), 0 0 12px rgba(40,200,64,0.2); }
    50%       { box-shadow: 0 0 10px rgba(40,200,64,0.9), 0 0 20px rgba(40,200,64,0.35); }
  }

  /* Animated scan line on focus */
  .ce-scanbeam {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 80px;
    background: linear-gradient(180deg, rgba(99,102,241,0.04) 0%, transparent 100%);
    pointer-events: none;
    z-index: 1;
    transform: translateY(-100%);
    transition: none;
  }
  .ce-shell.focused .ce-scanbeam {
    animation: ce-scan 3.5s ease-in-out infinite;
  }
  @keyframes ce-scan {
    0%   { transform: translateY(-100%); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.4; }
    100% { transform: translateY(900%); opacity: 0; }
  }

  /* Token counter pill */
  .ce-token-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 8px;
    border-radius: 99px;
    font-family: var(--ce-mono);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.08em;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.025);
    color: rgba(255,255,255,0.28);
    transition: all 0.2s;
  }
  .ce-token-pill.has-code {
    border-color: rgba(99,102,241,0.2);
    background: rgba(99,102,241,0.06);
    color: rgba(99,102,241,0.7);
  }
`;

export default function CodeEditor({ code, onChange, language = "javascript" }) {
  const [focused, setFocused] = useState(false);
  const [copied, setCopied]   = useState(false);
  const langKey  = language?.toLowerCase() || "javascript";
  const meta     = LANG_META[langKey] || { label:"?", color:"#888", glow:"transparent", dim:"transparent", ext:".txt" };

  const lines  = code ? code.split("\n").length : 0;
  const chars  = code ? code.length : 0;
  const tokens = Math.ceil(chars / 4);

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className={`ce-shell${focused ? " focused" : ""}`}>
        <div className="ce-noise" />
        <div className="ce-scanbeam" />

        {/* ── Title bar ── */}
        <div className="ce-titlebar" style={{
          "--accent-glow": meta.glow,
        }}>
          <div className="ce-left">
            {/* Traffic lights */}
            <div className="ce-lights">
              <div className="ce-light ce-l-r" />
              <div className="ce-light ce-l-y" />
              <div className="ce-light ce-l-g" />
            </div>

            <div className="ce-pipe" />

            {/* Language badge */}
            <div className="ce-lang">
              <div className="ce-lang-chip" style={{
                background: meta.dim,
                color: meta.color,
                boxShadow: `0 0 10px ${meta.glow}`,
              }}>
                {meta.label}
              </div>
              <span className="ce-lang-name">{langKey}</span>
            </div>

            {/* Filepath hint */}
            <div className="ce-filepath">
              <span className="ce-filepath-seg">~/</span>
              <span className="ce-filepath-seg">project/</span>
              <span style={{ color:"rgba(255,255,255,0.35)" }}>solution</span>
              <span style={{ color: meta.color, opacity: 0.6 }}>{meta.ext}</span>
            </div>
          </div>

          <div className="ce-right">
            <button
              className={`ce-btn${copied ? " ce-btn-copied" : ""}`}
              onClick={handleCopy}
              title="Copy code"
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="5" y="5" width="9" height="9" rx="2"/>
                    <path d="M11 5V3a1 1 0 00-1-1H3a1 1 0 001 1v7a1 1 0 001 1h2" strokeLinecap="round"/>
                  </svg>
                  Copy
                </>
              )}
            </button>

            <button
              className="ce-btn ce-btn-clear"
              onClick={() => onChange("")}
              title="Clear editor"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round"/>
              </svg>
              Clear
            </button>
          </div>
        </div>

        {/* ── Editor ── */}
        <div
          className="ce-editor-area"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {/* Left accent gutter */}
          <div
            className={`ce-gutter-bar ${focused ? "active" : "inactive"}`}
            style={{
              background: `linear-gradient(180deg, ${meta.color}99 0%, ${meta.color}44 40%, transparent 100%)`,
            }}
          />

          <Editor
            height="55vh"
            language={LANGUAGE_MAP[langKey] || "javascript"}
            theme="vs-dark"
            value={code}
            onChange={(v) => onChange(v || "")}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              padding: { top: 22, bottom: 22 },
              lineNumbers: "on",
              lineNumbersMinChars: 4,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              bracketPairColorization: { enabled: true },
              wordWrap: "on",
              renderLineHighlight: "gutter",
              cursorBlinking: "phase",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              renderWhitespace: "none",
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 6,
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              scrollbar: {
                verticalScrollbarSize: 5,
                horizontalScrollbarSize: 5,
              },
            }}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme("ce-noir", {
                base: "vs-dark",
                inherit: true,
                rules: [
                  { token: "comment",   foreground: "3d4f63", fontStyle: "italic" },
                  { token: "keyword",   foreground: "b39ddb" },
                  { token: "string",    foreground: "80cbc4" },
                  { token: "number",    foreground: "ffcc80" },
                  { token: "type",      foreground: "80deea" },
                  { token: "function",  foreground: "90caf9" },
                  { token: "variable",  foreground: "eceff1" },
                  { token: "operator",  foreground: "f48fb1" },
                  { token: "delimiter", foreground: "546e7a" },
                  { token: "tag",       foreground: "ef9a9a" },
                  { token: "attribute", foreground: "ffe082" },
                ],
                colors: {
                  "editor.background":                 "#0d0d18",
                  "editor.foreground":                 "#cfd8dc",
                  "editor.lineHighlightBackground":    "#ffffff07",
                  "editor.lineHighlightBorderColor":   "#ffffff00",
                  "editor.selectionBackground":        "#6366f128",
                  "editor.inactiveSelectionBackground":"#6366f112",
                  "editorLineNumber.foreground":       "#263040",
                  "editorLineNumber.activeForeground": "#546e7a",
                  "editorCursor.foreground":           "#b39ddb",
                  "editorWhitespace.foreground":       "#1a2233",
                  "editorIndentGuide.background1":     "#1a2233",
                  "editorIndentGuide.activeBackground1":"#37474f",
                  "scrollbarSlider.background":        "#ffffff0a",
                  "scrollbarSlider.hoverBackground":   "#ffffff14",
                  "scrollbarSlider.activeBackground":  "#6366f130",
                  "editorGutter.background":           "#0d0d18",
                  "editorBracketMatch.background":     "#6366f120",
                  "editorBracketMatch.border":         "#6366f155",
                  "editor.findMatchBackground":        "#fbbf2430",
                  "editor.findMatchHighlightBackground":"#fbbf2415",
                },
              });
            }}
            onMount={(editor, monaco) => {
              monaco.editor.setTheme("ce-noir");
            }}
            loading={
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "55vh",
                background: "#0d0d18",
                gap: 16,
              }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(99,102,241,0.12)",
                  borderTop: "1.5px solid rgba(99,102,241,0.6)",
                  animation: "ce-spin 0.7s linear infinite",
                }} />
                <style>{`@keyframes ce-spin { to { transform: rotate(360deg); } }`}</style>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.18)",
                }}>LOADING EDITOR</span>
              </div>
            }
          />
        </div>

        {/* ── Status bar ── */}
        <div className="ce-statusbar">
          <div className="ce-status-left">
            <div className="ce-stat">
              <span>Ln</span>
              <b>{lines}</b>
            </div>
            <div className="ce-stat-sep" />
            <div className="ce-stat">
              <span>Ch</span>
              <b>{chars.toLocaleString()}</b>
            </div>
            <div className="ce-stat-sep" />
            <div className={`ce-token-pill${code ? " has-code" : ""}`}>
              ~{tokens.toLocaleString()} tokens
            </div>
          </div>
        </div>
      </div>
    </>
  );
}