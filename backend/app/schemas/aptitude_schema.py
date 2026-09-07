from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ============================================================
# APTITUDE TOPIC RESPONSE
# ============================================================

class AptitudeTopicResponse(BaseModel):

    id: int

    name: str

    description: str | None = None

    display_order: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# APTITUDE QUESTION RESPONSE
# ============================================================

class AptitudeQuestionResponse(BaseModel):

    id: int

    topic_id: int

    question: str

    option_a: str

    option_b: str

    option_c: str

    option_d: str

    difficulty: str

    is_active: bool

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# APTITUDE QUESTION WITH STUDENT PROGRESS
# ============================================================

class AptitudeQuestionWithProgressResponse(BaseModel):

    id: int

    topic_id: int

    question: str

    option_a: str

    option_b: str

    option_c: str

    option_d: str

    difficulty: str

    completed: bool

    completed_at: datetime | None = None


# ============================================================
# APTITUDE ANSWER REQUEST
# ============================================================

class AptitudeAnswerRequest(BaseModel):

    answer: str


# ============================================================
# APTITUDE ANSWER RESPONSE
# ============================================================

class AptitudeAnswerResponse(BaseModel):

    question_id: int

    selected_answer: str

    correct_answer: str

    is_correct: bool

    explanation: str | None = None

    completed: bool


# ============================================================
# APTITUDE PROGRESS RESPONSE
# ============================================================

class AptitudeProgressResponse(BaseModel):

    id: int

    user_id: int

    question_id: int

    completed: bool

    completed_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# APTITUDE PROGRESS UPDATE REQUEST
# ============================================================

class AptitudeProgressUpdateRequest(BaseModel):

    completed: bool


# ============================================================
# APTITUDE PROGRESS SUMMARY
# ============================================================

class AptitudeProgressSummaryResponse(BaseModel):

    total_questions: int

    completed_questions: int

    remaining_questions: int

    progress_percentage: float


# ============================================================
# APTITUDE OVERVIEW RESPONSE
# ============================================================

class AptitudeOverviewResponse(BaseModel):

    progress: AptitudeProgressSummaryResponse

    topics: list[AptitudeTopicResponse]


# ============================================================
# APTITUDE QUESTION LIST RESPONSE
# ============================================================

class AptitudeQuestionListResponse(BaseModel):

    items: list[
        AptitudeQuestionWithProgressResponse
    ]

    total: int

    completed: int

    remaining: int