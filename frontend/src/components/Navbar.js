import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  LogOut,
  Upload,
  LayoutDashboard,
  Sparkles,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
    setDropOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLogout = () => {
    setDropOpen(false);
    setOpen(false);
    logout();
    navigate("/");
  };

  const isActive = (p) => location.pathname === p;

  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={15} strokeWidth={2} />,
    },
    {
      to: "/upload",
      label: "Analyze",
      icon: <Upload size={15} strokeWidth={2} />,
    },
  ];

  return (
    <>
      {/* ════════════ MAIN NAV ════════════ */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          background: scrolled ? "rgba(8,8,12,0.98)" : "rgba(8,8,12,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid ${scrolled ? "#1e1e2a" : "rgba(255,255,255,0.06)"}`,
          boxShadow: scrolled
            ? "0 1px 0 #1e1e2a, 0 4px 32px rgba(0,0,0,0.5)"
            : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "0 20px",
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* ── Logo ── */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                flexShrink: 0,
                background: "linear-gradient(135deg,#6c63ff,#38bdf8)",
                boxShadow: "0 2px 12px rgba(108,99,255,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={17} color="#fff" strokeWidth={2} />
            </div>
            <span
              style={{
                fontFamily: "Syne,sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                letterSpacing: "-0.025em",
                color: "#f0f0f8",
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
          </Link>

          {/* ── Desktop centre pill ── */}
          {user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1e1e2a",
                borderRadius: 12,
                padding: "4px 5px",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              className="d-none d-lg-flex"
            >
              {navLinks.map(({ to, label, icon }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "7px 16px",
                      borderRadius: 8,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      color: active ? "#f0f0f8" : "#6060a0",
                      background: active
                        ? "linear-gradient(135deg,rgba(108,99,255,0.2),rgba(56,189,248,0.1))"
                        : "transparent",
                      border: active
                        ? "1px solid rgba(108,99,255,0.3)"
                        : "1px solid transparent",
                      transition: "all 0.18s",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = "#c0c0e0";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = "#6060a0";
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <span
                      style={{
                        color: active ? "#a78bfa" : "#6060a0",
                        display: "flex",
                      }}
                    >
                      {icon}
                    </span>
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── Desktop right ── */}
          <div
            className="d-none d-lg-flex"
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {user ? (
              /* User dropdown */
              <div ref={dropRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setDropOpen((o) => !o)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: dropOpen
                      ? "rgba(108,99,255,0.12)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${dropOpen ? "rgba(108,99,255,0.35)" : "#1e1e2a"}`,
                    borderRadius: 10,
                    padding: "5px 10px 5px 5px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: "linear-gradient(135deg,#6c63ff,#a78bfa)",
                      color: "#fff",
                      fontFamily: "Syne,sans-serif",
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#c0c0e0",
                    }}
                  >
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={13}
                    color="#6060a0"
                    style={{
                      transform: dropOpen ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>

                {/* Dropdown menu */}
                {dropOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: 200,
                      background: "#0c0c14",
                      border: "1px solid #1e1e2a",
                      borderRadius: 12,
                      boxShadow:
                        "0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
                      overflow: "hidden",
                      zIndex: 300,
                      animation: "fadeSlideDown 0.15s ease",
                    }}
                  >
                    {/* User info */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "14px 16px",
                        borderBottom: "1px solid #1a1a24",
                        background:
                          "linear-gradient(135deg,rgba(108,99,255,0.06),rgba(56,189,248,0.03))",
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          flexShrink: 0,
                          background: "linear-gradient(135deg,#6c63ff,#a78bfa)",
                          color: "#fff",
                          fontFamily: "Syne,sans-serif",
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(108,99,255,0.3)",
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "#f0f0f8",
                          }}
                        >
                          {user.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            marginTop: 2,
                          }}
                        >
                          <div
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: "#22d3a5",
                            }}
                          />
                          <span
                            style={{ fontSize: "0.7rem", color: "#22d3a5" }}
                          >
                            Active session
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sign out */}
                    <div style={{ padding: "6px" }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          borderRadius: 8,
                          background: "transparent",
                          border: "none",
                          color: "#f43f5e",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          fontFamily: "inherit",
                          cursor: "pointer",
                          transition: "background 0.15s",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(244,63,94,0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <LogOut size={15} strokeWidth={2} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    color: "#6060a0",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c0c0e0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#6060a0")
                  }
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 18px",
                    borderRadius: 9,
                    background: "linear-gradient(135deg,#6c63ff,#8b5cf6)",
                    color: "#fff",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    boxShadow: "0 2px 12px rgba(108,99,255,0.35)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(108,99,255,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(108,99,255,0.35)";
                  }}
                >
                  <Sparkles size={13} strokeWidth={2} />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="d-flex d-lg-none"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              marginLeft: "auto",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: open
                ? "rgba(108,99,255,0.12)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${open ? "rgba(108,99,255,0.3)" : "#1e1e2a"}`,
              borderRadius: 9,
              cursor: "pointer",
              color: open ? "#a78bfa" : "#6060a0",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                transition: "transform 0.3s",
                transform: open ? "rotate(90deg)" : "rotate(0)",
              }}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </div>
          </button>
        </div>
      </nav>

      {/* ════════════ MOBILE DRAWER ════════════ */}
      <div
        className="d-lg-none"
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          zIndex: 190,
          transform: open ? "translateY(0)" : "translateY(-10px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition:
            "transform 0.26s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
        }}
      >
        <div
          style={{
            margin: "0 10px",
            background: "#0c0c14",
            border: "1px solid #1e1e2a",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
          }}
        >
          {user ? (
            <>
              {/* User banner */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 18px",
                  background:
                    "linear-gradient(135deg,rgba(108,99,255,0.08),rgba(56,189,248,0.04))",
                  borderBottom: "1px solid #1a1a24",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 11,
                    flexShrink: 0,
                    background: "linear-gradient(135deg,#6c63ff,#a78bfa)",
                    color: "#fff",
                    fontFamily: "Syne,sans-serif",
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 3px 10px rgba(108,99,255,0.35)",
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Syne,sans-serif",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      color: "#f0f0f8",
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 3,
                    }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#22d3a5",
                      }}
                    />
                    <span style={{ fontSize: "0.7rem", color: "#22d3a5" }}>
                      Active session
                    </span>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <div style={{ padding: "8px" }}>
                {navLinks.map(({ to, label, icon }) => {
                  const active = isActive(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 9,
                        marginBottom: 2,
                        color: active ? "#a78bfa" : "#8080b0",
                        background: active
                          ? "rgba(108,99,255,0.1)"
                          : "transparent",
                        border: active
                          ? "1px solid rgba(108,99,255,0.2)"
                          : "1px solid transparent",
                        fontSize: "0.92rem",
                        fontWeight: 500,
                        textDecoration: "none",
                        transition: "all 0.16s",
                      }}
                    >
                      {icon} {label}
                      {active && (
                        <span
                          style={{
                            marginLeft: "auto",
                            padding: "2px 8px",
                            borderRadius: 20,
                            background: "rgba(108,99,255,0.15)",
                            color: "#a78bfa",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                          }}
                        >
                          Current
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Sign out */}
              <div style={{ borderTop: "1px solid #1a1a24", padding: "8px" }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 9,
                    background: "transparent",
                    border: "none",
                    color: "#f43f5e",
                    fontSize: "0.92rem",
                    fontWeight: 500,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "background 0.16s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(244,63,94,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <LogOut size={16} strokeWidth={2} /> Sign out
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: "8px" }}>
              <Link
                to="/login"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: 9,
                  color: "#8080b0",
                  fontSize: "0.92rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  marginBottom: 3,
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: 9,
                  background:
                    "linear-gradient(135deg,rgba(108,99,255,0.15),rgba(56,189,248,0.08))",
                  border: "1px solid rgba(108,99,255,0.25)",
                  color: "#a78bfa",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <Sparkles size={15} /> Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="d-lg-none"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 180,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
