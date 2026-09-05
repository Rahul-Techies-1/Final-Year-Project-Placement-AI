from sqlalchemy.orm import Session

from app.models.dsa_problem import DSAProblem


class DSAProblemRepository:

    # ========================================================
    # GET ALL ACTIVE PROBLEMS
    # ========================================================

    def get_all(
        self,
        db: Session
    ):

        return (
            db.query(DSAProblem)
            .filter(
                DSAProblem.is_active.is_(True)
            )
            .order_by(
                DSAProblem.id.asc()
            )
            .all()
        )


    # ========================================================
    # GET PROBLEMS BY TOPIC
    # ========================================================

    def get_by_topic(
        self,
        db: Session,
        topic_id: int
    ):

        return (
            db.query(DSAProblem)
            .filter(
                DSAProblem.topic_id == topic_id,
                DSAProblem.is_active.is_(True)
            )
            .order_by(
                DSAProblem.id.asc()
            )
            .all()
        )


    # ========================================================
    # GET PROBLEM BY ID
    # ========================================================

    def get_by_id(
        self,
        db: Session,
        problem_id: int
    ) -> DSAProblem | None:

        return (
            db.query(DSAProblem)
            .filter(
                DSAProblem.id == problem_id,
                DSAProblem.is_active.is_(True)
            )
            .first()
        )


    # ========================================================
    # COUNT ACTIVE PROBLEMS
    # ========================================================

    def count_active(
        self,
        db: Session
    ) -> int:

        return (
            db.query(DSAProblem)
            .filter(
                DSAProblem.is_active.is_(True)
            )
            .count()
        )


    # ========================================================
    # COUNT ACTIVE PROBLEMS BY TOPIC
    # ========================================================

    def count_active_by_topic(
        self,
        db: Session,
        topic_id: int
    ) -> int:

        return (
            db.query(DSAProblem)
            .filter(
                DSAProblem.topic_id == topic_id,
                DSAProblem.is_active.is_(True)
            )
            .count()
        )


dsa_problem_repository = DSAProblemRepository()