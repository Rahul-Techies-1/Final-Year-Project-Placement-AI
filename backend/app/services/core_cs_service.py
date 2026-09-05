from datetime import datetime

from sqlalchemy.orm import Session

from app.models.core_cs_progress import CoreCSProgress

from app.repositories.core_cs_topic_repository import (
    core_cs_topic_repository
)

from app.repositories.core_cs_problem_repository import (
    core_cs_problem_repository
)

from app.repositories.core_cs_progress_repository import (
    core_cs_progress_repository
)


class CoreCSService:

    # ========================================================
    # GET CORE CS OVERVIEW
    # ========================================================

    def get_core_cs_overview(
        self,
        db: Session,
        user_id: int
    ):

        total_problems = (
            core_cs_problem_repository.count_active(
                db
            )
        )

        completed_problems = (
            core_cs_progress_repository
            .count_completed_by_user(
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
            core_cs_topic_repository.get_all(
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
    # GET ALL CORE CS TOPICS
    # ========================================================

    def get_core_cs_topics(
        self,
        db: Session
    ):

        return (
            core_cs_topic_repository.get_all(
                db
            )
        )


    # ========================================================
    # GET CORE CS PROBLEMS
    # ========================================================

    def get_core_cs_problems(
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
                core_cs_topic_repository.get_by_id(
                    db,
                    topic_id
                )
            )

            if not topic:

                raise ValueError(
                    "Core CS topic not found."
                )

            problems = (
                core_cs_problem_repository.get_by_topic(
                    db,
                    topic_id
                )
            )

        else:

            problems = (
                core_cs_problem_repository.get_all(
                    db
                )
            )

        # ----------------------------------------------------
        # Get student progress
        # ----------------------------------------------------

        progress_records = (
            core_cs_progress_repository.get_by_user(
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
    # GET SINGLE CORE CS PROBLEM
    # ========================================================

    def get_core_cs_problem(
        self,
        db: Session,
        user_id: int,
        problem_id: int
    ):

        problem = (
            core_cs_problem_repository.get_by_id(
                db,
                problem_id
            )
        )

        if not problem:

            raise ValueError(
                "Core CS problem not found."
            )

        progress = (
            core_cs_progress_repository
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
    # UPDATE CORE CS PROGRESS
    # ========================================================

    def update_core_cs_progress(
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
            core_cs_problem_repository.get_by_id(
                db,
                problem_id
            )
        )

        if not problem:

            raise ValueError(
                "Core CS problem not found."
            )

        # ----------------------------------------------------
        # Check existing progress
        # ----------------------------------------------------

        progress = (
            core_cs_progress_repository
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

            progress = CoreCSProgress(

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
                core_cs_progress_repository.create(
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
                core_cs_progress_repository.update(
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

        return self.update_core_cs_progress(

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

        return self.update_core_cs_progress(

            db=db,

            user_id=user_id,

            problem_id=problem_id,

            completed=False
        )


core_cs_service = CoreCSService()