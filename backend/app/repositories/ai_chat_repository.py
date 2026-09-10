from sqlalchemy.orm import Session

from app.models.ai_chat_session import AIChatSession
from app.models.ai_chat_message import AIChatMessage


class AIChatRepository:

    # ========================================================
    # CREATE CHAT SESSION
    # ========================================================

    @staticmethod
    def create_session(
        db: Session,
        user_id: int,
        title: str = "New AI Mentor Chat"
    ) -> AIChatSession:

        session = AIChatSession(
            user_id=user_id,
            title=title
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        return session

    # ========================================================
    # GET SESSION BY ID
    # ========================================================

    @staticmethod
    def get_session_by_id(
        db: Session,
        session_id: int,
        user_id: int
    ) -> AIChatSession | None:

        return (
            db.query(AIChatSession)
            .filter(
                AIChatSession.id == session_id,
                AIChatSession.user_id == user_id
            )
            .first()
        )

    # ========================================================
    # GET USER SESSIONS
    # ========================================================

    @staticmethod
    def get_user_sessions(
        db: Session,
        user_id: int
    ) -> list[AIChatSession]:

        return (
            db.query(AIChatSession)
            .filter(
                AIChatSession.user_id == user_id
            )
            .order_by(
                AIChatSession.updated_at.desc()
            )
            .all()
        )

    # ========================================================
    # UPDATE SESSION TITLE
    # ========================================================

    @staticmethod
    def update_session_title(
        db: Session,
        session: AIChatSession,
        title: str
    ) -> AIChatSession:

        session.title = title

        db.commit()
        db.refresh(session)

        return session

    # ========================================================
    # UPDATE SESSION TIMESTAMP
    # ========================================================

    @staticmethod
    def touch_session(
        db: Session,
        session: AIChatSession
    ) -> AIChatSession:

        from datetime import datetime

        session.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(session)

        return session

    # ========================================================
    # DELETE SESSION
    # ========================================================

    @staticmethod
    def delete_session(
        db: Session,
        session: AIChatSession
    ) -> None:

        db.delete(session)
        db.commit()

    # ========================================================
    # ADD MESSAGE
    # ========================================================

    @staticmethod
    def add_message(
        db: Session,
        session_id: int,
        role: str,
        content: str
    ) -> AIChatMessage:

        message = AIChatMessage(
            session_id=session_id,
            role=role,
            content=content
        )

        db.add(message)
        db.commit()
        db.refresh(message)

        return message

    # ========================================================
    # GET SESSION MESSAGES
    # ========================================================

    @staticmethod
    def get_session_messages(
        db: Session,
        session_id: int
    ) -> list[AIChatMessage]:

        return (
            db.query(AIChatMessage)
            .filter(
                AIChatMessage.session_id == session_id
            )
            .order_by(
                AIChatMessage.created_at.asc()
            )
            .all()
        )


# ============================================================
# REPOSITORY INSTANCE
# ============================================================

ai_chat_repository = AIChatRepository()