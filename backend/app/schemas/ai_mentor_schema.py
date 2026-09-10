from pydantic import BaseModel, Field


# ============================================================
# AI MENTOR QUESTION
# ============================================================

class AIMentorChatMessage(BaseModel):
    role: str
    content: str = Field(min_length=1, max_length=5000)


class AIMentorQuestionRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    session_id: int | None = None
    chat_history: list[AIMentorChatMessage] = []


# ============================================================
# AI MENTOR ANSWER
# ============================================================

class AIMentorQuestionResponse(BaseModel):

    question: str

    answer: str

    sources: list[str]

    session_id: int


# ============================================================
# AI MENTOR DOCUMENT UPLOAD RESPONSE
# ============================================================

class AIMentorDocumentUploadResponse(BaseModel):

    document_id: str

    filename: str

    total_chunks: int

    message: str

class AIMentorDocumentResponse(BaseModel):
    document_id: int
    filename: str
    status: str
    total_chunks: int
    created_at: str


class AIMentorDocumentListResponse(BaseModel):
    documents: list[AIMentorDocumentResponse]


class AIMentorChatSessionCreateRequest(BaseModel):
    title: str = Field(
        default="New AI Mentor Chat",
        min_length=1,
        max_length=255
    )


class AIMentorChatSessionResponse(BaseModel):
    session_id: int
    title: str
    created_at: str
    updated_at: str


class AIMentorChatSessionListResponse(BaseModel):
    sessions: list[AIMentorChatSessionResponse]

class AIMentorChatMessageResponse(BaseModel):
    message_id: int
    role: str
    content: str
    created_at: str


class AIMentorChatSessionDetailResponse(BaseModel):
    session_id: int
    title: str
    created_at: str
    updated_at: str
    messages: list[AIMentorChatMessageResponse]