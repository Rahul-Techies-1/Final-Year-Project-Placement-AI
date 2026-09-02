from pydantic import BaseModel
from datetime import datetime


# ============================================================
# STUDENT APPLICATION STATUS ANALYTICS
# ============================================================

class StudentApplicationStatusAnalytics(BaseModel):

    applied: int

    shortlisted: int

    interview_scheduled: int

    rejected: int

    hired: int


# ============================================================
# STUDENT DASHBOARD STATISTICS
# ============================================================

class StudentDashboardResponse(BaseModel):

    total_applications: int

    applied: int

    shortlisted: int

    interview_scheduled: int

    rejected: int

    hired: int

    total_interviews: int


# ============================================================
# STUDENT RECENT APPLICATION
# ============================================================

class StudentRecentApplicationResponse(BaseModel):

    application_id: int

    job_id: int

    job_title: str

    company: str

    location: str

    status: str


# ============================================================
# STUDENT UPCOMING INTERVIEW
# ============================================================

class StudentUpcomingInterviewResponse(BaseModel):

    interview_id: int

    application_id: int

    scheduled_at: datetime

    interview_type: str

    meeting_link: str | None

    status: str


# ============================================================
# STUDENT RECENT APPLICATIONS PAGINATION
# ============================================================

class StudentPaginatedApplicationsResponse(BaseModel):

    items: list[
        StudentRecentApplicationResponse
    ]

    page: int

    limit: int

    total: int

    total_pages: int


# ============================================================
# COMPLETE STUDENT DASHBOARD OVERVIEW
# ============================================================

class StudentDashboardOverviewResponse(BaseModel):

    statistics: StudentDashboardResponse

    recent_applications: list[
        StudentRecentApplicationResponse
    ]

    upcoming_interviews: list[
        StudentUpcomingInterviewResponse
    ]