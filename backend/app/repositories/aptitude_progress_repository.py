from sqlalchemy.orm import Session

from app.models.aptitude_progress import AptitudeProgress


class AptitudeProgressRepository:

    # ========================================================
    # GET PROGRESS FOR A SPECIFIC QUESTION
    # ========================================================

    def get_by_user_and_question(
        self,
        db: Session,
        user_id: int,
        question_id: int
    ) -> AptitudeProgress | None:

        return (
            db.query(AptitudeProgress)
            .filter(
                AptitudeProgress.user_id == user_id,
                AptitudeProgress.question_id == question_id
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
            db.query(AptitudeProgress)
            .filter(
                AptitudeProgress.user_id == user_id
            )
            .all()
        )


    # ========================================================
    # GET COMPLETED QUESTIONS
    # ========================================================

    def get_completed_by_user(
        self,
        db: Session,
        user_id: int
    ):

        return (
            db.query(AptitudeProgress)
            .filter(
                AptitudeProgress.user_id == user_id,
                AptitudeProgress.completed.is_(True)
            )
            .all()
        )


    # ========================================================
    # COUNT COMPLETED QUESTIONS
    # ========================================================

    def count_completed_by_user(
        self,
        db: Session,
        user_id: int
    ) -> int:

        return (
            db.query(AptitudeProgress)
            .filter(
                AptitudeProgress.user_id == user_id,
                AptitudeProgress.completed.is_(True)
            )
            .count()
        )


    # ========================================================
    # CREATE PROGRESS
    # ========================================================

    def create(
        self,
        db: Session,
        progress: AptitudeProgress
    ) -> AptitudeProgress:

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
        progress: AptitudeProgress
    ) -> AptitudeProgress:

        db.commit()

        db.refresh(progress)

        return progress


    # ========================================================
    # MARK QUESTION COMPLETED
    # ========================================================

    def mark_completed(
        self,
        db: Session,
        progress: AptitudeProgress
    ) -> AptitudeProgress:

        progress.completed = True

        from datetime import datetime

        progress.completed_at = datetime.utcnow()

        db.commit()

        db.refresh(progress)

        return progress


    # ========================================================
    # MARK QUESTION INCOMPLETE
    # ========================================================

    def mark_incomplete(
        self,
        db: Session,
        progress: AptitudeProgress
    ) -> AptitudeProgress:

        progress.completed = False

        progress.completed_at = None

        db.commit()

        db.refresh(progress)

        return progress


aptitude_progress_repository = AptitudeProgressRepository()