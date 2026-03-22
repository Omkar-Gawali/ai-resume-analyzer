import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data);
      toast.success(`Account created! Welcome, ${data.name.split(" ")[0]}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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

  const fields = [
    {
      key: "name",
      type: "text",
      placeholder: "Enter Name",
      Icon: User,
      label: "Full name",
      ac: "name",
    },
    {
      key: "email",
      type: "email",
      placeholder: "you@example.com",
      Icon: Mail,
      label: "Email address",
      ac: "email",
    },
    {
      key: "password",
      type: "password",
      placeholder: "Min 6 characters",
      Icon: Lock,
      label: "Password",
      ac: "new-password",
    },
  ];

  const checklist = [
    "Instant skill extraction",
    "Job role matching",
    "Actionable suggestions",
    "Score out of 100",
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
      {/* Background */}
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
          {/* LEFT */}
          <div
            className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5"
            style={{
              borderRight: "1px solid #1e1e2a",
              background:
                "linear-gradient(160deg,rgba(108,99,255,0.07) 0%,rgba(56,189,248,0.03) 60%,transparent 100%)",
            }}
          >
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
                Land your
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg,#a78bfa,#38bdf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  dream role.
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
                Get an AI-powered breakdown of your resume — skills extracted,
                gaps identified, and job roles matched instantly.
              </p>
              <div className="d-flex flex-column gap-3">
                {checklist.map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                      style={{
                        width: 28,
                        height: 28,
                        background: "rgba(34,211,165,0.1)",
                        border: "1px solid rgba(34,211,165,0.2)",
                      }}
                    >
                      <CheckCircle
                        size={14}
                        color="#22d3a5"
                        strokeWidth={2.5}
                      />
                    </div>
                    <span style={{ fontSize: "0.9rem", color: "#7070a0" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontSize: "0.8rem", color: "#353550" }}>
              Free to use · No credit card needed
            </p>
          </div>

          {/* RIGHT */}
          <div
            className="col-12 col-lg-6 d-flex align-items-center justify-content-center"
            style={{ padding: "48px 24px" }}
          >
            <div style={{ width: "100%", maxWidth: 400 }}>
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
                  <Sparkles size={11} strokeWidth={2.5} /> Get started
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
                  Create your account
                </h2>
                <p style={{ fontSize: "0.88rem", color: "#7070a0" }}>
                  Already have one?{" "}
                  <Link
                    to="/login"
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
                    Sign in instead →
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    marginBottom: 20,
                  }}
                >
                  {fields.map(({ key, type, placeholder, Icon, label, ac }) => (
                    <div key={key}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          color: focused === key ? "#a78bfa" : "#454560",
                          marginBottom: 8,
                          transition: "color 0.2s",
                        }}
                      >
                        {label}
                      </label>
                      <div className="position-relative">
                        <span
                          className="position-absolute"
                          style={{
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: focused === key ? "#a78bfa" : "#454560",
                            pointerEvents: "none",
                            transition: "color 0.2s",
                            zIndex: 1,
                          }}
                        >
                          <Icon size={16} />
                        </span>
                        <input
                          type={
                            key === "password"
                              ? showPass
                                ? "text"
                                : "password"
                              : type
                          }
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={(e) =>
                            setForm({ ...form, [key]: e.target.value })
                          }
                          onFocus={() => setFocused(key)}
                          onBlur={() => setFocused("")}
                          required
                          autoComplete={ac}
                          style={inputStyle(key)}
                        />
                        {key === "password" && (
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
                            {showPass ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

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
                        <span>Create Account</span>
                        <ArrowRight size={17} strokeWidth={2.2} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <p
                className="text-center"
                style={{
                  fontSize: "0.75rem",
                  color: "#353550",
                  lineHeight: 1.6,
                }}
              >
                By creating an account you agree to our{" "}
                <span style={{ color: "#454560", cursor: "default" }}>
                  Terms
                </span>{" "}
                and{" "}
                <span style={{ color: "#454560", cursor: "default" }}>
                  Privacy Policy
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.06)} }
        .auth-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
        .auth-orb--1{width:520px;height:520px;background:#6c63ff;opacity:.12;top:-160px;left:-100px;animation:orbFloat 14s ease-in-out infinite;}
        .auth-orb--2{width:400px;height:400px;background:#38bdf8;opacity:.08;bottom:-100px;right:-80px;animation:orbFloat 10s ease-in-out infinite;animation-delay:-4s;}
        .auth-orb--3{width:280px;height:280px;background:#a78bfa;opacity:.07;top:50%;left:40%;transform:translate(-50%,-50%);animation:orbFloat 18s ease-in-out infinite;animation-delay:-7s;}
        .auth-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:52px 52px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);}
        .auth-spinner{width:20px;height:20px;border:2px solid rgba(255,255,255,0.25);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;}
        @keyframes spin{to{transform:rotate(360deg)}}
        input::placeholder{color:#353550 !important;}
        input:focus{outline:none !important;}
      `}</style>
    </div>
  );
}
