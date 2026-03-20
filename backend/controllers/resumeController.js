import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import Resume from "../models/Resume.js";

// ── Background analysis ───────────────────────────────────────
const analyzeInBackground = async (resume, absolutePath) => {
  try {
    console.log("Background analysis started:", resume.fileName);

    // Wake ML service first
    try {
      await axios.get(`${process.env.ML_SERVICE_URL}/health`, {
        timeout: 60000,
      });
      console.log("ML service awake ✅");
    } catch {
      console.log("ML ping failed — continuing anyway");
    }

    // Send file as multipart
    const formData = new FormData();
    formData.append("file", fs.createReadStream(absolutePath), {
      filename: resume.fileName,
      contentType: "application/pdf",
    });

    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/analyze`,
      formData,
      {
        headers: { ...formData.getHeaders() },
        timeout: 300000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      },
    );

    resume.analysisResult = mlResponse.data;
    resume.status = "analyzed";
    await resume.save();
    console.log("✅ Analysis complete:", resume.fileName);

    try {
      fs.unlinkSync(absolutePath);
    } catch {
      /* ignore */
    }
  } catch (error) {
    resume.status = "failed";
    resume.errorMessage = error.response?.data?.detail || error.message;
    await resume.save();
    console.log("❌ Analysis failed:", error.message);
  }
};

// ── Upload ────────────────────────────────────────────────────
export const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const resume = await Resume.create({
    user: req.user._id,
    fileName: req.file.originalname,
    filePath: req.file.path,
    status: "pending",
  });

  try {
    const absolutePath = path.isAbsolute(req.file.path)
      ? req.file.path
      : path.join(process.cwd(), req.file.path);

    console.log("File path:", absolutePath);
    console.log("File exists:", fs.existsSync(absolutePath));

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    // ✅ Respond immediately — don't make mobile wait
    res.status(201).json({
      message: "Resume uploaded — analysis in progress",
      resume,
    });

    // ✅ Analyze in background after responding
    analyzeInBackground(resume, absolutePath);
  } catch (error) {
    resume.status = "failed";
    await resume.save();
    console.log("❌ Upload Error:", error.message);
    return res.status(500).json({
      message: error.message,
      error: error.message,
    });
  }
};

// ── Get all resumes ───────────────────────────────────────────
export const getMyResumes = async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(resumes);
};

// ── Get single resume ─────────────────────────────────────────
export const getResumeById = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  if (resume.user.toString() !== req.user._id.toString())
    return res.status(401).json({ message: "Not authorized" });
  res.json(resume);
};

// ── Delete resume ─────────────────────────────────────────────
export const deleteResume = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  if (resume.user.toString() !== req.user._id.toString())
    return res.status(401).json({ message: "Not authorized" });
  await resume.deleteOne();
  res.json({ message: "Resume deleted successfully" });
};
