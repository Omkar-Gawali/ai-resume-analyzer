import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  Sparkles,
} from "lucide-react";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      toast.success(`Welcome back, ${data.name.split(" ")[0]}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (key) => ({
    width: "100%",
    height: 50,
    background: focused === key ? "rgba(108,99,255,0.05)" : "#0e0e17",
    border: `1.5px solid ${focused === key ? "#6c63ff" : "#252535"}`,
    borderRadius: 12,
    color: "#f0f0f8",
    paddingLeft: 44,
    paddingRight: key === "password" ? 44 : 16,
    fontSize: "0.93rem",
    outline: "none",
    boxShadow: focused === key ? "0 0 0 3px rgba(108,99,255,0.12)" : "none",
    transition: "all 0.2s",
  });

  const stats = [
    { num: "500+", label: "Resumes analyzed" },
    { num: "12+", label: "Job roles matched" },
    { num: "30s", label: "Analysis time" },
  ];

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        background: "#0a0a0f",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Background orbs ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div className="auth-orb auth-orb--1" />
        <div className="auth-orb auth-orb--2" />
        <div className="auth-orb auth-orb--3" />
        <div className="auth-grid" />
      </div>

      <div
        className="container-fluid flex-grow-1 position-relative"
        style={{ zIndex: 1 }}
      >
        <div className="row" style={{ minHeight: "calc(100vh - 64px)" }}>
          {/* ══════════════════════════════
              LEFT — Branding panel
          ══════════════════════════════ */}
          <div
            className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5"
            style={{
              borderRight: "1px solid #1e1e2a",
              background:
                "linear-gradient(160deg,rgba(108,99,255,0.07) 0%,rgba(56,189,248,0.03) 60%,transparent 100%)",
            }}
          >
            {/* Brand */}
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg,#6c63ff,#38bdf8)",
                  boxShadow: "0 4px 16px rgba(108,99,255,0.35)",
                }}
              >
                <FileText size={19} color="#fff" strokeWidth={2} />
              </div>
              <span
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  color: "#f0f0f8",
                  letterSpacing: "-0.02em",
                }}
              >
                Resume
                <span
                  style={{
                    background: "linear-gradient(135deg,#a78bfa,#38bdf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  AI
                </span>
              </span>
            </div>

            {/* Hero copy */}
            <div>
              <h1
                className="fw-bold mb-4"
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2.4rem,4vw,3.4rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  color: "#f0f0f8",
                }}
              >
                Your career,
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg,#a78bfa,#38bdf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  analyzed.
                </span>
              </h1>
              <p
                className="mb-5"
                style={{
                  color: "#7070a0",
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  maxWidth: 380,
                }}
              >
                Upload your resume and get instant AI-powered insights — skill
                gaps, job matches, and a clear path forward.
              </p>

              {/* Stats */}
              <div className="d-flex align-items-center">
                {stats.map((s, i) => (
                  <React.Fragment key={i}>
                    <div
                      className="d-flex flex-column"
                      style={{ paddingRight: i < 2 ? 28 : 0 }}
                    >
                      <strong
                        style={{
                          fontFamily: "Syne,sans-serif",
                          fontSize: "1.7rem",
                          fontWeight: 800,
                          color: "#f0f0f8",
                          letterSpacing: "-0.03em",
                          lineHeight: 1,
                        }}
                      >
                        {s.num}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.77rem",
                          color: "#454560",
                          marginTop: 4,
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div
                        style={{
                          width: 1,
                          height: 36,
                          background: "#1e1e2a",
                          marginRight: 28,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Feature chips */}
            <div className="d-flex flex-wrap gap-2">
              {[
                "Skill extraction",
                "Job matching",
                "Score out of 100",
                "AI suggestions",
              ].map((f, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid #1e1e2a",
                    fontSize: "0.78rem",
                    color: "#7070a0",
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#a78bfa,#38bdf8)",
                      flexShrink: 0,
                    }}
                  />
                  {f}
                </div>
              ))}
            </div>

            <p style={{ fontSize: "0.8rem", color: "#353550" }}>
              Built for developers who ship 🚀
            </p>
          </div>

          {/* ══════════════════════════════
              RIGHT — Form panel
          ══════════════════════════════ */}
          <div
            className="col-12 col-lg-6 d-flex align-items-center justify-content-center"
            style={{ padding: "48px 24px" }}
          >
            <div style={{ width: "100%", maxWidth: 400 }}>
              {/* Header */}
              <div style={{ marginBottom: 32 }}>
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
                  <Sparkles size={11} strokeWidth={2.5} /> Welcome back
                </div>
                <h2
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontWeight: 800,
                    fontSize: "2rem",
                    letterSpacing: "-0.03em",
                    color: "#f0f0f8",
                    marginBottom: 8,
                    lineHeight: 1.1,
                  }}
                >
                  Sign in to continue
                </h2>
                <p style={{ fontSize: "0.88rem", color: "#7070a0" }}>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#a78bfa",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.textDecoration = "none")
                    }
                  >
                    Create one free →
                  </Link>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    marginBottom: 24,
                  }}
                >
                  {/* Email */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: focused === "email" ? "#a78bfa" : "#454560",
                        marginBottom: 8,
                        transition: "color 0.2s",
                      }}
                    >
                      Email address
                    </label>
                    <div className="position-relative">
                      <span
                        className="position-absolute"
                        style={{
                          left: 14,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: focused === "email" ? "#a78bfa" : "#454560",
                          pointerEvents: "none",
                          transition: "color 0.2s",
                          zIndex: 1,
                        }}
                      >
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused("")}
                        required
                        autoComplete="email"
                        style={inputStyle("email")}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div
                      className="d-flex align-items-center justify-content-between"
                      style={{ marginBottom: 8 }}
                    >
                      <label
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          color: focused === "password" ? "#a78bfa" : "#454560",
                          transition: "color 0.2s",
                        }}
                      >
                        Password
                      </label>
                    </div>
                    <div className="position-relative">
                      <span
                        className="position-absolute"
                        style={{
                          left: 14,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: focused === "password" ? "#a78bfa" : "#454560",
                          pointerEvents: "none",
                          transition: "color 0.2s",
                          zIndex: 1,
                        }}
                      >
                        <Lock size={16} />
                      </span>
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused("")}
                        required
                        autoComplete="current-password"
                        style={inputStyle("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        tabIndex={-1}
                        className="position-absolute border-0 d-flex align-items-center justify-content-center"
                        style={{
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          color: "#454560",
                          cursor: "pointer",
                          padding: 6,
                          borderRadius: 6,
                          transition: "color 0.2s",
                          zIndex: 1,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#9090b0")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#454560")
                        }
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="d-flex align-items-center justify-content-center gap-2 fw-semibold border-0 w-100"
                    style={{
                      height: 52,
                      borderRadius: 12,
                      background: loading
                        ? "rgba(108,99,255,0.5)"
                        : "linear-gradient(135deg,#6c63ff 0%,#8b5cf6 100%)",
                      color: "#fff",
                      fontSize: "0.97rem",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      boxShadow: "0 4px 20px rgba(108,99,255,0.3)",
                      position: "relative",
                      overflow: "hidden",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 32px rgba(108,99,255,0.45)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(108,99,255,0.3)";
                    }}
                  >
                    {/* Shine overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 50%)",
                        pointerEvents: "none",
                      }}
                    />
                    {loading ? (
                      <span className="auth-spinner" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight size={17} strokeWidth={2.2} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div
                className="d-flex align-items-center gap-3"
                style={{ marginBottom: 16 }}
              >
                <hr
                  className="flex-grow-1 m-0"
                  style={{ borderColor: "#1e1e2a" }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#353550",
                    whiteSpace: "nowrap",
                  }}
                >
                  or continue with
                </span>
                <hr
                  className="flex-grow-1 m-0"
                  style={{ borderColor: "#1e1e2a" }}
                />
              </div>

              {/* Social buttons */}
              <div className="row g-2">
                {[
                  {
                    label: "Google",
                    icon: (
                      <svg width="17" height="17" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "GitHub",
                    icon: (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="#9090b0"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    ),
                  },
                ].map((s, i) => (
                  <div className="col-6" key={i}>
                    <button
                      type="button"
                      disabled
                      className="d-flex align-items-center justify-content-center gap-2 w-100 border-0 fw-medium"
                      style={{
                        height: 46,
                        borderRadius: 10,
                        background: "#0e0e17",
                        border: "1px solid #1e1e2a !important",
                        outline: "1px solid #1e1e2a",
                        color: "#7070a0",
                        fontSize: "0.875rem",
                        opacity: 0.55,
                        cursor: "not-allowed",
                        fontFamily: "inherit",
                      }}
                    >
                      {s.icon} {s.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-30px) scale(1.06); }
        }
        .auth-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .auth-orb--1 { width:520px;height:520px;background:#6c63ff;opacity:.12;top:-160px;left:-100px;animation:orbFloat 14s ease-in-out infinite; }
        .auth-orb--2 { width:400px;height:400px;background:#38bdf8;opacity:.08;bottom:-100px;right:-80px;animation:orbFloat 10s ease-in-out infinite;animation-delay:-4s; }
        .auth-orb--3 { width:280px;height:280px;background:#a78bfa;opacity:.07;top:50%;left:40%;transform:translate(-50%,-50%);animation:orbFloat 18s ease-in-out infinite;animation-delay:-7s; }
        .auth-grid {
          position:absolute;inset:0;
          background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
          background-size:52px 52px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);
        }
        .auth-spinner {
          width:20px;height:20px;
          border:2px solid rgba(255,255,255,0.25);
          border-top-color:#fff;
          border-radius:50%;
          animation:spin .7s linear infinite;
          display:inline-block;
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        input::placeholder { color:#353550 !important; }
        input:focus { outline:none !important; }
      `}</style>
    </div>
  );
}
