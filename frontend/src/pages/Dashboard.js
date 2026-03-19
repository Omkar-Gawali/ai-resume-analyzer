import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  BarChart2,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { getMyResumes, deleteResume } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ScoreBadge = ({ score }) => {
  const cfg =
    score >= 70
      ? {
          color: "#22d3a5",
          bg: "rgba(34,211,165,0.1)",
          border: "rgba(34,211,165,0.2)",
        }
      : score >= 45
        ? {
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.1)",
            border: "rgba(245,158,11,0.2)",
          }
        : {
            color: "#f43f5e",
            bg: "rgba(244,63,94,0.1)",
            border: "rgba(244,63,94,0.2)",
          };
  return (
    <div
      className="d-flex align-items-center justify-content-center rounded-2 fw-bold"
      style={{
        minWidth: 48,
        height: 34,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        fontFamily: "Syne,sans-serif",
        fontSize: "0.95rem",
        padding: "0 10px",
      }}
    >
      {score}
    </div>
  );
};

const StatusPill = ({ status }) => {
  const cfg =
    status === "failed"
      ? {
          color: "#f43f5e",
          bg: "rgba(244,63,94,0.08)",
          border: "rgba(244,63,94,0.2)",
        }
      : {
          color: "#f59e0b",
          bg: "rgba(245,158,11,0.08)",
          border: "rgba(245,158,11,0.2)",
        };
  return (
    <div
      className="px-3 py-1 rounded-pill"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        fontSize: "0.75rem",
        fontWeight: 600,
      }}
    >
      {status}
    </div>
  );
};

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyResumes();
        setResumes(data);
      } catch {
        toast.error("Failed to load resumes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this resume?")) return;
    setDeleting(id);
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resume deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const analyzed = resumes.filter((r) => r.status === "analyzed");
  const avgScore = analyzed.length
    ? Math.round(
        analyzed.reduce((a, r) => a + (r.analysisResult?.score || 0), 0) /
          analyzed.length,
      )
    : 0;
  const bestScore = analyzed.length
    ? Math.max(...analyzed.map((r) => r.analysisResult?.score || 0))
    : 0;

  const stats = [
    {
      icon: <FileText size={20} />,
      label: "Total Uploads",
      value: resumes.length,
      iconColor: "#a78bfa",
      iconBg: "rgba(108,99,255,0.1)",
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Analyzed",
      value: analyzed.length,
      iconColor: "#22d3a5",
      iconBg: "rgba(34,211,165,0.1)",
    },
    {
      icon: <BarChart2 size={20} />,
      label: "Avg Score",
      value: avgScore || "—",
      iconColor: "#38bdf8",
      iconBg: "rgba(56,189,248,0.1)",
    },
    {
      icon: <Sparkles size={20} />,
      label: "Best Score",
      value: bestScore || "—",
      iconColor: "#f59e0b",
      iconBg: "rgba(245,158,11,0.1)",
    },
  ];

  return (
    <div
      style={{
        background: "#0a0a0f",
        minHeight: "calc(100vh - 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "#6c63ff",
            opacity: 0.06,
            filter: "blur(100px)",
            top: -150,
            right: -100,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "#38bdf8",
            opacity: 0.04,
            filter: "blur(80px)",
            bottom: -100,
            left: -80,
          }}
        />
      </div>

      <div
        className="container position-relative py-5"
        style={{ zIndex: 1, maxWidth: 900 }}
      >
        {/* ── Header ── */}
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-5">
          <div>
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3"
              style={{
                background: "rgba(108,99,255,0.1)",
                border: "1px solid rgba(108,99,255,0.2)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#a78bfa",
              }}
            >
              <Sparkles size={11} strokeWidth={2.5} /> Dashboard
            </div>
            <h1
              className="fw-bold mb-1"
              style={{
                fontFamily: "Syne,sans-serif",
                fontSize: "clamp(1.8rem,4vw,2.4rem)",
                letterSpacing: "-0.03em",
                color: "#f0f0f8",
                lineHeight: 1.1,
              }}
            >
              Hey, {user.name.split(" ")[0]} 👋
            </h1>
            <p
              style={{ color: "#7070a0", fontSize: "0.95rem", marginBottom: 0 }}
            >
              Track and manage your resume analyses
            </p>
          </div>
          <Link
            to="/upload"
            className="d-flex align-items-center gap-2 text-decoration-none text-white fw-semibold flex-shrink-0"
            style={{
              padding: "11px 22px",
              borderRadius: 12,
              background: "linear-gradient(135deg,#6c63ff,#8b5cf6)",
              fontSize: "0.9rem",
              transition: "all 0.2s",
              boxShadow: "0 4px 16px rgba(108,99,255,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 28px rgba(108,99,255,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(108,99,255,0.3)";
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 50%)",
                pointerEvents: "none",
              }}
            />
            <Upload size={17} strokeWidth={2} />
            Analyze New Resume
            <ArrowRight size={15} strokeWidth={2.2} />
          </Link>
        </div>

        {/* ── Stats grid ── */}
        <div className="row g-3 mb-5">
          {stats.map((s, i) => (
            <div key={i} className="col-6 col-md-3">
              <div
                className="rounded-4 p-3 p-md-4 h-100"
                style={{
                  background: "#0e0e17",
                  border: "1px solid #1e1e2a",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#252535";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1e1e2a";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 mb-3"
                  style={{
                    width: 42,
                    height: 42,
                    background: s.iconBg,
                    color: s.iconColor,
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontWeight: 800,
                    fontSize: "1.8rem",
                    color: "#f0f0f8",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#454560",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Resume list ── */}
        <div>
          {/* Section header */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2
              className="fw-bold mb-0"
              style={{
                fontFamily: "Syne,sans-serif",
                fontSize: "1.15rem",
                color: "#f0f0f8",
                letterSpacing: "-0.02em",
              }}
            >
              Your Resumes
            </h2>
            {resumes.length > 0 && (
              <span style={{ fontSize: "0.78rem", color: "#454560" }}>
                {resumes.length} {resumes.length === 1 ? "file" : "files"}
              </span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div
              className="d-flex align-items-center justify-content-center rounded-4"
              style={{
                height: 200,
                background: "#0e0e17",
                border: "1px solid #1e1e2a",
              }}
            >
              <div className="d-flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#6c63ff",
                      opacity: 0.7,
                      animation: "bounce 0.8s infinite alternate",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && resumes.length === 0 && (
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center rounded-4 p-5"
              style={{
                background: "#0e0e17",
                border: "2px dashed #1e1e2a",
                minHeight: 280,
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-3 mb-4"
                style={{
                  width: 64,
                  height: 64,
                  background: "rgba(108,99,255,0.08)",
                  border: "1px solid rgba(108,99,255,0.15)",
                }}
              >
                <FileText size={28} color="#454560" />
              </div>
              <h3
                className="fw-semibold mb-2"
                style={{ fontSize: "1.1rem", color: "#c0c0e0" }}
              >
                No resumes yet
              </h3>
              <p
                className="mb-4"
                style={{ fontSize: "0.88rem", color: "#454560", maxWidth: 280 }}
              >
                Upload your first resume and get instant AI-powered insights
              </p>
              <Link
                to="/upload"
                className="d-flex align-items-center gap-2 text-decoration-none text-white fw-semibold"
                style={{
                  padding: "11px 24px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#6c63ff,#8b5cf6)",
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 16px rgba(108,99,255,0.3)",
                }}
              >
                <Upload size={17} /> Upload First Resume
              </Link>
            </div>
          )}

          {/* Resume list */}
          {!loading && resumes.length > 0 && (
            <div className="d-flex flex-column gap-2">
              {resumes.map((r, idx) => (
                <div
                  key={r._id}
                  className="d-flex align-items-center gap-3 rounded-3 px-4 py-3"
                  style={{
                    background: "#0e0e17",
                    border: "1px solid #1e1e2a",
                    transition: "border-color 0.2s, background 0.2s",
                    animation: `fadeSlideUp 0.3s ease both`,
                    animationDelay: `${idx * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#252535";
                    e.currentTarget.style.background = "#111120";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1e1e2a";
                    e.currentTarget.style.background = "#0e0e17";
                  }}
                >
                  {/* File icon */}
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{
                      width: 44,
                      height: 44,
                      background:
                        r.status === "analyzed"
                          ? "rgba(108,99,255,0.08)"
                          : r.status === "failed"
                            ? "rgba(244,63,94,0.08)"
                            : "rgba(245,158,11,0.08)",
                      border: `1px solid ${r.status === "analyzed" ? "rgba(108,99,255,0.15)" : r.status === "failed" ? "rgba(244,63,94,0.15)" : "rgba(245,158,11,0.15)"}`,
                    }}
                  >
                    {r.status === "failed" ? (
                      <AlertCircle size={20} color="#f43f5e" />
                    ) : (
                      <FileText
                        size={20}
                        color={r.status === "analyzed" ? "#a78bfa" : "#f59e0b"}
                      />
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "#e0e0f0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {r.fileName}
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-1">
                      <div
                        className="d-flex align-items-center gap-1"
                        style={{ fontSize: "0.75rem", color: "#454560" }}
                      >
                        <Clock size={11} />
                        {new Date(r.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      {r.status === "analyzed" &&
                        r.analysisResult?.extractedSkills?.length > 0 && (
                          <div
                            style={{ fontSize: "0.75rem", color: "#454560" }}
                          >
                            {r.analysisResult.extractedSkills.length} skills
                            found
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Score / status */}
                  <div className="flex-shrink-0">
                    {r.status === "analyzed" ? (
                      <ScoreBadge score={r.analysisResult?.score || 0} />
                    ) : (
                      <StatusPill status={r.status} />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    {r.status === "analyzed" && (
                      <Link
                        to={`/results/${r._id}`}
                        className="d-flex align-items-center justify-content-center text-decoration-none"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          background: "rgba(108,99,255,0.08)",
                          border: "1px solid rgba(108,99,255,0.2)",
                          color: "#a78bfa",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(108,99,255,0.15)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(108,99,255,0.08)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                        title="View results"
                      >
                        <Eye size={15} />
                      </Link>
                    )}
                    <button
                      onClick={(e) => handleDelete(r._id, e)}
                      disabled={deleting === r._id}
                      className="d-flex align-items-center justify-content-center border-0"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: "rgba(244,63,94,0.06)",
                        border: "1px solid rgba(244,63,94,0.15)",
                        color: "#f43f5e",
                        cursor: deleting === r._id ? "not-allowed" : "pointer",
                        opacity: deleting === r._id ? 0.5 : 1,
                        transition: "all 0.2s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        if (deleting !== r._id) {
                          e.currentTarget.style.background =
                            "rgba(244,63,94,0.12)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(244,63,94,0.06)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                      title="Delete resume"
                    >
                      {deleting === r._id ? (
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            border: "2px solid rgba(244,63,94,0.3)",
                            borderTopColor: "#f43f5e",
                            borderRadius: "50%",
                            animation: "spin .7s linear infinite",
                          }}
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce { to { transform: translateY(-8px); opacity: 0.4; } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
