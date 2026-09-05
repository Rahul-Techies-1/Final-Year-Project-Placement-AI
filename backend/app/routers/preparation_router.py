from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.services.preparation_service import (
    preparation_service
)

from app.schemas.preparation_schema import (
    DSATopicResponse,
    DSAProblemResponse,
    DSAProblemWithProgressResponse,
    DSAProgressResponse,
    DSAProgressUpdateRequest,
    DSAOverviewResponse,
    DSAProblemListResponse
)

# IMPORTANT:
# Use the same authentication dependency
# that your existing protected routers use.
from app.dependencies.auth import require_role
from app.models.user import User


router = APIRouter(
    prefix="/preparation",
    tags=["Preparation"]
)


# ========================================================
# DSA OVERVIEW
# ========================================================

@router.get(
    "/dsa/overview",
    response_model=DSAOverviewResponse
)
def get_dsa_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    return preparation_service.get_dsa_overview(
        db=db,
        user_id=current_user.id
    )


# ========================================================
# GET DSA TOPICS
# ========================================================

@router.get(
    "/dsa/topics",
    response_model=list[DSATopicResponse]
)
def get_dsa_topics(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    return preparation_service.get_dsa_topics(
        db=db
    )


# ========================================================
# GET DSA PROBLEMS
# ========================================================

@router.get(
    "/dsa/problems",
    response_model=DSAProblemListResponse
)
def get_dsa_problems(
    topic_id: int | None = Query(
        default=None
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return preparation_service.get_dsa_problems(
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
# GET SINGLE DSA PROBLEM
# ========================================================

@router.get(
    "/dsa/problems/{problem_id}",
    response_model=DSAProblemWithProgressResponse
)
def get_dsa_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return preparation_service.get_dsa_problem(
            db=db,
            user_id=current_user.id,
            problem_id=problem_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ========================================================
# UPDATE DSA PROGRESS
# ========================================================

@router.put(
    "/dsa/problems/{problem_id}/progress",
    response_model=DSAProgressResponse
)
def update_dsa_progress(
    problem_id: int,
    request: DSAProgressUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return preparation_service.update_dsa_progress(
            db=db,
            user_id=current_user.id,
            problem_id=problem_id,
            completed=request.completed
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ========================================================
# MARK PROBLEM COMPLETED
# ========================================================

@router.post(
    "/dsa/problems/{problem_id}/complete",
    response_model=DSAProgressResponse
)
def mark_problem_completed(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return preparation_service.mark_problem_completed(
            db=db,
            user_id=current_user.id,
            problem_id=problem_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ========================================================
# MARK PROBLEM INCOMPLETE
# ========================================================

@router.post(
    "/dsa/problems/{problem_id}/incomplete",
    response_model=DSAProgressResponse
)
def mark_problem_incomplete(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    try:

        return preparation_service.mark_problem_incomplete(
            db=db,
            user_id=current_user.id,
            problem_id=problem_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )