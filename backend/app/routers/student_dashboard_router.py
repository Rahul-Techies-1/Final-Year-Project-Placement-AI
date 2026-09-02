from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import require_role
from app.models.user import User

from app.schemas.student_dashboard_schema import (
    StudentDashboardResponse,
    StudentRecentApplicationResponse,
    StudentUpcomingInterviewResponse,
    StudentDashboardOverviewResponse,
    StudentPaginatedApplicationsResponse
)

from app.services.student_dashboard_service import (
    student_dashboard_service
)


router = APIRouter(
    prefix="/student",
    tags=["Student Dashboard"]
)


# ============================================================
# STUDENT - DASHBOARD STATISTICS
# ============================================================

@router.get(
    "/dashboard",
    response_model=StudentDashboardResponse
)
def get_student_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    return student_dashboard_service.get_student_dashboard(
        db,
        current_user.id
    )


# ============================================================
# STUDENT - RECENT APPLICATIONS
# ============================================================

@router.get(
    "/dashboard/recent-applications",
    response_model=StudentPaginatedApplicationsResponse
)
def get_recent_applications(
    page: int = 1,
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return student_dashboard_service.get_recent_applications(
            db,
            current_user.id,
            page,
            limit
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ============================================================
# STUDENT - UPCOMING INTERVIEWS
# ============================================================

@router.get(
    "/dashboard/upcoming-interviews",
    response_model=list[StudentUpcomingInterviewResponse]
)
def get_upcoming_interviews(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    if limit < 1 or limit > 20:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 20."
        )

    try:

        return student_dashboard_service.get_upcoming_interviews(
            db,
            current_user.id,
            limit
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ============================================================
# STUDENT - COMPLETE DASHBOARD OVERVIEW
# ============================================================

@router.get(
    "/dashboard/overview",
    response_model=StudentDashboardOverviewResponse
)
def get_dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    return student_dashboard_service.get_dashboard_overview(
        db,
        current_user.id
    )