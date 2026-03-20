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


# ── Section Detection ────────────────────────────────────────────
SECTION_PATTERNS = {
    "education":        [r'\beducation\b', r'\bacademic\b', r'\bqualification\b', r'\bdegree\b'],
    "experience":       [r'\bexperience\b', r'\bwork history\b', r'\bemployment\b', r'\bcareer\b'],
    "projects":         [r'\bprojects?\b', r'\bportfolio\b', r'\bcase stud'],
    "skills":           [r'\bskills?\b', r'\btechnical skills\b', r'\bcore competencies\b', r'\bproficiencies\b'],
    "certifications":   [r'\bcertification\b', r'\bcertified\b', r'\bcourse\b', r'\btraining\b'],
    "summary":          [r'\bsummary\b', r'\bobjective\b', r'\bprofile\b', r'\babout me\b'],
    "achievements":     [r'\bachievement\b', r'\baward\b', r'\bhonor\b', r'\brecognition\b'],
    "internship":       [r'\binternship\b', r'\btrainee\b', r'\bapprentice\b'],
    "publications":     [r'\bpublication\b', r'\bresearch paper\b', r'\bjournal\b'],
    "volunteer":        [r'\bvolunteer\b', r'\bcommunity service\b', r'\bngo\b'],
    "languages_spoken": [r'\blanguages? spoken\b', r'\bhuman languages?\b'],
    "references":       [r'\breferences?\b'],
}

def detect_sections(text: str) -> dict:
    """Detect which resume sections are present."""
    detected = {}
    for section, patterns in SECTION_PATTERNS.items():
        detected[section] = any(re.search(p, text) for p in patterns)
    return detected


# ── Contact Info Extraction ──────────────────────────────────────
def extract_contact_info(text: str) -> dict:
    """Extract contact details from resume text."""
    email_match   = re.search(r'[\w\.\-]+@[\w\.\-]+\.\w+', text)
    phone_match   = re.search(r'(\+?\d[\d\s\-\(\)]{8,15})', text)
    linkedin_match = re.search(r'linkedin\.com/in/[\w\-]+', text)
    github_match  = re.search(r'github\.com/[\w\-]+', text)
    portfolio_match = re.search(r'https?://(?!linkedin|github)[\w\./\-]+', text)

    return {
        "email":     email_match.group(0) if email_match else None,
        "phone":     phone_match.group(0).strip() if phone_match else None,
        "linkedin":  linkedin_match.group(0) if linkedin_match else None,
        "github":    github_match.group(0) if github_match else None,
        "portfolio": portfolio_match.group(0) if portfolio_match else None,
    }


# ── Education Extraction ─────────────────────────────────────────
DEGREE_PATTERNS = {
    "PhD / Doctorate": [r'\bph\.?d\b', r'\bdoctorate\b', r'\bdoctor of'],
    "Master's":        [r'\bm\.?tech\b', r'\bm\.?e\b', r'\bm\.?sc\b', r'\bmba\b', r'\bmaster'],
    "Bachelor's":      [r'\bb\.?tech\b', r'\bb\.?e\b', r'\bb\.?sc\b', r'\bbachelor', r'\bbca\b', r'\bbba\b', r'\bllb\b', r'\bmbbs\b'],
    "Diploma":         [r'\bdiploma\b', r'\bpolytechnic\b'],
    "12th / Higher Secondary": [r'\b12th\b', r'\bhsc\b', r'\bhigher secondary\b', r'\bclass xii\b'],
    "10th / Secondary": [r'\b10th\b', r'\bssc\b', r'\bsecondary school\b', r'\bclass x\b'],
}

def extract_education(text: str) -> list:
    """Detect highest and all education levels found."""
    found = []
    for label, patterns in DEGREE_PATTERNS.items():
        if any(re.search(p, text) for p in patterns):
            found.append(label)
    return found


# ── Experience Level Estimation ──────────────────────────────────
def estimate_experience_level(text: str) -> dict:
    """Estimate candidate seniority based on resume signals."""
    years_match = re.findall(r'(\d+)\+?\s*years?\s*(of)?\s*(experience|exp)', text)
    explicit_years = max([int(m[0]) for m in years_match], default=0)

    # Count experience/internship mentions as proxies
    exp_mentions = len(re.findall(r'\b(experience|worked at|working at|employed at)\b', text))
    intern_mentions = len(re.findall(r'\binternship\b', text))

    if explicit_years >= 5 or exp_mentions >= 4:
        level = "Senior"
    elif explicit_years >= 2 or exp_mentions >= 2 or intern_mentions >= 2:
        level = "Mid-level"
    elif explicit_years >= 1 or intern_mentions >= 1 or exp_mentions >= 1:
        level = "Junior / Entry-level"
    else:
        level = "Fresher"

    return {
        "level": level,
        "explicit_years_found": explicit_years,
        "experience_mentions": exp_mentions,
        "internship_mentions": intern_mentions,
    }


# ── Skill Extraction ─────────────────────────────────────────────
def extract_skills(text: str) -> list:
    """Match skills from SKILLS_DB against resume text."""
    text = clean_text(text.lower())
    found_skills = []
    for category, skills in SKILLS_DB.items():
        for skill in skills:
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text):
                found_skills.append(skill)
    return list(set(found_skills))


def categorize_skills(extracted_skills: list) -> dict:
    """Group extracted skills back into their SKILLS_DB categories."""
    skills_lower = {s.lower() for s in extracted_skills}
    categorized = {}
    for category, skills in SKILLS_DB.items():
        matched = [s for s in skills if s.lower() in skills_lower]
        if matched:
            categorized[category] = matched
    return categorized


# ── Job Matching ─────────────────────────────────────────────────
def match_jobs(extracted_skills: list) -> list:
    """Match extracted skills against job roles with richer output."""
    matched_jobs = []
    skills_lower = [s.lower() for s in extracted_skills]

    for job_title, job_data in JOB_ROLES.items():
        required      = job_data["required"]
        good_to_have  = job_data["good_to_have"]

        matched_required    = [s for s in required if s in skills_lower]
        matched_good        = [s for s in good_to_have if s in skills_lower]
        missing_required    = [s for s in required if s not in skills_lower]

        req_pct  = round((len(matched_required) / len(required)) * 100)
        bonus    = min(len(matched_good) * 5, 20)               # up to 20 bonus pts
        overall  = min(req_pct + bonus, 100)

        if req_pct >= 40:
            matched_jobs.append({
                "title":            job_title,
                "match_percent":    overall,
                "required_match_percent": req_pct,
                "matched_required": matched_required,
                "missing_required": missing_required,
                "matched_good_to_have": matched_good,
                "good_to_have":     good_to_have,
                "readiness":        _readiness_label(req_pct),
            })

    matched_jobs.sort(key=lambda x: x["match_percent"], reverse=True)
    return matched_jobs[:5]  # top 5 matches


def _readiness_label(pct: int) -> str:
    if pct >= 80:  return "Strong Match"
    if pct >= 60:  return "Good Match"
    if pct >= 40:  return "Partial Match"
    return "Weak Match"


# ── Score Calculation ────────────────────────────────────────────
def calculate_score(text: str, extracted_skills: list, sections: dict) -> dict:
    """
    Score the resume out of 100 with a detailed breakdown.

    Breakdown:
      Skills depth       : 30 pts
      Section completeness: 25 pts
      Keyword quality    : 20 pts
      Content length     : 15 pts
      Contact info       : 10 pts
    """
    breakdown = {}

    # 1. Skills depth (30 pts)
    skill_pts = min(len(extracted_skills) * 1.5, 30)
    breakdown["skills_depth"] = round(skill_pts)

    # 2. Section completeness (25 pts)
    key_sections = ["education", "experience", "projects", "skills", "certifications", "summary"]
    present = sum(1 for s in key_sections if sections.get(s))
    section_pts = round((present / len(key_sections)) * 25)
    breakdown["section_completeness"] = section_pts

    # 3. Keyword quality (20 pts)
    power_keywords = [
        "developed", "built", "designed", "implemented", "led", "managed",
        "optimized", "deployed", "created", "architected", "integrated",
        "automated", "increased", "reduced", "achieved", "collaborated",
        "mentored", "delivered", "launched", "scaled"
    ]
    hits = sum(1 for kw in power_keywords if kw in text)
    keyword_pts = min(hits * 2, 20)
    breakdown["keyword_quality"] = keyword_pts

    # 4. Content length (15 pts)
    word_count = len(text.split())
    if word_count > 600:
        length_pts = 15
    elif word_count > 400:
        length_pts = 12
    elif word_count > 200:
        length_pts = 7
    else:
        length_pts = 3
    breakdown["content_length"] = length_pts

    # 5. Contact info (10 pts)
    contact_checks = [
        bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)),  # email
        bool(re.search(r'\+?\d[\d\s\-]{8,}', text)),        # phone
        "linkedin" in text,
        "github" in text,
        bool(re.search(r'https?://', text)),                 # any URL / portfolio
    ]
    contact_pts = round(sum(contact_checks) * 2)
    breakdown["contact_info"] = min(contact_pts, 10)

    total = sum(breakdown.values())
    return {
        "total": min(total, 100),
        "breakdown": breakdown,
        "grade": _score_grade(min(total, 100)),
    }


def _score_grade(score: int) -> str:
    if score >= 85: return "A"
    if score >= 70: return "B"
    if score >= 55: return "C"
    if score >= 40: return "D"
    return "F"


# ── ATS Friendliness Check ───────────────────────────────────────
ATS_RED_FLAGS = [
    (r'(table|column|text box)', "Avoid tables/text boxes — ATS parsers often skip them."),
    (r'header|footer',           "Keep critical info out of headers/footers."),
    (r'\.(jpg|jpeg|png|gif)',    "Avoid images — ATS cannot read them."),
]

def check_ats_friendliness(text: str, sections: dict) -> dict:
    """Basic ATS compatibility heuristics."""
    warnings = []
    for pattern, msg in ATS_RED_FLAGS:
        if re.search(pattern, text):
            warnings.append(msg)

    if not sections.get("skills"):
        warnings.append("Add an explicit 'Skills' section — ATS looks for it by name.")
    if not sections.get("education"):
        warnings.append("Education section not clearly labeled — ATS may miss it.")

    return {
        "ats_friendly": len(warnings) == 0,
        "warnings": warnings,
    }


# ── Suggestions Generator ────────────────────────────────────────
def generate_suggestions(
    text: str,
    extracted_skills: list,
    matched_jobs: list,
    sections: dict,
    contact_info: dict,
    experience_info: dict,
) -> list:
    """Generate prioritized, actionable suggestions."""
    suggestions = []
    skills_lower = [s.lower() for s in extracted_skills]

    # ── Contact completeness ──
    if not contact_info.get("github"):
        suggestions.append({
            "priority": "high",
            "category": "Contact",
            "message": "Add your GitHub profile URL — recruiters and ATS systems check for it."
        })
    if not contact_info.get("linkedin"):
        suggestions.append({
            "priority": "high",
            "category": "Contact",
            "message": "Add your LinkedIn profile URL to improve professional visibility."
        })
    if not contact_info.get("portfolio"):
        suggestions.append({
            "priority": "medium",
            "category": "Contact",
            "message": "Add a portfolio or personal website link to stand out."
        })

    # ── Section gaps ──
    if not sections.get("summary"):
        suggestions.append({
            "priority": "medium",
            "category": "Structure",
            "message": "Add a 2–3 line professional summary at the top highlighting your expertise and goals."
        })
    if not sections.get("projects"):
        suggestions.append({
            "priority": "high",
            "category": "Structure",
            "message": "Add a Projects section with descriptions, tech stack used, and live/GitHub links."
        })
    if not sections.get("experience") and not sections.get("internship"):
        suggestions.append({
            "priority": "high",
            "category": "Structure",
            "message": "Add work experience or internships — even freelance or academic projects count."
        })
    if not sections.get("certifications"):
        suggestions.append({
            "priority": "low",
            "category": "Structure",
            "message": "Add relevant certifications (e.g., AWS, Google, Meta, Coursera) to boost credibility."
        })
    if not sections.get("achievements"):
        suggestions.append({
            "priority": "low",
            "category": "Structure",
            "message": "Include an Achievements section with quantified results (e.g., 'Reduced load time by 40%')."
        })

    # ── Skill gaps from top matched job ──
    if matched_jobs:
        top_job = matched_jobs[0]
        missing = top_job.get("missing_required", [])
        if missing:
            suggestions.append({
                "priority": "high",
                "category": "Skills Gap",
                "message": (
                    f"For '{top_job['title']}' (your best match), you're missing: "
                    f"{', '.join(missing)}. Consider learning these next."
                )
            })
        good_missing = [s for s in top_job.get("good_to_have", []) if s not in skills_lower]
        if good_missing:
            suggestions.append({
                "priority": "medium",
                "category": "Skills Gap",
                "message": (
                    f"Boost your '{top_job['title']}' match by adding: "
                    f"{', '.join(good_missing[:4])}."
                )
            })

    # ── Content quality ──
    word_count = len(text.split())
    if word_count < 300:
        suggestions.append({
            "priority": "high",
            "category": "Content",
            "message": "Resume is too short. Expand project descriptions and add measurable outcomes."
        })
    elif word_count < 500:
        suggestions.append({
            "priority": "medium",
            "category": "Content",
            "message": "Consider adding more detail — describe your role, tools used, and impact in each project."
        })

    if len(extracted_skills) < 8:
        suggestions.append({
            "priority": "high",
            "category": "Skills",
            "message": "Very few skills detected. Aim for 12–20 relevant technical skills."
        })
    elif len(extracted_skills) < 12:
        suggestions.append({
            "priority": "medium",
            "category": "Skills",
            "message": "Add more skills — aim for at least 15 relevant skills to improve ATS matching."
        })

    # ── Action verbs ──
    action_verbs = [
        "developed", "built", "designed", "implemented", "led", "optimized",
        "deployed", "automated", "integrated", "scaled", "launched"
    ]
    used_verbs = [v for v in action_verbs if v in text]
    if len(used_verbs) < 3:
        suggestions.append({
            "priority": "medium",
            "category": "Writing Quality",
            "message": (
                "Use strong action verbs like 'Developed', 'Optimized', 'Deployed' "
                "to make bullet points more impactful."
            )
        })

    # ── Quantification check ──
    metrics_pattern = r'\b\d+\s*(%|percent|x|times|users|customers|projects|ms|seconds|hours)\b'
    metrics_found = re.findall(metrics_pattern, text)
    if len(metrics_found) < 2:
        suggestions.append({
            "priority": "medium",
            "category": "Writing Quality",
            "message": (
                "Quantify your achievements — e.g., 'Improved API response time by 30%' "
                "or 'Served 5000+ users'. Numbers grab attention."
            )
        })

    # ── Fresher-specific ──
    if experience_info["level"] == "Fresher":
        suggestions.append({
            "priority": "medium",
            "category": "Fresher Tip",
            "message": (
                "As a fresher, highlight academic projects, hackathons, open-source contributions, "
                "and personal builds prominently."
            )
        })

    if not suggestions:
        suggestions.append({
            "priority": "info",
            "category": "General",
            "message": "Strong resume! Keep your projects updated with live links and quantified results."
        })

    # Sort: high → medium → low → info
    priority_order = {"high": 0, "medium": 1, "low": 2, "info": 3}
    suggestions.sort(key=lambda s: priority_order.get(s["priority"], 4))
    return suggestions