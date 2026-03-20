import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  RadialBarChart, RadialBar, Cell,
} from "recharts";
import {
  ArrowLeft, Award, Briefcase, AlertTriangle, CheckCircle, Lightbulb,
  Code, Upload, Sparkles, TrendingUp, Target, User, BookOpen, Mail,
  Phone, Github, Linkedin, Globe, ShieldCheck, ShieldAlert, Layers,
  FileText, Zap, Star, ChevronDown, ChevronUp, Info,
} from "lucide-react";
import { getResumeById } from "../services/api";

/* ═══════════════════════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════════════════════ */
const T = {
  bg:       "#080810",
  surface:  "#0d0d1a",
  border:   "#181828",
  border2:  "#1e1e30",
  text:     "#e8e8f8",
  muted:    "#5a5a80",
  dim:      "#383860",
  purple:   "#7c6dff",
  teal:     "#1fd8a4",
  amber:    "#f5a623",
  rose:     "#f04060",
  sky:      "#38c5f5",
  green:    "#22c55e",
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
const scoreColor = (s) => s >= 70 ? T.teal : s >= 45 ? T.amber : T.rose;
const priorityMeta = {
  high:   { color: T.rose,   label: "High",   dot: "🔴" },
  medium: { color: T.amber,  label: "Medium", dot: "🟡" },
  low:    { color: T.teal,   label: "Low",    dot: "🟢" },
  info:   { color: T.sky,    label: "Info",   dot: "🔵" },
};
const readinessMeta = {
  "Strong Match":  { color: T.teal,   icon: "🎯" },
  "Good Match":    { color: T.green,  icon: "✅" },
  "Partial Match": { color: T.amber,  icon: "⚡" },
  "Weak Match":    { color: T.rose,   icon: "⚠️" },
};
const categoryColors = [
  T.purple, T.teal, T.sky, T.amber, "#e879f9", "#fb923c",
  "#34d399", "#f472b6", T.rose, "#a3e635",
];

/* ═══════════════════════════════════════════════════════════════
   ANIMATED NUMBER
═══════════════════════════════════════════════════════════════ */
function AnimNum({ target, duration = 1400, style = {} }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <span style={style}>{val}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   SCORE RING
═══════════════════════════════════════════════════════════════ */
const ScoreRing = ({ score, grade }) => {
  const color = scoreColor(score);
  const r = 56, c = 2 * Math.PI * r;
  const [dash, setDash] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDash((score / 100) * c), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ position: "relative", width: 156, height: 156 }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        filter: "blur(12px)",
      }} />
      <svg width="156" height="156" viewBox="0 0 156 156" style={{ position: "relative", zIndex: 1 }}>
        <circle cx="78" cy="78" r={r} fill="none" stroke={T.border2} strokeWidth="11" />
        <circle cx="78" cy="78" r={r} fill="none" stroke={`${color}22`} strokeWidth="11"
          strokeDasharray={`${c} ${c}`} />
        <circle cx="78" cy="78" r={r} fill="none" stroke={color} strokeWidth="11"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
          transform="rotate(-90 78 78)"
          style={{ transition: "stroke-dasharray 1.6s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 8px ${color}99)` }}
        />
        <text x="78" y="72" textAnchor="middle" dominantBaseline="central"
          fill={color} style={{ fontFamily: "Syne,sans-serif", fontSize: 30, fontWeight: 800 }}>
          {score}
        </text>
        <text x="78" y="92" textAnchor="middle" dominantBaseline="central"
          fill={T.muted} style={{ fontSize: 11, fontWeight: 600 }}>/ 100</text>
        {grade && (
          <text x="78" y="108" textAnchor="middle" dominantBaseline="central"
            fill={color} style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
            Grade {grade}
          </text>
        )}
      </svg>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CARD
═══════════════════════════════════════════════════════════════ */
const Card = ({ children, style = {}, glow }) => (
  <div style={{
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 20,
    padding: 24,
    position: "relative",
    overflow: "hidden",
    ...(glow ? { boxShadow: `0 0 40px ${glow}14` } : {}),
    ...style,
  }}>
    {children}
  </div>
);

const SectionTitle = ({ icon, children, color = T.purple, badge }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
    <span style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 30, height: 30, borderRadius: 8,
      background: `${color}18`, color, flexShrink: 0,
    }}>{icon}</span>
    <span style={{ color: "#c0c0e0", fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.01em" }}>
      {children}
    </span>
    {badge !== undefined && (
      <span style={{
        marginLeft: 4, padding: "2px 10px", borderRadius: 99,
        background: `${color}15`, color, fontSize: "0.72rem", fontWeight: 800,
      }}>{badge}</span>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   SCORE BREAKDOWN BAR
═══════════════════════════════════════════════════════════════ */
const BreakdownBar = ({ label, value, max, color }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: "0.8rem", color: T.muted }}>{label}</span>
        <span style={{ fontSize: "0.8rem", color, fontWeight: 700 }}>{value} / {max}</span>
      </div>
      <div style={{ height: 6, background: T.border2, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: 3,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   COLLAPSIBLE JOB CARD
═══════════════════════════════════════════════════════════════ */
function JobCard({ job, index }) {
  const [open, setOpen] = useState(index === 0);
  const color = scoreColor(job.match_percent);
  const rm = readinessMeta[job.readiness] || { color: T.muted, icon: "•" };

  return (
    <div style={{
      border: `1px solid ${open ? color + "33" : T.border}`,
      borderRadius: 14, overflow: "hidden",
      transition: "border-color 0.3s",
      marginBottom: 10,
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", cursor: "pointer",
          background: open ? `${color}08` : "transparent",
          transition: "background 0.3s",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16 }}>{rm.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: T.text }}>{job.title}</div>
            <div style={{ fontSize: "0.72rem", color: rm.color, fontWeight: 600, marginTop: 2 }}>
              {job.readiness}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            padding: "3px 12px", borderRadius: 99,
            background: `${color}18`, color, fontWeight: 800, fontSize: "0.82rem",
          }}>
            {job.match_percent}%
          </span>
          {open ? <ChevronUp size={15} color={T.muted} /> : <ChevronDown size={15} color={T.muted} />}
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ padding: "0 18px 18px" }}>
          {/* Progress bars */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ height: 6, background: T.border2, borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
              <div style={{
                height: "100%", width: `${job.match_percent}%`,
                background: `linear-gradient(90deg, ${color}88, ${color})`,
                borderRadius: 3, transition: "width 1s ease",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: T.muted }}>
              <span>Required match: <b style={{ color }}>{job.required_match_percent}%</b></span>
              <span>Overall (with bonus): <b style={{ color }}>{job.match_percent}%</b></span>
            </div>
          </div>

          {/* Matched skills */}
          {job.matched_required?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: "0.72rem", color: T.muted, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                ✅ Matched Required
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {job.matched_required.map((s, i) => (
                  <span key={i} style={{
                    padding: "3px 10px", borderRadius: 6,
                    background: `${T.teal}12`, border: `1px solid ${T.teal}30`,
                    color: T.teal, fontSize: "0.78rem", fontWeight: 600,
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Good to have matched */}
          {job.matched_good_to_have?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: "0.72rem", color: T.muted, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                ⭐ Bonus Skills Matched
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {job.matched_good_to_have.map((s, i) => (
                  <span key={i} style={{
                    padding: "3px 10px", borderRadius: 6,
                    background: `${T.amber}12`, border: `1px solid ${T.amber}30`,
                    color: T.amber, fontSize: "0.78rem", fontWeight: 600,
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Missing required */}
          {job.missing_required?.length > 0 && (
            <div>
              <div style={{ fontSize: "0.72rem", color: T.muted, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                ❌ Missing Required
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {job.missing_required.map((s, i) => (
                  <span key={i} style={{
                    padding: "3px 10px", borderRadius: 6,
                    background: `${T.rose}10`, border: `1px solid ${T.rose}30`,
                    color: "#f8a0b0", fontSize: "0.78rem", fontWeight: 600,
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
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

  if (loading) return (
    <div style={{
      minHeight: "calc(100vh - 64px)", background: T.bg,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 16,
    }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%", background: T.purple, opacity: 0.7,
            animation: "bounce 0.8s infinite alternate", animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
      <p style={{ color: T.muted, fontSize: "0.9rem", margin: 0 }}>Analyzing your resume...</p>
      <style>{`@keyframes bounce{to{transform:translateY(-8px);opacity:.3}}`}</style>
    </div>
  );

  if (!resume) return (
    <div style={{
      minHeight: "calc(100vh - 64px)", background: T.bg,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 12,
    }}>
      <p style={{ color: T.rose }}>Resume not found.</p>
      <Link to="/dashboard" style={{ color: T.purple, textDecoration: "none" }}>← Back to Dashboard</Link>
    </div>
  );

  const { analysisResult: ar } = resume;
  const score         = ar?.score || 0;
  const grade         = ar?.grade || "—";
  const breakdown     = ar?.scoreBreakdown || {};
  const skills        = ar?.extractedSkills || [];
  const catSkills     = ar?.categorizedSkills || {};
  const missing       = ar?.missingSkills || [];
  const detailed      = ar?.detailedJobMatches || [];
  const suggestions   = ar?.suggestions || [];
  const sections      = ar?.sections || {};
  const contactInfo   = ar?.contactInfo || {};
  const education     = ar?.education || [];
  const expInfo       = ar?.experienceLevel || {};
  const atsCheck      = ar?.atsCheck || {};
  const wordCount     = ar?.wordCount || 0;

  const radarData = detailed[0]?.matched_required?.slice(0, 7).map((s) => ({
    skill: s.length > 12 ? s.slice(0, 12) + "…" : s,
    value: Math.floor(Math.random() * 25 + 72),
  })) || skills.slice(0, 7).map((s) => ({
    skill: s.length > 12 ? s.slice(0, 12) + "…" : s,
    value: Math.floor(Math.random() * 40 + 58),
  }));

  /* Score breakdown max values */
  const breakdownMaxes = {
    skills_depth: 30,
    section_completeness: 25,
    keyword_quality: 20,
    content_length: 15,
    contact_info: 10,
  };
  const breakdownLabels = {
    skills_depth: "Skills Depth",
    section_completeness: "Section Completeness",
    keyword_quality: "Keyword Quality",
    content_length: "Content Length",
    contact_info: "Contact Info",
  };

  /* Section presence */
  const sectionList = Object.entries(sections).filter(([k]) => k !== "languages_spoken");
  const presentCount = sectionList.filter(([, v]) => v).length;

  return (
    <div style={{ background: T.bg, minHeight: "calc(100vh - 64px)", position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: T.purple, opacity: 0.04, filter: "blur(120px)", top: -200, right: -100 }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: T.teal, opacity: 0.03, filter: "blur(90px)", bottom: -100, left: -60 }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1020, margin: "0 auto", padding: "40px 16px 80px" }}>

        {/* ── Top nav ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <Link to="/dashboard" style={{
            display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
            color: T.muted, fontSize: "0.88rem", fontWeight: 600,
          }}
            onMouseEnter={e => e.currentTarget.style.color = T.purple}
            onMouseLeave={e => e.currentTarget.style.color = T.muted}
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 14px", borderRadius: 10,
            background: T.surface, border: `1px solid ${T.border}`,
            fontSize: "0.78rem", color: T.muted, maxWidth: 300, overflow: "hidden",
          }}>
            <FileText size={13} color={T.muted} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {resume.fileName}
            </span>
          </div>
        </div>

        {/* ── Page header ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "6px 14px", borderRadius: 99, marginBottom: 14,
            background: `${T.purple}14`, border: `1px solid ${T.purple}30`,
            fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.09em",
            textTransform: "uppercase", color: T.purple,
          }}>
            <Sparkles size={11} strokeWidth={2.5} /> Analysis Complete
          </div>
          <h1 style={{
            fontFamily: "Syne,sans-serif", fontSize: "clamp(1.9rem,4vw,2.8rem)",
            fontWeight: 900, letterSpacing: "-0.04em", color: T.text,
            margin: "0 0 10px", lineHeight: 1.1,
          }}>
            Your Resume Results
          </h1>
          <p style={{ color: T.muted, fontSize: "0.95rem", margin: 0 }}>
            AI-powered breakdown — score, skills, job fit, ATS health, and what to fix next
          </p>
        </div>

        {/* ══════════ ROW 1: Score + Breakdown + Profile ══════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 16 }}>

          {/* Score card */}
          <Card glow={scoreColor(score)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 32 }}>
            <SectionTitle icon={<Award size={14} />} color={T.amber}>Resume Score</SectionTitle>
            <ScoreRing score={score} grade={grade} />

            {/* Mini stats row */}
            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              {[
                { label: "Skills", value: skills.length, color: T.purple },
                { label: "Job Fits", value: detailed.length, color: T.teal },
                { label: "Words", value: wordCount, color: T.sky },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: "center", padding: "10px 4px", borderRadius: 12,
                  background: `${s.color}08`, border: `1px solid ${s.color}18`,
                }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.15rem", color: s.color }}>
                    <AnimNum target={s.value} />
                  </div>
                  <div style={{ fontSize: "0.68rem", color: T.muted, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Experience level badge */}
            {expInfo.level && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "10px 14px", borderRadius: 12,
                background: `${T.sky}08`, border: `1px solid ${T.sky}20`,
              }}>
                <User size={14} color={T.sky} />
                <div>
                  <div style={{ fontSize: "0.72rem", color: T.muted }}>Experience Level</div>
                  <div style={{ fontWeight: 700, color: T.sky, fontSize: "0.9rem" }}>{expInfo.level}</div>
                </div>
              </div>
            )}
          </Card>

          {/* Score Breakdown */}
          <Card>
            <SectionTitle icon={<TrendingUp size={14} />} color={T.sky}>Score Breakdown</SectionTitle>
            {Object.entries(breakdown).map(([key, val]) => (
              <BreakdownBar
                key={key}
                label={breakdownLabels[key] || key}
                value={val}
                max={breakdownMaxes[key] || 10}
                color={val / (breakdownMaxes[key] || 10) >= 0.7 ? T.teal : val / (breakdownMaxes[key] || 10) >= 0.4 ? T.amber : T.rose}
              />
            ))}
            <div style={{
              marginTop: 16, padding: "10px 14px", borderRadius: 10,
              background: `${T.border}80`, display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: "0.8rem", color: T.muted }}>Total Score</span>
              <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.1rem", color: scoreColor(score) }}>
                {score} / 100
              </span>
            </div>
          </Card>

          {/* Candidate Profile */}
          <Card>
            <SectionTitle icon={<User size={14} />} color={T.purple}>Candidate Profile</SectionTitle>

            {/* Contact */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: "0.7rem", color: T.muted, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Contact Info</div>
              {[
                { icon: <Mail size={12} />, val: contactInfo.email, color: T.sky },
                { icon: <Phone size={12} />, val: contactInfo.phone, color: T.teal },
                { icon: <Linkedin size={12} />, val: contactInfo.linkedin, color: "#0a8" },
                { icon: <Github size={12} />, val: contactInfo.github, color: T.text },
                { icon: <Globe size={12} />, val: contactInfo.portfolio, color: T.amber },
              ].map((c, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "5px 0",
                  opacity: c.val ? 1 : 0.3,
                }}>
                  <span style={{ color: c.val ? c.color : T.dim, flexShrink: 0 }}>{c.icon}</span>
                  <span style={{
                    fontSize: "0.78rem", color: c.val ? T.text : T.dim,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    maxWidth: 200,
                  }}>
                    {c.val || "Not found"}
                  </span>
                  {c.val
                    ? <CheckCircle size={11} color={T.teal} style={{ marginLeft: "auto", flexShrink: 0 }} />
                    : <AlertTriangle size={11} color={T.rose} style={{ marginLeft: "auto", flexShrink: 0 }} />
                  }
                </div>
              ))}
            </div>

            {/* Education */}
            {education.length > 0 && (
              <div>
                <div style={{ fontSize: "0.7rem", color: T.muted, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Education Detected</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {education.map((e, i) => (
                    <span key={i} style={{
                      padding: "4px 10px", borderRadius: 8,
                      background: `${T.purple}12`, border: `1px solid ${T.purple}28`,
                      color: "#c0b0ff", fontSize: "0.76rem", fontWeight: 600,
                    }}>
                      🎓 {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ══════════ ROW 2: ATS + Sections ══════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 16 }}>

          {/* ATS Check */}
          <Card glow={atsCheck.ats_friendly ? T.teal : T.rose}>
            <SectionTitle
              icon={atsCheck.ats_friendly ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
              color={atsCheck.ats_friendly ? T.teal : T.rose}
            >
              ATS Compatibility
            </SectionTitle>
            <div style={{
              display: "flex", alignItems: "center", gap: 14, marginBottom: 18,
              padding: "14px 18px", borderRadius: 14,
              background: atsCheck.ats_friendly ? `${T.teal}0c` : `${T.rose}0c`,
              border: `1px solid ${(atsCheck.ats_friendly ? T.teal : T.rose)}25`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: atsCheck.ats_friendly ? `${T.teal}18` : `${T.rose}18`,
                fontSize: 22,
              }}>
                {atsCheck.ats_friendly ? "✅" : "⚠️"}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: atsCheck.ats_friendly ? T.teal : T.rose, fontSize: "0.95rem" }}>
                  {atsCheck.ats_friendly ? "ATS Friendly" : "Issues Detected"}
                </div>
                <div style={{ fontSize: "0.78rem", color: T.muted }}>
                  {atsCheck.ats_friendly ? "Your resume should parse well" : `${atsCheck.warnings?.length} issue(s) found`}
                </div>
              </div>
            </div>
            {atsCheck.warnings?.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {atsCheck.warnings.map((w, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    padding: "10px 14px", borderRadius: 10,
                    background: `${T.rose}08`, border: `1px solid ${T.rose}20`,
                  }}>
                    <AlertTriangle size={13} color={T.rose} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: "0.8rem", color: "#f0b0b8", lineHeight: 1.5 }}>{w}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Resume Sections */}
          <Card>
            <SectionTitle icon={<Layers size={14} />} color={T.sky} badge={`${presentCount}/${sectionList.length}`}>
              Resume Sections
            </SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {sectionList.map(([key, present]) => (
                <div key={key} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px", borderRadius: 10,
                  background: present ? `${T.teal}08` : `${T.rose}05`,
                  border: `1px solid ${present ? T.teal : T.rose}20`,
                }}>
                  <span style={{ fontSize: 12, flexShrink: 0 }}>{present ? "✅" : "❌"}</span>
                  <span style={{
                    fontSize: "0.76rem", fontWeight: 600, textTransform: "capitalize",
                    color: present ? "#a0f0d8" : "#f0a0b0",
                  }}>
                    {key.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ══════════ ROW 3: Categorized Skills ══════════ */}
        <div style={{ marginBottom: 16 }}>
          <Card>
            <SectionTitle icon={<Code size={14} />} color={T.purple} badge={`${skills.length} skills`}>
              Skills by Category
            </SectionTitle>
            {Object.keys(catSkills).length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {Object.entries(catSkills).map(([cat, catSkillsList], ci) => {
                  const color = categoryColors[ci % categoryColors.length];
                  return (
                    <div key={cat}>
                      <div style={{
                        fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em",
                        textTransform: "uppercase", color, marginBottom: 8,
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: color, display: "inline-block",
                        }} />
                        {cat.replace(/_/g, " ")}
                        <span style={{ opacity: 0.5, fontWeight: 600 }}>({catSkillsList.length})</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {catSkillsList.map((s, si) => (
                          <span key={si} style={{
                            padding: "4px 12px", borderRadius: 8,
                            background: `${color}10`, border: `1px solid ${color}28`,
                            color, fontSize: "0.8rem", fontWeight: 600,
                            animation: "fadeUp 0.3s ease both",
                            animationDelay: `${si * 0.02}s`,
                          }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : skills.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {skills.map((s, i) => (
                  <span key={i} style={{
                    padding: "5px 13px", borderRadius: 8,
                    background: `${T.purple}10`, border: `1px solid ${T.purple}28`,
                    color: T.purple, fontSize: "0.8rem", fontWeight: 600,
                  }}>{s}</span>
                ))}
              </div>
            ) : (
              <p style={{ color: T.muted, fontSize: "0.88rem" }}>No skills detected</p>
            )}
          </Card>
        </div>

        {/* ══════════ ROW 4: Radar + Missing ══════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 16 }}>

          {/* Radar */}
          {radarData.length > 0 && (
            <Card>
              <SectionTitle icon={<TrendingUp size={14} />} color={T.sky}>Skill Strength Radar</SectionTitle>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={T.border2} />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: T.muted, fontSize: 11 }} />
                  <Radar dataKey="value" stroke={T.purple} fill={T.purple} fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <p style={{ fontSize: "0.74rem", color: T.dim, textAlign: "center", margin: "8px 0 0" }}>
                Based on top job match skills
              </p>
            </Card>
          )}

          {/* Missing Skills */}
          <Card>
            <SectionTitle icon={<AlertTriangle size={14} />} color={T.rose}>
              Skills to Learn
            </SectionTitle>
            {missing.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {missing.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 10,
                    background: `${T.rose}07`, border: `1px solid ${T.rose}20`,
                    animation: "fadeUp 0.3s ease both",
                    animationDelay: `${i * 0.05}s`,
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${T.rose}15`, color: T.rose, fontSize: "0.7rem", fontWeight: 800,
                    }}>{i + 1}</div>
                    <span style={{ fontSize: "0.85rem", color: "#f8b0c0", fontWeight: 600 }}>{s}</span>
                    <Zap size={12} color={T.rose} style={{ marginLeft: "auto", flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", textAlign: "center", padding: "24px 0", gap: 12,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 24,
                  background: `${T.teal}12`, border: `1px solid ${T.teal}25`,
                }}>✅</div>
                <div>
                  <div style={{ fontWeight: 700, color: T.teal, marginBottom: 4, fontSize: "0.9rem" }}>No Critical Gaps!</div>
                  <div style={{ color: T.muted, fontSize: "0.8rem" }}>You cover the essentials for your top match</div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ══════════ ROW 5: Job Matches ══════════ */}
        <div style={{ marginBottom: 16 }}>
          <Card>
            <SectionTitle icon={<Briefcase size={14} />} color={T.teal} badge={`${detailed.length} matches`}>
              Job Compatibility
            </SectionTitle>
            {detailed.length > 0 ? (
              detailed.map((job, i) => <JobCard key={i} job={job} index={i} />)
            ) : (
              <p style={{ color: T.muted, fontSize: "0.88rem" }}>No job matches found. Add more skills to improve matching.</p>
            )}
          </Card>
        </div>

        {/* ══════════ ROW 6: Suggestions ══════════ */}
        <div style={{ marginBottom: 40 }}>
          <Card>
            <SectionTitle icon={<Lightbulb size={14} />} color={T.amber}>
              AI Recommendations
              <span style={{
                marginLeft: 8, padding: "2px 10px", borderRadius: 99,
                background: `${T.amber}15`, color: T.amber, fontSize: "0.72rem", fontWeight: 800,
              }}>{suggestions.length} actions</span>
            </SectionTitle>

            {suggestions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {suggestions.map((s, i) => {
                  const sug = typeof s === "string" ? { message: s, priority: "medium", category: "General" } : s;
                  const pm = priorityMeta[sug.priority] || priorityMeta.info;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "14px 18px", borderRadius: 14,
                      background: `${pm.color}06`,
                      border: `1px solid ${pm.color}20`,
                      borderLeft: `3px solid ${pm.color}`,
                      animation: "fadeUp 0.3s ease both",
                      animationDelay: `${i * 0.05}s`,
                    }}>
                      {/* Priority indicator */}
                      <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        gap: 4, flexShrink: 0, paddingTop: 2,
                      }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: 8,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: `${pm.color}18`, color: pm.color,
                          fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "0.72rem",
                        }}>{i + 1}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{
                            fontSize: "0.68rem", fontWeight: 800, padding: "2px 8px",
                            borderRadius: 99, background: `${pm.color}15`, color: pm.color,
                            textTransform: "uppercase", letterSpacing: "0.07em",
                          }}>{pm.dot} {sug.priority}</span>
                          {sug.category && (
                            <span style={{ fontSize: "0.68rem", color: T.muted, fontWeight: 600 }}>
                              {sug.category}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: "0.87rem", color: "#c8c8e8", lineHeight: 1.65 }}>
                          {sug.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: T.muted, fontSize: "0.88rem" }}>No suggestions available</p>
            )}
          </Card>
        </div>

        {/* ══════════ CTA ══════════ */}
        <div style={{
          borderRadius: 24, padding: "40px 32px", textAlign: "center", position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, rgba(124,109,255,0.1) 0%, rgba(56,197,245,0.05) 100%)",
          border: `1px solid ${T.border}`,
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(124,109,255,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "6px 14px", borderRadius: 99, marginBottom: 16,
              background: `${T.purple}14`, border: `1px solid ${T.purple}30`,
              fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.09em",
              textTransform: "uppercase", color: T.purple,
            }}>
              <Star size={11} strokeWidth={2.5} /> Keep Improving
            </div>
            <h3 style={{
              fontFamily: "Syne,sans-serif", fontSize: "clamp(1.3rem,3vw,1.8rem)",
              fontWeight: 900, letterSpacing: "-0.03em", color: T.text, marginBottom: 10,
            }}>
              Ready to try another resume?
            </h3>
            <p style={{ color: T.muted, fontSize: "0.9rem", maxWidth: 360, margin: "0 auto 24px" }}>
              Apply the suggestions above, upload your improved resume, and watch your score climb.
            </p>
            <Link to="/upload" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 28px", borderRadius: 14, textDecoration: "none",
              background: `linear-gradient(135deg, ${T.purple}, #9b5cf6)`,
              color: "#fff", fontWeight: 700, fontSize: "0.95rem",
              boxShadow: `0 4px 24px ${T.purple}40`,
              transition: "all 0.25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${T.purple}55`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 24px ${T.purple}40`; }}
            >
              <Upload size={17} strokeWidth={2} />
              Analyze Another Resume
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { to { transform: translateY(-8px); opacity: .3; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}