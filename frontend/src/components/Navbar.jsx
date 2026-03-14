import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut, FiLayout, FiUser, FiCode } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);
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