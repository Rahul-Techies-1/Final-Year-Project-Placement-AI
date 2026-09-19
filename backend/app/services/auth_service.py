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

    # ========================================================
    # REGISTER USER
    # ========================================================

    def register_user(
        self,
        db: Session,
        request: UserRegisterRequest
    ):

        # ----------------------------------------------------
        # CHECK IF EMAIL ALREADY EXISTS
        # ----------------------------------------------------

        existing_user = user_repository.get_by_email(
            db,
            request.email
        )

        if existing_user:

            raise EmailAlreadyExistsException()


        # ----------------------------------------------------
        # HASH PASSWORD
        # ----------------------------------------------------

        hashed_password = pwd_context.hash(
            request.password
        )


        # ----------------------------------------------------
        # CREATE USER
        # ----------------------------------------------------

        user = User(

            full_name=request.full_name,

            email=request.email,

            password_hash=hashed_password,

            role=request.role
        )


        # ----------------------------------------------------
        # SAVE USER
        # ----------------------------------------------------

        return user_repository.create(
            db,
            user
        )


    # ========================================================
    # LOGIN USER
    # ========================================================

    def login_user(
        self,
        db: Session,
        email: str,
        password: str,
    ) -> TokenResponse:

        # ----------------------------------------------------
        # FIND USER
        # ----------------------------------------------------

        user = user_repository.get_by_email(
            db,
            email
        )


        if not user:

            raise ValueError(
                "Invalid email or password"
            )


        # ----------------------------------------------------
        # VERIFY PASSWORD
        # ----------------------------------------------------

        if not pwd_context.verify(
            password,
            user.password_hash
        ):

            raise ValueError(
                "Invalid email or password"
            )


        # ----------------------------------------------------
        # GENERATE JWT TOKEN
        # ----------------------------------------------------

        access_token = create_access_token(

            data={
                "sub": user.email,
                "user_id": user.id,
            }

        )


        # ----------------------------------------------------
        # RETURN TOKEN
        # ----------------------------------------------------

        return TokenResponse(

            access_token=access_token,

            token_type="bearer"
        )


auth_service = AuthService()