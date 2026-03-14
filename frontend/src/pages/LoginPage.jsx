import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiCode, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Syne:wght@500;600;700;800&display=swap');

  .lp-root {
    font-family: 'Syne', sans-serif;
    min-height: calc(100vh - 64px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    position: relative;
    overflow: hidden;
  }

  /* Ambient background glow */
  .lp-glow-1 {
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
    top: -120px; left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }
  .lp-glow-2 {
    position: absolute;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%);
    bottom: 0; right: -60px;
    pointer-events: none;
  }

  /* Scanline */
  .lp-scanline {
    position: fixed; inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(255,255,255,0.006) 2px, rgba(255,255,255,0.006) 4px
    );
    pointer-events: none; z-index: 0;
  }

  /* Grid pattern */
  .lp-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
    pointer-events: none;
  }

  .lp-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    background: #0d0d14;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 36px 32px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.02),
      0 32px 80px rgba(0,0,0,0.6),
      0 8px 24px rgba(0,0,0,0.4);
  }
  .lp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 50%; transform: translateX(-50%);
    width: 60%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent);
    border-radius: 1px;
  }

  /* Logo mark */
  .lp-logo-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 28px;
  }
  .lp-logo-icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.25);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
    box-shadow: 0 0 24px rgba(99,102,241,0.12);
  }

  /* Field */
  .lp-label {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    display: block;
    margin-bottom: 7px;
  }

  .lp-input-wrap { position: relative; }

  .lp-input-icon {
    position: absolute;
    left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.2);
    pointer-events: none;
    transition: color 0.2s;
  }

  .lp-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 11px 14px 11px 38px;
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .lp-input::placeholder { color: rgba(255,255,255,0.18); }
  .lp-input:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.04);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
    color: rgba(255,255,255,0.9);
  }
  .lp-input:focus + .lp-input-icon,
  .lp-input-wrap:focus-within .lp-input-icon {
    color: rgba(99,102,241,0.7);
  }

  /* Submit button */
  .lp-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px;
    border-radius: 11px;
    border: 1px solid rgba(99,102,241,0.4);
    background: rgba(99,102,241,0.12);
    color: #a78bfa;
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 6px;
  }
  .lp-submit:hover:not(:disabled) {
    background: rgba(99,102,241,0.2);
    border-color: rgba(99,102,241,0.65);
    box-shadow: 0 4px 24px rgba(99,102,241,0.2);
    color: #c4b5fd;
    transform: translateY(-1px);
  }
  .lp-submit:active:not(:disabled) { transform: translateY(0); }
  .lp-submit:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* Loading dots */
  .lp-dots::after {
    content: '';
    animation: lp-dot 1.4s steps(4, end) infinite;
  }
  @keyframes lp-dot {
    0%   { content: ''; }
    25%  { content: '.'; }
    50%  { content: '..'; }
    75%  { content: '...'; }
    100% { content: ''; }
  }

  /* Divider */
  .lp-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 22px 0 0;
  }
  .lp-divider-line {
    flex: 1; height: 1px;
    background: rgba(255,255,255,0.05);
  }
  .lp-divider-text {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.18);
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="lp-scanline" />

      <div className="lp-root">
        <div className="lp-glow-1" />
        <div className="lp-glow-2" />
        <div className="lp-grid" />

        <div className="lp-card">

          {/* Logo */}
          <div className="lp-logo-wrap">
            <div className="lp-logo-icon">
              <FiCode size={20} style={{ color: "#a78bfa" }} />
            </div>
            <div
              style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(99,102,241,0.6)", marginBottom: 8 }}
            >
              GEKKO /AI
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: "-0.3px", marginBottom: 6 }}>
              Welcome back
            </h1>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: "0.03em" }}>
              Sign in to continue reviewing code
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Email */}
            <div>
              <label className="lp-label">Email</label>
              <div className="lp-input-wrap">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="lp-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <FiMail size={13} className="lp-input-icon" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="lp-label">Password</label>
              <div className="lp-input-wrap">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="lp-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <FiLock size={13} className="lp-input-icon" />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="lp-submit" disabled={loading}>
              {loading ? (
                <span className="lp-dots">Signing in</span>
              ) : (
                <>
                  Sign In
                  <FiArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="lp-divider">
            <div className="lp-divider-line" />
            <span className="lp-divider-text">No account?</span>
            <div className="lp-divider-line" />
          </div>

          <div style={{ textAlign: "center", marginTop: 14 }}>
            <Link
              to="/register"
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "rgba(99,102,241,0.7)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = "#a78bfa"}
              onMouseLeave={e => e.target.style.color = "rgba(99,102,241,0.7)"}
            >
              Create an account →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}