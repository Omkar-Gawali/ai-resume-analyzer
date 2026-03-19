import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data";
import Resume from "../models/Resume.js";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  let absolutePath;

  try {
    // DEBUG logs
    console.log("=== UPLOAD DEBUG ===");
    console.log("req.file:", req.file);

    // Resolve path (Render/Linux safe)
    absolutePath = path.isAbsolute(req.file.path)
      ? req.file.path
      : path.join(process.cwd(), req.file.path);

    console.log("Resolved absolutePath:", absolutePath);
    console.log("File exists:", fs.existsSync(absolutePath));
    console.log("====================");

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found at: ${absolutePath}`);
    }

    let mlResponse;

    try {
      // ===============================
      // ✅ TRY BASE64 (existing flow)
      // ===============================
      console.log("⚡ Trying base64 ML request...");

      const fileBuffer = fs.readFileSync(absolutePath);
      const base64File = fileBuffer.toString("base64");

      mlResponse = await axios.post(
        `${process.env.ML_SERVICE_URL}/analyze`,
        {
          file_content: base64File,
          file_name: req.file.originalname,
        },
        { timeout: 60000 }, // reduced timeout
      );

      console.log("✅ Base64 ML success");
    } catch (base64Error) {
      // ===============================
      // 🔥 FALLBACK → FILE UPLOAD (mobile fix)
      // ===============================
      console.log("⚠️ Base64 failed → switching to upload...");
      console.log("Error:", base64Error.message);

      const formData = new FormData();
      formData.append("file", fs.createReadStream(absolutePath));

      mlResponse = await axios.post(
        `${process.env.ML_SERVICE_URL}/analyze-upload`,
        formData,
        {
          headers: formData.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 120000,
        },
      );

      console.log("✅ Upload ML success");
    }

    // Save result
    resume.analysisResult = mlResponse.data;
    resume.status = "analyzed";
    await resume.save();

    // Clean up temp file
    try {
      fs.unlinkSync(absolutePath);
    } catch {
      /* ignore */
    }

    return res.status(201).json({
      message: "Resume analyzed successfully",
      resume,
    });
  } catch (error) {
    resume.status = "failed";
    await resume.save();

    console.log("❌ Upload Error:", error.response?.data || error.message);

    return res.status(500).json({
      message: error.response?.data?.detail || error.message,
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
