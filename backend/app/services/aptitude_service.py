from datetime import datetime

from sqlalchemy.orm import Session

from app.models.aptitude_progress import AptitudeProgress

from app.repositories.aptitude_topic_repository import (
    aptitude_topic_repository
)

from app.repositories.aptitude_question_repository import (
    aptitude_question_repository
)

from app.repositories.aptitude_progress_repository import (
    aptitude_progress_repository
)


class AptitudeService:

    # ========================================================
    # GET APTITUDE OVERVIEW
    # ========================================================

    def get_aptitude_overview(
        self,
        db: Session,
        user_id: int
    ):

        total_questions = (
            aptitude_question_repository.count_active(
                db
            )
        )

        completed_questions = (
            aptitude_progress_repository
            .count_completed_by_user(
                db,
                user_id
            )
        )

        completed_questions = min(
            completed_questions,
            total_questions
        )

        remaining_questions = (
            total_questions -
            completed_questions
        )

        progress_percentage = (
            (completed_questions / total_questions) * 100
            if total_questions > 0
            else 0
        )

        topics = (
            aptitude_topic_repository.get_all(
                db
            )
        )

        return {

            "progress": {

                "total_questions":
                    total_questions,

                "completed_questions":
                    completed_questions,

                "remaining_questions":
                    remaining_questions,

                "progress_percentage":
                    round(
                        progress_percentage,
                        2
                    )
            },

            "topics": topics
        }


    # ========================================================
    # GET ALL APTITUDE TOPICS
    # ========================================================

    def get_aptitude_topics(
        self,
        db: Session
    ):

        return (
            aptitude_topic_repository.get_all(
                db
            )
        )


    # ========================================================
    # GET APTITUDE QUESTIONS
    # ========================================================

    def get_aptitude_questions(
        self,
        db: Session,
        user_id: int,
        topic_id: int | None = None
    ):

        if topic_id is not None:

            topic = (
                aptitude_topic_repository.get_by_id(
                    db,
                    topic_id
                )
            )

            if not topic:

                raise ValueError(
                    "Aptitude topic not found."
                )

            questions = (
                aptitude_question_repository.get_by_topic(
                    db,
                    topic_id
                )
            )

        else:

            questions = (
                aptitude_question_repository.get_all(
                    db
                )
            )

        progress_records = (
            aptitude_progress_repository.get_by_user(
                db,
                user_id
            )
        )

        progress_map = {

            progress.question_id:
                progress

            for progress in progress_records
        }

        items = []

        completed_count = 0

        for question in questions:

            progress = (
                progress_map.get(
                    question.id
                )
            )

            completed = (
                progress.completed
                if progress
                else False
            )

            completed_at = (
                progress.completed_at
                if progress
                else None
            )

            if completed:
                completed_count += 1

            items.append({

                "id":
                    question.id,

                "topic_id":
                    question.topic_id,

                "question":
                    question.question,

                "option_a":
                    question.option_a,

                "option_b":
                    question.option_b,

                "option_c":
                    question.option_c,

                "option_d":
                    question.option_d,

                "difficulty":
                    question.difficulty,

                "completed":
                    completed,

                "completed_at":
                    completed_at
            })

        total = len(items)

        remaining = (
            total -
            completed_count
        )

        return {

            "items":
                items,

            "total":
                total,

            "completed":
                completed_count,

            "remaining":
                remaining
        }


    # ========================================================
    # GET SINGLE APTITUDE QUESTION
    # ========================================================

    def get_aptitude_question(
        self,
        db: Session,
        user_id: int,
        question_id: int
    ):

        question = (
            aptitude_question_repository.get_by_id(
                db,
                question_id
            )
        )

        if not question:

            raise ValueError(
                "Aptitude question not found."
            )

        progress = (
            aptitude_progress_repository
            .get_by_user_and_question(
                db,
                user_id,
                question_id
            )
        )

        return {

            "id":
                question.id,

            "topic_id":
                question.topic_id,

            "question":
                question.question,

            "option_a":
                question.option_a,

            "option_b":
                question.option_b,

            "option_c":
                question.option_c,

            "option_d":
                question.option_d,

            "difficulty":
                question.difficulty,

            "completed":
                progress.completed
                if progress
                else False,

            "completed_at":
                progress.completed_at
                if progress
                else None
        }


    # ========================================================
    # SUBMIT APTITUDE ANSWER
    # ========================================================

    def submit_aptitude_answer(
        self,
        db: Session,
        user_id: int,
        question_id: int,
        answer: str
    ):

        # ----------------------------------------------------
        # Get question
        # ----------------------------------------------------

        question = (
            aptitude_question_repository.get_by_id(
                db,
                question_id
            )
        )

        if not question:

            raise ValueError(
                "Aptitude question not found."
            )


        # ----------------------------------------------------
        # Normalize answer
        # ----------------------------------------------------

        selected_answer = (
            answer.strip().upper()
        )


        # ----------------------------------------------------
        # Validate answer
        # ----------------------------------------------------

        valid_answers = {
            "A",
            "B",
            "C",
            "D"
        }

        if selected_answer not in valid_answers:

            raise ValueError(
                "Answer must be A, B, C, or D."
            )


        # ----------------------------------------------------
        # Check answer
        # ----------------------------------------------------

        correct_answer = (
            question.correct_answer
            .strip()
            .upper()
        )

        is_correct = (
            selected_answer ==
            correct_answer
        )


        # ----------------------------------------------------
        # Mark completed
        #
        # We consider a submitted question completed
        # regardless of whether the answer is correct.
        #
        # This tracks practice activity rather than accuracy.
        # ----------------------------------------------------

        progress = (
            aptitude_progress_repository
            .get_by_user_and_question(
                db,
                user_id,
                question_id
            )
        )


        if not progress:

            progress = AptitudeProgress(

                user_id=user_id,

                question_id=question_id,

                completed=True,

                completed_at=datetime.utcnow()
            )

            aptitude_progress_repository.create(
                db,
                progress
            )

        else:

            progress.completed = True

            progress.completed_at = (
                datetime.utcnow()
            )

            aptitude_progress_repository.update(
                db,
                progress
            )


        # ----------------------------------------------------
        # Return result
        # ----------------------------------------------------

        return {

            "question_id":
                question.id,

            "selected_answer":
                selected_answer,

            "correct_answer":
                correct_answer,

            "is_correct":
                is_correct,

            "explanation":
                question.explanation,

            "completed":
                True
        }


    # ========================================================
    # UPDATE APTITUDE PROGRESS
    # ========================================================

    def update_aptitude_progress(
        self,
        db: Session,
        user_id: int,
        question_id: int,
        completed: bool
    ):

        question = (
            aptitude_question_repository.get_by_id(
                db,
                question_id
            )
        )

        if not question:

            raise ValueError(
                "Aptitude question not found."
            )

        progress = (
            aptitude_progress_repository
            .get_by_user_and_question(
                db,
                user_id,
                question_id
            )
        )

        if not progress:

            progress = AptitudeProgress(

                user_id=user_id,

                question_id=question_id,

                completed=completed,

                completed_at=(
                    datetime.utcnow()
                    if completed
                    else None
                )
            )

            progress = (
                aptitude_progress_repository.create(
                    db,
                    progress
                )
            )

        else:

            progress.completed = completed

            progress.completed_at = (

                datetime.utcnow()
                if completed
                else None
            )

            progress = (
                aptitude_progress_repository.update(
                    db,
                    progress
                )
            )

        return progress


    # ========================================================
    # MARK QUESTION COMPLETED
    # ========================================================

    def mark_question_completed(
        self,
        db: Session,
        user_id: int,
        question_id: int
    ):

        return self.update_aptitude_progress(

            db=db,

            user_id=user_id,

            question_id=question_id,

            completed=True
        )


    # ========================================================
    # MARK QUESTION INCOMPLETE
    # ========================================================

    def mark_question_incomplete(
        self,
        db: Session,
        user_id: int,
        question_id: int
    ):

        return self.update_aptitude_progress(

            db=db,

            user_id=user_id,

            question_id=question_id,

            completed=False
        )


aptitude_service = AptitudeService()