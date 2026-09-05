from sqlalchemy.orm import Session

from app.models.core_cs_topic import CoreCSTopic


class CoreCSTopicRepository:

    # ========================================================
    # GET ALL CORE CS TOPICS
    # ========================================================

    def get_all(
        self,
        db: Session
    ):

        return (
            db.query(CoreCSTopic)
            .order_by(
                CoreCSTopic.display_order.asc(),
                CoreCSTopic.id.asc()
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
    ) -> CoreCSTopic | None:

        return (
            db.query(CoreCSTopic)
            .filter(
                CoreCSTopic.id == topic_id
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
    ) -> CoreCSTopic | None:

        return (
            db.query(CoreCSTopic)
            .filter(
                CoreCSTopic.name == name
            )
            .first()
        )


core_cs_topic_repository = CoreCSTopicRepository()