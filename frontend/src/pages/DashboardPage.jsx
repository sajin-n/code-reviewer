import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSubmissions, deleteSubmission } from "../api/reviewApi";
import { FiClock, FiCode, FiTrendingUp, FiAward, FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Syne:wght@500;600;700&display=swap');

  .db-root { font-family: 'Syne', sans-serif; }
  .db-mono { font-family: 'Geist Mono', monospace; }

  .db-stat-card {
    position: relative;
    background: #0d0d14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 20px;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
  }
  .db-stat-card:hover {
    border-color: rgba(255,255,255,0.1);
    transform: translateY(-2px);
  }
  .db-stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
  }
  .db-stat-indigo::before  { background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent); }
  .db-stat-blue::before    { background: linear-gradient(90deg, transparent, rgba(96,165,250,0.6), transparent); }
  .db-stat-amber::before   { background: linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent); }
  .db-stat-purple::before  { background: linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent); }

  .db-stat-icon {
    width: 36px; height: 36px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
    border: 1px solid;
  }

  .db-table-wrap {
    background: #0d0d14;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow: hidden;
  }

  .db-table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: relative;
  }
  .db-table-header::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(139,92,246,0.3), transparent);
  }

  .db-th {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .db-tr {
    border-bottom: 1px solid rgba(255,255,255,0.03);
    transition: background 0.15s;
  }
  .db-tr:last-child { border-bottom: none; }
  .db-tr:hover { background: rgba(255,255,255,0.02); }

  .db-td {
    padding: 13px 16px;
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    vertical-align: middle;
  }

  .db-lang-badge {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 5px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.4);
  }

  .db-score-badge {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 6px;
    border: 1px solid;
  }

  .db-link {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    transition: color 0.15s;
    text-decoration: none;
  }
  .db-link:hover { color: #fff; }

  .db-delete-btn {
    display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px;
    border-radius: 7px;
    border: 1px solid rgba(255,255,255,0.05);
    background: transparent;
    color: rgba(255,255,255,0.2);
    cursor: pointer;
    transition: all 0.2s;
  }
  .db-delete-btn:hover {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.2);
    color: #f87171;
  }

  .db-pagination-btn {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    transition: all 0.2s;
  }
  .db-pagination-btn:hover:not(:disabled) {
    background: rgba(99,102,241,0.1);
    border-color: rgba(99,102,241,0.25);
    color: #a78bfa;
  }
  .db-pagination-btn:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  .db-empty-icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
  }

  .db-spinner {
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 2px solid rgba(99,102,241,0.15);
    border-top-color: rgba(99,102,241,0.7);
    animation: db-spin 0.8s linear infinite;
  }
  @keyframes db-spin { to { transform: rotate(360deg); } }

  .db-scanline {
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

function ScoreBadge({ score }) {
  if (score == null)
    return <span className="db-mono" style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>—</span>;

  const styles =
    score >= 70
      ? { color: "#a78bfa", background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.25)" }
      : score >= 40
      ? { color: "#fbbf24", background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)" }
      : { color: "#f87171", background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" };

  return <span className="db-score-badge" style={styles}>{score}/100</span>;
}

function StatCard({ icon: Icon, label, value, accent, iconColor, iconBg, iconBorder }) {
  return (
    <div className={`db-stat-card db-stat-${accent}`}>
      <div className="db-stat-icon" style={{ background: iconBg, borderColor: iconBorder }}>
        <Icon size={15} style={{ color: iconColor }} />
      </div>
      <p className="db-mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
        {label}
      </p>
      <p className="db-mono" style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.5px", textTransform: "capitalize" }}>
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, refreshProfile } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getSubmissions(page);
      setSubmissions(data.submissions);
      setPagination(data.pagination);
      await refreshProfile();
    } catch {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission? This cannot be undone.")) return;
    try {
      await deleteSubmission(id);
      toast.success("Submission deleted");
      fetchData(pagination.page);
    } catch {
      toast.error("Failed to delete submission");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div className="db-scanline" />

      <div className="db-root relative z-10 max-w-6xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="mb-8">
          <div className="db-mono mb-1.5" style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(99,102,241,0.6)" }}>
            GEKKO /AI
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: "-0.5px" }}>
            Dashboard
          </h1>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={FiCode} label="Total Submissions" accent="indigo"
            value={user?.totalSubmissions ?? 0}
            iconColor="#6366f1" iconBg="rgba(99,102,241,0.1)" iconBorder="rgba(99,102,241,0.2)"
          />
          <StatCard
            icon={FiTrendingUp} label="Average Score" accent="blue"
            value={user?.averageScore ? `${user.averageScore}/100` : "—"}
            iconColor="#60a5fa" iconBg="rgba(96,165,250,0.1)" iconBorder="rgba(96,165,250,0.2)"
          />
          <StatCard
            icon={FiAward} label="Rank" accent="amber"
            value={user?.rank || "Beginner"}
            iconColor="#f59e0b" iconBg="rgba(245,158,11,0.1)" iconBorder="rgba(245,158,11,0.2)"
          />
          <StatCard
            icon={FiClock} label="Total Reviews" accent="purple"
            value={pagination.total}
            iconColor="#a78bfa" iconBg="rgba(167,139,250,0.1)" iconBorder="rgba(167,139,250,0.2)"
          />
        </div>

        {/* Table */}
        <div className="db-table-wrap">
          <div className="db-table-header">
            <div>
              <div className="db-mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 3 }}>
                History
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>
                Submission History
              </span>
            </div>
            {!loading && (
              <span className="db-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                {pagination.total} total
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 0", gap: 14 }}>
              <div className="db-spinner" />
              <span className="db-mono" style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
                Loading
              </span>
            </div>
          ) : submissions.length === 0 ? (
            <div style={{ padding: "56px 0", textAlign: "center" }}>
              <div className="db-empty-icon">
                <FiCode size={20} style={{ color: "rgba(255,255,255,0.2)" }} />
              </div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 10 }}>No submissions yet</p>
              <Link to="/" className="db-mono" style={{ fontSize: 11, color: "rgba(99,102,241,0.7)", letterSpacing: "0.05em", textDecoration: "none" }}>
                Submit your first code review →
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr>
                    {["Problem", "Language", "Score", "Date", ""].map((h) => (
                      <th key={h} className="db-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => {
                    const langStyle = LANG_COLORS[s.language?.toLowerCase()] || { color: "#888", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" };
                    return (
                      <tr key={s._id} className="db-tr">
                        <td className="db-td" style={{ minWidth: 180 }}>
                          <Link to={`/submission/${s._id}`} className="db-link">
                            {s.problemName || "Untitled"}
                          </Link>
                        </td>
                        <td className="db-td">
                          <span
                            className="db-lang-badge"
                            style={{ color: langStyle.color, background: langStyle.bg, borderColor: langStyle.border }}
                          >
                            {s.language}
                          </span>
                        </td>
                        <td className="db-td">
                          <ScoreBadge score={s.feedback?.score?.overall} />
                        </td>
                        <td className="db-td">
                          <span className="db-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.03em" }}>
                            {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        </td>
                        <td className="db-td" style={{ width: 48, textAlign: "center" }}>
                          <button
                            className="db-delete-btn"
                            onClick={() => handleDelete(s._id)}
                            title="Delete submission"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 20px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span className="db-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                Page <span style={{ color: "rgba(255,255,255,0.5)" }}>{pagination.page}</span> / {pagination.pages}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="db-pagination-btn"
                  onClick={() => fetchData(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <FiChevronLeft size={14} />
                </button>
                <button
                  className="db-pagination-btn"
                  onClick={() => fetchData(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}