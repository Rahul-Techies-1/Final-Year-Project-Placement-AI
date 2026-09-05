from datetime import datetime

from sqlalchemy.orm import Session

from app.models.core_cs_progress import CoreCSProgress


class CoreCSProgressRepository:

    # ========================================================
    # GET PROGRESS FOR A SPECIFIC PROBLEM
    # ========================================================

    def get_by_user_and_problem(
        self,
        db: Session,
        user_id: int,
        problem_id: int
    ) -> CoreCSProgress | None:

        return (
            db.query(CoreCSProgress)
            .filter(
                CoreCSProgress.user_id == user_id,
                CoreCSProgress.problem_id == problem_id
            )
            .first()
        )


    # ========================================================
    # GET ALL PROGRESS FOR A STUDENT
    # ========================================================

    def get_by_user(
        self,
        db: Session,
        user_id: int
    ):

        return (
            db.query(CoreCSProgress)
            .filter(
                CoreCSProgress.user_id == user_id
            )
            .all()
        )


    # ========================================================
    # GET COMPLETED PROBLEMS
    # ========================================================

    def get_completed_by_user(
        self,
        db: Session,
        user_id: int
    ):

        return (
            db.query(CoreCSProgress)
            .filter(
                CoreCSProgress.user_id == user_id,
                CoreCSProgress.completed.is_(True)
            )
            .all()
        )


    # ========================================================
    # COUNT COMPLETED PROBLEMS
    # ========================================================

    def count_completed_by_user(
        self,
        db: Session,
        user_id: int
    ) -> int:

        return (
            db.query(CoreCSProgress)
            .filter(
                CoreCSProgress.user_id == user_id,
                CoreCSProgress.completed.is_(True)
            )
            .count()
        )


    # ========================================================
    # CREATE PROGRESS
    # ========================================================

    def create(
        self,
        db: Session,
        progress: CoreCSProgress
    ) -> CoreCSProgress:

        db.add(progress)

        db.commit()

        db.refresh(progress)

        return progress


    # ========================================================
    # UPDATE PROGRESS
    # ========================================================

    def update(
        self,
        db: Session,
        progress: CoreCSProgress
    ) -> CoreCSProgress:

        db.commit()

        db.refresh(progress)

        return progress


    # ========================================================
    # MARK PROBLEM COMPLETED
    # ========================================================

    def mark_completed(
        self,
        db: Session,
        progress: CoreCSProgress
    ) -> CoreCSProgress:

        progress.completed = True

        progress.completed_at = datetime.utcnow()

        db.commit()

        db.refresh(progress)

        return progress


    # ========================================================
    # MARK PROBLEM INCOMPLETE
    # ========================================================

    def mark_incomplete(
        self,
        db: Session,
        progress: CoreCSProgress
    ) -> CoreCSProgress:

        progress.completed = False

        progress.completed_at = None

        db.commit()

        db.refresh(progress)

        return progress


core_cs_progress_repository = CoreCSProgressRepository()