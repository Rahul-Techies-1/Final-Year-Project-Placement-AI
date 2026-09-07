from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.services.aptitude_service import (
    aptitude_service
)

from app.schemas.aptitude_schema import (
    AptitudeTopicResponse,
    AptitudeQuestionWithProgressResponse,
    AptitudeProgressResponse,
    AptitudeProgressUpdateRequest,
    AptitudeOverviewResponse,
    AptitudeQuestionListResponse,
    AptitudeAnswerRequest,
    AptitudeAnswerResponse,
)

from app.dependencies.auth import require_role
from app.models.user import User


router = APIRouter(
    prefix="/preparation/aptitude",
    tags=["Aptitude Preparation"]
)


# ========================================================
# APTITUDE OVERVIEW
# ========================================================

@router.get(
    "/overview",
    response_model=AptitudeOverviewResponse
)
def get_aptitude_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    return aptitude_service.get_aptitude_overview(
        db=db,
        user_id=current_user.id
    )


# ========================================================
# GET APTITUDE TOPICS
# ========================================================

@router.get(
    "/topics",
    response_model=list[AptitudeTopicResponse]
)
def get_aptitude_topics(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    return aptitude_service.get_aptitude_topics(
        db=db
    )


# ========================================================
# GET APTITUDE QUESTIONS
# ========================================================

@router.get(
    "/questions",
    response_model=AptitudeQuestionListResponse
)
def get_aptitude_questions(
    topic_id: int | None = Query(
        default=None
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return aptitude_service.get_aptitude_questions(
            db=db,
            user_id=current_user.id,
            topic_id=topic_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ========================================================
# GET SINGLE APTITUDE QUESTION
# ========================================================

@router.get(
    "/questions/{question_id}",
    response_model=AptitudeQuestionWithProgressResponse
)
def get_aptitude_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return aptitude_service.get_aptitude_question(
            db=db,
            user_id=current_user.id,
            question_id=question_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ========================================================
# SUBMIT APTITUDE ANSWER
# ========================================================

@router.post(
    "/questions/{question_id}/answer",
    response_model=AptitudeAnswerResponse
)
def submit_aptitude_answer(
    question_id: int,
    request: AptitudeAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return aptitude_service.submit_aptitude_answer(
            db=db,
            user_id=current_user.id,
            question_id=question_id,
            answer=request.answer
        )

    except ValueError as e:

        message = str(e)

        if message == "Aptitude question not found.":

            raise HTTPException(
                status_code=404,
                detail=message
            )

        raise HTTPException(
            status_code=400,
            detail=message
        )


# ========================================================
# UPDATE APTITUDE PROGRESS
# ========================================================

@router.put(
    "/questions/{question_id}/progress",
    response_model=AptitudeProgressResponse
)
def update_aptitude_progress(
    question_id: int,
    request: AptitudeProgressUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return aptitude_service.update_aptitude_progress(
            db=db,
            user_id=current_user.id,
            question_id=question_id,
            completed=request.completed
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ========================================================
# MARK QUESTION COMPLETED
# ========================================================

@router.post(
    "/questions/{question_id}/complete",
    response_model=AptitudeProgressResponse
)
def mark_question_completed(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return aptitude_service.mark_question_completed(
            db=db,
            user_id=current_user.id,
            question_id=question_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ========================================================
# MARK QUESTION INCOMPLETE
# ========================================================

@router.post(
    "/questions/{question_id}/incomplete",
    response_model=AptitudeProgressResponse
)
def mark_question_incomplete(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return aptitude_service.mark_question_incomplete(
            db=db,
            user_id=current_user.id,
            question_id=question_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )