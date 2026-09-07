from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.dependencies.auth import require_role

from app.models.user import User

from app.services.mock_interview_service import (
    mock_interview_service
)

from app.schemas.mock_interview_schema import (
    MockInterviewCreateRequest,
    MockInterviewResponse,
    MockInterviewListResponse,
    MockInterviewDetailResponse,
    MockInterviewQuestionCreateRequest,
    MockInterviewQuestionResponse,
    MockInterviewAnswerRequest,
    MockInterviewAnswerResponse,
    MockInterviewCompleteResponse,
    MockInterviewPerformanceAnalyticsResponse
)


router = APIRouter(
    prefix="/preparation/mock-interviews",
    tags=["Mock Interviews"]
)


# ========================================================
# CREATE MOCK INTERVIEW
# ========================================================

@router.post(
    "",
    response_model=MockInterviewResponse
)
def create_mock_interview(
    request: MockInterviewCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return mock_interview_service.create_interview(
            db=db,
            user_id=current_user.id,
            interview_type=request.interview_type,
            difficulty=request.difficulty,
            total_questions=request.total_questions
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ========================================================
# GET STUDENT MOCK INTERVIEWS
# ========================================================

@router.get(
    "",
    response_model=MockInterviewListResponse
)
def get_mock_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    interviews = (
        mock_interview_service.get_user_interviews(
            db=db,
            user_id=current_user.id
        )
    )

    return {
        "items": interviews,
        "total": len(interviews)
    }


# ========================================================
# GET MOCK INTERVIEW PERFORMANCE ANALYTICS
# ========================================================

@router.get(
    "/analytics",
    response_model=MockInterviewPerformanceAnalyticsResponse
)
def get_mock_interview_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return (
            mock_interview_service
            .get_performance_analytics(
                db=db,
                user_id=current_user.id
            )
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ========================================================
# GET MOCK INTERVIEW DETAIL
# ========================================================

@router.get(
    "/{interview_id}",
    response_model=MockInterviewDetailResponse
)
def get_mock_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return mock_interview_service.get_interview_detail(
            db=db,
            user_id=current_user.id,
            interview_id=interview_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ========================================================
# GET INTERVIEW QUESTIONS
# ========================================================

@router.get(
    "/{interview_id}/questions",
    response_model=list[MockInterviewQuestionResponse]
)
def get_interview_questions(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return mock_interview_service.get_interview_questions(
            db=db,
            user_id=current_user.id,
            interview_id=interview_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ========================================================
# ADD INTERVIEW QUESTION
# ========================================================

@router.post(
    "/{interview_id}/questions",
    response_model=MockInterviewQuestionResponse
)
def add_interview_question(
    interview_id: int,
    request: MockInterviewQuestionCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return mock_interview_service.add_question(
            db=db,
            user_id=current_user.id,
            interview_id=interview_id,
            question=request.question,
            question_type=request.question_type,
            question_order=request.question_order,
            expected_answer=request.expected_answer
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ========================================================
# SUBMIT ANSWER
# ========================================================

@router.post(
    "/{interview_id}/questions/{question_id}/answer",
    response_model=MockInterviewAnswerResponse
)
def submit_interview_answer(
    interview_id: int,
    question_id: int,
    request: MockInterviewAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return mock_interview_service.submit_answer(
            db=db,
            user_id=current_user.id,
            interview_id=interview_id,
            question_id=question_id,
            student_answer=request.student_answer
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ========================================================
# COMPLETE MOCK INTERVIEW
# ========================================================

@router.post(
    "/{interview_id}/complete",
    response_model=MockInterviewCompleteResponse
)
def complete_mock_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return mock_interview_service.complete_interview(
            db=db,
            user_id=current_user.id,
            interview_id=interview_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ========================================================
# DELETE MOCK INTERVIEW
# ========================================================

@router.delete(
    "/{interview_id}",
    status_code=204
)
def delete_mock_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        mock_interview_service.delete_interview(
            db=db,
            user_id=current_user.id,
            interview_id=interview_id
        )

        return None

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )