from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.dependencies.auth import require_role

from app.schemas.ai_mentor_schema import (
    AIMentorChatSessionCreateRequest,
    AIMentorChatSessionResponse,
    AIMentorChatSessionDetailResponse,
    AIMentorChatSessionListResponse,
    AIMentorDocumentListResponse,
    AIMentorDocumentUploadResponse,
    AIMentorQuestionRequest,
    AIMentorQuestionResponse,
)

from app.services.ai_mentor_service import (
    ai_mentor_service,
)


# ========================================================
# ROUTER
# ========================================================

router = APIRouter(
    prefix="/preparation/ai-mentor",
    tags=["AI Mentor"]
)


# ========================================================
# UPLOAD PDF
# ========================================================

@router.post(
    "/upload",
    response_model=AIMentorDocumentUploadResponse
)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("student")
    )
):

    try:

        result = await (
            ai_mentor_service
            .upload_document(
                db=db,
                student_id=current_user.id,
                file=file
            )
        )

        return result

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )


# ========================================================
# ASK AI MENTOR
# ========================================================

@router.post(
    "/ask",
    response_model=AIMentorQuestionResponse
)
def ask_ai_mentor(
    request: AIMentorQuestionRequest,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("student")
    )
):

    try:

        result = (
            ai_mentor_service
            .ask_question(
                student_id=current_user.id,
                question=request.question,
                session_id=request.session_id,
                chat_history=[
                    {
                        "role": message.role,
                        "content": message.content
                    }
                    for message in request.chat_history
                ]
            )
        )

        return result

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

@router.post(
    "/sessions",
    response_model=AIMentorChatSessionResponse
)
def create_chat_session(
    request: AIMentorChatSessionCreateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("student"))
):

    try:

        session = (
            ai_mentor_service
            .create_chat_session(
                db=db,
                student_id=current_user.id,
                title=request.title
            )
        )

        return {
            "session_id": session.id,
            "title": session.title,
            "created_at": session.created_at.isoformat(),
            "updated_at": session.updated_at.isoformat()
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )


@router.get(
    "/sessions",
    response_model=AIMentorChatSessionListResponse
)
def get_chat_sessions(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("student"))
):

    sessions = (
        ai_mentor_service
        .get_chat_sessions(
            db=db,
            student_id=current_user.id
        )
    )

    return {
        "sessions": [
            {
                "session_id": session.id,
                "title": session.title,
                "created_at": session.created_at.isoformat(),
                "updated_at": session.updated_at.isoformat()
            }
            for session in sessions
        ]
    }


@router.get(
    "/sessions/{session_id}",
    response_model=AIMentorChatSessionDetailResponse
)
def get_chat_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("student"))
):

    try:

        session, messages = (
            ai_mentor_service
            .get_chat_session(
                db=db,
                student_id=current_user.id,
                session_id=session_id
            )
        )

        return {
            "session_id": session.id,
            "title": session.title,
            "created_at": session.created_at.isoformat(),
            "updated_at": session.updated_at.isoformat(),
            "messages": [
                {
                    "message_id": message.id,
                    "role": message.role,
                    "content": message.content,
                    "created_at": message.created_at.isoformat()
                }
                for message in messages
            ]
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc)
        )


@router.delete("/sessions/{session_id}")
def delete_chat_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("student"))
):

    try:

        return (
            ai_mentor_service
            .delete_chat_session(
                db=db,
                student_id=current_user.id,
                session_id=session_id
            )
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc)
        )


# ========================================================
# GET USER DOCUMENTS
# ========================================================

@router.get(
    "/documents",
    response_model=AIMentorDocumentListResponse
)
def get_ai_mentor_documents(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("student")
    )
):

    documents = (
        ai_mentor_service
        .get_user_documents(
            db=db,
            student_id=current_user.id
        )
    )


    return {

        "documents": [

            {
                "document_id": document.id,
                "filename": document.original_filename,
                "status": document.status,
                "total_chunks": document.chunk_count,
                "created_at": (
                    document.created_at.isoformat()
                )
            }

            for document in documents

        ]

    }


# ========================================================
# DELETE DOCUMENT
# ========================================================

@router.delete(
    "/documents/{document_id}"
)
def delete_ai_mentor_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("student")
    )
):

    try:

        result = (
            ai_mentor_service
            .delete_document(
                db=db,
                student_id=current_user.id,
                document_id=document_id
            )
        )

        return result

    except ValueError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc)
        )