// server/models/Resume.js
import mongoose from "mongoose";
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
      score: { type: Number, default: 0 },
      extractedSkills: [String],
      missingSkills: [String],
      jobRecommendations: [String],
      suggestions: [String],
    },
    status: {
      type: String,
      enum: ["pending", "analyzed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
