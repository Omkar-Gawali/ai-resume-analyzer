// server/models/Resume.js
import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    priority: { type: String }, // "high" | "medium" | "low" | "info"
    category: { type: String }, // "Skills Gap" | "Structure" | "Contact" etc.
    message: { type: String },
  },
  { _id: false },
);

const jobMatchSchema = new mongoose.Schema(
  {
    title: { type: String },
    match_percent: { type: Number },
    required_match_percent: { type: Number },
    readiness: { type: String },
    matched_required: [String],
    missing_required: [String],
    matched_good_to_have: [String],
    good_to_have: [String],
  },
  { _id: false },
);

const contactInfoSchema = new mongoose.Schema(
  {
    email: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
  },
  { _id: false },
);

const experienceLevelSchema = new mongoose.Schema(
  {
    level: { type: String },
    explicit_years_found: { type: Number },
    experience_mentions: { type: Number },
    internship_mentions: { type: Number },
  },
  { _id: false },
);

const scoreBreakdownSchema = new mongoose.Schema(
  {
    skills_depth: { type: Number },
    section_completeness: { type: Number },
    keyword_quality: { type: Number },
    content_length: { type: Number },
    contact_info: { type: Number },
  },
  { _id: false },
);

const atsCheckSchema = new mongoose.Schema(
  {
    ats_friendly: { type: Boolean },
    warnings: [String],
  },
  { _id: false },
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },

    analysisResult: {
      // ── Core score ─────────────────────────────────────
      score: { type: Number, default: 0 },
      grade: { type: String },
      scoreBreakdown: { type: scoreBreakdownSchema },

      // ── Skills ─────────────────────────────────────────
      extractedSkills: [String],
      skillCount: { type: Number },
      categorizedSkills: { type: mongoose.Schema.Types.Mixed }, // { frontend: [...], ai_ml: [...] }

      // ── Job matching ────────────────────────────────────
      missingSkills: [String],
      jobRecommendations: [String],
      detailedJobMatches: [jobMatchSchema],

      // ── Resume structure ────────────────────────────────
      sections: { type: mongoose.Schema.Types.Mixed }, // { education: true, projects: false, ... }
      wordCount: { type: Number },

      // ── Candidate profile ───────────────────────────────
      contactInfo: { type: contactInfoSchema },
      education: [String],
      experienceLevel: { type: experienceLevelSchema },

      // ── ATS ─────────────────────────────────────────────
      atsCheck: { type: atsCheckSchema },

      // ── Suggestions (objects with priority + category) ──
      suggestions: [suggestionSchema],
    },

    status: {
      type: String,
      enum: ["pending", "analyzed", "failed"],
      default: "pending",
    },
    errorMessage: { type: String },
  },
  { timestamps: true },
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
