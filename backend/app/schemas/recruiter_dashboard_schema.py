from datetime import datetime

from pydantic import BaseModel


# ============================================================
# RECRUITER DASHBOARD STATS
# ============================================================

class RecruiterDashboardStats(BaseModel):

    total_jobs: int

    active_jobs: int

    total_applications: int

    applied: int

    shortlisted: int

    interview_scheduled: int

    rejected: int

    hired: int


# ============================================================
# RECENT APPLICATION
# ============================================================

class RecruiterRecentApplication(BaseModel):

    id: int

    student_id: int

    job_id: int

    job_title: str

    status: str

    applied_at: datetime


# ============================================================
# RECRUITER DASHBOARD RESPONSE
# ============================================================

class RecruiterDashboardResponse(BaseModel):

    stats: RecruiterDashboardStats

    recent_applications: list[
        RecruiterRecentApplication
    ]