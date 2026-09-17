from datetime import datetime

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

from app.models.sql_topic import SQLTopic
from app.models.sql_problem import SQLProblem
from app.models.sql_progress import SQLProgress


class SQLService:

    # ============================================================
    # SQL OVERVIEW
    # ============================================================

    @staticmethod
    def get_sql_overview(
        db: Session,
        user_id: int
    ):

        total_problems = (
            db.query(SQLProblem)
            .filter(
                SQLProblem.is_active.is_(True)
            )
            .count()
        )

        completed_problems = (
            db.query(SQLProgress)
            .join(
                SQLProblem,
                SQLProblem.id == SQLProgress.problem_id
            )
            .filter(
                SQLProgress.user_id == user_id,
                SQLProgress.completed.is_(True),
                SQLProblem.is_active.is_(True)
            )
            .count()
        )

        remaining_problems = (
            total_problems - completed_problems
        )

        if total_problems > 0:
            progress_percentage = round(
                (
                    completed_problems
                    / total_problems
                ) * 100,
                2
            )
        else:
            progress_percentage = 0

        return {
            "progress": {
                "total_problems": total_problems,
                "completed_problems": completed_problems,
                "remaining_problems": remaining_problems,
                "progress_percentage": progress_percentage
            }
        }

    # ============================================================
    # SQL TOPICS
    # ============================================================

    @staticmethod
    def get_sql_topics(
        db: Session
    ):

        topics = (
            db.query(SQLTopic)
            .order_by(
                SQLTopic.display_order.asc(),
                SQLTopic.id.asc()
            )
            .all()
        )

        return [
            {
                "id": topic.id,
                "name": topic.name,
                "description": topic.description,
                "display_order": topic.display_order
            }
            for topic in topics
        ]

    # ============================================================
    # SQL PROBLEMS
    # ============================================================

    @staticmethod
    def get_sql_problems(
        db: Session,
        user_id: int,
        topic_id: int | None = None
    ):

        query = (
            db.query(
                SQLProblem,
                SQLProgress.completed,
                SQLProgress.completed_at
            )
            .outerjoin(
                SQLProgress,
                (
                    SQLProgress.problem_id
                    == SQLProblem.id
                )
                & (
                    SQLProgress.user_id
                    == user_id
                )
            )
            .filter(
                SQLProblem.is_active.is_(True)
            )
        )

        if topic_id is not None:

            query = query.filter(
                SQLProblem.topic_id == topic_id
            )

        query = query.order_by(
            SQLProblem.id.asc()
        )

        results = query.all()

        items = []

        for problem, completed, completed_at in results:

            items.append(
                {
                    "id": problem.id,
                    "topic_id": problem.topic_id,
                    "title": problem.title,
                    "description": problem.description,
                    "difficulty": problem.difficulty,
                    "expected_query": problem.expected_query,
                    "completed": (
                        bool(completed)
                        if completed is not None
                        else False
                    ),
                    "completed_at": (
                        completed_at.isoformat()
                        if completed_at
                        else None
                    )
                }
            )

        completed_count = sum(
            1
            for item in items
            if item["completed"]
        )

        total_count = len(items)

        return {
            "items": items,
            "total": total_count,
            "completed": completed_count,
            "remaining": (
                total_count - completed_count
            )
        }

    # ============================================================
    # SINGLE SQL PROBLEM
    # ============================================================

    @staticmethod
    def get_sql_problem_by_id(
        db: Session,
        user_id: int,
        problem_id: int
    ):

        result = (
            db.query(
                SQLProblem,
                SQLProgress.completed,
                SQLProgress.completed_at
            )
            .outerjoin(
                SQLProgress,
                (
                    SQLProgress.problem_id
                    == SQLProblem.id
                )
                & (
                    SQLProgress.user_id
                    == user_id
                )
            )
            .filter(
                SQLProblem.id == problem_id,
                SQLProblem.is_active.is_(True)
            )
            .first()
        )

        if not result:
            return None

        problem, completed, completed_at = result

        return {
            "id": problem.id,
            "topic_id": problem.topic_id,
            "title": problem.title,
            "description": problem.description,
            "difficulty": problem.difficulty,
            "expected_query": problem.expected_query,
            "completed": (
                bool(completed)
                if completed is not None
                else False
            ),
            "completed_at": (
                completed_at.isoformat()
                if completed_at
                else None
            )
        }

    # ============================================================
    # EXECUTE SQL QUERY
    # ============================================================

    @staticmethod
    def execute_sql_query(
        query: str,
        problem_id: int
    ):
        """
        Execute a student's SQL query against a temporary
        SQLite practice database.

        The student's query NEVER runs against the
        PlacementAI PostgreSQL database.
        """

        cleaned_query = query.strip()

        if not cleaned_query:
            raise ValueError(
                "Please enter a SQL query."
            )

        # --------------------------------------------------------
        # Normalize query
        # --------------------------------------------------------

        normalized_query = (
            cleaned_query
            .lower()
            .strip()
        )

        # --------------------------------------------------------
        # Only SELECT and WITH queries are allowed
        # --------------------------------------------------------

        if not (
            normalized_query.startswith("select")
            or normalized_query.startswith("with")
        ):
            raise ValueError(
                "Only SELECT and WITH queries are allowed."
            )

        # --------------------------------------------------------
        # Prevent multiple SQL statements
        # --------------------------------------------------------

        query_without_final_semicolon = (
            cleaned_query.rstrip(";").strip()
        )

        if ";" in query_without_final_semicolon:
            raise ValueError(
                "Multiple SQL statements are not allowed."
            )

        # --------------------------------------------------------
        # Block dangerous SQL keywords
        # --------------------------------------------------------

        forbidden_keywords = [
            "insert",
            "update",
            "delete",
            "drop",
            "alter",
            "truncate",
            "create",
            "grant",
            "revoke",
            "replace",
            "attach",
            "detach",
            "pragma",
        ]

        normalized_for_check = (
            f" {normalized_query} "
        )

        for keyword in forbidden_keywords:

            if (
                f" {keyword} "
                in normalized_for_check
            ):
                raise ValueError(
                    "This SQL operation is not allowed. "
                    "Only read-only queries are permitted."
                )

        # --------------------------------------------------------
        # Create temporary SQLite database
        # --------------------------------------------------------

        engine = create_engine(
            "sqlite:///:memory:",
            future=True
        )

        try:

            with engine.begin() as connection:

                # =================================================
                # DEPARTMENTS TABLE
                # =================================================

                connection.execute(
                    text(
                        """
                        CREATE TABLE departments (
                            id INTEGER PRIMARY KEY,
                            name TEXT NOT NULL
                        )
                        """
                    )
                )

                # =================================================
                # EMPLOYEES TABLE
                # =================================================

                connection.execute(
                    text(
                        """
                        CREATE TABLE employees (
                            id INTEGER PRIMARY KEY,
                            name TEXT NOT NULL,
                            email TEXT,
                            salary INTEGER NOT NULL,
                            department_id INTEGER
                        )
                        """
                    )
                )

                # =================================================
                # DEPARTMENT DATA
                # =================================================

                connection.execute(
                    text(
                        """
                        INSERT INTO departments
                        (id, name)
                        VALUES
                        (1, 'IT'),
                        (2, 'HR'),
                        (3, 'Finance'),
                        (4, 'Marketing')
                        """
                    )
                )

                # =================================================
                # EMPLOYEE DATA
                # =================================================

                connection.execute(
                    text(
                        """
                        INSERT INTO employees
                        (
                            id,
                            name,
                            email,
                            salary,
                            department_id
                        )
                        VALUES
                        (
                            1,
                            'Rahul',
                            'rahul@example.com',
                            75000,
                            1
                        ),
                        (
                            2,
                            'Priya',
                            'priya@example.com',
                            65000,
                            1
                        ),
                        (
                            3,
                            'Aman',
                            'aman@example.com',
                            55000,
                            2
                        ),
                        (
                            4,
                            'Neha',
                            NULL,
                            48000,
                            2
                        ),
                        (
                            5,
                            'Karan',
                            'karan@example.com',
                            90000,
                            3
                        ),
                        (
                            6,
                            'Simran',
                            'simran@example.com',
                            60000,
                            3
                        ),
                        (
                            7,
                            'Arjun',
                            'arjun@example.com',
                            52000,
                            4
                        ),
                        (
                            8,
                            'Anjali',
                            NULL,
                            45000,
                            NULL
                        )
                        """
                    )
                )

                # =================================================
                # EXECUTE STUDENT QUERY
                # =================================================

                result = connection.execute(
                    text(
                        query_without_final_semicolon
                    )
                )

                rows = result.fetchall()

                columns = list(
                    result.keys()
                )

                # =================================================
                # FORMAT RESULT
                # =================================================

                formatted_rows = []

                for row in rows:

                    formatted_rows.append(
                        {
                            column: value
                            for column, value
                            in zip(
                                columns,
                                row
                            )
                        }
                    )

                return {
                    "success": True,
                    "problem_id": problem_id,
                    "columns": columns,
                    "rows": formatted_rows,
                    "row_count": len(
                        formatted_rows
                    ),
                    "message": (
                        "Query executed successfully."
                    )
                }

        except ValueError:
            raise

        except Exception as exc:

            raise ValueError(
                f"SQL execution error: {str(exc)}"
            )

        finally:

            engine.dispose()

    # ============================================================
    # UPDATE SQL PROGRESS
    # ============================================================

    @staticmethod
    def update_sql_progress(
        db: Session,
        user_id: int,
        problem_id: int,
        completed: bool
    ):

        problem = (
            db.query(SQLProblem)
            .filter(
                SQLProblem.id == problem_id,
                SQLProblem.is_active.is_(True)
            )
            .first()
        )

        if not problem:
            return None

        progress = (
            db.query(SQLProgress)
            .filter(
                SQLProgress.user_id == user_id,
                SQLProgress.problem_id == problem_id
            )
            .first()
        )

        if progress is None:

            progress = SQLProgress(
                user_id=user_id,
                problem_id=problem_id,
                completed=completed,
                completed_at=(
                    datetime.utcnow()
                    if completed
                    else None
                )
            )

            db.add(progress)

        else:

            progress.completed = completed

            progress.completed_at = (
                datetime.utcnow()
                if completed
                else None
            )

        db.commit()
        db.refresh(progress)

        return {
            "problem_id": progress.problem_id,
            "completed": progress.completed,
            "completed_at": (
                progress.completed_at.isoformat()
                if progress.completed_at
                else None
            )
        }

    # ============================================================
    # MARK COMPLETE
    # ============================================================

    @staticmethod
    def mark_sql_problem_completed(
        db: Session,
        user_id: int,
        problem_id: int
    ):

        return SQLService.update_sql_progress(
            db=db,
            user_id=user_id,
            problem_id=problem_id,
            completed=True
        )

    # ============================================================
    # MARK INCOMPLETE
    # ============================================================

    @staticmethod
    def mark_sql_problem_incomplete(
        db: Session,
        user_id: int,
        problem_id: int
    ):

        return SQLService.update_sql_progress(
            db=db,
            user_id=user_id,
            problem_id=problem_id,
            completed=False
        )


sql_service = SQLService()