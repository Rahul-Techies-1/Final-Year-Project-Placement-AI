from sqlalchemy.orm import Session

from app.repositories.user_repository import user_repository


class AdminService:

    def get_all_users(
        self,
        db: Session,
        page:int,
        limit:int,
        search:str
    ):
        return user_repository.get_all_users(
            db,
            page,
            limit,
            search
        )
        

    def get_user_by_id(
            self,
            db:Session,
            user_id:int
    ):
        return user_repository.get_by_id(
            db,
            user_id
        )
    def delete_user(
            self,
            db: Session,
            user_id: int,
            current_user
    ):
        user = user_repository.get_by_id(
            db,
            user_id
        )
        if not user:
            return None

        if user.id==current_user.id:
            raise ValueError(
                "You cannot delete your own account"
            )
        user_repository.delete_user(
            db,
            user
        )

    def update_user_role(
            self,
            db:Session,
            user_id:int,
            role:str
    ):
        user=user_repository.get_by_id(
            db,
            user_id
        )
        if not user:
            return None
        return user_repository.update_role(
            db,
            user,
            role
        )
        return user




admin_service = AdminService()