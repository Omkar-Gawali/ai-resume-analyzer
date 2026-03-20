import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Upload as UploadIcon,
  FileText,
  X,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Target,
} from "lucide-react";
import { uploadResume } from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [debugError, setDebugError] = useState(""); // ← debug state
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    setFile(f);
    setDebugError(""); // clear previous error
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }
    setLoading(true);
    setProgress(0);
    setDebugError("");

    const iv = setInterval(
      () => setProgress((p) => (p < 85 ? p + Math.random() * 12 : p)),
      400,
    );

    try {
      const form = new FormData();
      form.append("resume", file);
      const { data } = await uploadResume(form);
      clearInterval(iv);
      setProgress(100);
      toast.success("Resume analyzed successfully!");
      setTimeout(() => navigate(`/results/${data.resume._id}`), 300);
    } catch (err) {
      clearInterval(iv);
      setProgress(0);

      // ── Build detailed debug info ──
      const status = err?.response?.status ?? "NO_RESPONSE";
      const code = err?.code ?? "NO_CODE";
      const message = err?.response?.data?.message || err?.message || "unknown";
      const url = err?.config?.url ?? "unknown url";
      const method = err?.config?.method ?? "unknown method";

      const debugMsg = [
        `Status : ${status}`,
        `Code   : ${code}`,
        `Message: ${message}`,
        `URL    : ${url}`,
        `Method : ${method}`,
      ].join("\n");

      setDebugError(debugMsg); // ← show on screen

      // ── User-facing toast ──
      if (
        code === "ECONNABORTED" ||
        message.toLowerCase().includes("timeout")
      ) {
        toast.error("Server is waking up — wait 30s and try again", {
          autoClose: 6000,
        });
      } else if (!err.response) {
        toast.error(`Connection failed (${code}) — no response from server`, {
          autoClose: 6000,
        });
      } else {
        toast.error(message || "Upload failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const tips = [
    "Use a text-based PDF (not scanned image)",
    "Include skills, projects and experience sections",
    "Add GitHub and LinkedIn profile links",
    "Keep it 1–2 pages for best results",
  ];

  const features = [
    { icon: <Zap size={16} />, label: "30s analysis", color: "#a78bfa" },
    { icon: <Target size={16} />, label: "Job matching", color: "#22d3a5" },
    { icon: <Shield size={16} />, label: "Secure upload", color: "#38bdf8" },
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
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "#6c63ff",
            opacity: 0.07,
            filter: "blur(100px)",
            top: -200,
            left: -150,
            animation: "orbFloat 14s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "#38bdf8",
            opacity: 0.05,
            filter: "blur(80px)",
            bottom: -100,
            right: -80,
            animation: "orbFloat 10s ease-in-out infinite",
            animationDelay: "-5s",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 40%,black 20%,transparent 100%)",
          }}
        />
      </div>

      <div
        className="container position-relative py-5"
        style={{ zIndex: 1, maxWidth: 680 }}
      >
        {/* Header */}
        <div className="text-center mb-5">
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
            <Sparkles size={11} strokeWidth={2.5} /> AI-Powered Analysis
          </div>
          <h1
            className="fw-bold mb-3"
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: "clamp(1.9rem,4vw,2.8rem)",
              letterSpacing: "-0.03em",
              color: "#f0f0f8",
              lineHeight: 1.1,
            }}
          >
            Analyze Your Resume
          </h1>
          <p
            style={{
              color: "#7070a0",
              fontSize: "1rem",
              maxWidth: 420,
              margin: "0 auto",
            }}
          >
            Upload your PDF and get instant AI-powered insights — skills, score,
            job matches
          </p>
          <div className="d-flex align-items-center justify-content-center flex-wrap gap-3 mt-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid #1e1e2a",
                  fontSize: "0.8rem",
                  color: "#7070a0",
                }}
              >
                <span style={{ color: f.color }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Main card */}
        <div
          className="rounded-4 p-4 p-md-5"
          style={{
            background: "#0e0e17",
            border: "1px solid #1e1e2a",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Drop zone */}
          <div
            onClick={() => !file && inputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragging ? "#6c63ff" : file ? "#22d3a5" : "#252535"}`,
              borderRadius: 16,
              padding: "40px 24px",
              textAlign: "center",
              cursor: file ? "default" : "pointer",
              background: dragging
                ? "rgba(108,99,255,0.06)"
                : file
                  ? "rgba(34,211,165,0.03)"
                  : "rgba(255,255,255,0.01)",
              transition: "all 0.25s",
              marginBottom: 20,
              minHeight: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {file ? (
              <div
                className="d-flex align-items-center gap-4 w-100"
                style={{ maxWidth: 460, margin: "0 auto" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: 56,
                    height: 56,
                    background: "rgba(34,211,165,0.1)",
                    border: "1px solid rgba(34,211,165,0.2)",
                  }}
                >
                  <FileText size={26} color="#22d3a5" />
                </div>
                <div className="flex-grow-1 text-start" style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#f0f0f8",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file.name}
                  </div>
                  <div className="d-flex align-items-center gap-3 mt-1">
                    <span style={{ fontSize: "0.78rem", color: "#7070a0" }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <span
                      className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                      style={{
                        background: "rgba(34,211,165,0.1)",
                        color: "#22d3a5",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle size={11} strokeWidth={2.5} /> Ready
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setProgress(0);
                    setDebugError("");
                  }}
                  className="d-flex align-items-center justify-content-center border-0 flex-shrink-0"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: "rgba(244,63,94,0.08)",
                    color: "#f43f5e",
                    cursor: "pointer",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div>
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4"
                  style={{
                    width: 72,
                    height: 72,
                    background: dragging
                      ? "rgba(108,99,255,0.15)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${dragging ? "rgba(108,99,255,0.4)" : "#252535"}`,
                    transition: "all 0.25s",
                  }}
                >
                  <UploadIcon
                    size={30}
                    color={dragging ? "#a78bfa" : "#454560"}
                  />
                </div>
                <p
                  className="fw-semibold mb-2"
                  style={{
                    fontSize: "1.05rem",
                    color: dragging ? "#a78bfa" : "#c0c0e0",
                  }}
                >
                  {dragging ? "Drop it here!" : "Drop your resume here"}
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#454560",
                    marginBottom: 0,
                  }}
                >
                  or{" "}
                  <span
                    style={{
                      color: "#a78bfa",
                      fontWeight: 600,
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    click to browse
                  </span>{" "}
                  — PDF only, max 5MB
                </p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {loading && (
            <div style={{ marginBottom: 20 }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ fontSize: "0.8rem", color: "#7070a0" }}>
                  Analyzing resume...
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#a78bfa",
                    fontWeight: 600,
                  }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "#1e1e2a",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg,#6c63ff,#38bdf8)",
                    borderRadius: 3,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <div className="d-flex gap-2 mt-3 flex-wrap">
                {[
                  "Extracting text",
                  "Matching skills",
                  "Scoring resume",
                  "Finding job matches",
                ].map((step, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                    style={{
                      background:
                        progress > i * 25
                          ? "rgba(108,99,255,0.1)"
                          : "rgba(255,255,255,0.02)",
                      border: `1px solid ${progress > i * 25 ? "rgba(108,99,255,0.25)" : "#1e1e2a"}`,
                      fontSize: "0.75rem",
                      color: progress > i * 25 ? "#a78bfa" : "#454560",
                      transition: "all 0.3s",
                    }}
                  >
                    {progress > i * 25 ? (
                      <CheckCircle size={11} strokeWidth={2.5} />
                    ) : (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          border: "1.5px solid #454560",
                        }}
                      />
                    )}
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {!loading && (
            <div
              className="rounded-3 p-3 mb-4"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #1a1a26",
              }}
            >
              <p
                className="fw-semibold mb-3 d-flex align-items-center gap-2"
                style={{
                  fontSize: "0.8rem",
                  color: "#454560",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                <Sparkles size={12} color="#a78bfa" /> For best results
              </p>
              <div className="row g-2">
                {tips.map((tip, i) => (
                  <div key={i} className="col-12 col-sm-6">
                    <div className="d-flex align-items-start gap-2">
                      <CheckCircle
                        size={13}
                        color="#22d3a5"
                        strokeWidth={2.5}
                        style={{ marginTop: 3, flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: "0.82rem",
                          color: "#7070a0",
                          lineHeight: 1.5,
                        }}
                      >
                        {tip}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="d-flex align-items-center justify-content-center gap-2 fw-semibold border-0 w-100"
            style={{
              height: 54,
              borderRadius: 14,
              background: !file
                ? "#13131c"
                : loading
                  ? "rgba(108,99,255,0.5)"
                  : "linear-gradient(135deg,#6c63ff 0%,#8b5cf6 100%)",
              color: !file ? "#454560" : "#fff",
              fontSize: "1rem",
              cursor: !file || loading ? "not-allowed" : "pointer",
              transition: "all 0.25s",
              boxShadow:
                file && !loading ? "0 4px 24px rgba(108,99,255,0.3)" : "none",
              position: "relative",
              overflow: "hidden",
              fontFamily: "inherit",
            }}
          >
            {file && !loading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 50%)",
                  pointerEvents: "none",
                }}
              />
            )}
            {loading ? (
              <>
                <span className="upload-spinner" /> Analyzing your resume...
              </>
            ) : file ? (
              <>
                <UploadIcon size={19} strokeWidth={2} /> Analyze Resume{" "}
                <ArrowRight size={17} strokeWidth={2.2} />
              </>
            ) : (
              <>
                <UploadIcon size={19} strokeWidth={2} /> Select a PDF to
                continue
              </>
            )}
          </button>

          <p
            className="text-center mt-3 mb-0"
            style={{ fontSize: "0.75rem", color: "#353550" }}
          >
            Max file size 5MB · PDF format only · Your data is never stored
            permanently
          </p>

          {/* ── DEBUG ERROR — visible on mobile screen ── */}
          {debugError && (
            <div
              className="mt-4 p-3 rounded-3"
              style={{
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.25)",
                fontSize: "0.72rem",
                color: "#f43f5e",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                lineHeight: 1.8,
                fontFamily: "monospace",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 6,
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                }}
              >
                🔍 DEBUG INFO (share this)
              </div>
              {debugError}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.05)} }
        .upload-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
          display: inline-block;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
