import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import { fileURLToPath } from "url";
import Resume from "../models/Resume.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    // Build absolute path
    const absolutePath = path.isAbsolute(req.file.path)
      ? req.file.path
      : path.join(process.cwd(), req.file.path);

    console.log("File path:", absolutePath);
    console.log("File exists:", fs.existsSync(absolutePath));

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    // ✅ Send as multipart FormData — works on all devices
    const formData = new FormData();
    formData.append("file", fs.createReadStream(absolutePath), {
      filename: req.file.originalname,
      contentType: "application/pdf",
    });

    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/analyze`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 120000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      },
    );

    resume.analysisResult = mlResponse.data;
    resume.status = "analyzed";
    await resume.save();

    try {
      fs.unlinkSync(absolutePath);
    } catch {
      /* ignore */
    }

    res.status(201).json({
      message: "Resume analyzed successfully",
      resume,
    });
  } catch (error) {
    resume.status = "failed";
    await resume.save();
    console.log("Error:", error.response?.data || error.message);
    res.status(500).json({
      message: error.response?.data?.detail || error.message,
      error: error.response?.data?.detail || error.message,
    });
  }
};

export const getMyResumes = async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(resumes);
};

export const getResumeById = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  if (resume.user.toString() !== req.user._id.toString())
    return res.status(401).json({ message: "Not authorized" });
  res.json(resume);
};

export const deleteResume = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  if (resume.user.toString() !== req.user._id.toString())
    return res.status(401).json({ message: "Not authorized" });
  await resume.deleteOne();
  res.json({ message: "Resume deleted successfully" });
};
