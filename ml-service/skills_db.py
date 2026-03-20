# ml-service/skills_db.py

SKILLS_DB = {
    # ── IT & Software ─────────────────────────────────────────
    "frontend": [
        "react", "reactjs", "next.js", "nextjs", "vue", "vuejs", "angular",
        "html", "css", "javascript", "typescript", "tailwind", "bootstrap",
        "sass", "scss", "redux", "context api", "axios", "jquery", "webpack",
        "vite", "svelte", "gatsby", "remix"
    ],
    "backend": [
        "node.js", "nodejs", "express", "expressjs", "django", "flask",
        "fastapi", "spring boot", "spring", "php", "laravel", "ruby on rails",
        "rest api", "graphql", "websocket", "microservices", "grpc", "nestjs"
    ],
    "database": [
        "mongodb", "mysql", "postgresql", "sqlite", "redis", "firebase",
        "mongoose", "sequelize", "prisma", "oracle", "cassandra", "dynamodb",
        "elasticsearch", "supabase", "sql", "nosql"
    ],
    "ai_ml": [
        "machine learning", "deep learning", "nlp", "tensorflow", "pytorch",
        "scikit-learn", "pandas", "numpy", "keras", "computer vision", "bert",
        "transformers", "langchain", "openai", "groq", "hugging face",
        "data science", "neural networks", "llm", "generative ai", "cv",
        "reinforcement learning", "mlops", "feature engineering"
    ],
    "devops": [
        "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd",
        "github actions", "jenkins", "nginx", "linux", "terraform",
        "ansible", "helm", "prometheus", "grafana", "cloudformation"
    ],
    "mobile": [
        "android", "ios", "react native", "flutter", "swift", "kotlin",
        "xamarin", "ionic", "expo", "mobile development"
    ],
    "tools": [
        "git", "github", "gitlab", "postman", "vs code", "jira", "figma",
        "vercel", "netlify", "render", "heroku", "bitbucket", "confluence",
        "notion", "slack", "trello", "asana"
    ],
    "languages": [
        "python", "java", "c++", "c#", "c", "go", "rust", "kotlin", "swift",
        "r", "scala", "perl", "matlab", "bash", "shell scripting", "typescript",
        "javascript", "php", "ruby", "dart"
    ],
    "cybersecurity": [
        "ethical hacking", "penetration testing", "network security",
        "cybersecurity", "soc", "siem", "firewall", "vulnerability assessment",
        "wireshark", "kali linux", "owasp", "encryption", "ssl", "tls",
        "identity management", "iam", "zero trust"
    ],

    # ── Data & Analytics ──────────────────────────────────────
    "data_analytics": [
        "data analysis", "data visualization", "power bi", "tableau",
        "excel", "google sheets", "sql", "python", "r", "statistics",
        "business intelligence", "bi", "looker", "qlik", "data storytelling",
        "a/b testing", "hypothesis testing", "regression analysis"
    ],
    "data_engineering": [
        "apache spark", "hadoop", "kafka", "airflow", "etl", "data pipeline",
        "data warehouse", "snowflake", "databricks", "bigquery", "redshift",
        "dbt", "data lake", "pyspark", "hive", "flink"
    ],

    # ── Finance & Accounting ──────────────────────────────────
    "finance": [
        "financial analysis", "financial modeling", "valuation", "dcf",
        "accounting", "bookkeeping", "tally", "quickbooks", "sap",
        "budgeting", "forecasting", "risk management", "portfolio management",
        "investment banking", "equity research", "derivatives", "trading",
        "ca", "cfa", "cpa", "ifrs", "gaap", "taxation", "gst", "income tax",
        "audit", "internal audit", "cost accounting", "balance sheet",
        "profit and loss", "cash flow", "working capital"
    ],

    # ── Marketing & Sales ─────────────────────────────────────
    "marketing": [
        "digital marketing", "seo", "sem", "social media marketing",
        "content marketing", "email marketing", "google ads", "facebook ads",
        "instagram marketing", "influencer marketing", "brand management",
        "market research", "google analytics", "meta ads", "ppc",
        "affiliate marketing", "copywriting", "growth hacking",
        "conversion rate optimization", "cro", "hubspot", "mailchimp",
        "canva", "adobe photoshop", "video marketing", "youtube marketing"
    ],
    "sales": [
        "sales", "business development", "lead generation", "crm",
        "salesforce", "cold calling", "b2b sales", "b2c sales",
        "inside sales", "field sales", "account management",
        "negotiation", "sales funnel", "pipeline management",
        "customer acquisition", "upselling", "cross selling"
    ],

    # ── Healthcare & Medical ──────────────────────────────────
    "healthcare": [
        "clinical research", "pharmacovigilance", "medical coding",
        "icd-10", "cpt coding", "ehr", "emr", "healthcare management",
        "nursing", "patient care", "medical billing", "hipaa",
        "clinical trials", "good clinical practice", "gcp",
        "radiology", "pathology", "pharmacy", "mbbs", "bds",
        "physiotherapy", "public health", "epidemiology", "bioinformatics"
    ],

    # ── Design & Creative ─────────────────────────────────────
    "design": [
        "ui design", "ux design", "ui/ux", "user research", "wireframing",
        "prototyping", "figma", "adobe xd", "sketch", "invision",
        "graphic design", "adobe photoshop", "adobe illustrator",
        "adobe indesign", "after effects", "premiere pro", "motion graphics",
        "brand identity", "typography", "color theory", "design thinking",
        "3d modeling", "blender", "autocad", "solidworks"
    ],

    # ── Mechanical & Civil Engineering ────────────────────────
    "mechanical": [
        "autocad", "solidworks", "catia", "ansys", "creo", "nx",
        "cad", "cam", "manufacturing", "cnc", "quality control",
        "six sigma", "lean manufacturing", "production planning",
        "supply chain", "maintenance", "hvac", "thermodynamics",
        "fluid mechanics", "fea", "product design", "3d printing"
    ],
    "civil": [
        "autocad", "staad pro", "revit", "primavera", "ms project",
        "structural analysis", "construction management", "quantity surveying",
        "site supervision", "concrete", "steel design", "geotechnical",
        "surveying", "bim", "civil 3d", "highways", "water supply",
        "wastewater treatment", "project management"
    ],

    # ── Electrical & Electronics ──────────────────────────────
    "electrical": [
        "plc", "scada", "matlab", "simulink", "circuit design",
        "pcb design", "embedded systems", "arduino", "raspberry pi",
        "iot", "power systems", "electrical design", "autocad electrical",
        "hmi", "instrumentation", "control systems", "vlsi",
        "vhdl", "verilog", "fpga", "microcontroller", "arm"
    ],

    # ── HR & Management ───────────────────────────────────────
    "hr": [
        "recruitment", "talent acquisition", "onboarding", "payroll",
        "performance management", "hr operations", "employee relations",
        "training and development", "compensation", "benefits",
        "hris", "workday", "sap hr", "labor law", "compliance",
        "organizational development", "succession planning", "hr analytics"
    ],
    "management": [
        "project management", "pmp", "agile", "scrum", "kanban",
        "product management", "stakeholder management", "risk management",
        "change management", "strategic planning", "operations management",
        "team leadership", "people management", "budget management",
        "vendor management", "contract management", "six sigma", "prince2"
    ],

    # ── Legal ─────────────────────────────────────────────────
    "legal": [
        "legal research", "contract drafting", "litigation", "corporate law",
        "intellectual property", "ip", "trademark", "patent", "copyright",
        "mergers and acquisitions", "due diligence", "compliance",
        "regulatory affairs", "arbitration", "legal drafting",
        "company law", "civil law", "criminal law", "llb", "llm"
    ],

    # ── Education ─────────────────────────────────────────────
    "education": [
        "curriculum development", "instructional design", "e-learning",
        "lms", "moodle", "teaching", "training", "coaching", "mentoring",
        "classroom management", "assessment", "educational technology",
        "content development", "academic writing", "research"
    ],

    # ── Logistics & Supply Chain ──────────────────────────────
    "logistics": [
        "supply chain management", "logistics", "warehouse management",
        "inventory management", "procurement", "sourcing", "erp",
        "sap", "oracle", "demand planning", "forecasting",
        "vendor management", "import export", "customs", "freight",
        "last mile delivery", "fleet management"
    ],

    # ── Soft Skills ───────────────────────────────────────────
    "soft_skills": [
        "communication", "leadership", "teamwork", "problem solving",
        "critical thinking", "time management", "adaptability",
        "creativity", "emotional intelligence", "conflict resolution",
        "decision making", "presentation", "negotiation", "multitasking"
    ],
}


JOB_ROLES = {
    # ── IT Roles ──────────────────────────────────────────────
    "Full Stack Developer (MERN)": {
        "required":     ["react", "node.js", "mongodb", "express", "javascript"],
        "good_to_have": ["typescript", "redux", "docker", "aws"]
    },
    "Full Stack AI Developer": {
        "required":     ["react", "node.js", "python", "rest api", "openai"],
        "good_to_have": ["langchain", "fastapi", "docker", "mongodb"]
    },
    "Frontend Developer": {
        "required":     ["react", "javascript", "html", "css", "typescript"],
        "good_to_have": ["next.js", "tailwind", "redux", "figma"]
    },
    "Backend Developer": {
        "required":     ["node.js", "express", "mongodb", "rest api", "git"],
        "good_to_have": ["docker", "aws", "redis", "postgresql"]
    },
    "ML Engineer": {
        "required":     ["python", "machine learning", "scikit-learn", "pandas", "numpy"],
        "good_to_have": ["tensorflow", "pytorch", "docker", "aws"]
    },
    "AI Engineer": {
        "required":     ["python", "langchain", "openai", "fastapi", "nlp"],
        "good_to_have": ["hugging face", "bert", "docker", "mongodb", "react"]
    },
    "Data Scientist": {
        "required":     ["python", "machine learning", "pandas", "numpy", "statistics"],
        "good_to_have": ["tensorflow", "pytorch", "sql", "tableau", "spark"]
    },
    "Data Analyst": {
        "required":     ["sql", "excel", "data analysis", "python", "data visualization"],
        "good_to_have": ["power bi", "tableau", "r", "statistics", "google analytics"]
    },
    "Data Engineer": {
        "required":     ["python", "sql", "etl", "apache spark", "data pipeline"],
        "good_to_have": ["kafka", "airflow", "snowflake", "docker", "scala"]
    },
    "DevOps Engineer": {
        "required":     ["docker", "kubernetes", "aws", "ci/cd", "linux"],
        "good_to_have": ["terraform", "ansible", "nginx", "python", "github actions"]
    },
    "Mobile Developer": {
        "required":     ["react native", "javascript", "android", "ios", "git"],
        "good_to_have": ["flutter", "typescript", "firebase", "redux", "expo"]
    },
    "Cybersecurity Analyst": {
        "required":     ["cybersecurity", "network security", "ethical hacking", "linux", "siem"],
        "good_to_have": ["penetration testing", "wireshark", "python", "firewall", "owasp"]
    },

    # ── Finance Roles ─────────────────────────────────────────
    "Financial Analyst": {
        "required":     ["financial analysis", "financial modeling", "excel", "accounting", "valuation"],
        "good_to_have": ["python", "sql", "power bi", "bloomberg", "cfa"]
    },
    "Accountant": {
        "required":     ["accounting", "tally", "gst", "taxation", "bookkeeping"],
        "good_to_have": ["sap", "quickbooks", "excel", "audit", "ifrs"]
    },
    "Investment Banker": {
        "required":     ["financial modeling", "valuation", "dcf", "excel", "equity research"],
        "good_to_have": ["bloomberg", "pitch deck", "mergers and acquisitions", "cfa", "python"]
    },

    # ── Marketing Roles ───────────────────────────────────────
    "Digital Marketing Specialist": {
        "required":     ["seo", "google ads", "social media marketing", "google analytics", "content marketing"],
        "good_to_have": ["meta ads", "email marketing", "hubspot", "canva", "copywriting"]
    },
    "Sales Manager": {
        "required":     ["sales", "b2b sales", "crm", "lead generation", "negotiation"],
        "good_to_have": ["salesforce", "business development", "account management", "pipeline management", "excel"]
    },

    # ── Design Roles ──────────────────────────────────────────
    "UI/UX Designer": {
        "required":     ["figma", "ui design", "ux design", "wireframing", "prototyping"],
        "good_to_have": ["adobe xd", "user research", "design thinking", "adobe photoshop", "css"]
    },
    "Graphic Designer": {
        "required":     ["adobe photoshop", "adobe illustrator", "graphic design", "typography", "canva"],
        "good_to_have": ["adobe indesign", "after effects", "brand identity", "figma", "color theory"]
    },

    # ── Engineering Roles ─────────────────────────────────────
    "Mechanical Engineer": {
        "required":     ["autocad", "solidworks", "manufacturing", "cad", "quality control"],
        "good_to_have": ["ansys", "catia", "six sigma", "fea", "3d printing"]
    },
    "Civil Engineer": {
        "required":     ["autocad", "staad pro", "structural analysis", "construction management", "surveying"],
        "good_to_have": ["revit", "primavera", "bim", "quantity surveying", "ms project"]
    },
    "Electrical Engineer": {
        "required":     ["autocad electrical", "plc", "circuit design", "matlab", "power systems"],
        "good_to_have": ["scada", "embedded systems", "simulink", "hmi", "instrumentation"]
    },
    "Embedded Systems Engineer": {
        "required":     ["embedded systems", "c", "microcontroller", "arduino", "iot"],
        "good_to_have": ["raspberry pi", "rtos", "arm", "pcb design", "python"]
    },

    # ── HR & Management Roles ─────────────────────────────────
    "HR Manager": {
        "required":     ["recruitment", "hr operations", "payroll", "performance management", "labor law"],
        "good_to_have": ["workday", "sap hr", "training and development", "hris", "hr analytics"]
    },
    "Project Manager": {
        "required":     ["project management", "agile", "scrum", "stakeholder management", "risk management"],
        "good_to_have": ["pmp", "jira", "ms project", "budget management", "prince2"]
    },
    "Product Manager": {
        "required":     ["product management", "agile", "stakeholder management", "roadmap", "user research"],
        "good_to_have": ["jira", "figma", "sql", "analytics", "a/b testing"]
    },

    # ── Healthcare Roles ──────────────────────────────────────
    "Clinical Research Associate": {
        "required":     ["clinical research", "gcp", "clinical trials", "pharmacovigilance", "ehr"],
        "good_to_have": ["sas", "spss", "medical coding", "regulatory affairs", "icd-10"]
    },
    "Healthcare Data Analyst": {
        "required":     ["sql", "excel", "data analysis", "healthcare management", "ehr"],
        "good_to_have": ["python", "power bi", "tableau", "hipaa", "statistics"]
    },

    # ── Legal Roles ───────────────────────────────────────────
    "Legal Associate": {
        "required":     ["legal research", "contract drafting", "compliance", "litigation", "corporate law"],
        "good_to_have": ["intellectual property", "due diligence", "arbitration", "regulatory affairs", "llm"]
    },

    # ── Logistics Roles ───────────────────────────────────────
    "Supply Chain Manager": {
        "required":     ["supply chain management", "procurement", "inventory management", "erp", "logistics"],
        "good_to_have": ["sap", "demand planning", "vendor management", "six sigma", "forecasting"]
    },
}