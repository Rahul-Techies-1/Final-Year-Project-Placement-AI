from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:

    def get_by_email(
        self,
        db: Session,
        email: str
    ) -> User | None:

        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    def create(
        self,
        db: Session,
        user: User
    ) -> User:

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    def get_all_users(
        self,
        db: Session,
        page: int,
        limit: int,
        search: str
    ):

        query = db.query(User)

        if search:
            query = query.filter(
                or_(
                    User.full_name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%")
                )
            )

        return (
            query
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

    def get_by_id(
        self,
        db: Session,
        user_id: int
    ) -> User | None:

        return (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    def delete_user(
        self,
        db: Session,
        user: User
    ):

        db.delete(user)
        db.commit()

    def update_role(
        self,
        db: Session,
        user: User,
        role: str
    ) -> User:

        user.role = role

        db.commit()
        db.refresh(user)

        return user


user_repository = UserRepository()