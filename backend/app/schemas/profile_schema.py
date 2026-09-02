from pydantic import BaseModel, Field


class StudentProfileUpdateRequest(BaseModel):

    college: str | None = None

    branch: str | None = None

    semester: int | None = Field(
        default=None,
        ge=1,
        le=8
    )

    skills: str | None = None

    bio: str | None = None


class StudentProfileResponse(BaseModel):

    id: int

    full_name: str

    email: str

    role: str

    college: str | None

    branch: str | None

    semester: int | None

    skills: str | None

    bio: str | None

    class Config:
        from_attributes = True