from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.dependencies.auth import require_role

from app.models.user import User

from app.services.sql_service import (
    sql_service
)


router = APIRouter(
    prefix="/preparation/sql",
    tags=["SQL"]
)


# ============================================================
# REQUEST SCHEMAS
# ============================================================

class SQLProgressUpdateRequest(BaseModel):

    completed: bool


class SQLQueryExecutionRequest(BaseModel):

    problem_id: int
    query: str


# ============================================================
# GET SQL OVERVIEW
# ============================================================

@router.get(
    "/overview"
)
def get_sql_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    return sql_service.get_sql_overview(
        db=db,
        user_id=current_user.id
    )


# ============================================================
# GET SQL TOPICS
# ============================================================

@router.get(
    "/topics"
)
def get_sql_topics(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    return sql_service.get_sql_topics(
        db=db
    )


# ============================================================
# GET SQL PROBLEMS
# ============================================================

@router.get(
    "/problems"
)
def get_sql_problems(
    topic_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    return sql_service.get_sql_problems(
        db=db,
        user_id=current_user.id,
        topic_id=topic_id
    )


# ============================================================
# GET SINGLE SQL PROBLEM
# ============================================================

@router.get(
    "/problems/{problem_id}"
)
def get_sql_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    problem = sql_service.get_sql_problem_by_id(
        db=db,
        user_id=current_user.id,
        problem_id=problem_id
    )

    if problem is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SQL problem not found."
        )

    return problem


# ============================================================
# EXECUTE SQL QUERY
# ============================================================

@router.post(
    "/problems/{problem_id}/execute"
)
def execute_sql_query(
    problem_id: int,
    request: SQLQueryExecutionRequest,
    current_user: User = Depends(
        require_role("student")
    )
):

    # --------------------------------------------------------
    # Make sure request problem_id matches URL problem_id
    # --------------------------------------------------------

    if request.problem_id != problem_id:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Problem ID in the request body "
                "does not match the URL."
            )
        )

    try:

        result = sql_service.execute_sql_query(
            query=request.query,
            problem_id=problem_id
        )

        return result

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc)
        )


# ============================================================
# UPDATE SQL PROGRESS
# ============================================================

@router.put(
    "/problems/{problem_id}/progress"
)
def update_sql_progress(
    problem_id: int,
    request: SQLProgressUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    result = sql_service.update_sql_progress(
        db=db,
        user_id=current_user.id,
        problem_id=problem_id,
        completed=request.completed
    )

    if result is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SQL problem not found."
        )

    return result


# ============================================================
# MARK SQL PROBLEM COMPLETE
# ============================================================

@router.post(
    "/problems/{problem_id}/complete"
)
def mark_sql_problem_completed(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    result = sql_service.mark_sql_problem_completed(
        db=db,
        user_id=current_user.id,
        problem_id=problem_id
    )

    if result is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SQL problem not found."
        )

    return result


# ============================================================
# MARK SQL PROBLEM INCOMPLETE
# ============================================================

@router.post(
    "/problems/{problem_id}/incomplete"
)
def mark_sql_problem_incomplete(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role("student")
    )
):

    result = sql_service.mark_sql_problem_incomplete(
        db=db,
        user_id=current_user.id,
        problem_id=problem_id
    )

    if result is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SQL problem not found."
        )

    return result