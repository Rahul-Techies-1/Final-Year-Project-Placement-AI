from pydantic import BaseModel


class RecruiterApplicationAnalyticsResponse(BaseModel):

    total_applications: int

    applied: int

    shortlisted: int

    interview_scheduled: int

    rejected: int

    hired: int