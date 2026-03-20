from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

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
        # Save uploaded file to temp location
        contents = await file.read()

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf",
            prefix="resume_"
        ) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        # Extract and analyze
        raw_text = extract_text_from_pdf(tmp_path)

        if not raw_text or len(raw_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text. Make sure PDF is not scanned."
            )

        extracted_skills    = extract_skills(raw_text)
        matched_jobs        = match_jobs(extracted_skills)
        score               = calculate_score(raw_text, extracted_skills)
        suggestions         = generate_suggestions(raw_text, extracted_skills, matched_jobs)
        missing_skills      = matched_jobs[0].get("missing_required", []) if matched_jobs else []
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
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)