from sqlalchemy.orm import Session

from app.models.dsa_topic import DSATopic


class DSATopicRepository:

    # ========================================================
    # GET ALL DSA TOPICS
    # ========================================================

    def get_all(
        self,
        db: Session
    ):

        return (
            db.query(DSATopic)
            .order_by(
                DSATopic.display_order.asc(),
                DSATopic.id.asc()
            )
            .all()
        )


    # ========================================================
    # GET TOPIC BY ID
    # ========================================================

    def get_by_id(
        self,
        db: Session,
        topic_id: int
    ) -> DSATopic | None:

        return (
            db.query(DSATopic)
            .filter(
                DSATopic.id == topic_id
            )
            .first()
        )


    # ========================================================
    # GET TOPIC BY NAME
    # ========================================================

    def get_by_name(
        self,
        db: Session,
        name: str
    ) -> DSATopic | None:

        return (
            db.query(DSATopic)
            .filter(
                DSATopic.name == name
            )
            .first()
        )


dsa_topic_repository = DSATopicRepository()