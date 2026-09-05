from datetime import datetime

from sqlalchemy.orm import Session

from app.models.dsa_progress import DSAProgress


class DSAProgressRepository:

    # ========================================================
    # GET PROGRESS FOR A SPECIFIC PROBLEM
    # ========================================================

    def get_by_user_and_problem(
        self,
        db: Session,
        user_id: int,
        problem_id: int
    ) -> DSAProgress | None:

        return (
            db.query(DSAProgress)
            .filter(
                DSAProgress.user_id == user_id,
                DSAProgress.problem_id == problem_id
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
            db.query(DSAProgress)
            .filter(
                DSAProgress.user_id == user_id
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
            db.query(DSAProgress)
            .filter(
                DSAProgress.user_id == user_id,
                DSAProgress.completed.is_(True)
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
            db.query(DSAProgress)
            .filter(
                DSAProgress.user_id == user_id,
                DSAProgress.completed.is_(True)
            )
            .count()
        )


    # ========================================================
    # CREATE PROGRESS
    # ========================================================

    def create(
        self,
        db: Session,
        progress: DSAProgress
    ) -> DSAProgress:

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
        progress: DSAProgress
    ) -> DSAProgress:

        db.commit()
        db.refresh(progress)

        return progress


    # ========================================================
    # MARK PROBLEM COMPLETED
    # ========================================================

    def mark_completed(
        self,
        db: Session,
        progress: DSAProgress
    ) -> DSAProgress:

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
        progress: DSAProgress
    ) -> DSAProgress:

        progress.completed = False

        progress.completed_at = None

        db.commit()
        db.refresh(progress)

        return progress


dsa_progress_repository = DSAProgressRepository()