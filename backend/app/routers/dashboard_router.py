from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import require_role
from app.models.user import User

from app.schemas.dashboard_schema import (
    RecruiterDashboardResponse,
    UpcomingInterviewResponse,
    RecruiterDashboardOverviewResponse,
    PaginatedRecentApplicationsResponse
)

from app.services.dashboard_service import dashboard_service


router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter Dashboard"]
)


# ============================================================
# RECRUITER - DASHBOARD STATISTICS
# ============================================================

@router.get(
    "/dashboard",
    response_model=RecruiterDashboardResponse
)
def get_recruiter_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    )
):

    return dashboard_service.get_recruiter_dashboard(
        db,
        current_user.id
    )


# ============================================================
# RECRUITER - RECENT APPLICATIONS
# ============================================================

@router.get(
    "/dashboard/recent-applications",
    response_model=PaginatedRecentApplicationsResponse
)
def get_recent_applications(
    page: int = 1,
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    )
):

    try:

        return dashboard_service.get_recent_applications(
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
# RECRUITER - UPCOMING INTERVIEWS
# ============================================================

@router.get(
    "/dashboard/upcoming-interviews",
    response_model=list[UpcomingInterviewResponse]
)
def get_upcoming_interviews(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    )
):

    if limit < 1 or limit > 20:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 20."
        )

    try:

        return dashboard_service.get_upcoming_interviews(
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
# RECRUITER - COMPLETE DASHBOARD OVERVIEW
# ============================================================

@router.get(
    "/dashboard/overview",
    response_model=RecruiterDashboardOverviewResponse
)
def get_dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    )
):

    return dashboard_service.get_dashboard_overview(
        db,
        current_user.id
    )