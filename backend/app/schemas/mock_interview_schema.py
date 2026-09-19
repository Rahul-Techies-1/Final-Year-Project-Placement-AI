from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ============================================================
# CREATE MOCK INTERVIEW REQUEST
# ============================================================

class MockInterviewCreateRequest(BaseModel):

    interview_type: str

    difficulty: str

    total_questions: int


# ============================================================
# MOCK INTERVIEW QUESTION RESPONSE
# ============================================================

class MockInterviewQuestionResponse(BaseModel):

    id: int

    interview_id: int

    question: str

    question_type: str

    question_order: int

    # Do NOT expose expected_answer to the student.
    # It should remain internal for evaluation.

    student_answer: str | None = None

    score: int | None = None

    feedback: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# MOCK INTERVIEW RESPONSE
# ============================================================

class MockInterviewResponse(BaseModel):

    id: int

    user_id: int

    interview_type: str

    difficulty: str

    total_questions: int

    questions_answered: int

    score: int | None = None

    status: str

    started_at: datetime

    completed_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# MOCK INTERVIEW DETAIL RESPONSE
# ============================================================

class MockInterviewDetailResponse(BaseModel):

    id: int

    user_id: int

    interview_type: str

    difficulty: str

    total_questions: int

    questions_answered: int

    score: int | None = None

    status: str

    started_at: datetime

    completed_at: datetime | None = None

    questions: list[
        MockInterviewQuestionResponse
    ]


# ============================================================
# ADD INTERVIEW QUESTION REQUEST
# ============================================================

class MockInterviewQuestionCreateRequest(BaseModel):

    question: str

    question_type: str

    question_order: int

    expected_answer: str | None = None


# ============================================================
# SUBMIT ANSWER REQUEST
# ============================================================

class MockInterviewAnswerRequest(BaseModel):

    student_answer: str


# ============================================================
# SUBMIT ANSWER RESPONSE
# ============================================================

class MockInterviewAnswerResponse(BaseModel):

    question_id: int

    student_answer: str

    score: int | None = None

    feedback: str | None = None

    completed: bool


# ============================================================
# COMPLETE INTERVIEW RESPONSE
# ============================================================

class MockInterviewCompleteResponse(BaseModel):

    interview_id: int

    status: str

    total_questions: int

    questions_answered: int

    score: int | None = None

    completed_at: datetime | None = None


# ============================================================
# INTERVIEW LIST RESPONSE
# ============================================================

class MockInterviewListResponse(BaseModel):

    items: list[
        MockInterviewResponse
    ]

    total: int


# ============================================================
# RECENT INTERVIEW ANALYTICS ITEM
# ============================================================

class MockInterviewRecentItem(BaseModel):

    id: int

    interview_type: str

    difficulty: str

    status: str

    total_questions: int

    questions_answered: int

    score: int | None = None

    started_at: datetime

    completed_at: datetime | None = None


# ============================================================
# MOCK INTERVIEW PERFORMANCE ANALYTICS RESPONSE
# ============================================================

# ============================================================
# MOCK INTERVIEW PERFORMANCE ANALYTICS RESPONSE
# ============================================================

class MockInterviewPerformanceAnalyticsResponse(BaseModel):

    total_interviews: int

    completed_interviews: int

    in_progress_interviews: int

    average_score: float | None = None

    best_score: float | None = None

    total_questions: int

    total_questions_answered: int

    answer_rate: float

    completion_rate: float

    technical_average_score: float | None = None

    hr_average_score: float | None = None

    recent_interviews: list[dict] = []