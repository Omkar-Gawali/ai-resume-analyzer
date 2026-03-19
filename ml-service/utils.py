# ml-service/utils.py
import re
from pdfminer.high_level import extract_text
from skills_db import SKILLS_DB, JOB_ROLES


# ── Text Extraction ──────────────────────────────────────────────
def extract_text_from_pdf(file_path: str) -> str:
    """Extract raw text from a PDF file."""
    try:
        text = extract_text(file_path)
        return text.lower().strip()
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")


def clean_text(text: str) -> str:
    """Remove special characters, extra whitespace."""
    text = re.sub(r'[^\w\s\.\+\#\/]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


# ── Skill Extraction ─────────────────────────────────────────────
def extract_skills(text: str) -> list:
    """Match skills from SKILLS_DB against resume text."""
    text = clean_text(text.lower())
    found_skills = []

    for category, skills in SKILLS_DB.items():
        for skill in skills:
            # Match whole word to avoid partial matches
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text):
                found_skills.append(skill)

    return list(set(found_skills))  # remove duplicates


# ── Job Matching ─────────────────────────────────────────────────
def match_jobs(extracted_skills: list) -> list:
    """Match extracted skills against job roles."""
    matched_jobs = []
    skills_lower = [s.lower() for s in extracted_skills]

    for job_title, job_data in JOB_ROLES.items():
        required = job_data["required"]
        good_to_have = job_data["good_to_have"]

        matched_required = [s for s in required if s in skills_lower]
        match_percent = (len(matched_required) / len(required)) * 100

        if match_percent >= 40:  # at least 40% required skills match
            matched_jobs.append({
                "title": job_title,
                "match_percent": round(match_percent),
                "matched_skills": matched_required,
                "missing_required": [s for s in required if s not in skills_lower],
                "good_to_have": good_to_have
            })

    # Sort by match percent descending
    matched_jobs.sort(key=lambda x: x["match_percent"], reverse=True)
    return matched_jobs[:3]  # top 3 matches


# ── Score Calculation ────────────────────────────────────────────
def calculate_score(text: str, extracted_skills: list) -> int:
    """
    Score the resume out of 100.
    Breakdown:
      - Skills count      : 40 pts
      - Keyword presence  : 30 pts
      - Content length    : 20 pts
      - Contact info      : 10 pts
    """
    score = 0

    # 1. Skills count (40 pts)
    skill_score = min(len(extracted_skills) * 2, 40)
    score += skill_score

    # 2. Important keyword presence (30 pts)
    important_keywords = [
        "experience", "project", "education", "skills",
        "internship", "certification", "achievement", "github"
    ]
    keyword_hits = sum(1 for kw in important_keywords if kw in text)
    score += min(keyword_hits * 4, 30)

    # 3. Content length (20 pts)
    word_count = len(text.split())
    if word_count > 400:
        score += 20
    elif word_count > 200:
        score += 10
    else:
        score += 5

    # 4. Contact info (10 pts)
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text))
    has_phone = bool(re.search(r'\+?\d[\d\s\-]{8,}', text))
    has_linkedin = "linkedin" in text
    has_github = "github" in text

    contact_score = sum([has_email, has_phone, has_linkedin, has_github]) * 2.5
    score += int(contact_score)

    return min(int(score), 100)


# ── Suggestions Generator ────────────────────────────────────────
def generate_suggestions(
    text: str,
    extracted_skills: list,
    matched_jobs: list
) -> list:
    """Generate actionable suggestions based on resume analysis."""
    suggestions = []
    skills_lower = [s.lower() for s in extracted_skills]

    # Check contact info
    if "github" not in text:
        suggestions.append("Add your GitHub profile link to showcase your projects.")
    if "linkedin" not in text:
        suggestions.append("Add your LinkedIn profile URL.")

    # Check content sections
    if "project" not in text:
        suggestions.append("Add a dedicated Projects section with live demo links.")
    if "internship" not in text and "experience" not in text:
        suggestions.append("Add internship or work experience, even freelance projects count.")
    if "certification" not in text:
        suggestions.append("Consider adding relevant certifications (e.g., AWS, Google, Meta).")

    # Skills gap from top matched job
    if matched_jobs:
        top_job = matched_jobs[0]
        missing = top_job.get("missing_required", [])
        if missing:
            suggestions.append(
                f"For '{top_job['title']}', you're missing: {', '.join(missing)}. "
                f"Consider learning these."
            )

    # General improvements
    word_count = len(text.split())
    if word_count < 300:
        suggestions.append("Your resume seems short. Add more detail to your projects and experience.")

    if len(extracted_skills) < 8:
        suggestions.append("Add more technical skills — aim for at least 10–15 relevant skills.")

    if not suggestions:
        suggestions.append("Great resume! Keep your projects updated with live demo links.")

    return suggestions