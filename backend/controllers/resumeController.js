// server/controllers/resumeController.js
import axios from "axios";
import path from "path";
import Resume from "../models/Resume.js";

// @desc    Upload resume and trigger analysis
// @route   POST /api/resume/upload
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
    // ✅ Fix: convert Windows backslashes to forward slashes
    const absolutePath = path.resolve(req.file.path).replace(/\\/g, "/");

    console.log("Sending path to ML:", absolutePath); // debug log

    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/analyze`,
      { file_path: absolutePath },
    );

    resume.analysisResult = mlResponse.data;
    resume.status = "analyzed";
    await resume.save();

    res.status(201).json({
      message: "Resume analyzed successfully",
      resume,
    });
  } catch (error) {
    resume.status = "failed";
    await resume.save();

    console.log("ML Error:", error.response?.data || error.message);

    res.status(500).json({
      message: "ML analysis failed",
      error: error.response?.data?.detail || error.message,
    });
  }
};

// @desc    Get all resumes for logged in user
// @route   GET /api/resume
export const getMyResumes = async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(resumes);
};

// @desc    Get single resume by ID
// @route   GET /api/resume/:id
export const getResumeById = async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }

  if (resume.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.json(resume);
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
export const deleteResume = async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }

  if (resume.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await resume.deleteOne();
  res.json({ message: "Resume deleted successfully" });
};
