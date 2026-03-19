# ml-service/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils import (
    extract_text_from_pdf,
    extract_skills,
    match_jobs,
    calculate_score,
    generate_suggestions
)

app = FastAPI(title="Resume Analyzer ML Service")

# Allow requests from Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request Schema ───────────────────────────────────────────────
class ResumeRequest(BaseModel):
    file_path: str


# ── Routes ───────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "ML Service is running ✅"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
def analyze_resume(data: ResumeRequest):
    """
    Main endpoint called by Node.js backend.
    Accepts file path → returns full analysis.
    """
    try:
        # Step 1: Extract text from PDF
        raw_text = extract_text_from_pdf(data.file_path)

        if not raw_text or len(raw_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text. Make sure the PDF is not scanned/image-based."
            )

        # Step 2: Extract skills
        extracted_skills = extract_skills(raw_text)

        # Step 3: Match to job roles
        matched_jobs = match_jobs(extracted_skills)

        # Step 4: Calculate score
        score = calculate_score(raw_text, extracted_skills)

        # Step 5: Generate suggestions
        suggestions = generate_suggestions(raw_text, extracted_skills, matched_jobs)

        # Step 6: Get missing skills from top job
        missing_skills = []
        if matched_jobs:
            missing_skills = matched_jobs[0].get("missing_required", [])

        # Step 7: Job recommendation titles only (for DB storage)
        job_recommendations = [job["title"] for job in matched_jobs]

        return {
            "score": score,
            "extractedSkills": extracted_skills,
            "missingSkills": missing_skills,
            "jobRecommendations": job_recommendations,
            "suggestions": suggestions,
            "detailedJobMatches": matched_jobs  # full match details for frontend
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))