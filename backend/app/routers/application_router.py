from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import require_role

from app.models.user import User

from app.schemas.application_schema import (
    ApplicationCreateRequest,
    ApplicationResponse,
    ApplicationStatusUpdateRequest,
    MyApplicationResponse,
    ApplicationStatsResponse,
    ApplicationDetailResponse,
    RecruiterApplicationResponse
)

from app.services.application_service import application_service


router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


# ============================================================
# STUDENT - APPLY FOR JOB
# ============================================================

@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def apply_job(
    request: ApplicationCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    ),
):

    try:

        return application_service.apply_job(
            db,
            request,
            current_user,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ============================================================
# STUDENT - MY APPLICATIONS
# ============================================================

@router.get(
    "/my",
    response_model=list[MyApplicationResponse],
)
def my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    ),
):

    return application_service.get_my_applications(
        db,
        current_user,
    )


# ============================================================
# RECRUITER - VIEW JOB APPLICATIONS
# ============================================================

@router.get(
    "/job/{job_id}",
    response_model=list[RecruiterApplicationResponse],
)
def job_applications(
    job_id: int,
    page: int = 1,
    limit: int = 10,
    application_status: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    ),
):

    try:

        return application_service.get_job_applications(
            db,
            job_id,
            page,
            limit,
            application_status,
            search,
            current_user,
        )

    except LookupError as e:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    except PermissionError as e:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ============================================================
# RECRUITER - APPLICATION STATISTICS
# ============================================================

@router.get(
    "/job/{job_id}/stats",
    response_model=ApplicationStatsResponse,
)
def application_stats(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    ),
):

    try:

        stats = application_service.get_application_stats(
            db,
            job_id,
            current_user,
        )

        if stats is None:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found.",
            )

        return stats

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )


# ============================================================
# RECRUITER - UPDATE APPLICATION STATUS
# ============================================================

@router.put(
    "/{application_id}/status",
    response_model=ApplicationResponse,
)
def update_application_status(
    application_id: int,
    request: ApplicationStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    ),
):

    try:

        application = application_service.update_status(
            db,
            application_id,
            request,
            current_user,
        )

        if not application:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )

        return application

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )


# ============================================================
# STUDENT - APPLICATION DETAILS
# ============================================================

@router.get(
    "/{application_id}",
    response_model=ApplicationDetailResponse,
)
def get_application_details(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    ),
):

    try:

        application = (
            application_service.get_application_details(
                db,
                application_id,
                current_user,
            )
        )

        if application is None:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found.",
            )

        return application

    except PermissionError as e:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ============================================================
# STUDENT - WITHDRAW APPLICATION
# ============================================================

@router.delete(
    "/{application_id}"
)
def withdraw_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    ),
):

    try:

        result = application_service.withdraw_application(
            db,
            application_id,
            current_user,
        )

        if result is None:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found.",
            )

        return {
            "message": "Application withdrawn successfully."
        }

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )