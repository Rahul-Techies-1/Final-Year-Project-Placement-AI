from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.models.user import User
from app.repositories.user_repository import user_repository

from app.schemas.user_schema import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
)

from app.exceptions.custom_exceptions import (
    EmailAlreadyExistsException,
)

from app.core.security import create_access_token


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


class AuthService:

    def register_user(
        self,
        db: Session,
        request: UserRegisterRequest
    ):

        # Check if email already exists
        existing_user = user_repository.get_by_email(
            db,
            request.email
        )

        if existing_user:
            raise EmailAlreadyExistsException()

        # Hash password
        hashed_password = pwd_context.hash(
            request.password
        )

        # Create User object
        user = User(
            full_name=request.full_name,
            email=request.email,
            password_hash=hashed_password
        )

        # Save user to database
        return user_repository.create(
            db,
            user
        )

    def login_user(
        self,
        db: Session,
        email: str,
        password: str,
    ) -> TokenResponse:

        # Find user by email
        user = user_repository.get_by_email(
            db,
            email
        )

        # Check if user exists
        if not user:
            raise ValueError(
                "Invalid email or password"
            )

        # Verify password
        if not pwd_context.verify(
            password,
            user.password_hash
        ):
            raise ValueError(
                "Invalid email or password"
            )

        # Generate JWT Token
        access_token = create_access_token(
            data={
                "sub": user.email,
                "user_id": user.id,
            }
        )

        # Return token
        return TokenResponse(
            access_token=access_token,
            token_type="bearer"
        )


auth_service = AuthService()