from pydantic import BaseModel
from datetime import datetime
from typing import Literal


# ============================================================
# CREATE APPLICATION
# ============================================================

class ApplicationCreateRequest(BaseModel):

    job_id: int


# ============================================================
# APPLICATION RESPONSE
# ============================================================

class ApplicationResponse(BaseModel):

    id: int

    student_id: int

    job_id: int

    status: str

    applied_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# UPDATE APPLICATION STATUS
# ============================================================

class ApplicationStatusUpdateRequest(BaseModel):

    status: Literal[
        "Applied",
        "Shortlisted",
        "Interview Scheduled",
        "Rejected",
        "Hired"
    ]


# ============================================================
# STUDENT - MY APPLICATIONS
# ============================================================

class MyApplicationResponse(BaseModel):

    id: int

    job_id: int

    job_title: str

    company: str

    location: str

    status: str

    class Config:
        from_attributes = True


# ============================================================
# APPLICATION STATISTICS
# ============================================================

class ApplicationStatsResponse(BaseModel):

    total: int

    applied: int

    shortlisted: int

    interview_scheduled: int

    rejected: int

    hired: int


# ============================================================
# APPLICATION DETAILS
# ============================================================

class ApplicationDetailResponse(BaseModel):

    id: int

    student_id: int

    job_id: int

    job_title: str

    company: str

    location: str

    job_description: str

    status: str

    applied_at: datetime

    class Config:
        from_attributes = True

# ============================================================
# RECRUITER - CANDIDATE APPLICATION RESPONSE
# ============================================================

class RecruiterApplicationResponse(BaseModel):

    id: int

    student_id: int

    student_name: str

    student_email: str

    college: str | None

    branch: str | None

    semester: int | None

    skills: str | None

    bio: str | None

    job_id: int

    status: str

    applied_at: datetime

    class Config:
        from_attributes = True