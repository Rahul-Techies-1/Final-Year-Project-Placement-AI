from fastapi import APIRouter, Depends

from app.dependencies.auth import require_role
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.admin_service import admin_service
from app.schemas.user_schema import UserResponse
from fastapi import HTTPException
from app.schemas.user_schema import UpdateUserRoleRequest

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def admin_dashboard(
    current_user=Depends(require_role("admin"))
):
    return {
        "message": "Welcome Admin",
        "user": current_user.email
    }
@router.get(
    "/users",
    response_model=list[UserResponse]
)
def get_all_users(

    page: int = 1,

    limit: int = 10,

    search: str = "",

    db: Session = Depends(get_db),

    current_user=Depends(require_role("admin"))

):

    return admin_service.get_all_users(
        db,
        page,
        limit,
        search
    )

@router.get(
    "/users/{user_id}",
    response_model=UserResponse
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin"))
):

    user = admin_service.get_user_by_id(
        db,
        user_id
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin"))
):

    try:

        user = admin_service.delete_user(
            db,
            user_id,
            current_user
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return {
            "message": "User deleted successfully"
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.patch(
    "/users/{user_id}/role",
    response_model=UserResponse
)
def update_role(
    user_id: int,
    request: UpdateUserRoleRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("admin"))
):

    user = admin_service.update_user_role(
        db,
        user_id,
        request.role
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user