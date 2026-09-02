from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


# ============================================================
# CREATE INTERVIEW
# ============================================================

class InterviewCreateRequest(BaseModel):

    application_id: int = Field(
        ...,
        gt=0
    )

    scheduled_at: datetime

    interview_type: str = Field(
        ...,
        min_length=2,
        max_length=50
    )

    meeting_link: str | None = None


# ============================================================
# INTERVIEW RESPONSE
# ============================================================

class InterviewResponse(BaseModel):

    id: int

    application_id: int

    scheduled_at: datetime

    interview_type: str

    status: str

    meeting_link: str | None

    interviewer_notes: str | None

    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# STUDENT - INTERVIEW RESPONSE
# ============================================================

class StudentInterviewResponse(BaseModel):

    id: int

    application_id: int

    job_id: int

    job_title: str

    company: str

    scheduled_at: datetime

    interview_type: str

    status: str

    meeting_link: str | None

    interviewer_notes: str | None

    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# INTERVIEW LIST RESPONSE
# ============================================================

class InterviewListResponse(BaseModel):

    items: list[InterviewResponse]

    total: int

    page: int

    limit: int

    total_pages: int


# ============================================================
# UPDATE INTERVIEW STATUS
# ============================================================

class InterviewStatusUpdateRequest(BaseModel):

    status: Literal[
        "scheduled",
        "completed",
        "cancelled"
    ]