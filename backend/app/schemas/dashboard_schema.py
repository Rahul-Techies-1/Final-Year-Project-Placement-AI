from pydantic import BaseModel
from datetime import datetime


class ApplicationStatusAnalytics(BaseModel):

    applied: int

    shortlisted: int

    interview_scheduled: int

    rejected: int

    hired: int


class RecruiterDashboardResponse(BaseModel):

    total_jobs: int

    active_jobs: int

    total_applications: int

    shortlisted: int

    interviews: int

    hired: int

    application_status: ApplicationStatusAnalytics


class RecentApplicationResponse(BaseModel):

    application_id: int

    student_id: int

    job_id: int

    job_title: str

    company: str

    status: str


class UpcomingInterviewResponse(BaseModel):

    interview_id: int

    application_id: int

    scheduled_at: datetime

    interview_type: str

    meeting_link: str | None

    status: str


class RecruiterDashboardOverviewResponse(BaseModel):

    statistics: RecruiterDashboardResponse

    recent_applications: list[
        RecentApplicationResponse
    ]

    upcoming_interviews: list[
        UpcomingInterviewResponse
    ]


class PaginatedRecentApplicationsResponse(BaseModel):

    items: list[RecentApplicationResponse]

    page: int

    limit: int

    total: int

    total_pages: int