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
# MOCK INTERVIEW PERFORMANCE ANALYTICS
# ============================================================

# ============================================================
# MOCK INTERVIEW PERFORMANCE ANALYTICS
# ============================================================

class MockInterviewPerformanceAnalyticsResponse(BaseModel):

    total_interviews: int

    completed_interviews: int

    in_progress_interviews: int

    average_score: float | None = None

    best_score: float | None = None

    total_questions: int

    total_questions_answered: int

    answer_rate: int

    completion_rate: int

    technical_average_score: float | None = None

    hr_average_score: float | None = None

    recent_interviews: list = []


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

    mock_interview_analytics: (
        MockInterviewPerformanceAnalyticsResponse
    )