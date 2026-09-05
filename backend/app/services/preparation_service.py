from datetime import datetime

from sqlalchemy.orm import Session

from app.models.dsa_progress import DSAProgress

from app.repositories.dsa_topic_repository import (
    dsa_topic_repository
)

from app.repositories.dsa_problem_repository import (
    dsa_problem_repository
)

from app.repositories.dsa_progress_repository import (
    dsa_progress_repository
)


class PreparationService:

    # ========================================================
    # GET DSA OVERVIEW
    # ========================================================

    def get_dsa_overview(
        self,
        db: Session,
        user_id: int
    ):

        total_problems = (
            dsa_problem_repository.count_active(
                db
            )
        )

        completed_problems = (
            dsa_progress_repository.count_completed_by_user(
                db,
                user_id
            )
        )

        # ----------------------------------------------------
        # Safety: completed cannot exceed total active problems
        # ----------------------------------------------------

        completed_problems = min(
            completed_problems,
            total_problems
        )

        remaining_problems = (
            total_problems -
            completed_problems
        )

        progress_percentage = (
            (completed_problems / total_problems) * 100
            if total_problems > 0
            else 0
        )

        topics = (
            dsa_topic_repository.get_all(
                db
            )
        )

        return {

            "progress": {

                "total_problems":
                    total_problems,

                "completed_problems":
                    completed_problems,

                "remaining_problems":
                    remaining_problems,

                "progress_percentage":
                    round(
                        progress_percentage,
                        2
                    )
            },

            "topics": topics
        }


    # ========================================================
    # GET ALL DSA TOPICS
    # ========================================================

    def get_dsa_topics(
        self,
        db: Session
    ):

        return (
            dsa_topic_repository.get_all(
                db
            )
        )


    # ========================================================
    # GET DSA PROBLEMS
    # ========================================================

    def get_dsa_problems(
        self,
        db: Session,
        user_id: int,
        topic_id: int | None = None
    ):

        # ----------------------------------------------------
        # Get problems
        # ----------------------------------------------------

        if topic_id is not None:

            topic = (
                dsa_topic_repository.get_by_id(
                    db,
                    topic_id
                )
            )

            if not topic:

                raise ValueError(
                    "DSA topic not found."
                )

            problems = (
                dsa_problem_repository.get_by_topic(
                    db,
                    topic_id
                )
            )

        else:

            problems = (
                dsa_problem_repository.get_all(
                    db
                )
            )

        # ----------------------------------------------------
        # Get student progress
        # ----------------------------------------------------

        progress_records = (
            dsa_progress_repository.get_by_user(
                db,
                user_id
            )
        )

        progress_map = {

            progress.problem_id:
                progress

            for progress in progress_records
        }

        # ----------------------------------------------------
        # Build response
        # ----------------------------------------------------

        items = []

        completed_count = 0

        for problem in problems:

            progress = (
                progress_map.get(
                    problem.id
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
                    problem.id,

                "topic_id":
                    problem.topic_id,

                "title":
                    problem.title,

                "description":
                    problem.description,

                "difficulty":
                    problem.difficulty,

                "external_url":
                    problem.external_url,

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
    # GET SINGLE DSA PROBLEM
    # ========================================================

    def get_dsa_problem(
        self,
        db: Session,
        user_id: int,
        problem_id: int
    ):

        problem = (
            dsa_problem_repository.get_by_id(
                db,
                problem_id
            )
        )

        if not problem:

            raise ValueError(
                "DSA problem not found."
            )

        progress = (
            dsa_progress_repository
            .get_by_user_and_problem(
                db,
                user_id,
                problem_id
            )
        )

        return {

            "id":
                problem.id,

            "topic_id":
                problem.topic_id,

            "title":
                problem.title,

            "description":
                problem.description,

            "difficulty":
                problem.difficulty,

            "external_url":
                problem.external_url,

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
    # UPDATE DSA PROBLEM PROGRESS
    # ========================================================

    def update_dsa_progress(
        self,
        db: Session,
        user_id: int,
        problem_id: int,
        completed: bool
    ):

        # ----------------------------------------------------
        # Check problem exists
        # ----------------------------------------------------

        problem = (
            dsa_problem_repository.get_by_id(
                db,
                problem_id
            )
        )

        if not problem:

            raise ValueError(
                "DSA problem not found."
            )

        # ----------------------------------------------------
        # Check existing progress
        # ----------------------------------------------------

        progress = (
            dsa_progress_repository
            .get_by_user_and_problem(
                db,
                user_id,
                problem_id
            )
        )

        # ----------------------------------------------------
        # Create progress if it doesn't exist
        # ----------------------------------------------------

        if not progress:

            progress = DSAProgress(

                user_id=user_id,

                problem_id=problem_id,

                completed=completed,

                completed_at=(
                    datetime.utcnow()
                    if completed
                    else None
                )
            )

            progress = (
                dsa_progress_repository.create(
                    db,
                    progress
                )
            )

        # ----------------------------------------------------
        # Update existing progress
        # ----------------------------------------------------

        else:

            progress.completed = completed

            progress.completed_at = (

                datetime.utcnow()
                if completed
                else None
            )

            progress = (
                dsa_progress_repository.update(
                    db,
                    progress
                )
            )

        return progress


    # ========================================================
    # MARK PROBLEM COMPLETE
    # ========================================================

    def mark_problem_completed(
        self,
        db: Session,
        user_id: int,
        problem_id: int
    ):

        return self.update_dsa_progress(

            db=db,

            user_id=user_id,

            problem_id=problem_id,

            completed=True
        )


    # ========================================================
    # MARK PROBLEM INCOMPLETE
    # ========================================================

    def mark_problem_incomplete(
        self,
        db: Session,
        user_id: int,
        problem_id: int
    ):

        return self.update_dsa_progress(

            db=db,

            user_id=user_id,

            problem_id=problem_id,

            completed=False
        )


preparation_service = PreparationService()