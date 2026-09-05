from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ============================================================
# CORE CS TOPIC RESPONSE
# ============================================================

class CoreCSTopicResponse(BaseModel):

    id: int

    name: str

    description: str | None = None

    display_order: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# CORE CS PROBLEM RESPONSE
# ============================================================

class CoreCSProblemResponse(BaseModel):

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
# CORE CS PROBLEM WITH STUDENT PROGRESS
# ============================================================

class CoreCSProblemWithProgressResponse(BaseModel):

    id: int

    topic_id: int

    title: str

    description: str

    difficulty: str

    external_url: str | None = None

    completed: bool

    completed_at: datetime | None = None


# ============================================================
# CORE CS PROGRESS RESPONSE
# ============================================================

class CoreCSProgressResponse(BaseModel):

    id: int

    user_id: int

    problem_id: int

    completed: bool

    completed_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# CORE CS PROGRESS UPDATE REQUEST
# ============================================================

class CoreCSProgressUpdateRequest(BaseModel):

    completed: bool


# ============================================================
# CORE CS PROGRESS SUMMARY
# ============================================================

class CoreCSProgressSummaryResponse(BaseModel):

    total_problems: int

    completed_problems: int

    remaining_problems: int

    progress_percentage: float


# ============================================================
# CORE CS OVERVIEW RESPONSE
# ============================================================

class CoreCSOverviewResponse(BaseModel):

    progress: CoreCSProgressSummaryResponse

    topics: list[
        CoreCSTopicResponse
    ]


# ============================================================
# CORE CS PROBLEM LIST RESPONSE
# ============================================================

class CoreCSProblemListResponse(BaseModel):

    items: list[
        CoreCSProblemWithProgressResponse
    ]

    total: int

    completed: int

    remaining: int