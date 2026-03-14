import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useReview } from "../context/ReviewContext";
import { FiLogOut, FiLayout, FiUser, FiCode, FiSettings } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { apiKey, setApiKey } = useReview();
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey || "");
  const settingsRef = useRef(null);
  const lastScrollY = useRef(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) {
        setVisible(true);
      } else if (currentY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSettings]);

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    setShowSettings(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Syne:wght@500;600;700&display=swap');

        .nb-outer {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%) translateY(0);
          z-index: 50;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.4s ease;
          opacity: 1;
          width: max-content;
          max-width: calc(100vw - 32px);
          font-family: 'Syne', sans-serif;
        }
        .nb-outer.nb-hidden {
          transform: translateX(-50%) translateY(-80px);
          opacity: 0;
          pointer-events: none;
        }

        .nb-pill {
          display: flex;
          align-items: center;
          gap: 2px;
          height: 46px;
          padding: 5px 5px;
          background: rgba(12, 12, 20, 0.92);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.025) inset,
            0 1px 0 rgba(255,255,255,0.07) inset,
            0 12px 40px rgba(0,0,0,0.55),
            0 4px 12px rgba(0,0,0,0.35);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        /* Logo circle */
        .nb-logo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 2px;
          transition: background 0.2s, border-color 0.2s;
        }
        .nb-logo-btn:hover {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.4);
        }
        .nb-logo-btn:hover .nb-logo-icon {
          filter: brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(220deg) brightness(1.3);
        }
        .nb-logo-icon {
          width: 70px; height: 70px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.75;
          transition: filter 0.2s, opacity 0.2s;
        }
        .nb-logo-btn:hover .nb-logo-icon {
          opacity: 1;
          filter: brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(220deg) brightness(1.3);
        }

        /* Nav links */
        .nb-link {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 14px;
          height: 36px;
          border-radius: 999px;
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(255,255,255,0.38);
          transition: color 0.18s, background 0.18s;
          white-space: nowrap;
        }
        .nb-link:hover {
          color: rgba(255,255,255,0.82);
          background: rgba(255,255,255,0.05);
        }
        .nb-link.nb-active {
          color: rgba(255,255,255,0.92);
          background: rgba(255,255,255,0.09);
        }

        /* Separator */
        .nb-sep {
          width: 1px;
          height: 18px;
          background: rgba(255,255,255,0.08);
          margin: 0 3px;
          flex-shrink: 0;
        }

        /* User name chip */
        .nb-user-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 12px 0 5px;
          height: 36px;
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          margin-left: 1px;
        }
        .nb-avatar {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: rgba(99,102,241,0.14);
          border: 1px solid rgba(99,102,241,0.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nb-uname {
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.03em;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Logout */
        .nb-logout {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.25);
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          margin-left: 2px;
        }
        .nb-logout:hover {
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.3);
          color: #f87171;
        }
        .nb-logout:hover svg {
          filter: drop-shadow(0 0 4px rgba(248,113,113,0.5));
        }

        /* Guest CTA */
        .nb-cta {
          display: flex;
          align-items: center;
          padding: 0 16px;
          height: 36px;
          border-radius: 999px;
          background: rgba(99,102,241,0.14);
          border: 1px solid rgba(99,102,241,0.35);
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #a78bfa;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          margin-left: 2px;
        }
        .nb-cta:hover {
          background: rgba(99,102,241,0.24);
          border-color: rgba(99,102,241,0.6);
          color: #c4b5fd;
        }

        /* Settings Button */
        .nb-settings-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.25);
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          margin-left: 2px;
          position: relative;
        }
        .nb-settings-btn:hover {
          background: rgba(34,211,238,0.08);
          border-color: rgba(34,211,238,0.3);
          color: #22d3ee;
        }
        .nb-settings-btn.active {
          background: rgba(34,211,238,0.15);
          border-color: rgba(34,211,238,0.5);
          color: #22d3ee;
        }

        /* Settings Modal */
        .nb-settings-modal {
          position: fixed;
          top: 70px;
          right: 20px;
          background: rgba(12, 12, 20, 0.95);
          border: 1px solid rgba(34,211,238,0.3);
          border-radius: 12px;
          padding: 20px;
          z-index: 100;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,211,238,0.1) inset;
          backdrop-filter: blur(16px);
          width: 320px;
          max-width: calc(100vw - 40px);
          animation: slideDown 0.22s ease;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nb-settings-title {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nb-api-input-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .nb-api-label {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .nb-api-input {
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          padding: 9px 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(34,211,238,0.2);
          border-radius: 6px;
          color: rgba(255,255,255,0.8);
          transition: all 0.2s;
        }
        .nb-api-input:focus {
          outline: none;
          background: rgba(34,211,238,0.08);
          border-color: rgba(34,211,238,0.5);
          box-shadow: 0 0 0 2px rgba(34,211,238,0.15);
        }

        .nb-api-hint {
          font-family: 'Geist Mono', monospace;
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          line-height: 1.4;
          margin-top: 4px;
        }

        .nb-settings-buttons {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .nb-btn-save, .nb-btn-cancel {
          flex: 1;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nb-btn-save {
          background: rgba(34,211,238,0.15);
          color: #22d3ee;
          border-color: rgba(34,211,238,0.3);
        }
        .nb-btn-save:hover {
          background: rgba(34,211,238,0.25);
          border-color: rgba(34,211,238,0.6);
        }

        .nb-btn-cancel {
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
        }
        .nb-btn-cancel:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
        }

        .nb-api-status {
          font-family: 'Geist Mono', monospace;
          font-size: 9px;
          color: rgba(34,211,238,0.6);
          margin-top: 8px;
          padding: 6px 8px;
          background: rgba(34,211,238,0.05);
          border-radius: 4px;
          border-left: 2px solid rgba(34,211,238,0.3);
        }
      `}</style>

      {/* Floating pill */}
      <div className={`nb-outer${visible ? "" : " nb-hidden"}`}>
        <div className="nb-pill">

          {/* Logo icon */}
          <Link to={user ? "/review" : "/"} className="nb-logo-btn" title="GEKKO">
            <img src="/gecko.svg" alt="GEKKO" className="nb-logo-icon" />
          </Link>

          {user ? (
            <>
              <Link to="/review" className={`nb-link${isActive("/review") ? " nb-active" : ""}`}>
                <FiCode size={11} />
                Review
              </Link>
              <Link to="/dashboard" className={`nb-link${isActive("/dashboard") ? " nb-active" : ""}`}>
                <FiLayout size={11} />
                Dash
              </Link>

              <div className="nb-sep" />

              <div className="nb-user-chip">
                <div className="nb-avatar">
                  <FiUser size={11} style={{ color: "#a78bfa" }} />
                </div>
                <span className="nb-uname">{user.name}</span>
              </div>

              <div style={{ position: "relative" }} ref={settingsRef}>
                <button 
                  className={`nb-settings-btn${showSettings ? " active" : ""}`}
                  onClick={() => setShowSettings(!showSettings)}
                  title="API Settings"
                >
                  <FiSettings size={13} />
                </button>
                {showSettings && (
                  <div className="nb-settings-modal">
                    <div className="nb-settings-title">
                      <span style={{ color: "#22d3ee" }}>⚙</span> API Key Settings
                    </div>
                    <div className="nb-api-input-group">
                      <label className="nb-api-label">Groq API Key</label>
                      <input
                        type="password"
                        className="nb-api-input"
                        placeholder="gsk_..."
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveApiKey();
                        }}
                      />
                      <div className="nb-api-hint">
                        Leave empty to use the default server API key
                      </div>
                      {apiKey && (
                        <div className="nb-api-status">
                          ✓ Custom API key set
                        </div>
                      )}
                    </div>
                    <div className="nb-settings-buttons">
                      <button 
                        className="nb-btn-save"
                        onClick={handleSaveApiKey}
                      >
                        Save
                      </button>
                      <button 
                        className="nb-btn-cancel"
                        onClick={() => {
                          setShowSettings(false);
                          setTempApiKey(apiKey || "");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="nb-logout" onClick={handleLogout} title="Logout">
                <FiLogOut size={13} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nb-link">Sign In</Link>
              <Link to="/register" className="nb-cta">Get Started</Link>
            </>
          )}

        </div>
      </div>
    </>
  );
}