import type {
  ResumeAnalysis,
  CareerRecommendation,
  IndustryRequirements,
  SkillGapAnalysisResult,
  PersonalizedRoadmap,
  GeneratedProject,
  QuizQuestion
} from '../types.ts';

export const SAMPLE_RESUME_TEXT = `Alex Johnson
Email: alex.johnson@example.edu | Location: Bangalore, India
GitHub: github.com/alex-j | LinkedIn: linkedin.com/in/alex-johnson

EDUCATION
Bachelor of Technology (B.Tech) in Artificial Intelligence & Machine Learning
PES University, Bangalore | 2023 - 2027 (Expected 2nd Year)
CGPA: 8.4/10

TECHNICAL SKILLS
- Programming: Python, C++ (Basic), HTML5, CSS3, JavaScript (Basic)
- AI & Data Science: Basic Machine Learning, Scikit-Learn, NumPy, Matplotlib
- Databases & Tools: Git, GitHub, VS Code, Jupyter Notebook

ACADEMIC PROJECTS
1. House Price Prediction Model
- Built a supervised linear regression and random forest model to predict real-estate prices based on Boston Housing dataset.
- Technologies: Python, Pandas, Scikit-Learn, Matplotlib.
- Evaluated model using RMSE and R2 score.

2. Student Portfolio Website
- Designed and deployed responsive personal portfolio site using HTML5, CSS3, and JavaScript with interactive project showcase.

CERTIFICATIONS
- Python for Data Science and AI (Coursera - IBM)
- Supervised Machine Learning: Regression and Classification (DeepLearning.AI)

SOFT SKILLS
- Problem Solving, Analytical Thinking, Team Collaboration, Technical Documentation`;

export const DEMO_RESUME_ANALYSIS: ResumeAnalysis = {
  personalInfo: {
    name: "Alex Johnson",
    email: "alex.johnson@example.edu",
    location: "Bangalore, India",
    github: "github.com/alex-j",
    linkedin: "linkedin.com/in/alex-johnson"
  },
  education: [
    {
      degree: "B.Tech",
      branch: "Artificial Intelligence & Machine Learning",
      college: "PES University, Bangalore",
      graduationYear: "2027 (2nd Year)",
      cgpaOrPercentage: "8.4 / 10"
    }
  ],
  skills: {
    programming: ["Python", "C++ (Basic)", "JavaScript (Basic)"],
    ai_ml: ["Basic Machine Learning", "Scikit-Learn", "Regression", "Classification"],
    data: ["NumPy", "Matplotlib", "Pandas"],
    web: ["HTML5", "CSS3"],
    cloud: ["Not mentioned in resume"],
    databases: ["Not mentioned in resume"],
    tools: ["Git", "GitHub", "VS Code", "Jupyter Notebook"],
    other: ["Supervised Learning"]
  },
  softSkills: [
    "Problem Solving",
    "Analytical Thinking",
    "Team Collaboration",
    "Technical Documentation"
  ],
  projects: [
    {
      name: "House Price Prediction Model",
      description: "Supervised regression model predicting real-estate prices using historical feature indicators.",
      technologies: ["Python", "Pandas", "Scikit-Learn", "Matplotlib"],
      skillsDemonstrated: ["Data Preprocessing", "Feature Scaling", "Model Evaluation"]
    },
    {
      name: "Student Portfolio Website",
      description: "Responsive personal portfolio showcasing projects and academic achievements.",
      technologies: ["HTML5", "CSS3", "JavaScript"],
      skillsDemonstrated: ["Web Layout", "DOM Manipulation", "UI Design"]
    }
  ],
  certifications: [
    "Python for Data Science and AI (IBM)",
    "Supervised Machine Learning (DeepLearning.AI)"
  ],
  experience: [
    {
      role: "Not mentioned in resume",
      company: "Not mentioned in resume",
      duration: "Not mentioned in resume",
      responsibilities: ["Not mentioned in resume"],
      technologies: []
    }
  ],
  summary: "2nd-year undergraduate in AI & ML with foundational Python programming, core machine learning concepts, and basic web development knowledge looking to specialize as an AI/ML Engineer.",
  isAiGenerated: true
};

export const CAREER_OPTIONS = [
  { id: "ai_ml_engineer", name: "AI/ML Engineer", icon: "Brain", demand: "Very High", salary: "$110k - $160k" },
  { id: "data_scientist", name: "Data Scientist", icon: "LineChart", demand: "Very High", salary: "$105k - $150k" },
  { id: "generative_ai_engineer", name: "Generative AI Engineer", icon: "Sparkles", demand: "Extremely High", salary: "$130k - $185k" },
  { id: "data_analyst", name: "Data Analyst", icon: "BarChart3", demand: "High", salary: "$75k - $105k" },
  { id: "software_developer", name: "Software Developer", icon: "Code2", demand: "High", salary: "$95k - $140k" },
  { id: "cloud_engineer", name: "Cloud Engineer", icon: "Cloud", demand: "Very High", salary: "$105k - $155k" },
  { id: "cybersecurity_analyst", name: "Cybersecurity Analyst", icon: "ShieldCheck", demand: "High", salary: "$90k - $135k" },
  { id: "prompt_engineer", name: "Prompt Engineer", icon: "Bot", demand: "Moderate", salary: "$85k - $125k" },
  { id: "product_analyst", name: "Business/Product Analyst", icon: "Briefcase", demand: "High", salary: "$80k - $120k" }
];

export const DEMO_RECOMMENDATIONS: CareerRecommendation[] = [
  {
    careerName: "AI/ML Engineer",
    matchPercentage: 78,
    whyItMatches: "Your formal coursework in AI & ML, Python proficiency, and hands-on projects with Scikit-Learn provide a direct launchpad towards production machine learning systems.",
    currentStrengths: ["Python programming", "Basic Machine Learning algorithms", "Data manipulation with NumPy & Pandas", "Git version control"],
    missingSkills: ["Deep Learning (PyTorch/TensorFlow)", "SQL & Relational Databases", "Model Deployment & Docker", "MLOps & CI/CD"],
    recommendedNextSteps: [
      "Master SQL queries and database schemas for feature stores",
      "Learn Deep Learning fundamentals with PyTorch",
      "Build an end-to-end deployed model using FastAPI and Docker"
    ]
  },
  {
    careerName: "Data Scientist",
    matchPercentage: 72,
    whyItMatches: "Strong foundation in regression modeling, exploratory data analysis, and mathematical orientation from B.Tech curriculum matches analytical workflows.",
    currentStrengths: ["NumPy and Pandas wrangling", "Matplotlib visualization", "Regression & Classification metrics"],
    missingSkills: ["Advanced Statistics & Hypothesis Testing", "SQL Data Warehousing", "Tableau or PowerBI", "Big Data (PySpark)"],
    recommendedNextSteps: [
      "Deep dive into inferential statistics and A/B testing",
      "Gain proficiency in complex SQL aggregations",
      "Create an end-to-end exploratory data analysis case study"
    ]
  },
  {
    careerName: "Generative AI Engineer",
    matchPercentage: 65,
    whyItMatches: "Your Python base and ML background enable quick ramp-up to LLM orchestration, Retrieval-Augmented Generation (RAG), and vector databases.",
    currentStrengths: ["Python scripting", "Understanding of ML embeddings & tokenization basics"],
    missingSkills: ["Large Language Models (LLMs)", "LangChain / LlamaIndex", "Vector Databases (Chroma / Pinecone)", "RAG Architecture"],
    recommendedNextSteps: [
      "Explore prompt engineering and LLM API integrations (Gemini API)",
      "Build a RAG chatbot over custom PDF documents",
      "Study vector similarity and embedding metrics"
    ]
  }
];

export const DEMO_INDUSTRY_REQUIREMENTS: Record<string, IndustryRequirements> = {
  "AI/ML Engineer": {
    careerName: "AI/ML Engineer",
    overview: "AI/ML Engineers bridge theoretical research and production systems, designing, training, deploying, and maintaining scalable predictive and generative models.",
    essentialSkills: [
      "Python Advanced",
      "Mathematics & Linear Algebra",
      "Probability & Statistics",
      "NumPy & Pandas",
      "SQL & Database Queries",
      "Machine Learning (Scikit-Learn)",
      "Deep Learning (PyTorch / TensorFlow)",
      "Git & GitHub Version Control",
      "RESTful APIs (FastAPI / Flask)",
      "Model Evaluation & Tuning",
      "Docker & Containerization",
      "Model Deployment"
    ],
    emergingSkills: [
      "Generative AI & LLM Fine-tuning",
      "Retrieval-Augmented Generation (RAG)",
      "Vector Databases (Pinecone, Milvus, Qdrant)",
      "Autonomous AI Agents",
      "MLOps (MLflow, Kubeflow)",
      "Cloud AI (GCP Vertex AI, AWS SageMaker)",
      "Quantization & ONNX Optimization",
      "Responsible AI & Safety Auditing"
    ],
    typicalTools: ["PyTorch", "Docker", "FastAPI", "MLflow", "Vertex AI", "Weights & Biases", "PostgreSQL"],
    salaryRange: "$110,000 - $165,000 / year",
    marketDemand: "Very High"
  }
};

export const DEMO_SKILL_GAP: SkillGapAnalysisResult = {
  careerName: "AI/ML Engineer",
  overallMatchScore: 48,
  readinessSummary: "Alex has solid foundational Python, Git, and elementary Scikit-Learn skills. The primary skill gaps preventing employment as an AI/ML Engineer are SQL databases, Deep Learning frameworks (PyTorch), REST API deployment, and MLOps tooling.",
  skillGaps: [
    { skill: "Python Programming", category: "Core", score: 85, status: "Strong", importance: "Critical", notes: "Demonstrated through projects and coursework" },
    { skill: "Machine Learning (Scikit-Learn)", category: "Core", score: 70, status: "Intermediate", importance: "Critical", notes: "Familiar with regression & classification, needs advanced ensemble methods" },
    { skill: "NumPy & Pandas", category: "Data", score: 65, status: "Intermediate", importance: "Critical", notes: "Basic data wrangling shown in projects" },
    { skill: "Git & GitHub", category: "Tools", score: 60, status: "Intermediate", importance: "High", notes: "Basic repository usage, needs branching & PR workflow" },
    { skill: "Mathematics & Statistics", category: "Core", score: 55, status: "Intermediate", importance: "High", notes: "Undergraduate curriculum coverage, needs applied ML stats" },
    { skill: "SQL & Relational Databases", category: "Data", score: 25, status: "Beginner", importance: "Critical", notes: "Minimal evidence in resume; essential for fetching training data" },
    { skill: "Deep Learning (PyTorch)", category: "AI/ML", score: 10, status: "Missing", importance: "Critical", notes: "No neural network implementations detected" },
    { skill: "REST API & FastAPI", category: "Deployment", score: 15, status: "Beginner", importance: "High", notes: "Needed to serve models to client applications" },
    { skill: "Docker & Containerization", category: "Deployment", score: 0, status: "Missing", importance: "High", notes: "Vital for reproducible model hosting" },
    { skill: "Generative AI & LLMs", category: "Emerging", score: 20, status: "Beginner", importance: "High", notes: "High industry demand; not present in resume projects" },
    { skill: "Vector Databases & RAG", category: "Emerging", score: 0, status: "Missing", importance: "Medium", notes: "Modern standard for contextual AI pipelines" },
    { skill: "MLOps & Model Monitoring", category: "Emerging", score: 0, status: "Missing", importance: "Medium", notes: "Key requirement for senior engineering roles" }
  ],
  topSkillsToLearn: [
    {
      skill: "SQL & Relational Databases",
      whyYouNeedIt: "90% of production ML training pipelines pull raw records from SQL datastores. Without SQL, you cannot extract or engineer features.",
      currentLevel: "Beginner (25%)",
      targetLevel: "Advanced Queries & Joins",
      priority: "Urgent",
      estimatedHours: 18
    },
    {
      skill: "Deep Learning with PyTorch",
      whyYouNeedIt: "Industry AI solutions rely heavily on modern deep architectures (Transformers, CNNs) built with PyTorch.",
      currentLevel: "Missing (10%)",
      targetLevel: "Competent Model Training & Fine-Tuning",
      priority: "Urgent",
      estimatedHours: 35
    },
    {
      skill: "API Model Deployment (FastAPI)",
      whyYouNeedIt: "A machine learning model locked inside a Jupyter notebook has zero commercial value until served as an API.",
      currentLevel: "Beginner (15%)",
      targetLevel: "Production REST endpoints with validation",
      priority: "High",
      estimatedHours: 15
    },
    {
      skill: "Docker & Model Packaging",
      whyYouNeedIt: "Ensures environment consistency across developer laptops and cloud Kubernetes clusters without dependency conflicts.",
      currentLevel: "Missing (0%)",
      targetLevel: "Dockerfile creation & lightweight containerization",
      priority: "High",
      estimatedHours: 12
    },
    {
      skill: "Generative AI & RAG Systems",
      whyYouNeedIt: "Top tech companies currently prioritize candidates capable of combining custom knowledge bases with LLMs via vector search.",
      currentLevel: "Beginner (20%)",
      targetLevel: "End-to-End RAG with Gemini API & Vector DB",
      priority: "High",
      estimatedHours: 22
    }
  ]
};

export const DEMO_SKILL_GAP_RESULT: SkillGapAnalysisResult = DEMO_SKILL_GAP;
export const DEMO_DEFAULT_REQUIREMENTS: IndustryRequirements = DEMO_INDUSTRY_REQUIREMENTS["AI/ML Engineer"];

export const DEMO_ROADMAP: PersonalizedRoadmap = {
  careerName: "AI/ML Engineer",
  weeklyHours: "10-15 hours",
  totalEstimatedWeeks: 14,
  totalEstimatedHours: 165,
  generatedAt: new Date().toISOString(),
  phases: [
    {
      phaseNumber: 1,
      phaseName: "Data Pipelines & SQL Mastery",
      description: "Close foundational gaps in data extraction, structured SQL queries, and production Python packaging. (Bypasses basic Python since Alex already demonstrates it).",
      estimatedWeeks: 2,
      items: [
        {
          id: "r1-1",
          phaseNumber: 1,
          phaseName: "Data Pipelines & SQL Mastery",
          topic: "Relational Databases & SQL for Data Science",
          difficulty: "Beginner",
          priority: "Critical",
          estimatedHours: 14,
          prerequisites: ["Basic Python"],
          whatToLearn: [
            "SELECT, filtering, GROUP BY, aggregates",
            "INNER, LEFT, and FULL OUTER JOINs across multiple tables",
            "Window functions (ROW_NUMBER, RANK, LAG/LEAD)",
            "Connecting Python to PostgreSQL with SQLAlchemy"
          ],
          practiceTask: "Write 15 complex analytical SQL queries against an e-commerce schema to compute monthly customer churn and repeat purchase ratios.",
          projectSuggestion: "Automated Data Ingestion Script that queries PostgreSQL and outputs clean training dataframes.",
          learningResources: [
            { title: "Mode Analytics SQL Tutorial for Data Analysts", type: "Tutorial" },
            { title: "SQLZoo Interactive Query Exercises", type: "Practice" },
            { title: "PostgreSQL Official Documentation", type: "Documentation" }
          ],
          status: "completed"
        },
        {
          id: "r1-2",
          phaseNumber: 1,
          phaseName: "Data Pipelines & SQL Mastery",
          topic: "Advanced NumPy & Vectorized Feature Engineering",
          difficulty: "Intermediate",
          priority: "High",
          estimatedHours: 10,
          prerequisites: ["Basic NumPy"],
          whatToLearn: [
            "Broadcasting rules and memory layout",
            "Vectorized calculations vs Python loops",
            "Handling missing values and outlier detection strategies",
            "One-hot encoding vs target encoding"
          ],
          practiceTask: "Optimize a slow Python data-cleaning loop using pure vectorized NumPy methods, achieving a 50x speedup.",
          projectSuggestion: "Reusable feature engineering pipeline module packaged with setup.py/pip.",
          learningResources: [
            { title: "NumPy Vectorization Guide", type: "Documentation" },
            { title: "Pandas Cookbook & Performance Optimization", type: "Tutorial" }
          ],
          status: "in_progress"
        }
      ]
    },
    {
      phaseNumber: 2,
      phaseName: "Applied Machine Learning & Ensembles",
      description: "Upgrade basic Scikit-Learn usage to industry standards: cross-validation, gradient boosting (XGBoost/LightGBM), and hyperparameter optimization.",
      estimatedWeeks: 2,
      items: [
        {
          id: "r2-1",
          phaseNumber: 2,
          phaseName: "Applied Machine Learning & Ensembles",
          topic: "Gradient Boosting & Tree Ensembles",
          difficulty: "Intermediate",
          priority: "Critical",
          estimatedHours: 16,
          prerequisites: ["Decision Trees", "Scikit-Learn"],
          whatToLearn: [
            "Random Forests vs Gradient Boosted Trees",
            "XGBoost and LightGBM mechanics and regularization parameters",
            "Feature importance analysis with SHAP and permutation importance",
            "Cross-validation strategies (StratifiedKFold, TimeSeriesSplit)"
          ],
          practiceTask: "Train an XGBoost model on tabular fraud detection data, tune hyperparameters with Optuna, and explain predictions using SHAP values.",
          projectSuggestion: "Credit Risk Assessment Model with interpretability dashboard.",
          learningResources: [
            { title: "StatQuest: XGBoost Illustrated", type: "Tutorial" },
            { title: "Scikit-Learn Cross Validation Documentation", type: "Documentation" }
          ],
          status: "not_started"
        }
      ]
    },
    {
      phaseNumber: 3,
      phaseName: "Deep Learning with PyTorch",
      description: "Build neural network architectures from scratch using PyTorch, progressing from multi-layer perceptrons to convolutional and sequence models.",
      estimatedWeeks: 3,
      items: [
        {
          id: "r3-1",
          phaseNumber: 3,
          phaseName: "Deep Learning with PyTorch",
          topic: "PyTorch Tensors, Autograd & Training Loops",
          difficulty: "Intermediate",
          priority: "Critical",
          estimatedHours: 18,
          prerequisites: ["Linear Algebra", "Python OOP"],
          whatToLearn: [
            "PyTorch Tensor operations and GPU acceleration (CUDA)",
            "Computational graphs and backward propagation via Autograd",
            "Writing custom Dataset and DataLoader classes",
            "Structuring standard training and validation loops"
          ],
          practiceTask: "Implement an image classifier on FashionMNIST using PyTorch nn.Module with learning rate scheduling and early stopping.",
          projectSuggestion: "Custom PyTorch training boilerplate repository with logging.",
          learningResources: [
            { title: "Deep Learning with PyTorch: A 60 Minute Blitz", type: "Tutorial" },
            { title: "PyTorch Official Tutorials", type: "Documentation" }
          ],
          status: "not_started"
        },
        {
          id: "r3-2",
          phaseNumber: 3,
          phaseName: "Deep Learning with PyTorch",
          topic: "Transfer Learning & Vision / NLP Transformers",
          difficulty: "Advanced",
          priority: "High",
          estimatedHours: 20,
          prerequisites: ["PyTorch Training Loops"],
          whatToLearn: [
            "Convolutional Neural Networks (ResNet, EfficientNet)",
            "Self-attention mechanism and Transformer architecture",
            "Fine-tuning pretrained Hugging Face models",
            "Tokenization, attention masks, and embedding generation"
          ],
          practiceTask: "Fine-tune a pretrained BERT or DistilBERT model for multi-label text categorization using Hugging Face Transformers.",
          projectSuggestion: "Medical Document Classification using fine-tuned BioBERT.",
          learningResources: [
            { title: "Hugging Face NLP Course", type: "Course" },
            { title: "The Illustrated Transformer by Jay Alammar", type: "Tutorial" }
          ],
          status: "not_started"
        }
      ]
    },
    {
      phaseNumber: 4,
      phaseName: "Generative AI, RAG & Vector Systems",
      description: "Learn modern GenAI engineering: Gemini API integration, prompt tuning, vector indexing, and Retrieval-Augmented Generation.",
      estimatedWeeks: 3,
      items: [
        {
          id: "r4-1",
          phaseNumber: 4,
          phaseName: "Generative AI, RAG & Vector Systems",
          topic: "LLM APIs & Prompt Engineering with Gemini",
          difficulty: "Intermediate",
          priority: "High",
          estimatedHours: 14,
          prerequisites: ["Python REST APIs"],
          whatToLearn: [
            "Gemini API structured outputs (JSON schema enforcement)",
            "Few-shot prompting and system instructions",
            "Handling context windows, token limits, and rate limits",
            "Function calling / Tool use with Gemini"
          ],
          practiceTask: "Build an automated code reviewer tool using Gemini API with structured JSON output validating PEP8 compliance.",
          projectSuggestion: "Developer Assistant CLI using Gemini Flash.",
          learningResources: [
            { title: "Google AI Studio Quickstart Guides", type: "Documentation" },
            { title: "Prompt Engineering Guide (DAIR.AI)", type: "Tutorial" }
          ],
          status: "not_started"
        },
        {
          id: "r4-2",
          phaseNumber: 4,
          phaseName: "Generative AI, RAG & Vector Systems",
          topic: "Retrieval-Augmented Generation (RAG) Architecture",
          difficulty: "Advanced",
          priority: "Critical",
          estimatedHours: 22,
          prerequisites: ["LLM APIs", "Embeddings"],
          whatToLearn: [
            "Document chunking strategies and overlap sizing",
            "Embedding generation with text-embedding models",
            "Vector databases (ChromaDB, Pinecone, Qdrant)",
            "Hybrid search: BM25 keyword + dense semantic vector search",
            "Reranking and prompt synthesis for hallucination minimization"
          ],
          practiceTask: "Construct a local RAG knowledge agent that ingests university syllabi and accurately answers student queries with source citations.",
          projectSuggestion: "Enterprise Knowledge Base Q&A System with verifiable source attribution.",
          learningResources: [
            { title: "RAG from Scratch by LangChain", type: "Tutorial" },
            { title: "Pinecone Learning Center: Vector Search Explained", type: "Documentation" }
          ],
          status: "not_started"
        }
      ]
    },
    {
      phaseNumber: 5,
      phaseName: "Model Deployment, APIs & Containerization",
      description: "Transform models into scalable, production-grade cloud microservices with FastAPI and Docker.",
      estimatedWeeks: 2,
      items: [
        {
          id: "r5-1",
          phaseNumber: 5,
          phaseName: "Model Deployment, APIs & Containerization",
          topic: "Production Model Serving with FastAPI & Pydantic",
          difficulty: "Intermediate",
          priority: "Critical",
          estimatedHours: 15,
          prerequisites: ["Python OOP"],
          whatToLearn: [
            "FastAPI routing, dependency injection, and lifespan events",
            "Request/Response validation using Pydantic models",
            "Asynchronous batch prediction endpoints",
            "Benchmarking latency and memory usage"
          ],
          practiceTask: "Expose a trained PyTorch model as a high-throughput REST API with automated Swagger OpenAPI documentation.",
          projectSuggestion: "Real-time AI Inference Service with rate-limiting and health checks.",
          learningResources: [
            { title: "FastAPI Official Documentation", type: "Documentation" },
            { title: "TestDriven.io: FastAPI with Machine Learning", type: "Tutorial" }
          ],
          status: "not_started"
        },
        {
          id: "r5-2",
          phaseNumber: 5,
          phaseName: "Model Deployment, APIs & Containerization",
          topic: "Docker Containerization & Cloud Deployment",
          difficulty: "Intermediate",
          priority: "Critical",
          estimatedHours: 14,
          prerequisites: ["Linux CLI", "FastAPI"],
          whatToLearn: [
            "Writing optimized multi-stage Dockerfiles for Python/ML",
            "Managing dependencies with virtualenvs and wheel caches",
            "Docker Compose for multi-service apps (API + Redis/DB)",
            "Deploying containers to Google Cloud Run / AWS ECS"
          ],
          practiceTask: "Containerize the FastAPI inference service into a <300MB production Docker image and deploy it to a live cloud URL.",
          projectSuggestion: "Cloud-Deployed AI Microservice with CI/CD GitHub Actions.",
          learningResources: [
            { title: "Docker for Data Science by RealPython", type: "Tutorial" },
            { title: "Google Cloud Run Deployment Guides", type: "Documentation" }
          ],
          status: "not_started"
        }
      ]
    },
    {
      phaseNumber: 6,
      phaseName: "Job Preparation & Portfolio Optimization",
      description: "Polish GitHub repositories, package resume bullets with quantifiable impact, and practice technical machine learning interviews.",
      estimatedWeeks: 2,
      items: [
        {
          id: "r6-1",
          phaseNumber: 6,
          phaseName: "Job Preparation & Portfolio Optimization",
          topic: "Technical Portfolio, GitHub Readmes & Live Demos",
          difficulty: "Beginner",
          priority: "High",
          estimatedHours: 10,
          prerequisites: ["Completed Projects"],
          whatToLearn: [
            "Writing architectural READMEs with diagrams and demo GIFs",
            "Setting up GitHub Actions for continuous unit testing",
            "Hosting interactive demo frontends on Vercel / Hugging Face Spaces"
          ],
          practiceTask: "Create professional READMEs with architecture diagrams, benchmarks, and live links for your top 3 projects.",
          projectSuggestion: "Unified AI Portfolio Portal.",
          learningResources: [
            { title: "How to Build a Data Science Portfolio that Gets Hired", type: "Tutorial" }
          ],
          status: "not_started"
        },
        {
          id: "r6-2",
          phaseNumber: 6,
          phaseName: "Job Preparation & Portfolio Optimization",
          topic: "ML System Design & Coding Interview Prep",
          difficulty: "Advanced",
          priority: "High",
          estimatedHours: 16,
          prerequisites: ["All prior modules"],
          whatToLearn: [
            "ML system design framework (Data collection, model choice, training, serving, monitoring)",
            "Handling common pitfalls: data drift, feedback loops, cold-start problem",
            "Algorithmic coding (arrays, graphs, dynamic programming) in Python"
          ],
          practiceTask: "Participate in 3 mock ML system design interviews (e.g. Design YouTube recommendation or Fraud detection).",
          projectSuggestion: "Personal ML Interview Study Cheat Sheet.",
          learningResources: [
            { title: "Designing Machine Learning Systems by Chip Huyen", type: "Course" },
            { title: "NeetCode 150 Data Structures in Python", type: "Practice" }
          ],
          status: "not_started"
        }
      ]
    }
  ]
};

export const DEMO_PROJECTS: GeneratedProject[] = [
  {
    id: "proj-1",
    title: "End-to-End Customer Churn Predictor with FastAPI & Docker",
    level: "Beginner",
    problemStatement: "Subscription businesses lose millions in revenue due to unpredictable customer attrition.",
    objective: "Develop an end-to-end churn prediction service using XGBoost, wrapped in a FastAPI REST endpoint and containerized with Docker.",
    features: [
      "Tabular data preprocessing with Scikit-Learn pipelines",
      "Model training and hyperparameter tuning with Optuna",
      "FastAPI endpoint accepting customer profile JSON payload and returning probability score",
      "Interactive Swagger UI for live testing",
      "Dockerfile configured for single-command container deployment"
    ],
    techStack: ["Python", "Pandas", "Scikit-Learn", "FastAPI", "Docker", "Pydantic"],
    skillsPracticed: ["Data Preprocessing", "XGBoost", "API Development", "Containerization"],
    implementationSteps: [
      "1. Download Telco Churn dataset and perform exploratory data analysis in Jupyter.",
      "2. Build preprocessing pipeline with numerical scalers and categorical one-hot encoders.",
      "3. Train and compare Random Forest vs XGBoost models with Stratified K-Fold CV.",
      "4. Serialize trained pipeline using joblib/pickle.",
      "5. Create app.py with FastAPI POST /predict endpoint validating incoming payload with Pydantic.",
      "6. Write Dockerfile based on python:3.11-slim, expose port 8000, and test container locally."
    ],
    expectedOutcome: "A deployable GitHub repository with reproducible Docker container delivering <50ms prediction latency on customer churn queries."
  },
  {
    id: "proj-2",
    title: "Contextual Document Assistant with Gemini 3.8 & Vector Search (RAG)",
    level: "Intermediate",
    problemStatement: "Students and researchers struggle to rapidly search through complex multi-page PDF textbooks and technical manuals.",
    objective: "Build a production Retrieval-Augmented Generation (RAG) knowledge engine using Gemini Flash, ChromaDB vector database, and semantic chunking.",
    features: [
      "PDF text extraction and recursive character chunking with 15% overlap",
      "Dense vector embedding generation using Gemini Embeddings API",
      "ChromaDB local vector store persistence with cosine similarity search",
      "Prompt orchestration injecting top 4 relevant chunks with strict hallucination guards",
      "Source verification showing page numbers and exact quote snippets for every AI answer"
    ],
    techStack: ["Python", "Google GenAI SDK (Gemini)", "ChromaDB", "PyPDF", "Streamlit/React"],
    skillsPracticed: ["RAG Architecture", "Vector Databases", "Prompt Engineering", "Semantic Search"],
    implementationSteps: [
      "1. Setup Gemini API key and initialize GoogleGenAI client.",
      "2. Parse PDF documents into clean textual passages with metadata tags.",
      "3. Generate embeddings and ingest vectors into ChromaDB collection.",
      "4. Build similarity search query runner returning top-k matching passages.",
      "5. Construct system prompt instructing Gemini to only synthesize from provided context.",
      "6. Build clean interactive chat interface highlighting source evidence cards."
    ],
    expectedOutcome: "A high-accuracy document research engine that eliminates AI hallucination by citing direct PDF paragraph references."
  },
  {
    id: "proj-3",
    title: "Autonomous ML Experiment & Monitoring Dashboard (MLOps)",
    level: "Advanced",
    problemStatement: "Production models degrade silently over time due to statistical data drift and concept drift in live traffic.",
    objective: "Architect a comprehensive MLOps pipeline with automated experiment tracking via MLflow, statistical drift detection, and continuous model re-training triggers.",
    features: [
      "Automated training pipeline logging hyperparameters, metrics, and artifact artifacts to MLflow",
      "Evidently AI integration detecting Kolmogorov-Smirnov distribution shifts in incoming feature streams",
      "Automated alerting webhook when prediction confidence drops below 85%",
      "Automated retraining job triggered on detected drift threshold",
      "Web telemetry dashboard displaying real-time model health metrics"
    ],
    techStack: ["Python", "MLflow", "Evidently AI", "PostgreSQL", "Docker", "GitHub Actions"],
    skillsPracticed: ["MLOps", "Model Monitoring", "Data Drift Detection", "Automated Pipelines"],
    implementationSteps: [
      "1. Instrument MLflow tracking server backed by local SQLite/PostgreSQL and local storage.",
      "2. Train multiple model iterations and log precision/recall curves and ROC metrics.",
      "3. Simulate production traffic with gradual covariate shift (e.g. sudden age/income distribution change).",
      "4. Run Evidently AI test suites to flag statistical data drift.",
      "5. Implement automated script to pull new data, retrain champion model, and compare against challenger model."
    ],
    expectedOutcome: "A national-hackathon-winning MLOps project demonstrating enterprise readiness and automated model reliability management."
  }
];

export const DEMO_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which evaluation metric is most appropriate for assessing a machine learning model on a heavily imbalanced dataset (e.g., 99% negative class)?",
    options: [
      "Overall Accuracy",
      "Precision-Recall AUC (PR-AUC) or F1-Score",
      "Mean Squared Error (MSE)",
      "R-Squared Score"
    ],
    correctAnswerIndex: 1,
    explanation: "When classes are highly imbalanced, overall accuracy is deceiving (a model predicting only the majority class achieves 99% accuracy). PR-AUC or F1-Score evaluates the balance between precision and recall on the minority target class.",
    difficulty: "Medium",
    topic: "Machine Learning Evaluation"
  },
  {
    id: 2,
    question: "In SQL, what is the key difference between a WHERE clause and a HAVING clause?",
    options: [
      "WHERE filters rows before aggregation; HAVING filters groups after aggregation",
      "WHERE is only used with strings; HAVING is used with numbers",
      "WHERE can only be used with JOINs; HAVING cannot",
      "There is no difference; they are aliases"
    ],
    correctAnswerIndex: 0,
    explanation: "WHERE filters individual table rows before any GROUP BY operations take place. HAVING filters aggregated group metrics (e.g. HAVING COUNT(*) > 5) after GROUP BY has executed.",
    difficulty: "Easy",
    topic: "SQL Fundamentals"
  },
  {
    id: 3,
    question: "What is the primary purpose of a Vector Database in a Retrieval-Augmented Generation (RAG) system?",
    options: [
      "To store relational customer tables with foreign keys",
      "To perform rapid k-nearest-neighbors similarity search across high-dimensional text embeddings",
      "To execute SQL queries faster than PostgreSQL",
      "To compress JPEG images without quality loss"
    ],
    correctAnswerIndex: 1,
    explanation: "Vector databases index high-dimensional embeddings using algorithms like HNSW to find semantically similar text passages in sub-millisecond time for LLM context injection.",
    difficulty: "Medium",
    topic: "Generative AI & RAG"
  },
  {
    id: 4,
    question: "Why is setting `responseMimeType: 'application/json'` and providing a structured `responseSchema` crucial when integrating Gemini into production systems?",
    options: [
      "It makes the Gemini model run 10x faster on CPU",
      "It guarantees the model outputs parseable, schema-compliant JSON rather than conversational markdown text",
      "It removes the need for an API key",
      "It converts text into images automatically"
    ],
    correctAnswerIndex: 1,
    explanation: "Schema-enforced JSON guarantees deterministic structure, allowing backend servers to parse and validate AI results without regex hacks or runtime crashes caused by unexpected conversational filler.",
    difficulty: "Easy",
    topic: "Gemini API Best Practices"
  },
  {
    id: 5,
    question: "In PyTorch, why is it necessary to call `optimizer.zero_grad()` before calling `loss.backward()` during training?",
    options: [
      "To reset model weights back to random values",
      "Because PyTorch accumulates gradients by default on every backward pass",
      "To clear the GPU memory cache",
      "To normalize the loss value between 0 and 1"
    ],
    correctAnswerIndex: 1,
    explanation: "PyTorch accumulates gradients across consecutive .backward() calls to support techniques like gradient accumulation. If zero_grad() is omitted, the gradients will sum across batches, causing inaccurate weight updates.",
    difficulty: "Hard",
    topic: "Deep Learning (PyTorch)"
  }
];
