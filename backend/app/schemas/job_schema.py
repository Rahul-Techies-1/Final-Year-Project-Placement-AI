from pydantic import BaseModel, Field


# ============================================================
# CREATE JOB
# ============================================================

class JobCreateRequest(BaseModel):

    title: str = Field(
        ...,
        min_length=3,
        max_length=200
    )

    company: str = Field(
        ...,
        min_length=2,
        max_length=200
    )

    location: str

    salary: int | None = None

    description: str

    requirements: str


# ============================================================
# JOB RESPONSE
# ============================================================

class JobResponse(BaseModel):

    id: int

    title: str

    company: str

    location: str

    salary: int | None

    description: str

    requirements: str

    posted_by: int

    is_active: bool

    class Config:
        from_attributes = True


# ============================================================
# UPDATE JOB
# ============================================================

class JobUpdateRequest(BaseModel):

    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=200
    )

    company: str | None = Field(
        default=None,
        min_length=2,
        max_length=200
    )

    location: str | None = None

    salary: int | None = None

    description: str | None = None

    requirements: str | None = None

    is_active: bool | None = None