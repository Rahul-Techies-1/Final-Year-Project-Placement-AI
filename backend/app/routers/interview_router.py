from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.dependencies.auth import (
    get_current_user,
    require_role,
)

from app.models.user import User

from app.schemas.interview_schema import (
    InterviewCreateRequest,
    InterviewResponse,
    InterviewListResponse,
    InterviewStatusUpdateRequest,
    StudentInterviewResponse,
)

from app.services.interview_service import interview_service


router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"]
)


# ============================================================
# RECRUITER - CREATE INTERVIEW
# ============================================================

@router.post(
    "",
    response_model=InterviewResponse,
    status_code=status.HTTP_201_CREATED
)
def create_interview(
    request: InterviewCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    )
):

    try:

        return interview_service.create_interview(
            db,
            request,
            current_user
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ============================================================
# RECRUITER - GET ALL INTERVIEWS
# ============================================================

@router.get(
    "",
    response_model=InterviewListResponse
)
def get_all_interviews(
    page: int = 1,
    limit: int = 10,
    status: str | None = None,
    interview_type: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    )
):

    if page < 1:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page must be greater than or equal to 1."
        )

    if limit < 1 or limit > 100:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 100."
        )

    return interview_service.get_all_interviews(
        db,
        page,
        limit,
        status,
        interview_type,
        current_user.id
    )


# ============================================================
# STUDENT - GET MY INTERVIEWS
# ============================================================

@router.get(
    "/my",
    response_model=list[StudentInterviewResponse]
)
def get_my_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    return interview_service.get_student_interviews(
        db,
        current_user.id
    )


# ============================================================
# GET INTERVIEW BY ID
# ============================================================

@router.get(
    "/{interview_id}",
    response_model=InterviewResponse
)
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    try:

        interview = interview_service.get_interview(
            db,
            interview_id,
            current_user
        )

        if not interview:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview not found."
            )

        return interview

    except PermissionError as e:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


# ============================================================
# RECRUITER - UPDATE INTERVIEW STATUS
# ============================================================

@router.patch(
    "/{interview_id}/status",
    response_model=InterviewResponse
)
def update_interview_status(
    interview_id: int,
    request: InterviewStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    )
):

    try:

        interview = interview_service.update_status(
            db,
            interview_id,
            request,
            current_user.id
        )

        return interview

    except PermissionError as e:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ============================================================
# RECRUITER - DELETE INTERVIEW
# ============================================================

@router.delete(
    "/{interview_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    )
):

    try:

        interview_service.delete_interview(
            db,
            interview_id,
            current_user.id
        )

        return None

    except PermissionError as e:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )