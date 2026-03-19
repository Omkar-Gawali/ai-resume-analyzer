# ml-service/skills_db.py

SKILLS_DB = {
    "frontend": [
        "react", "reactjs", "next.js", "nextjs", "vue", "angular",
        "html", "css", "javascript", "typescript", "tailwind",
        "bootstrap", "sass", "redux", "context api", "axios"
    ],
    "backend": [
        "node.js", "nodejs", "express", "expressjs", "django",
        "flask", "fastapi", "spring boot", "php", "laravel",
        "rest api", "graphql", "websocket"
    ],
    "database": [
        "mongodb", "mysql", "postgresql", "sqlite", "redis",
        "firebase", "mongoose", "sequelize", "prisma"
    ],
    "ai_ml": [
        "machine learning", "deep learning", "nlp", "tensorflow",
        "pytorch", "scikit-learn", "pandas", "numpy", "keras",
        "computer vision", "bert", "transformers", "langchain",
        "openai", "groq", "hugging face"
    ],
    "devops": [
        "docker", "kubernetes", "aws", "azure", "gcp",
        "ci/cd", "github actions", "jenkins", "nginx", "linux"
    ],
    "tools": [
        "git", "github", "postman", "vs code", "jira",
        "figma", "vercel", "netlify", "render", "heroku"
    ],
    "languages": [
        "python", "java", "c++", "c#", "go", "rust",
        "kotlin", "swift", "r", "scala"
    ]
}

# Job roles with their required skills
JOB_ROLES = {
    "Full Stack Developer (MERN)": {
        "required": ["react", "node.js", "mongodb", "express", "javascript"],
        "good_to_have": ["typescript", "redux", "docker", "aws"]
    },
    "Full Stack AI Developer": {
        "required": ["react", "node.js", "python", "rest api", "openai"],
        "good_to_have": ["langchain", "fastapi", "docker", "mongodb"]
    },
    "Frontend Developer": {
        "required": ["react", "javascript", "html", "css", "typescript"],
        "good_to_have": ["next.js", "tailwind", "redux", "figma"]
    },
    "Backend Developer": {
        "required": ["node.js", "express", "mongodb", "rest api", "git"],
        "good_to_have": ["docker", "aws", "redis", "postgresql"]
    },
    "ML Engineer": {
        "required": ["python", "machine learning", "scikit-learn", "pandas", "numpy"],
        "good_to_have": ["tensorflow", "pytorch", "docker", "aws", "mlflow"]
    },
    "AI Engineer": {
        "required": ["python", "langchain", "openai", "fastapi", "nlp"],
        "good_to_have": ["hugging face", "bert", "docker", "mongodb", "react"]
    },
    "DevOps Engineer": {
        "required": ["docker", "kubernetes", "aws", "ci/cd", "linux"],
        "good_to_have": ["terraform", "ansible", "nginx", "python", "github actions"]
    }
}