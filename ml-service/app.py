from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import (
    extract_text_from_pdf,
    extract_skills,
    categorize_skills,
    match_jobs,
    calculate_score,
    generate_suggestions,
    detect_sections,
    extract_contact_info,
    extract_education,
    estimate_experience_level,
    check_ats_friendliness,
)

app = FastAPI(title="Resume Analyzer ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "ML Service is running ✅"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    tmp_path = None
    try:
        # ── Save uploaded file ────────────────────────────────
        contents = await file.read()
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=".pdf", prefix="resume_"
        ) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        # ── Extract text ──────────────────────────────────────
        raw_text = extract_text_from_pdf(tmp_path)
        if not raw_text or len(raw_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text. Make sure the PDF is not scanned/image-based."
            )

        # ── Core analysis ─────────────────────────────────────
        sections        = detect_sections(raw_text)
        contact_info    = extract_contact_info(raw_text)
        education       = extract_education(raw_text)
        experience_info = estimate_experience_level(raw_text)
        extracted_skills = extract_skills(raw_text)
        categorized_skills = categorize_skills(extracted_skills)
        matched_jobs    = match_jobs(extracted_skills)
        score_data      = calculate_score(raw_text, extracted_skills, sections)
        ats_check       = check_ats_friendliness(raw_text, sections)
        suggestions     = generate_suggestions(
            raw_text, extracted_skills, matched_jobs,
            sections, contact_info, experience_info
        )

        # ── Derived convenience fields ────────────────────────
        missing_skills      = matched_jobs[0].get("missing_required", []) if matched_jobs else []
        job_recommendations = [job["title"] for job in matched_jobs]
        word_count          = len(raw_text.split())

        return {
            # ── Top-level score ──────────────────────────────
            "score":         score_data["total"],
            "grade":         score_data["grade"],
            "scoreBreakdown": score_data["breakdown"],

            # ── Skills ──────────────────────────────────────
            "extractedSkills":    extracted_skills,
            "skillCount":         len(extracted_skills),
            "categorizedSkills":  categorized_skills,

            # ── Job matching ─────────────────────────────────
            "jobRecommendations": job_recommendations,
            "missingSkills":      missing_skills,
            "detailedJobMatches": matched_jobs,

            # ── Resume structure ─────────────────────────────
            "sections":           sections,
            "wordCount":          word_count,

            # ── Candidate profile ────────────────────────────
            "contactInfo":        contact_info,
            "education":          education,
            "experienceLevel":    experience_info,

            # ── ATS ──────────────────────────────────────────
            "atsCheck":           ats_check,

            # ── Suggestions ──────────────────────────────────
            "suggestions":        suggestions,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)