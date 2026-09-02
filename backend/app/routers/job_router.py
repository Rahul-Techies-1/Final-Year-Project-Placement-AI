from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import (
    get_current_user,
    require_role,
)

from app.models.user import User

from app.schemas.job_schema import (
    JobCreateRequest,
    JobResponse,
    JobUpdateRequest,
)

from app.services.job_service import job_service


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


# ============================================================
# RECRUITER - CREATE JOB
# ============================================================

@router.post(
    "",
    response_model=JobResponse,
)
def create_job(
    request: JobCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    ),
):

    return job_service.create_job(
        db,
        request,
        current_user,
    )


# ============================================================
# RECRUITER - GET MY JOBS
# ============================================================

@router.get(
    "/my",
    response_model=list[JobResponse],
)
def get_my_jobs(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    ),
):

    return job_service.get_recruiter_jobs(
        db,
        current_user.id,
        page,
        limit,
    )


# ============================================================
# GET ALL JOBS
# ============================================================

@router.get(
    "",
    response_model=list[JobResponse],
)
def get_all_jobs(
    page: int = 1,
    limit: int = 10,
    search: str = "",
    location: str = "",
    db: Session = Depends(get_db),
):

    return job_service.get_all_jobs(
        db,
        page,
        limit,
        search,
        location,
    )


# ============================================================
# STUDENT - AVAILABLE JOBS
# ============================================================

@router.get(
    "/available",
    response_model=list[JobResponse],
)
def get_available_jobs(
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    ),
):

    try:

        return job_service.get_available_jobs(
            db,
            page,
            limit,
            search,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ============================================================
# RECRUITER - GET MY JOBS
# ============================================================

@router.get(
    "/my",
    response_model=list[JobResponse],
)
def get_my_jobs(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    ),
):

    try:

        return job_service.get_recruiter_jobs(
            db,
            current_user.id,
            page,
            limit,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ============================================================
# GET JOB DETAILS
# ============================================================

@router.get(
    "/{job_id}",
    response_model=JobResponse,
)
def get_job_details(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    try:

        return job_service.get_job_details(
            db,
            job_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# ============================================================
# RECRUITER - UPDATE JOB
# ============================================================

@router.put(
    "/{job_id}",
    response_model=JobResponse,
)
def update_job(
    job_id: int,
    request: JobUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    ),
):

    try:

        job = job_service.update_job(
            db,
            job_id,
            request,
            current_user.id,
        )

        if not job:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found",
            )

        return job

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )


# ============================================================
# RECRUITER - DELETE JOB
# ============================================================

@router.delete(
    "/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    ),
):

    try:

        result = job_service.delete_job(
            db,
            job_id,
            current_user.id,
        )

        if not result:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found",
            )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )


# ============================================================
# RECRUITER - CLOSE JOB
# ============================================================

@router.patch(
    "/{job_id}/close",
    response_model=JobResponse,
)
def close_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("recruiter")
    ),
):

    try:

        job = job_service.close_job(
            db,
            job_id,
            current_user.id,
        )

        if not job:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found.",
            )

        return job

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )