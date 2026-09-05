from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.services.core_cs_service import (
    core_cs_service
)

from app.schemas.core_cs_schema import (
    CoreCSTopicResponse,
    CoreCSProblemWithProgressResponse,
    CoreCSProgressResponse,
    CoreCSProgressUpdateRequest,
    CoreCSOverviewResponse,
    CoreCSProblemListResponse,
)

from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/preparation/core-cs",
    tags=["Core CS Preparation"]
)


# ========================================================
# CORE CS OVERVIEW
# ========================================================

@router.get(
    "/overview",
    response_model=CoreCSOverviewResponse
)
def get_core_cs_overview(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return core_cs_service.get_core_cs_overview(
        db=db,
        user_id=current_user.id
    )


# ========================================================
# GET CORE CS TOPICS
# ========================================================

@router.get(
    "/topics",
    response_model=list[CoreCSTopicResponse]
)
def get_core_cs_topics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return core_cs_service.get_core_cs_topics(
        db=db
    )


# ========================================================
# GET CORE CS PROBLEMS
# ========================================================

@router.get(
    "/problems",
    response_model=CoreCSProblemListResponse
)
def get_core_cs_problems(
    topic_id: int | None = Query(
        default=None
    ),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    try:

        return core_cs_service.get_core_cs_problems(
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
# GET SINGLE CORE CS PROBLEM
# ========================================================

@router.get(
    "/problems/{problem_id}",
    response_model=CoreCSProblemWithProgressResponse
)
def get_core_cs_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    try:

        return core_cs_service.get_core_cs_problem(
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
# UPDATE CORE CS PROGRESS
# ========================================================

@router.put(
    "/problems/{problem_id}/progress",
    response_model=CoreCSProgressResponse
)
def update_core_cs_progress(
    problem_id: int,
    request: CoreCSProgressUpdateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    try:

        return core_cs_service.update_core_cs_progress(
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
    "/problems/{problem_id}/complete",
    response_model=CoreCSProgressResponse
)
def mark_problem_completed(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    try:

        return core_cs_service.mark_problem_completed(
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
    "/problems/{problem_id}/incomplete",
    response_model=CoreCSProgressResponse
)
def mark_problem_incomplete(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    try:

        return core_cs_service.mark_problem_incomplete(
            db=db,
            user_id=current_user.id,
            problem_id=problem_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )