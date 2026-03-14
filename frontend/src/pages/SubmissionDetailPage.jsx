import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSubmission } from "../api/reviewApi";
import ReviewResult from "../components/ReviewResult";
import { FiArrowLeft, FiClock, FiCode } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const LANG_MAP = {
  javascript: "javascript", typescript: "typescript", python: "python",
  java: "java", cpp: "cpp", c: "c", go: "go", rust: "rust",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Syne:wght@500;600;700&display=swap');

  .sd-root { font-family: 'Syne', sans-serif; }
  .sd-mono { font-family: 'Geist Mono', monospace; }

  .sd-scanline {
    position: fixed; inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(255,255,255,0.006) 2px, rgba(255,255,255,0.006) 4px
    );
    pointer-events: none; z-index: 0;
  }

  .sd-back-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    text-decoration: none;
    padding: 7px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    transition: all 0.2s;
    margin-bottom: 28px;
  }
  .sd-back-link:hover {
    color: rgba(255,255,255,0.65);
    border-color: rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    transform: translateX(-2px);
  }

  .sd-meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.35);
  }

  .sd-code-card {
    position: relative;
    background: #0d0d14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .sd-code-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: linear-gradient(180deg, rgba(99,102,241,0.6), transparent);
    border-radius: 14px 0 0 14px;
  }

  .sd-code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    position: relative;
  }
  .sd-code-header::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.25), transparent);
  }

  .sd-traffic { display: flex; align-items: center; gap: 6px; }
  .sd-dot {
    width: 10px; height: 10px; border-radius: 50%;
  }

  .sd-code-body {
    padding: 20px 20px 20px 22px;
    overflow-x: auto;
  }
  .sd-code-body pre {
    font-family: 'Geist Mono', monospace;
    font-size: 12.5px;
    color: #e2e8f0;
    white-space: pre-wrap;
    line-height: 1.75;
    margin: 0;
  }

  /* Syntax highlighter overrides */
  .sd-syntax-wrap pre { margin: 0 !important; border-radius: 0 !important; }
  .sd-syntax-wrap code { font-family: 'Geist Mono', 'Fira Code', monospace !important; font-size: 12.5px !important; line-height: 1.75 !important; }

  /* Loading */
  .sd-spinner {
    width: 26px; height: 26px;
    border-radius: 50%;
    border: 2px solid rgba(99,102,241,0.12);
    border-top-color: rgba(99,102,241,0.65);
    animation: sd-spin 0.75s linear infinite;
  }
  @keyframes sd-spin { to { transform: rotate(360deg); } }

  /* Error */
  .sd-error-card {
    background: #0d0d14;
    border: 1px solid rgba(239,68,68,0.15);
    border-radius: 14px;
    padding: 40px;
    text-align: center;
  }
  .sd-error-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.18);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    font-size: 20px;
  }
`;

const LANG_COLORS = {
  javascript: { color: "#F7DF1E", bg: "rgba(247,223,30,0.08)", border: "rgba(247,223,30,0.2)" },
  typescript: { color: "#3178C6", bg: "rgba(49,120,198,0.08)", border: "rgba(49,120,198,0.2)" },
  python:     { color: "#3ECFCF", bg: "rgba(62,207,207,0.08)", border: "rgba(62,207,207,0.2)" },
  java:       { color: "#ED8B00", bg: "rgba(237,139,0,0.08)",  border: "rgba(237,139,0,0.2)" },
  cpp:        { color: "#A97FE8", bg: "rgba(169,127,232,0.08)", border: "rgba(169,127,232,0.2)" },
  c:          { color: "#6C8EBF", bg: "rgba(108,142,191,0.08)", border: "rgba(108,142,191,0.2)" },
  go:         { color: "#00ADD8", bg: "rgba(0,173,216,0.08)",  border: "rgba(0,173,216,0.2)" },
  rust:       { color: "#F74C00", bg: "rgba(247,76,0,0.08)",   border: "rgba(247,76,0,0.2)" },
};

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSubmission(id)
      .then(setSubmission)
      .catch((err) => setError(err.response?.data?.error || "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="sd-scanline" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 14 }}>
          <div className="sd-spinner" />
          <span className="sd-mono" style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
            Loading Submission
          </span>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="sd-scanline" />
        <div className="sd-root relative z-10 max-w-4xl mx-auto px-4 py-16">
          <div className="sd-error-card">
            <div className="sd-error-icon">⚠</div>
            <p className="sd-mono" style={{ fontSize: 12, color: "#f87171", marginBottom: 16, letterSpacing: "0.03em" }}>{error}</p>
            <Link to="/dashboard" className="sd-back-link" style={{ display: "inline-flex", margin: 0 }}>
              <FiArrowLeft size={12} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </>
    );
  }

  const langKey = submission.language?.toLowerCase();
  const langStyle = LANG_COLORS[langKey] || { color: "#888", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" };
  const overall = submission.feedback?.score?.overall;
  const scoreStyle =
    overall == null ? null :
    overall >= 70 ? { color: "#a78bfa", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)" } :
    overall >= 40 ? { color: "#fbbf24", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" } :
                    { color: "#f87171", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" };

  return (
    <>
      <style>{STYLES}</style>
      <div className="sd-scanline" />

      <div className="sd-root relative z-10 max-w-6xl mx-auto px-4 py-10">

        {/* Back */}
        <Link to="/dashboard" className="sd-back-link">
          <FiArrowLeft size={11} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div className="sd-mono" style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(99,102,241,0.6)", marginBottom: 6 }}>
            GEKKO /AI · Submission
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: "-0.5px" }}>
              {submission.problemName || "Untitled"}
            </h1>
            {scoreStyle && overall != null && (
              <span
                className="sd-mono"
                style={{
                  fontSize: 13, fontWeight: 700,
                  padding: "5px 14px", borderRadius: 8,
                  background: scoreStyle.bg, color: scoreStyle.color, border: `1px solid ${scoreStyle.border}`,
                }}
              >
                {overall}/100
              </span>
            )}
          </div>

          {/* Meta chips */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 12 }}>
            <span
              className="sd-meta-chip"
              style={{ color: langStyle.color, background: langStyle.bg, borderColor: langStyle.border }}
            >
              <FiCode size={10} />
              {submission.language}
            </span>
            <span className="sd-meta-chip">
              <FiClock size={10} />
              {new Date(submission.createdAt).toLocaleString("en-GB", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Submitted Code */}
        <div className="sd-code-card">
          <div className="sd-code-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="sd-traffic">
                <div className="sd-dot" style={{ background: "#ff5f57", boxShadow: "0 0 5px rgba(255,95,87,0.4)" }} />
                <div className="sd-dot" style={{ background: "#ffbd2e", boxShadow: "0 0 5px rgba(255,189,46,0.4)" }} />
                <div className="sd-dot" style={{ background: "#28c840", boxShadow: "0 0 5px rgba(40,200,64,0.4)" }} />
              </div>
              <span className="sd-mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                Submitted Code
              </span>
            </div>
            <span
              className="sd-mono"
              style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: langStyle.color, opacity: 0.7 }}
            >
              {submission.language}
            </span>
          </div>
          <div className="sd-code-body sd-syntax-wrap">
            <SyntaxHighlighter
              language={LANG_MAP[langKey] || "javascript"}
              style={vscDarkPlus}
              customStyle={{ background: "transparent", padding: "20px 20px 20px 22px", margin: 0 }}
              showLineNumbers
              lineNumberStyle={{ color: "rgba(255,255,255,0.15)", minWidth: "2.5em", paddingRight: "1em" }}
              wrapLongLines
            >
              {submission.code}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Review feedback */}
        <ReviewResult feedback={submission.feedback} language={submission.language} />
      </div>
    </>
  );
}