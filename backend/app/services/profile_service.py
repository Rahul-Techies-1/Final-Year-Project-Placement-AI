from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.profile_schema import StudentProfileUpdateRequest


class ProfileService:

    def get_profile(
        self,
        current_user: User
    ):
        return current_user

    def update_profile(
        self,
        db: Session,
        current_user: User,
        request: StudentProfileUpdateRequest
    ):

        update_data = request.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(current_user, key, value)

        db.commit()
        db.refresh(current_user)

        return current_user


profile_service = ProfileService()