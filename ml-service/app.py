from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import tempfile
import os
from utils import (
    extract_text_from_pdf,
    extract_skills,
    match_jobs,
    calculate_score,
    generate_suggestions,
)

app = FastAPI(title="Resume Analyzer ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Updated request schema ──────────────────────────────────────
class ResumeRequest(BaseModel):
    file_content: str   # base64 encoded PDF
    file_name:    str   # original filename

# ── Routes ─────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "ML Service is running ✅"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze")
def analyze_resume(data: ResumeRequest):
    tmp_path = None
    try:
        # Decode base64 → write to temp file
        file_bytes = base64.b64decode(data.file_content)

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf",
            prefix="resume_"
        ) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        # Extract text from temp file
        raw_text = extract_text_from_pdf(tmp_path)

        if not raw_text or len(raw_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text. Make sure PDF is not scanned/image-based."
            )

        # Run analysis
        extracted_skills  = extract_skills(raw_text)
        matched_jobs      = match_jobs(extracted_skills)
        score             = calculate_score(raw_text, extracted_skills)
        suggestions       = generate_suggestions(raw_text, extracted_skills, matched_jobs)
        missing_skills    = matched_jobs[0].get("missing_required", []) if matched_jobs else []
        job_recommendations = [job["title"] for job in matched_jobs]

        return {
            "score":              score,
            "extractedSkills":    extracted_skills,
            "missingSkills":      missing_skills,
            "jobRecommendations": job_recommendations,
            "suggestions":        suggestions,
            "detailedJobMatches": matched_jobs,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Always clean up temp file
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)