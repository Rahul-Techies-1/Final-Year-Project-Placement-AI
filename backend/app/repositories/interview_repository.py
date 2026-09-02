from sqlalchemy.orm import Session
from datetime import datetime

from app.models.interview import Interview
from app.models.application import Application
from app.models.job import Job


class InterviewRepository:

    # ========================================================
    # INTERVIEW
    # ========================================================

    def create(
        self,
        db: Session,
        interview: Interview
    ) -> Interview:

        db.add(interview)
        db.commit()
        db.refresh(interview)

        return interview

    def get_by_id(
        self,
        db: Session,
        interview_id: int
    ) -> Interview | None:

        return (
            db.query(Interview)
            .filter(
                Interview.id == interview_id
            )
            .first()
        )

    def get_by_application_id(
        self,
        db: Session,
        application_id: int
    ) -> Interview | None:

        return (
            db.query(Interview)
            .filter(
                Interview.application_id == application_id
            )
            .first()
        )

    def get_all(
        self,
        db: Session,
        page: int = 1,
        limit: int = 10,
        status: str | None = None,
        interview_type: str | None = None,
        recruiter_id: int | None = None
    ):

        query = (
            db.query(Interview)
            .join(Interview.application)
            .join(Application.job)
            )
        if recruiter_id is not None:
            query = query.filter(
                Job.posted_by == recruiter_id
            )

        if status:
            query = query.filter(
                Interview.status == status
            )

        if interview_type:
            query = query.filter(
                Interview.interview_type.ilike(
                    f"%{interview_type}%"
                )
            )

        total = query.count()

        interviews = (
            query
            .order_by(
                Interview.scheduled_at
            )
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        return interviews, total

    def update_status(
        self,
        db: Session,
        interview: Interview,
        status: str
    ) -> Interview:

        interview.status = status

        db.commit()
        db.refresh(interview)

        return interview

    def delete(
        self,
        db: Session,
        interview: Interview
    ) -> None:

        db.delete(interview)
        db.commit()

    # ========================================================
    # STUDENT INTERVIEWS
    # ========================================================

    def get_by_student_id(
        self,
        db: Session,
        student_id: int
    ) -> list[Interview]:

        return (
            db.query(Interview)
            .join(
                Interview.application
            )
            .filter(
                Application.student_id == student_id
            )
            .order_by(
                Interview.scheduled_at.asc()
            )
            .all()
        )

    def count_by_student(
        self,
        db: Session,
        student_id: int
    ) -> int:

        return (
            db.query(Interview)
            .join(
                Interview.application
            )
            .filter(
                Application.student_id == student_id
            )
            .count()
        )

    def get_upcoming_by_student(
        self,
        db: Session,
        student_id: int,
        limit: int = 5
    ) -> list[Interview]:

        return (
            db.query(Interview)
            .join(
                Interview.application
            )
            .join(
                Application.job
            )
            .filter(
                Application.student_id == student_id,
                Interview.scheduled_at >= datetime.utcnow(),
                Interview.status == "scheduled"
            )
            .order_by(
                Interview.scheduled_at.asc()
            )
            .limit(limit)
            .all()
        )

    # ========================================================
    # RECRUITER DASHBOARD
    # ========================================================

    def count_by_recruiter(
        self,
        db: Session,
        recruiter_id: int
    ) -> int:

        return (
            db.query(Interview)
            .join(
                Interview.application
            )
            .join(
                Application.job
            )
            .filter(
                Job.posted_by == recruiter_id
            )
            .count()
        )

    def get_upcoming_by_recruiter(
        self,
        db: Session,
        recruiter_id: int,
        limit: int = 5
    ):

        return (
            db.query(Interview)
            .join(
                Interview.application
            )
            .join(
                Application.job
            )
            .filter(
                Job.posted_by == recruiter_id,
                Interview.scheduled_at >= datetime.utcnow(),
                Interview.status == "scheduled"
            )
            .order_by(
                Interview.scheduled_at.asc()
            )
            .limit(limit)
            .all()
        )


interview_repository = InterviewRepository()