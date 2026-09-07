from sqlalchemy.orm import Session

from app.models.aptitude_topic import AptitudeTopic


class AptitudeTopicRepository:

    # ========================================================
    # GET ALL APTITUDE TOPICS
    # ========================================================

    def get_all(
        self,
        db: Session
    ):

        return (
            db.query(AptitudeTopic)
            .order_by(
                AptitudeTopic.display_order.asc(),
                AptitudeTopic.id.asc()
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
    ) -> AptitudeTopic | None:

        return (
            db.query(AptitudeTopic)
            .filter(
                AptitudeTopic.id == topic_id
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
    ) -> AptitudeTopic | None:

        return (
            db.query(AptitudeTopic)
            .filter(
                AptitudeTopic.name == name
            )
            .first()
        )


aptitude_topic_repository = AptitudeTopicRepository()