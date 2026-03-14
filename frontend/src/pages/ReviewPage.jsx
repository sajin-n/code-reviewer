import { useState } from "react";
import toast from "react-hot-toast";
import { FiSend, FiHelpCircle, FiActivity, FiCheckSquare, FiTrash2 } from "react-icons/fi";
import CodeEditor from "../components/CodeEditor";
import LanguageSelector from "../components/LanguageSelector";
import ReviewResult from "../components/ReviewResult";
import LoadingSpinner from "../components/LoadingSpinner";
import { submitReview, getHints, getComplexity, getUnitTests } from "../api/reviewApi";
import { useReview } from "../context/ReviewContext";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Syne:wght@500;600;700&display=swap');

  .rp-root { font-family: 'Syne', sans-serif; }
  .rp-mono { font-family: 'Geist Mono', monospace; }

  .rp-scanline {
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent, transparent 2px,
      rgba(255,255,255,0.006) 2px, rgba(255,255,255,0.006) 4px
    );
    pointer-events: none;
    z-index: 0;
  }

  /* Problem name input */
  .rp-input {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.03em;
    background: #0d0d14;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    color: rgba(255,255,255,0.65);
    padding: 9px 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    min-width: 200px;
    flex: 1;
  }
  .rp-input::placeholder { color: rgba(255,255,255,0.2); }
  .rp-input:focus {
    border-color: rgba(99,102,241,0.45);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
    color: rgba(255,255,255,0.8);
  }

  /* Action buttons */
  .rp-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: 10px;
    border: 1px solid;
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }
  .rp-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  .rp-btn:not(:disabled):hover { transform: translateY(-1px); }
  .rp-btn:not(:disabled):active { transform: translateY(0); }

  .rp-btn-primary {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.35);
    color: #a78bfa;
    box-shadow: 0 0 0 0 rgba(99,102,241,0);
  }
  .rp-btn-primary:not(:disabled):hover {
    background: rgba(99,102,241,0.2);
    border-color: rgba(99,102,241,0.55);
    box-shadow: 0 4px 20px rgba(99,102,241,0.2);
    color: #c4b5fd;
  }
  .rp-btn-primary.rp-btn-loading {
    background: rgba(99,102,241,0.08);
    border-color: rgba(99,102,241,0.2);
    color: rgba(167,139,250,0.5);
  }

  .rp-btn-yellow {
    background: rgba(245,158,11,0.08);
    border-color: rgba(245,158,11,0.25);
    color: #fbbf24;
  }
  .rp-btn-yellow:not(:disabled):hover {
    background: rgba(245,158,11,0.14);
    border-color: rgba(245,158,11,0.45);
    box-shadow: 0 4px 20px rgba(245,158,11,0.15);
  }

  .rp-btn-amber {
    background: rgba(251,191,36,0.07);
    border-color: rgba(251,191,36,0.2);
    color: #f59e0b;
  }
  .rp-btn-amber:not(:disabled):hover {
    background: rgba(251,191,36,0.13);
    border-color: rgba(251,191,36,0.4);
    box-shadow: 0 4px 20px rgba(251,191,36,0.12);
  }

  .rp-btn-teal {
    background: rgba(45,212,191,0.07);
    border-color: rgba(45,212,191,0.2);
    color: #2dd4bf;
  }
  .rp-btn-teal:not(:disabled):hover {
    background: rgba(45,212,191,0.13);
    border-color: rgba(45,212,191,0.4);
    box-shadow: 0 4px 20px rgba(45,212,191,0.12);
  }

  .rp-btn-ghost {
    background: rgba(255,255,255,0.03);
    border-color: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.3);
  }
  .rp-btn-ghost:not(:disabled):hover {
    background: rgba(239,68,68,0.07);
    border-color: rgba(239,68,68,0.2);
    color: #f87171;
  }

  /* Loading state */
  .rp-loading-wrap {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 22px 20px;
    margin-top: 20px;
    border-radius: 14px;
    background: #0d0d14;
    border: 1px solid rgba(99,102,241,0.15);
  }

  .rp-spinner {
    width: 24px; height: 24px; flex-shrink: 0;
    border-radius: 50%;
    border: 2px solid rgba(99,102,241,0.15);
    border-top-color: rgba(99,102,241,0.7);
    animation: rp-spin 0.75s linear infinite;
  }
  @keyframes rp-spin { to { transform: rotate(360deg); } }

  .rp-loading-dots::after {
    content: '';
    animation: rp-dots 1.4s steps(4, end) infinite;
  }
  @keyframes rp-dots {
    0%   { content: ''; }
    25%  { content: '.'; }
    50%  { content: '..'; }
    75%  { content: '...'; }
    100% { content: ''; }
  }

  /* Controls bar */
  .rp-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    margin-bottom: 12px;
    background: #0d0d14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
  }

  .rp-divider {
    width: 1px; height: 20px;
    background: rgba(255,255,255,0.07);
    flex-shrink: 0;
  }

  /* Active action pill */
  .rp-action-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
  }
`;

const ACTION_LABELS = {
  review:     "Running full AI review",
  complexity: "Analyzing complexity",
  hints:      "Generating hints",
  tests:      "Generating unit tests",
};

export default function ReviewPage() {
  const {
    code, setCode,
    language, setLanguage,
    problemName, setProblemName,
    feedback, setFeedback,
    clearReview, DEFAULT_CODE,
  } = useReview();

  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const handleAction = async (action, apiFn) => {
    if (!code.trim() || code.trim() === DEFAULT_CODE.trim()) {
      toast.error("Please enter some code first");
      return;
    }
    setLoading(true);
    setActiveAction(action);
    setFeedback(null);
    try {
      const result = await apiFn();
      if (action === "review") {
        setFeedback(result.feedback);
      } else if (action === "hints") {
        setFeedback({ hints: result.hints || [] });
      } else if (action === "complexity") {
        setFeedback({
          timeComplexity: result.time_complexity || {},
          spaceComplexity: result.space_complexity || {},
        });
      } else if (action === "tests") {
        setFeedback({ unitTests: result.unit_tests || [] });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="rp-scanline" />

      <div className="rp-root relative z-10 max-w-6xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="mb-7">
          <div
            className="rp-mono mb-1.5"
            style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(99,102,241,0.6)" }}
          >
            GEKKO /AI
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: "-0.5px" }}>
            Code Review
          </h1>
          <p
            className="rp-mono mt-1.5"
            style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", letterSpacing: "0.02em" }}
          >
            Paste your code, choose a language, and let the AI do the rest.
          </p>
        </div>

        {/* Controls bar */}
        <div className="rp-controls">
          <LanguageSelector language={language} onChange={setLanguage} />
          <div className="rp-divider" />
          <input
            type="text"
            value={problemName}
            onChange={(e) => setProblemName(e.target.value)}
            placeholder="Problem name (optional)"
            className="rp-input"
          />
        </div>

        {/* Editor */}
        <CodeEditor code={code} onChange={setCode} language={language} />

        {/* Action buttons */}
        <div className="rp-action-bar">
          <button
            className={`rp-btn rp-btn-primary ${loading && activeAction === "review" ? "rp-btn-loading" : ""}`}
            onClick={() => handleAction("review", () => submitReview(code, language, problemName))}
            disabled={loading}
          >
            <FiSend size={12} />
            Full Review
          </button>

          <button
            className="rp-btn rp-btn-yellow"
            onClick={() => handleAction("complexity", () => getComplexity(code, language))}
            disabled={loading}
          >
            <FiActivity size={12} />
            Complexity
          </button>

          <button
            className="rp-btn rp-btn-amber"
            onClick={() => handleAction("hints", () => getHints(code, language))}
            disabled={loading}
          >
            <FiHelpCircle size={12} />
            Hints
          </button>

          <button
            className="rp-btn rp-btn-teal"
            onClick={() => handleAction("tests", () => getUnitTests(code, language))}
            disabled={loading}
          >
            <FiCheckSquare size={12} />
            Gen Tests
          </button>

          {feedback && !loading && (
            <button
              className="rp-btn rp-btn-ghost"
              onClick={clearReview}
              style={{ marginLeft: "auto" }}
            >
              <FiTrash2 size={12} />
              Clear
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="rp-loading-wrap">
            <div className="rp-spinner" />
            <div>
              <span
                className="rp-mono rp-loading-dots"
                style={{ fontSize: 12, color: "rgba(167,139,250,0.7)", letterSpacing: "0.05em" }}
              >
                {ACTION_LABELS[activeAction] || "Processing"}
              </span>
              <p
                className="rp-mono mt-1"
                style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                AI model processing · please wait
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && feedback && <ReviewResult feedback={feedback} language={language} />}
      </div>
    </>
  );
}