import express from "express";
const router = express.Router();

import {
  deleteResume,
  getMyResumes,
  getResumeById,
  uploadResume,
} from "../controllers/resumeController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/", protect, getMyResumes);
router.get("/:id", protect, getResumeById);
router.delete("/:id", protect, deleteResume);

export default router;
