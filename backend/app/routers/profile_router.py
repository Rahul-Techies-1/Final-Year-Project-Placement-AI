from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.profile_schema import (
    StudentProfileUpdateRequest,
    StudentProfileResponse,
)
from app.services.profile_service import profile_service

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get(
    "/me",
    response_model=StudentProfileResponse
)
def get_profile(
    current_user: User = Depends(get_current_user)
):
    return profile_service.get_profile(current_user)


@router.put(
    "/me",
    response_model=StudentProfileResponse
)
def update_profile(
    request: StudentProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return profile_service.update_profile(
        db,
        current_user,
        request
    )