import io
import math
import re
import uuid
from typing import Any

import numpy as np
from fastapi import UploadFile
from huggingface_hub import InferenceClient
from pypdf import PdfReader
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.models.ai_document_chunk import AIDocumentChunk
from app.repositories.ai_chat_repository import (
    ai_chat_repository
)
from app.repositories.ai_document_repository import (
    ai_document_repository
)


class AIMentorService:

    # ========================================================
    # INITIALIZE SERVICE
    # ========================================================

    def __init__(self):

        # ----------------------------------------------------
        # Hugging Face LLM (chat)
        # ----------------------------------------------------

        self.llm_client = InferenceClient(
            provider="auto",
            api_key=settings.HF_TOKEN
        )

        self.model = settings.HF_MODEL

        # ----------------------------------------------------
        # Hugging Face embeddings (runs on HF servers,
        # nothing heavy is loaded in this process)
        # ----------------------------------------------------

        self.embed_client = InferenceClient(
            provider="hf-inference",
            api_key=settings.HF_TOKEN
        )

        self.embedding_model = (
            "sentence-transformers/all-MiniLM-L6-v2"
        )

    # ========================================================
    # EMBEDDINGS
    # ========================================================

    def _embed_one(self, text: str) -> list[float]:

        out = np.asarray(
            self.embed_client.feature_extraction(
                text,
                model=self.embedding_model
            ),
            dtype=float
        )

        # token-level output -> mean pool
        while out.ndim > 1:
            out = out.mean(axis=0)

        return out.tolist()

    def _embed_many(
        self,
        texts: list[str]
    ) -> list[list[float]] | None:
        """
        Returns one vector per text, or None if the
        embedding API is unavailable (keyword search
        fallback is used in that case).
        """

        try:

            return [
                self._embed_one(text[:2000])
                for text in texts
            ]

        except Exception as exc:

            print("Embedding API unavailable:", exc)

            return None

    # ========================================================
    # KEYWORD FALLBACK
    # ========================================================

    @staticmethod
    def _tokens(text: str) -> list[str]:

        return [
            word
            for word in re.findall(r"[a-z0-9]+", text.lower())
            if len(word) > 2
        ]

    def _keyword_rank(
        self,
        question: str,
        rows: list[AIDocumentChunk],
        top_k: int = 4
    ) -> list[AIDocumentChunk]:

        query_words = set(self._tokens(question))

        scored = []

        for row in rows:

            words = self._tokens(row.content)

            if not words:
                continue

            hits = sum(
                1 for word in words if word in query_words
            )

            scored.append(
                (hits / math.sqrt(len(words)), row)
            )

        scored.sort(key=lambda pair: pair[0], reverse=True)

        return [row for _, row in scored[:top_k]]

    def _rank_chunks(
        self,
        question: str,
        rows: list[AIDocumentChunk],
        top_k: int = 4
    ) -> list[AIDocumentChunk]:

        if all(row.embedding for row in rows):

            try:

                query_vec = np.asarray(
                    self._embed_one(question),
                    dtype=float
                )

                matrix = np.asarray(
                    [row.embedding for row in rows],
                    dtype=float
                )

                query_vec = query_vec / (
                    np.linalg.norm(query_vec) or 1.0
                )

                matrix = matrix / np.clip(
                    np.linalg.norm(
                        matrix, axis=1, keepdims=True
                    ),
                    1e-12,
                    None
                )

                scores = matrix @ query_vec

                order = np.argsort(scores)[::-1][:top_k]

                return [rows[int(i)] for i in order]

            except Exception as exc:

                print("Vector search failed:", exc)

        return self._keyword_rank(question, rows, top_k)

    # ========================================================
    # CLEAN TEXT
    # ========================================================

    def _clean_text(
        self,
        text: str
    ) -> str:

        text = re.sub(
            r"\s+",
            " ",
            text
        )

        return text.strip()

    # ========================================================
    # SPLIT TEXT INTO CHUNKS
    # ========================================================

    def _split_text(
        self,
        text: str,
        chunk_size: int = 1000,
        chunk_overlap: int = 200
    ) -> list[str]:

        if not text:
            return []

        chunks = []

        start = 0

        text_length = len(text)

        while start < text_length:

            end = min(
                start + chunk_size,
                text_length
            )

            chunk = text[start:end].strip()

            if chunk:

                chunks.append(
                    chunk
                )

            if end >= text_length:

                break

            start = (
                end - chunk_overlap
            )

        return chunks

    # ========================================================
    # EXTRACT PDF TEXT
    # ========================================================

    async def _extract_pdf_text(
        self,
        file: UploadFile
    ) -> str:

        contents = await file.read()

        if not contents:

            raise ValueError(
                "Uploaded PDF is empty."
            )

        try:

            reader = PdfReader(io.BytesIO(contents))

        except Exception:

            raise ValueError(
                "The uploaded file is not a valid PDF."
            )

        pages_text = []

        for page in reader.pages:

            page_text = (
                page.extract_text()
                or ""
            )

            if page_text.strip():

                pages_text.append(
                    page_text
                )

        text = self._clean_text(
            "\n".join(pages_text)
        )

        if not text:

            raise ValueError(
                "No readable text was found "
                "inside the PDF."
            )

        return text

    # ========================================================
    # UPLOAD PDF
    # ========================================================

    async def upload_document(
        self,
        db: Session,
        student_id: int,
        file: UploadFile
    ) -> dict[str, Any]:

        # ----------------------------------------------------
        # Validate filename
        # ----------------------------------------------------

        filename = (
            file.filename
            or "document.pdf"
        )

        if not filename.lower().endswith(
            ".pdf"
        ):

            raise ValueError(
                "Only PDF files are supported."
            )

        # ----------------------------------------------------
        # Extract text
        # ----------------------------------------------------

        text = await self._extract_pdf_text(
            file
        )

        # ----------------------------------------------------
        # Create chunks
        # ----------------------------------------------------

        chunks = self._split_text(
            text
        )

        if not chunks:

            raise ValueError(
                "The PDF could not be divided "
                "into readable text chunks."
            )

        # ----------------------------------------------------
        # Generate unique document ID
        # ----------------------------------------------------

        document_id = (
            f"student_{student_id}_"
            f"document_{uuid.uuid4().hex}"
        )

        # ----------------------------------------------------
        # Create embeddings (None -> keyword fallback)
        # ----------------------------------------------------

        embeddings = self._embed_many(chunks)

        # ----------------------------------------------------
        # Create PostgreSQL document record
        # ----------------------------------------------------

        document = (
            ai_document_repository
            .create_document(
                db=db,
                user_id=student_id,
                original_filename=filename,
                stored_filename=document_id,
                file_path="postgres",
            )
        )

        # ----------------------------------------------------
        # Store chunks in PostgreSQL
        # ----------------------------------------------------

        db.add_all([

            AIDocumentChunk(
                document_id=document.id,
                user_id=student_id,
                filename=filename,
                chunk_index=index,
                content=chunk,
                embedding=(
                    embeddings[index]
                    if embeddings
                    else None
                ),
            )

            for index, chunk in enumerate(chunks)
        ])

        db.commit()

        # ----------------------------------------------------
        # Mark document as processed
        # ----------------------------------------------------

        ai_document_repository.update_status(
            db=db,
            document=document,
            status="processed",
        )

        # ----------------------------------------------------
        # Store chunk count
        # ----------------------------------------------------

        ai_document_repository.update_chunk_count(
            db=db,
            document=document,
            chunk_count=len(chunks),
        )

        # ----------------------------------------------------
        # Return upload information
        # ----------------------------------------------------

        return {

            "document_id": document_id,

            "filename": filename,

            "total_chunks": len(chunks),

            "message": (
                "PDF uploaded and indexed "
                "successfully."
            )
        }

    # ========================================================
    # ASK AI MENTOR
    # ========================================================

    def ask_question(
        self,
        db: Session,
        student_id: int,
        question: str,
        session_id: int | None = None,
        chat_history: list[dict[str, str]] | None = None
    ) -> dict[str, Any]:

        # ----------------------------------------------------
        # Validate question
        # ----------------------------------------------------

        if not question or not question.strip():

            raise ValueError(
                "Question cannot be empty."
            )

        question = question.strip()

        if chat_history is None:

            chat_history = []

        # ----------------------------------------------------
        # Load student's chunks
        # ----------------------------------------------------

        rows = (
            db.query(AIDocumentChunk)
            .filter(AIDocumentChunk.user_id == student_id)
            .all()
        )

        if not rows:

            raise ValueError(
                "No documents have been uploaded yet. "
                "Please upload a PDF first."
            )

        # ----------------------------------------------------
        # Create or validate chat session
        # ----------------------------------------------------

        if session_id is None:
            session_title = question[:60].strip()
            if not session_title:
                session_title = "New AI Mentor Chat"

            session = ai_chat_repository.create_session(
                db=db,
                user_id=student_id,
                title=session_title
            )
            session_id = session.id

        else:

            session = (
                ai_chat_repository
                .get_session_by_id(
                    db=db,
                    session_id=session_id,
                    user_id=student_id
                )
            )

            if not session:

                raise ValueError(
                    "Chat session not found."
                )

        # ----------------------------------------------------
        # Retrieve relevant chunks
        # ----------------------------------------------------

        top_rows = self._rank_chunks(
            question,
            rows,
            top_k=4
        )

        documents = [row.content for row in top_rows]

        metadatas = [
            {"filename": row.filename}
            for row in top_rows
        ]

        if not documents:

            raise ValueError(
                "No relevant information was found "
                "in your uploaded documents."
            )

        # ----------------------------------------------------
        # Save student's question
        # ----------------------------------------------------

        ai_chat_repository.add_message(
            db=db,
            session_id=session_id,
            role="user",
            content=question
        )

        # ----------------------------------------------------
        # Build context
        # ----------------------------------------------------

        context_parts = []

        for index, document in enumerate(
            documents
        ):

            context_parts.append(

                f"[Source {index + 1}]\n"
                f"{document}"
            )

        context = "\n\n".join(
            context_parts
        )

        # ----------------------------------------------------
        # Build conversation history
        # ----------------------------------------------------

        conversation_text = ""

        for message in chat_history[-10:]:

            role = message.get(
                "role",
                ""
            )

            content = message.get(
                "content",
                ""
            )

            if role and content:

                conversation_text += (
                    f"{role}: {content}\n"
                )

        # ----------------------------------------------------
        # Build RAG system prompt
        # ----------------------------------------------------

        system_prompt = """
You are PlacementAI's AI Mentor.

Answer the student's question using ONLY
the information provided in the retrieved context.

Rules:

1. Do not invent facts.
2. Do not use information that is not supported
   by the provided context.
3. If the answer is not available in the context,
   clearly say that the uploaded documents do not
   contain enough information.
4. Explain concepts clearly and simply.
5. For technical topics, use examples when the
   retrieved context supports them.
6. Focus on helping the student prepare for placements.

Return a clear and useful answer.
"""

        # ----------------------------------------------------
        # Build user prompt
        # ----------------------------------------------------

        user_prompt = f"""
Conversation History:

{conversation_text}

Student Question:

{question}

Retrieved Context:

{context}

Answer the student's latest question using
the retrieved context and the conversation history.

The conversation history is only used to understand
references such as "it", "this", "that", or
"what you said earlier".

Do not introduce facts that are not supported
by the retrieved context.

If the answer cannot be supported by the retrieved
context, clearly say that the uploaded documents
do not contain enough information.
"""

        # ----------------------------------------------------
        # Call Hugging Face LLM
        # ----------------------------------------------------

        try:

            response = (
                self.llm_client
                .chat
                .completions
                .create(

                    model=self.model,

                    messages=[

                        {
                            "role": "system",
                            "content": system_prompt
                        },

                        {
                            "role": "user",
                            "content": user_prompt
                        }

                    ],

                    max_tokens=700,

                    temperature=0.2
                )
            )

        except Exception as exc:

            raise ValueError(
                f"AI Mentor generation failed: {str(exc)}"
            )

        # ----------------------------------------------------
        # Extract answer
        # ----------------------------------------------------

        try:

            answer = (
                response
                .choices[0]
                .message
                .content
            )

        except Exception:

            raise ValueError(
                "AI Mentor returned an invalid response."
            )

        if not answer:

            raise ValueError(
                "AI Mentor returned an empty answer."
            )

        answer = answer.strip()

        # ----------------------------------------------------
        # Save AI answer
        # ----------------------------------------------------

        ai_chat_repository.add_message(
            db=db,
            session_id=session_id,
            role="assistant",
            content=answer
        )

        # ----------------------------------------------------
        # Update chat session timestamp
        # ----------------------------------------------------

        ai_chat_repository.touch_session(
            db=db,
            session=session
        )

        # ----------------------------------------------------
        # Build sources
        # ----------------------------------------------------

        sources = []

        for metadata in metadatas:

            if metadata:

                source_filename = metadata.get(
                    "filename"
                )

                if source_filename:

                    sources.append(
                        source_filename
                    )

        # ----------------------------------------------------
        # Return response
        # ----------------------------------------------------

        return {

            "question": question,

            "answer": answer,

            "sources": list(
                dict.fromkeys(
                    sources
                )
            ),

            "session_id": session_id
        }

    # ========================================================
    # GET USER DOCUMENTS
    # ========================================================

    def get_user_documents(
        self,
        db: Session,
        student_id: int
    ):

        documents = (
            ai_document_repository
            .get_user_documents(
                db=db,
                user_id=student_id
            )
        )

        return documents

    # ========================================================
    # DELETE DOCUMENT
    # ========================================================

    def delete_document(
        self,
        db: Session,
        student_id: int,
        document_id: int
    ):

        # ----------------------------------------------------
        # Find document belonging to current student
        # ----------------------------------------------------

        document = (
            ai_document_repository
            .get_document_by_id(
                db=db,
                document_id=document_id,
                user_id=student_id
            )
        )

        if not document:

            raise ValueError(
                "Document not found."
            )

        # ----------------------------------------------------
        # Delete document chunks
        # ----------------------------------------------------

        db.query(AIDocumentChunk).filter(
            AIDocumentChunk.document_id == document.id,
            AIDocumentChunk.user_id == student_id,
        ).delete(synchronize_session=False)

        db.commit()

        # ----------------------------------------------------
        # Delete PostgreSQL document record
        # ----------------------------------------------------

        ai_document_repository.delete_document(
            db=db,
            document=document
        )

        return {

            "message":
                "Document deleted successfully."

        }

    def create_chat_session(
        self,
        db: Session,
        student_id: int,
        title: str
    ):
        if not title or not title.strip():
            raise ValueError(
                "Chat session title cannot be empty."
            )
        session =( ai_chat_repository.create_session(
            db=db,
            user_id=student_id,
            title=title.strip()
        ))
        return session
    def get_chat_sessions(
        self,
        db: Session,
        student_id: int
    ):
        return ( ai_chat_repository.get_user_sessions(
            db=db,
            user_id=student_id
        ))
    def get_chat_session_by_id(
        self,
        db: Session,
        student_id: int,
        session_id: int
    ):
        session = ( ai_chat_repository.get_session_by_id(
            db=db,
            session_id=session_id,
            user_id=student_id
        ))
        if not session:
            raise ValueError(
                "Chat session not found."
            )
        messages = ( ai_chat_repository.get_session_messages(
            db=db,
            session_id=session_id
        ))
        return session, messages
    
    def delete_chat_session(
        self,
        db: Session,
        student_id: int,
        session_id: int
    ):
        session = ( ai_chat_repository.get_session_by_id(
            db=db,
            session_id=session_id,
            user_id=student_id
        ))
        if not session:
            raise ValueError(
                "Chat session not found."
            )
        ai_chat_repository.delete_session(
            db=db,
            session=session
        )
        return {
            "message": "Chat session deleted successfully."
        }


        


# ============================================================
# SERVICE INSTANCE
# ============================================================

ai_mentor_service = AIMentorService()