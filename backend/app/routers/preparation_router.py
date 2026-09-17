from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status
)
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.dependencies.auth import require_role

from app.models.user import User

from app.services.preparation_service import (
    preparation_service
)


router = APIRouter(
    prefix="/preparation",
    tags=["Preparation"]
)


# ============================================================
# DSA - OVERVIEW
# ============================================================

@router.get(
    "/dsa/overview"
)
def get_dsa_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):
    try:

        return preparation_service.get_dsa_overview(
            db=db,
            user_id=current_user.id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ============================================================
# DSA - TOPICS
# ============================================================

@router.get(
    "/dsa/topics"
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


# ============================================================
# DSA - PROBLEMS
# ============================================================

@router.get(
    "/dsa/problems"
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


# ============================================================
# DSA - SINGLE PROBLEM
# ============================================================

@router.get(
    "/dsa/problems/{problem_id}"
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


# ============================================================
# DSA - UPDATE PROGRESS
# ============================================================

@router.patch(
    "/dsa/problems/{problem_id}/progress"
)
def update_dsa_progress(
    problem_id: int,
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    completed = request.get("completed")

    if not isinstance(completed, bool):

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The 'completed' field must be a boolean."
        )

    try:

        return preparation_service.update_dsa_progress(
            db=db,
            user_id=current_user.id,
            problem_id=problem_id,
            completed=completed
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )