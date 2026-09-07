from sqlalchemy.orm import Session

from app.models.aptitude_question import AptitudeQuestion


class AptitudeQuestionRepository:

    # ========================================================
    # GET ALL ACTIVE APTITUDE QUESTIONS
    # ========================================================

    def get_all(
        self,
        db: Session
    ):

        return (
            db.query(AptitudeQuestion)
            .filter(
                AptitudeQuestion.is_active.is_(True)
            )
            .order_by(
                AptitudeQuestion.id.asc()
            )
            .all()
        )


    # ========================================================
    # GET QUESTIONS BY TOPIC
    # ========================================================

    def get_by_topic(
        self,
        db: Session,
        topic_id: int
    ):

        return (
            db.query(AptitudeQuestion)
            .filter(
                AptitudeQuestion.topic_id == topic_id,
                AptitudeQuestion.is_active.is_(True)
            )
            .order_by(
                AptitudeQuestion.id.asc()
            )
            .all()
        )


    # ========================================================
    # GET QUESTION BY ID
    # ========================================================

    def get_by_id(
        self,
        db: Session,
        question_id: int
    ) -> AptitudeQuestion | None:

        return (
            db.query(AptitudeQuestion)
            .filter(
                AptitudeQuestion.id == question_id,
                AptitudeQuestion.is_active.is_(True)
            )
            .first()
        )


    # ========================================================
    # COUNT ACTIVE QUESTIONS
    # ========================================================

    def count_active(
        self,
        db: Session
    ) -> int:

        return (
            db.query(AptitudeQuestion)
            .filter(
                AptitudeQuestion.is_active.is_(True)
            )
            .count()
        )


    # ========================================================
    # COUNT ACTIVE QUESTIONS BY TOPIC
    # ========================================================

    def count_active_by_topic(
        self,
        db: Session,
        topic_id: int
    ) -> int:

        return (
            db.query(AptitudeQuestion)
            .filter(
                AptitudeQuestion.topic_id == topic_id,
                AptitudeQuestion.is_active.is_(True)
            )
            .count()
        )


aptitude_question_repository = AptitudeQuestionRepository()