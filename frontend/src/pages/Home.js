import React from "react";
import { Link } from "react-router-dom";
import { Upload, Zap, Target, TrendingUp, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import "./Home.css";

const features = [
  { icon: <Upload size={22} />, title: "Upload PDF", desc: "Drop your resume in seconds. We support any standard PDF format." },
  { icon: <Zap size={22} />,    title: "AI Analysis", desc: "NLP-powered engine extracts every skill and scores your resume instantly." },
  { icon: <Target size={22} />, title: "Job Matching", desc: "Get matched to the most relevant roles based on your exact skillset." },
  { icon: <TrendingUp size={22} />, title: "Skill Gaps", desc: "Know exactly what to learn next to land your dream developer job." },
];

const checks = [
  "Skills extraction & matching",
  "Resume score out of 100",
  "Top job role recommendations",
  "Missing skills identified",
  "Actionable improvement tips",
];

const steps = [
  { num: "01", title: "Upload your resume", desc: "PDF format, max 5MB" },
  { num: "02", title: "AI scans & extracts", desc: "NLP reads every skill" },
  { num: "03", title: "Get your results",   desc: "Score, gaps & job matches" },
];

export default function Home() {
  return (
    <div style={{ background: "#0a0a0f", color: "#f0f0f8", overflowX: "hidden" }}>

      {/* ══════════════ HERO ══════════════ */}
      <section className="home-hero position-relative" style={{ minHeight: "calc(100vh - 62px)", display: "flex", alignItems: "center" }}>

        {/* Glow blobs */}
        <div className="hero-blob hero-blob--1" />
        <div className="hero-blob hero-blob--2" />
        <div className="hero-grid" />

        <div className="container position-relative py-5" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">

            {/* Left copy */}
            <div className="col-12 col-lg-6">

              {/* Badge */}
              <div
                className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-2 rounded-pill"
                style={{ background: "#1a1a24", border: "1px solid #3a3a4f", fontSize: "0.8rem", color: "#a78bfa" }}
              >
                <Zap size={13} strokeWidth={2.5} />
                AI-Powered Resume Analysis
              </div>

              {/* Headline */}
              <h1
                className="fw-bold mb-4"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "clamp(2.6rem, 5.5vw, 4rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  color: "#f0f0f8",
                }}
              >
                Know exactly where<br />
                <span className="hero-gradient-text">your resume stands</span>
              </h1>

              {/* Sub */}
              <p className="mb-4" style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "#9090b0", lineHeight: 1.75, maxWidth: 500 }}>
                Upload your resume and get an instant AI analysis —
                skills score, job matches, and a clear roadmap to your next role.
              </p>

              {/* CTA buttons */}
              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link
                  to="/register"
                  className="d-inline-flex align-items-center gap-2 fw-semibold text-decoration-none text-white"
                  style={{
                    padding: "14px 28px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
                    fontSize: "1rem", transition: "all 0.25s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(108,99,255,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  Analyze My Resume <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="d-inline-flex align-items-center gap-2 fw-medium text-decoration-none"
                  style={{
                    padding: "14px 28px", borderRadius: "12px",
                    border: "1px solid #3a3a4f", color: "#9090b0",
                    fontSize: "1rem", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#6c63ff"; e.currentTarget.style.color = "#a78bfa"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#3a3a4f"; e.currentTarget.style.color = "#9090b0"; }}
                >
                  Sign In
                </Link>
              </div>

              {/* Check list */}
              <div className="d-flex flex-wrap gap-2">
                {checks.map((c, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center gap-2"
                    style={{ fontSize: "0.82rem", color: "#9090b0" }}
                  >
                    <CheckCircle size={13} color="#22d3a5" strokeWidth={2.5} />
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating card mockup */}
            <div className="col-12 col-lg-6 d-flex justify-content-center">
              <div
                className="position-relative w-100"
                style={{ maxWidth: 420 }}
              >
                {/* Score card */}
                <div
                  className="rounded-4 p-4 mb-3"
                  style={{
                    background: "#111118",
                    border: "1px solid #2a2a3a",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span style={{ fontSize: "0.85rem", color: "#9090b0", fontWeight: 500 }}>Resume Score</span>
                    <span
                      className="px-2 py-1 rounded-2"
                      style={{ background: "rgba(34,211,165,0.1)", color: "#22d3a5", fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      Analyzed ✓
                    </span>
                  </div>

                  {/* Score ring mockup */}
                  <div className="d-flex align-items-center gap-4 mb-4">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                      style={{
                        width: 90, height: 90,
                        background: "conic-gradient(#6c63ff 0% 74%, #2a2a3a 74% 100%)",
                        boxShadow: "0 0 0 6px #0a0a0f",
                      }}
                    >
                      <div
                        className="d-flex flex-column align-items-center justify-content-center rounded-circle"
                        style={{ width: 68, height: 68, background: "#111118" }}
                      >
                        <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#6c63ff", lineHeight: 1 }}>74</span>
                        <span style={{ fontSize: "0.65rem", color: "#5a5a7a" }}>/100</span>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2 flex-grow-1">
                      {[
                        { label: "Skills found",  val: "11", color: "#6c63ff" },
                        { label: "Job matches",   val: "3",  color: "#22d3a5" },
                        { label: "Missing skills",val: "2",  color: "#f59e0b" },
                      ].map((item, i) => (
                        <div key={i} className="d-flex justify-content-between align-items-center">
                          <span style={{ fontSize: "0.78rem", color: "#9090b0" }}>{item.label}</span>
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: item.color }}>{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skill tags */}
                  <div className="d-flex flex-wrap gap-2">
                    {["react", "node.js", "mongodb", "express", "javascript", "git"].map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-2"
                        style={{ background: "rgba(108,99,255,0.1)", color: "#a78bfa", fontSize: "0.75rem", border: "1px solid rgba(108,99,255,0.2)" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div
                  className="position-absolute d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                  style={{
                    top: -16, right: -16,
                    background: "linear-gradient(135deg,#6c63ff,#38bdf8)",
                    color: "#fff", fontSize: "0.78rem", fontWeight: 600,
                    boxShadow: "0 8px 24px rgba(108,99,255,0.4)",
                  }}
                >
                  <Sparkles size={13} /> AI-Powered
                </div>

                {/* Job match card */}
                <div
                  className="rounded-3 px-4 py-3 d-flex align-items-center gap-3"
                  style={{
                    background: "#111118",
                    border: "1px solid #2a2a3a",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                    style={{ width: 38, height: 38, background: "rgba(34,211,165,0.1)" }}
                  >
                    <Target size={18} color="#22d3a5" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f0f0f8" }}>
                      Full Stack Developer (MERN)
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#22d3a5" }}>80% match</div>
                  </div>
                  <div className="ms-auto">
                    <div
                      className="rounded-pill px-2 py-1"
                      style={{ background: "rgba(34,211,165,0.1)", color: "#22d3a5", fontSize: "0.7rem", fontWeight: 700 }}
                    >
                      Top pick
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="py-5" style={{ background: "#0d0d14", borderTop: "1px solid #1a1a24" }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2
              className="fw-bold mb-2"
              style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", color: "#f0f0f8", letterSpacing: "-0.02em" }}
            >
              How it works
            </h2>
            <p style={{ color: "#9090b0", fontSize: "1rem" }}>Three steps to your next job offer</p>
          </div>

          <div className="row g-4 justify-content-center">
            {steps.map((s, i) => (
              <div key={i} className="col-12 col-md-4">
                <div
                  className="rounded-4 p-4 h-100 position-relative"
                  style={{ background: "#111118", border: "1px solid #2a2a3a", transition: "border-color 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#6c63ff"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a3a"}
                >
                  <div
                    className="fw-bold mb-3"
                    style={{
                      fontFamily: "Syne,sans-serif", fontSize: "2.5rem",
                      background: "linear-gradient(135deg,rgba(108,99,255,0.3),rgba(56,189,248,0.2))",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      lineHeight: 1,
                    }}
                  >
                    {s.num}
                  </div>
                  <h3 className="fw-semibold mb-2" style={{ fontSize: "1.05rem", color: "#f0f0f8" }}>{s.title}</h3>
                  <p className="mb-0" style={{ fontSize: "0.88rem", color: "#9090b0" }}>{s.desc}</p>

                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div
                      className="d-none d-md-block position-absolute"
                      style={{ top: "50%", right: -20, width: 40, height: 1, background: "linear-gradient(90deg,#2a2a3a,transparent)", zIndex: 2 }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-5" style={{ background: "#0a0a0f" }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2
              className="fw-bold mb-2"
              style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", color: "#f0f0f8", letterSpacing: "-0.02em" }}
            >
              Everything you need
            </h2>
            <p style={{ color: "#9090b0", fontSize: "1rem" }}>From upload to actionable insights in under 30 seconds</p>
          </div>

          <div className="row g-3">
            {features.map((f, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3">
                <div
                  className="rounded-4 p-4 h-100"
                  style={{ background: "#111118", border: "1px solid #2a2a3a", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#6c63ff"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(108,99,255,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a3a"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 mb-3"
                    style={{ width: 48, height: 48, background: "rgba(108,99,255,0.12)", color: "#a78bfa" }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="fw-semibold mb-2" style={{ fontSize: "1.05rem", color: "#f0f0f8" }}>{f.title}</h3>
                  <p className="mb-0" style={{ fontSize: "0.88rem", color: "#9090b0", lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ STATS STRIP ══════════════ */}
      <section style={{ background: "#0d0d14", borderTop: "1px solid #1a1a24", borderBottom: "1px solid #1a1a24" }}>
        <div className="container py-4">
          <div className="row g-3 text-center">
            {[
              { num: "500+", label: "Resumes analyzed" },
              { num: "12+",  label: "Job roles matched" },
              { num: "30s",  label: "Average analysis time" },
              { num: "95%",  label: "Accuracy rate" },
            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div
                  className="fw-bold"
                  style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", color: "#f0f0f8", letterSpacing: "-0.02em" }}
                >
                  {s.num}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#5a5a7a", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="py-5" style={{ background: "#0a0a0f" }}>
        <div className="container py-4">
          <div
            className="rounded-4 p-5 text-center position-relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(56,189,248,0.06) 100%)",
              border: "1px solid #2a2a3a",
            }}
          >
            {/* CTA glow */}
            <div
              className="position-absolute top-50 start-50 translate-middle rounded-circle"
              style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }}
            />

            <div className="position-relative" style={{ zIndex: 1 }}>
              <div
                className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-2 rounded-pill"
                style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.25)", fontSize: "0.8rem", color: "#a78bfa" }}
              >
                <Sparkles size={13} /> Free to use
              </div>

              <h2
                className="fw-bold mb-3"
                style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#f0f0f8", letterSpacing: "-0.025em" }}
              >
                Ready to level up your resume?
              </h2>
              <p className="mb-4 mx-auto" style={{ color: "#9090b0", fontSize: "1rem", maxWidth: 460 }}>
                Join thousands of developers who landed their dream roles faster with AI-powered resume insights.
              </p>

              <Link
                to="/register"
                className="d-inline-flex align-items-center gap-2 fw-semibold text-decoration-none text-white"
                style={{
                  padding: "14px 32px", borderRadius: "12px",
                  background: "linear-gradient(135deg,#6c63ff,#8b5cf6)",
                  fontSize: "1rem", transition: "all 0.25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(108,99,255,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer
        className="py-4"
        style={{ background: "#0a0a0f", borderTop: "1px solid #1a1a24" }}
      >
        <div className="container">
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{ width: 28, height: 28, background: "linear-gradient(135deg,#6c63ff,#38bdf8)" }}
              >
                <Zap size={14} color="#fff" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f0f8" }}>
                Resume<span style={{ background: "linear-gradient(135deg,#a78bfa,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
              </span>
            </div>
            <p className="mb-0" style={{ fontSize: "0.8rem", color: "#5a5a7a" }}>
              Built by Omkar Gawali · 2025
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}