from sqlalchemy.orm import Session

from app.models.core_cs_problem import CoreCSProblem


class CoreCSProblemRepository:

    # ========================================================
    # GET ALL ACTIVE CORE CS PROBLEMS
    # ========================================================

    def get_all(
        self,
        db: Session
    ):

        return (
            db.query(CoreCSProblem)
            .filter(
                CoreCSProblem.is_active.is_(True)
            )
            .order_by(
                CoreCSProblem.id.asc()
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
            db.query(CoreCSProblem)
            .filter(
                CoreCSProblem.topic_id == topic_id,
                CoreCSProblem.is_active.is_(True)
            )
            .order_by(
                CoreCSProblem.id.asc()
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
    ) -> CoreCSProblem | None:

        return (
            db.query(CoreCSProblem)
            .filter(
                CoreCSProblem.id == problem_id,
                CoreCSProblem.is_active.is_(True)
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
            db.query(CoreCSProblem)
            .filter(
                CoreCSProblem.is_active.is_(True)
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
            db.query(CoreCSProblem)
            .filter(
                CoreCSProblem.topic_id == topic_id,
                CoreCSProblem.is_active.is_(True)
            )
            .count()
        )


core_cs_problem_repository = CoreCSProblemRepository()