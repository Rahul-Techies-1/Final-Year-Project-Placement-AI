# PlacementAI 🚀

> **PlacementAI** is an AI-powered placement preparation and campus recruitment platform connecting students and recruiters. It offers AI-guided mock interviews, RAG-based AI mentorship, topic-specific preparation modules (DSA, SQL, Core CS, Aptitude), and recruitment pipeline workflows.

---

## 📑 Table of Contents

- [System Architecture](#system-architecture)
- [Project Directory Structure](#project-directory-structure)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
  - [Student Portal](#student-portal)
  - [Recruiter Portal](#recruiter-portal)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Database Migrations & Seeding](#database-migrations--seeding)
- [Environment Configuration](#environment-configuration)
- [API Endpoints Overview](#api-endpoints-overview)

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)              │
│       Student Portal        │      Recruiter Portal    │
└─────────────────────────────┬──────────────────────────┘
                              │ REST API / JSON
┌─────────────────────────────▼──────────────────────────┐
│                   Backend (FastAPI)                    │
│   Auth & RBAC  │  Prep Engine  │  Recruitment Pipeline │
└─────────┬───────────────────┬──────────────────┬───────┘
          │                   │                  │
┌─────────▼────────┐  ┌───────▼────────┐  ┌──────▼───────┐
│ PostgreSQL (ORM) │  │ ChromaDB (RAG) │  │ Hugging Face │
│ Relational Data  │  │ Vector Embeds  │  │ LLM Engine   │
└──────────────────┘  └────────────────┘  └──────────────┘
```

---

## 📂 Project Directory Structure

```plaintext
Placement AI/
├── backend/                        # FastAPI Backend Application
│   ├── alembic/                    # Database migrations (Alembic)
│   │   ├── versions/               # Migration revision scripts
│   │   └── env.py                  # Alembic environment runner
│   ├── app/
│   │   ├── config/                 # Pydantic environment settings
│   │   ├── core/                   # Security (JWT, bcrypt) & hashing
│   │   ├── data/                   # Mock interview question banks
│   │   ├── database/               # Engine, Base, and Session handling
│   │   ├── dependencies/           # Auth and DB dependency injections
│   │   ├── exceptions/             # Custom exceptions and HTTP handlers
│   │   ├── models/                 # SQLAlchemy ORM models
│   │   ├── repositories/           # Data access layer (CRUD)
│   │   ├── routers/                # FastAPI APIRouters (Auth, Jobs, Prep, etc.)
│   │   ├── schemas/                # Pydantic request & response schemas
│   │   ├── seed/                   # Data seeding scripts (Aptitude, Core CS, DSA)
│   │   ├── services/               # Business logic & AI orchestration
│   │   └── utils/                  # Utility helpers & seed runners
│   ├── chroma_db/                  # Chroma vector database storage for RAG
│   ├── requirements.txt            # Python dependencies
│   ├── alembic.ini                 # Alembic configuration
│   └── vercel.json                 # Deployment configuration
│
├── frontend/                       # React 19 + Vite Frontend Application
│   ├── public/                     # Static assets (favicons, svg icons)
│   ├── src/
│   │   ├── api/                    # Axios client instance configuration
│   │   ├── components/             # Reusable UI components
│   │   │   ├── common/             # Layout wrappers (StudentLayout)
│   │   │   └── dashboard/          # Analytics & dashboard cards
│   │   ├── context/                # Authentication & User State context
│   │   ├── pages/
│   │   │   ├── auth/               # Login & Registration pages
│   │   │   ├── recruiter/          # Recruiter dashboards, jobs, interviews
│   │   │   └── student/            # Student dashboard, jobs, applications
│   │   │       └── preparation/    # DSA, SQL, Core CS, Aptitude, Mock Interviews, AI Mentor
│   │   ├── routes/                 # Protected routes & React Router config
│   │   ├── services/               # Frontend API service wrappers
│   │   └── styles/                 # Global and modular CSS stylesheets
│   ├── index.html                  # HTML entry point
│   ├── package.json                # Dependencies and scripts
│   └── vite.config.js              # Vite configuration
│
└── README.md                       # Project documentation
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **ORM & Migrations**: [SQLAlchemy](https://www.sqlalchemy.org/) & [Alembic](https://alembic.sqlalchemy.org/)
- **Database**: PostgreSQL
- **Vector Database**: [ChromaDB](https://www.trychroma.com/) (RAG Document Store)
- **AI / LLM Integration**: [Hugging Face Hub Inference API](https://huggingface.co/docs/huggingface_hub/en/index), `sentence-transformers`, `pypdf`
- **Authentication**: JWT (JSON Web Tokens) with `python-jose` and `passlib[bcrypt]`

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ✨ Key Features

### 🎓 Student Portal
1. **Interactive Preparation Modules**:
   - **DSA**: Topic-wise problem tracking, status updates, external challenge links.
   - **SQL**: Database problem sets, schema visualizers, and query practice.
   - **Core CS**: Subject-based preparation covering OS, DBMS, Networks, and OOP.
   - **Aptitude**: Quantitative, Logical, and Verbal practice questions with solutions.
2. **AI Mock Interviews**:
   - Role-specific interview generation with simulated rounds.
   - Answer submission, scoring, and instant AI-driven performance evaluations.
3. **AI Mentor (RAG)**:
   - Upload syllabus or placement documents (PDFs).
   - Context-aware question answering powered by ChromaDB vector similarity and LLM inference.
4. **Job Search & Applications**:
   - Browse job postings with eligibility filters.
   - One-click application submission and application lifecycle tracking.

### 🏢 Recruiter Portal
1. **Job Management**: Create, edit, activate, or archive job postings.
2. **Application Tracking (ATS)**: Review candidate applications, change statuses (`Applied`, `Shortlisted`, `Interview Scheduled`, `Hired`, `Rejected`).
3. **Interview Scheduling**: Schedule candidate interviews and track rounds.
4. **Recruiter Analytics**: Overview of candidate pipeline metrics and application conversion rates.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- PostgreSQL database instance

---

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # Linux / macOS
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file inside `backend/`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/placement_ai
   SECRET_KEY=your_super_secret_jwt_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   HF_TOKEN=your_huggingface_api_token
   HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2
   ```

5. **Apply database migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Seed preparation data (Optional)**:
   ```bash
   python -m app.seed.dsa_seed
   python -m app.seed.core_cs_seed
   python -m app.seed.aptitude_seed
   python -m app.utils.seed_sql_data
   ```

7. **Start the API server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Interactive Swagger docs will be available at: `http://localhost:8000/docs`

---

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be running at: `http://localhost:5173`

---

## 📡 API Endpoints Overview

| Module | Route Prefix | Key Responsibilities |
| :--- | :--- | :--- |
| **Auth** | `/auth` | User registration, login, token issuance |
| **Profile** | `/profile` | Candidate & recruiter profile management |
| **Jobs** | `/jobs` | Job listings, filters, job creation, job status |
| **Applications** | `/applications` | Application submissions, candidate pipeline statuses |
| **Interviews** | `/interviews` | Interview scheduling, candidate interviews list |
| **DSA Prep** | `/preparation/dsa` | Topics, problem listings, completion tracking |
| **SQL Prep** | `/preparation/sql` | SQL topics, problem sets, and submission verification |
| **Core CS** | `/preparation/core-cs`| Topic & problem coverage for OS, DBMS, CN, OOP |
| **Aptitude** | `/preparation/aptitude`| Question sets and aptitude practice tracking |
| **Mock Interviews** | `/mock-interviews` | AI interview session initiation, questions, evaluation |
| **AI Mentor** | `/ai-mentor` | Document upload, vector indexing, AI conversational guidance |
| **Dashboards** | `/student/dashboard`, `/recruiter/dashboard` | Aggregated user metrics, upcoming interviews, analytics |
