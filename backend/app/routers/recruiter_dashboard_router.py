from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.dependencies.auth import (
    require_role
)

from app.models.user import User

from app.schemas.recruiter_dashboard_schema import (
    RecruiterDashboardResponse
)

from app.services.recruiter_dashboard_service import (
    recruiter_dashboard_service
)


router = APIRouter(
    prefix="/recruiter/dashboard",
    tags=["Recruiter Dashboard"]
)


# ============================================================
# RECRUITER DASHBOARD
# ============================================================

@router.get(
    "",
    response_model=RecruiterDashboardResponse
)
def get_recruiter_dashboard(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_role("recruiter")
    )

):

    return recruiter_dashboard_service.get_dashboard(

        db,

        current_user.id

    )