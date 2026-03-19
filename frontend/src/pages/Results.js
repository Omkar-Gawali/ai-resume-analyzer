import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  Award,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Code,
  Upload,
  Sparkles,
  TrendingUp,
  Target,
} from "lucide-react";
import { getResumeById } from "../services/api";

/* ── Score ring SVG ── */
const ScoreRing = ({ score }) => {
  const color = score >= 70 ? "#22d3a5" : score >= 45 ? "#f59e0b" : "#f43f5e";
  const label =
    score >= 70
      ? "Strong resume!"
      : score >= 45
        ? "Room to improve"
        : "Needs work";
  const r = 52,
    c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <div className="d-flex flex-column align-items-center gap-2">
      <div style={{ position: "relative", width: 140, height: 140 }}>
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Track */}
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="#1e1e2a"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${dash} ${c}`}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            style={{
              transition: "stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)",
              filter: `drop-shadow(0 0 6px ${color}88)`,
            }}
          />
          {/* Score text */}
          <text
            x="70"
            y="70"
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {score}
          </text>
          <text
            x="70"
            y="90"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#454560"
            style={{ fontSize: "11px", fontWeight: 500 }}
          >
            / 100
          </text>
        </svg>
      </div>
      <div
        className="px-3 py-1 rounded-pill"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}33`,
          color,
          fontSize: "0.78rem",
          fontWeight: 600,
        }}
      >
        {score >= 70 ? "🎉" : score >= 45 ? "👍" : "⚠️"} {label}
      </div>
    </div>
  );
};

/* ── Card wrapper ── */
const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: "#0e0e17",
      border: "1px solid #1e1e2a",
      borderRadius: 16,
      padding: 24,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── Card title ── */
const CardTitle = ({ icon, children, color = "#a78bfa" }) => (
  <div
    className="d-flex align-items-center gap-2 fw-semibold mb-4"
    style={{ fontSize: "0.9rem", color: "#c0c0e0", letterSpacing: "0.01em" }}
  >
    <span
      className="d-flex align-items-center justify-content-center rounded-2"
      style={{
        width: 28,
        height: 28,
        background: `${color}18`,
        color,
        flexShrink: 0,
      }}
    >
      {icon}
    </span>
    {children}
  </div>
);

export default function Results() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResumeById(id)
      .then(({ data }) => setResume(data))
      .catch(() => toast.error("Failed to load results"))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Loading ── */
  if (loading)
    return (
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "#0a0a0f",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
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
        <p style={{ color: "#454560", fontSize: "0.9rem", margin: 0 }}>
          Loading analysis...
        </p>
        <style>{`@keyframes bounce{to{transform:translateY(-8px);opacity:.4}}`}</style>
      </div>
    );

  /* ── Not found ── */
  if (!resume)
    return (
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "#0a0a0f",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <p style={{ color: "#f43f5e" }}>Resume not found.</p>
        <Link
          to="/dashboard"
          style={{ color: "#a78bfa", textDecoration: "none" }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    );

  const { analysisResult: ar } = resume;
  const score = ar?.score || 0;
  const skills = ar?.extractedSkills || [];
  const missing = ar?.missingSkills || [];
  const jobs = ar?.jobRecommendations || [];
  const suggestions = ar?.suggestions || [];
  const detailed = ar?.detailedJobMatches || [];

  const radarData =
    detailed.length > 0
      ? detailed[0].matched_skills?.slice(0, 6).map((s) => ({
          skill: s,
          value: Math.floor(Math.random() * 30 + 70),
        })) || []
      : skills.slice(0, 6).map((s) => ({
          skill: s,
          value: Math.floor(Math.random() * 40 + 60),
        }));

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
            background: "#22d3a5",
            opacity: 0.04,
            filter: "blur(80px)",
            bottom: -100,
            left: -80,
          }}
        />
      </div>

      <div
        className="container position-relative py-5"
        style={{ zIndex: 1, maxWidth: 960 }}
      >
        {/* ── Top nav ── */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <Link
            to="/dashboard"
            className="d-flex align-items-center gap-2 text-decoration-none fw-medium"
            style={{
              color: "#7070a0",
              fontSize: "0.88rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7070a0")}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
            style={{
              background: "#0e0e17",
              border: "1px solid #1e1e2a",
              fontSize: "0.78rem",
              color: "#454560",
              maxWidth: 280,
              overflow: "hidden",
            }}
          >
            <Code size={13} color="#454560" style={{ flexShrink: 0 }} />
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {resume.fileName}
            </span>
          </div>
        </div>

        {/* ── Page header ── */}
        <div className="mb-5">
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
            <Sparkles size={11} strokeWidth={2.5} /> Analysis Complete
          </div>
          <h1
            className="fw-bold mb-2"
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: "clamp(1.8rem,4vw,2.6rem)",
              letterSpacing: "-0.03em",
              color: "#f0f0f8",
              lineHeight: 1.1,
            }}
          >
            Your Resume Results
          </h1>
          <p style={{ color: "#7070a0", fontSize: "0.95rem", marginBottom: 0 }}>
            Here's what our AI found — skills, score, job matches and what to
            improve
          </p>
        </div>

        {/* ══════════ ROW 1 — Score + Skills ══════════ */}
        <div className="row g-3 mb-3">
          {/* Score card */}
          <div className="col-12 col-md-4">
            <Card
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                padding: 32,
              }}
            >
              <CardTitle icon={<Award size={14} />} color="#f59e0b">
                Resume Score
              </CardTitle>
              <ScoreRing score={score} />

              {/* Mini stats */}
              <div className="d-flex gap-3 w-100 mt-2">
                {[
                  { label: "Skills", value: skills.length, color: "#a78bfa" },
                  {
                    label: "Matches",
                    value: detailed.length || jobs.length,
                    color: "#22d3a5",
                  },
                  { label: "Missing", value: missing.length, color: "#f43f5e" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex-grow-1 text-center rounded-3 py-2"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid #1a1a26",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Syne,sans-serif",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        color: s.color,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#454560",
                        marginTop: 2,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Skills card */}
          <div className="col-12 col-md-8">
            <Card style={{ height: "100%" }}>
              <CardTitle icon={<Code size={14} />} color="#a78bfa">
                Extracted Skills
                <span
                  className="ms-2 px-2 py-1 rounded-pill"
                  style={{
                    background: "rgba(108,99,255,0.1)",
                    color: "#a78bfa",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  {skills.length} found
                </span>
              </CardTitle>
              {skills.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-2"
                      style={{
                        background: "rgba(108,99,255,0.08)",
                        border: "1px solid rgba(108,99,255,0.18)",
                        color: "#a78bfa",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        transition: "all 0.2s",
                        cursor: "default",
                        animation: `fadeSlideUp 0.3s ease both`,
                        animationDelay: `${i * 0.03}s`,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#454560", fontSize: "0.88rem" }}>
                  No skills detected
                </p>
              )}
            </Card>
          </div>
        </div>

        {/* ══════════ ROW 2 — Radar ══════════ */}
        {radarData.length > 0 && (
          <div className="mb-3">
            <Card>
              <CardTitle icon={<TrendingUp size={14} />} color="#38bdf8">
                Skill Strength Radar
              </CardTitle>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e1e2a" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: "#454560", fontSize: 12 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="#6c63ff"
                    fill="#6c63ff"
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ══════════ ROW 3 — Jobs + Missing ══════════ */}
        <div className="row g-3 mb-3">
          {/* Job matches */}
          <div className="col-12 col-md-7">
            <Card style={{ height: "100%" }}>
              <CardTitle icon={<Briefcase size={14} />} color="#22d3a5">
                Job Matches
              </CardTitle>
              {detailed.length > 0 ? (
                <div className="d-flex flex-column gap-4">
                  {detailed.map((job, i) => {
                    const pctColor =
                      job.match_percent >= 70
                        ? "#22d3a5"
                        : job.match_percent >= 40
                          ? "#f59e0b"
                          : "#f43f5e";
                    return (
                      <div key={i}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                              style={{
                                width: 28,
                                height: 28,
                                background: `${pctColor}18`,
                              }}
                            >
                              <Target size={14} color={pctColor} />
                            </div>
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: "0.88rem",
                                color: "#e0e0f0",
                              }}
                            >
                              {job.title}
                            </span>
                          </div>
                          <span
                            className="px-2 py-1 rounded-pill flex-shrink-0"
                            style={{
                              background: `${pctColor}18`,
                              border: `1px solid ${pctColor}33`,
                              color: pctColor,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            {job.match_percent}%
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div
                          style={{
                            height: 6,
                            background: "#1a1a26",
                            borderRadius: 3,
                            overflow: "hidden",
                            marginBottom: 6,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${job.match_percent}%`,
                              background: `linear-gradient(90deg, ${pctColor}99, ${pctColor})`,
                              borderRadius: 3,
                              transition:
                                "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                            }}
                          />
                        </div>
                        {job.missing_required?.length > 0 && (
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "#454560",
                              margin: 0,
                            }}
                          >
                            Missing:{" "}
                            <span style={{ color: "#f43f5e" }}>
                              {job.missing_required.join(", ")}
                            </span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : jobs.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {jobs.map((j, i) => (
                    <div
                      key={i}
                      className="d-flex align-items-center gap-3 px-3 py-3 rounded-3"
                      style={{
                        background: "rgba(34,211,165,0.04)",
                        border: "1px solid rgba(34,211,165,0.1)",
                      }}
                    >
                      <CheckCircle
                        size={15}
                        color="#22d3a5"
                        strokeWidth={2.5}
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ fontSize: "0.88rem", color: "#c0c0e0" }}>
                        {j}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#454560", fontSize: "0.88rem" }}>
                  No matches found
                </p>
              )}
            </Card>
          </div>

          {/* Missing skills */}
          <div className="col-12 col-md-5">
            <Card style={{ height: "100%" }}>
              <CardTitle icon={<AlertTriangle size={14} />} color="#f43f5e">
                Skills to Learn
              </CardTitle>
              {missing.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {missing.map((s, i) => (
                    <div
                      key={i}
                      className="d-flex align-items-center gap-3 px-3 py-2 rounded-3"
                      style={{
                        background: "rgba(244,63,94,0.05)",
                        border: "1px solid rgba(244,63,94,0.15)",
                        animation: `fadeSlideUp 0.3s ease both`,
                        animationDelay: `${i * 0.06}s`,
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#f43f5e",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#f0a0b0",
                          fontWeight: 500,
                        }}
                      >
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center text-center py-4 gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: 52,
                      height: 52,
                      background: "rgba(34,211,165,0.1)",
                      border: "1px solid rgba(34,211,165,0.2)",
                    }}
                  >
                    <CheckCircle size={24} color="#22d3a5" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        color: "#22d3a5",
                        marginBottom: 4,
                        fontSize: "0.9rem",
                      }}
                    >
                      No critical gaps!
                    </p>
                    <p
                      style={{
                        color: "#454560",
                        fontSize: "0.82rem",
                        margin: 0,
                      }}
                    >
                      Your skills cover the essentials
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* ══════════ ROW 4 — Suggestions ══════════ */}
        <div className="mb-5">
          <Card>
            <CardTitle icon={<Lightbulb size={14} />} color="#f59e0b">
              AI Suggestions
            </CardTitle>
            {suggestions.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-start gap-3 px-4 py-3 rounded-3"
                    style={{
                      background: "rgba(245,158,11,0.04)",
                      border: "1px solid rgba(245,158,11,0.12)",
                      borderLeft: "3px solid #f59e0b",
                      animation: `fadeSlideUp 0.3s ease both`,
                      animationDelay: `${i * 0.07}s`,
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                      style={{
                        width: 26,
                        height: 26,
                        background: "rgba(245,158,11,0.12)",
                        color: "#f59e0b",
                        fontFamily: "Syne,sans-serif",
                        fontWeight: 800,
                        fontSize: "0.78rem",
                        marginTop: 1,
                      }}
                    >
                      {i + 1}
                    </div>
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "#c0c0e0",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {s}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#454560", fontSize: "0.88rem" }}>
                No suggestions available
              </p>
            )}
          </Card>
        </div>

        {/* ══════════ CTA ══════════ */}
        <div
          className="rounded-4 p-4 p-md-5 text-center position-relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg,rgba(108,99,255,0.08) 0%,rgba(56,189,248,0.04) 100%)",
            border: "1px solid #1e1e2a",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 50%, rgba(108,99,255,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div className="position-relative">
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
              <Sparkles size={11} strokeWidth={2.5} /> Keep improving
            </div>
            <h3
              className="fw-bold mb-2"
              style={{
                fontFamily: "Syne,sans-serif",
                fontSize: "clamp(1.3rem,3vw,1.8rem)",
                color: "#f0f0f8",
                letterSpacing: "-0.02em",
              }}
            >
              Ready to try another resume?
            </h3>
            <p
              className="mb-4"
              style={{
                color: "#7070a0",
                fontSize: "0.9rem",
                maxWidth: 380,
                margin: "0 auto 24px",
              }}
            >
              Upload an updated version and track how your score improves over
              time.
            </p>
            <Link
              to="/upload"
              className="d-inline-flex align-items-center gap-2 text-decoration-none text-white fw-semibold"
              style={{
                padding: "13px 28px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#6c63ff,#8b5cf6)",
                fontSize: "0.95rem",
                transition: "all 0.25s",
                boxShadow: "0 4px 20px rgba(108,99,255,0.3)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(108,99,255,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(108,99,255,0.3)";
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
              Analyze Another Resume
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { to { transform: translateY(-8px); opacity: .4; } }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
