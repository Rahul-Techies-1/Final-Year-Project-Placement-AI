from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.auth_service import auth_service
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.user_schema import (
    UserRegisterRequest,
    UserRegisterResponse,
    UserLoginRequest,
    TokenResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserRegisterResponse
)
def register(
    request: UserRegisterRequest,
    db: Session = Depends(get_db)
):

    auth_service.register_user(
        db,
        request
    )

    return UserRegisterResponse(
        message="User registered successfully"
    )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    return auth_service.login_user(
        db,
        form_data.username,
        form_data.password
    )