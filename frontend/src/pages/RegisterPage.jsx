import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiCode, FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Syne:wght@500;600;700;800&display=swap');

  .rg-root {
    font-family: 'Syne', sans-serif;
    min-height: calc(100vh - 64px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    position: relative;
    overflow: hidden;
  }

  .rg-glow-1 {
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%);
    top: -120px; left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }
  .rg-glow-2 {
    position: absolute;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%);
    bottom: 0; left: -60px;
    pointer-events: none;
  }

  .rg-scanline {
    position: fixed; inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(255,255,255,0.006) 2px, rgba(255,255,255,0.006) 4px
    );
    pointer-events: none; z-index: 0;
  }

  .rg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
    pointer-events: none;
  }

  .rg-card {
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
  .rg-card::before {
    content: '';
    position: absolute;
    top: 0; left: 50%; transform: translateX(-50%);
    width: 60%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
  }

  .rg-logo-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 28px;
  }
  .rg-logo-icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    background: rgba(139,92,246,0.1);
    border: 1px solid rgba(139,92,246,0.25);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
    box-shadow: 0 0 24px rgba(139,92,246,0.12);
  }

  .rg-label {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    display: block;
    margin-bottom: 7px;
  }

  .rg-input-wrap { position: relative; }

  .rg-input-icon {
    position: absolute;
    left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.2);
    pointer-events: none;
    transition: color 0.2s;
  }

  .rg-input {
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
  .rg-input::placeholder { color: rgba(255,255,255,0.18); }
  .rg-input:focus {
    border-color: rgba(139,92,246,0.5);
    background: rgba(139,92,246,0.04);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.08);
    color: rgba(255,255,255,0.9);
  }
  .rg-input-wrap:focus-within .rg-input-icon {
    color: rgba(139,92,246,0.7);
  }

  /* Password strength */
  .rg-strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }
  .rg-strength-seg {
    flex: 1; height: 2px; border-radius: 99px;
    background: rgba(255,255,255,0.06);
    transition: background 0.3s;
  }
  .rg-strength-label {
    font-family: 'Geist Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 5px;
  }

  .rg-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px;
    border-radius: 11px;
    border: 1px solid rgba(139,92,246,0.4);
    background: rgba(139,92,246,0.12);
    color: #c4b5fd;
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 6px;
  }
  .rg-submit:hover:not(:disabled) {
    background: rgba(139,92,246,0.2);
    border-color: rgba(139,92,246,0.65);
    box-shadow: 0 4px 24px rgba(139,92,246,0.2);
    color: #ddd6fe;
    transform: translateY(-1px);
  }
  .rg-submit:active:not(:disabled) { transform: translateY(0); }
  .rg-submit:disabled { opacity: 0.35; cursor: not-allowed; }

  .rg-dots::after {
    content: '';
    animation: rg-dot 1.4s steps(4, end) infinite;
  }
  @keyframes rg-dot {
    0%   { content: ''; }
    25%  { content: '.'; }
    50%  { content: '..'; }
    75%  { content: '...'; }
    100% { content: ''; }
  }

  .rg-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 22px 0 0;
  }
  .rg-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.05); }
  .rg-divider-text {
    font-family: 'Geist Mono', monospace;
    font-size: 10px; letter-spacing: 0.1em;
    color: rgba(255,255,255,0.18);
  }

  /* Terms note */
  .rg-terms {
    font-family: 'Geist Mono', monospace;
    font-size: 9.5px;
    letter-spacing: 0.04em;
    color: rgba(255,255,255,0.15);
    text-align: center;
    line-height: 1.6;
    margin-top: 16px;
  }
`;

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "#f87171" };
  if (score <= 3) return { score, label: "Fair",   color: "#fbbf24" };
  return           { score, label: "Strong", color: "#4ade80" };
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="rg-scanline" />

      <div className="rg-root">
        <div className="rg-glow-1" />
        <div className="rg-glow-2" />
        <div className="rg-grid" />

        <div className="rg-card">

          {/* Logo */}
          <div className="rg-logo-wrap">
            <div className="rg-logo-icon">
              <FiCode size={20} style={{ color: "#c4b5fd" }} />
            </div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(139,92,246,0.65)", marginBottom: 8 }}>
              GEKKO /AI
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: "-0.3px", marginBottom: 6 }}>
              Create account
            </h1>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: "0.03em" }}>
              Start getting AI feedback on your code
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Name */}
            <div>
              <label className="rg-label">Name</label>
              <div className="rg-input-wrap">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rg-input"
                  placeholder="John Doe"
                  autoComplete="name"
                />
                <FiUser size={13} className="rg-input-icon" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="rg-label">Email</label>
              <div className="rg-input-wrap">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rg-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <FiMail size={13} className="rg-input-icon" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="rg-label">Password</label>
              <div className="rg-input-wrap">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rg-input"
                  placeholder="••••••••"
                  minLength={6}
                  autoComplete="new-password"
                />
                <FiLock size={13} className="rg-input-icon" />
              </div>

              {/* Strength meter */}
              {password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div className="rg-strength-bar">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="rg-strength-seg"
                        style={{ background: i <= strength.score ? strength.color : undefined }}
                      />
                    ))}
                  </div>
                  <div className="rg-strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="rg-submit" disabled={loading}>
              {loading ? (
                <span className="rg-dots">Creating account</span>
              ) : (
                <>
                  Create Account
                  <FiArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="rg-terms">
            By creating an account you agree to our<br />
            Terms of Service and Privacy Policy.
          </p>

          {/* Footer */}
          <div className="rg-divider">
            <div className="rg-divider-line" />
            <span className="rg-divider-text">Have an account?</span>
            <div className="rg-divider-line" />
          </div>

          <div style={{ textAlign: "center", marginTop: 14 }}>
            <Link
              to="/login"
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "rgba(139,92,246,0.7)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = "#c4b5fd"}
              onMouseLeave={e => e.target.style.color = "rgba(139,92,246,0.7)"}
            >
              Sign in instead →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}