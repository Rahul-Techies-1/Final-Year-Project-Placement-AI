from sqlalchemy.orm import Session

from app.models.ai_document import AIDocument


class AIDocumentRepository:

    # ============================================================
    # CREATE DOCUMENT
    # ============================================================

    @staticmethod
    def create_document(
        db: Session,
        user_id: int,
        original_filename: str,
        stored_filename: str,
        file_path: str,
    ) -> AIDocument:

        document = AIDocument(
            user_id=user_id,
            original_filename=original_filename,
            stored_filename=stored_filename,
            file_path=file_path,
            status="uploaded",
            chunk_count=0,
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        return document

    # ============================================================
    # GET DOCUMENT BY ID
    # ============================================================

    @staticmethod
    def get_document_by_id(
        db: Session,
        document_id: int,
        user_id: int,
    ) -> AIDocument | None:

        return (
            db.query(AIDocument)
            .filter(
                AIDocument.id == document_id,
                AIDocument.user_id == user_id,
            )
            .first()
        )

    # ============================================================
    # GET ALL DOCUMENTS OF A STUDENT
    # ============================================================

    @staticmethod
    def get_user_documents(
        db: Session,
        user_id: int,
    ) -> list[AIDocument]:

        return (
            db.query(AIDocument)
            .filter(AIDocument.user_id == user_id)
            .order_by(AIDocument.created_at.desc())
            .all()
        )

    # ============================================================
    # UPDATE DOCUMENT STATUS
    # ============================================================

    @staticmethod
    def update_status(
        db: Session,
        document: AIDocument,
        status: str,
    ) -> AIDocument:

        document.status = status

        db.commit()
        db.refresh(document)

        return document

    # ============================================================
    # UPDATE CHUNK COUNT
    # ============================================================

    @staticmethod
    def update_chunk_count(
        db: Session,
        document: AIDocument,
        chunk_count: int,
    ) -> AIDocument:

        document.chunk_count = chunk_count

        db.commit()
        db.refresh(document)

        return document

    # ============================================================
    # DELETE DOCUMENT
    # ============================================================

    @staticmethod
    def delete_document(
        db: Session,
        document: AIDocument,
    ) -> None:

        db.delete(document)
        db.commit()


# ============================================================
# REPOSITORY INSTANCE
# ============================================================

ai_document_repository = AIDocumentRepository()