from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ============================================================
# DSA TOPIC RESPONSE
# ============================================================

class DSATopicResponse(BaseModel):

    id: int

    name: str

    description: str | None = None

    display_order: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# DSA PROBLEM RESPONSE
# ============================================================

class DSAProblemResponse(BaseModel):

    id: int

    topic_id: int

    title: str

    description: str

    difficulty: str

    external_url: str | None = None

    is_active: bool

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# DSA PROBLEM WITH STUDENT PROGRESS
# ============================================================

class DSAProblemWithProgressResponse(BaseModel):

    id: int

    topic_id: int

    title: str

    description: str

    difficulty: str

    external_url: str | None = None

    completed: bool

    completed_at: datetime | None = None


# ============================================================
# DSA PROGRESS RESPONSE
# ============================================================

class DSAProgressResponse(BaseModel):

    id: int

    user_id: int

    problem_id: int

    completed: bool

    completed_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# DSA PROGRESS UPDATE REQUEST
# ============================================================

class DSAProgressUpdateRequest(BaseModel):

    completed: bool


# ============================================================
# DSA PROGRESS SUMMARY
# ============================================================

class DSAProgressSummaryResponse(BaseModel):

    total_problems: int

    completed_problems: int

    remaining_problems: int

    progress_percentage: float


# ============================================================
# DSA OVERVIEW RESPONSE
# ============================================================

class DSAOverviewResponse(BaseModel):

    progress: DSAProgressSummaryResponse

    topics: list[
        DSATopicResponse
    ]


# ============================================================
# DSA PROBLEM LIST RESPONSE
# ============================================================

class DSAProblemListResponse(BaseModel):

    items: list[
        DSAProblemWithProgressResponse
    ]

    total: int

    completed: int

    remaining: int