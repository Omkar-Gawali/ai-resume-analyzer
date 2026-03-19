from fastapi import FastAPI, HTTPException, UploadFile, File
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

# ✅ FIXED CORS (IMPORTANT)
origins = [
    "https://cvmind-ai.vercel.app",  # your deployed frontend
    "http://localhost:3000",         # local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Existing request schema (DO NOT BREAK CURRENT APP) ──────────
class ResumeRequest(BaseModel):
    file_content: str   # base64 encoded PDF
    file_name: str

# ── Routes ─────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "ML Service is running ✅"}

@app.get("/health")
def health():
    return {"status": "ok"}

# ──────────────────────────────────────────────────────────────
# ✅ OLD ENDPOINT (BASE64) → still works for laptop
# ──────────────────────────────────────────────────────────────
@app.post("/analyze")
def analyze_resume(data: ResumeRequest):
    tmp_path = None
    try:
        print("📥 Base64 request received:", data.file_name)

        # Decode base64 safely
        try:
            file_bytes = base64.b64decode(data.file_content)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid base64 file")

        # 🚫 Prevent large file crash (important for mobile)
        if len(file_bytes) > 3 * 1024 * 1024:  # 3MB
            raise HTTPException(status_code=400, detail="File too large (max 3MB)")

        # Save temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        return process_resume(tmp_path)

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Error:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


# ──────────────────────────────────────────────────────────────
# ✅ NEW ENDPOINT (UPLOAD FILE) → mobile-safe
# ──────────────────────────────────────────────────────────────
@app.post("/analyze-upload")
async def analyze_resume_upload(file: UploadFile = File(...)):
    tmp_path = None
    try:
        print("📥 Upload request received:", file.filename)

        contents = await file.read()

        # 🚫 Limit file size
        if len(contents) > 5 * 1024 * 1024:  # 5MB
            raise HTTPException(status_code=400, detail="File too large (max 5MB)")

        # Save temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        return process_resume(tmp_path)

    except HTTPException:
        raise
    except Exception as e:
        print("❌ Upload Error:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


# ──────────────────────────────────────────────────────────────
# ✅ COMMON PROCESSING FUNCTION (clean code)
# ──────────────────────────────────────────────────────────────
def process_resume(file_path: str):
    raw_text = extract_text_from_pdf(file_path)

    if not raw_text or len(raw_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text. PDF may be scanned/image-based."
        )

    extracted_skills = extract_skills(raw_text)
    matched_jobs = match_jobs(extracted_skills)
    score = calculate_score(raw_text, extracted_skills)
    suggestions = generate_suggestions(raw_text, extracted_skills, matched_jobs)

    missing_skills = matched_jobs[0].get("missing_required", []) if matched_jobs else []
    job_recommendations = [job["title"] for job in matched_jobs]

    return {
        "score": score,
        "extractedSkills": extracted_skills,
        "missingSkills": missing_skills,
        "jobRecommendations": job_recommendations,
        "suggestions": suggestions,
        "detailedJobMatches": matched_jobs,
    }