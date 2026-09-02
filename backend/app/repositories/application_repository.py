from sqlalchemy.orm import Session,contains_eager
from sqlalchemy import or_, func

from app.models.application import Application
from app.models.user import User
from app.models.job import Job


class ApplicationRepository:

    # ========================================================
    # APPLICATION
    # ========================================================

    def create(
        self,
        db: Session,
        application: Application
    ) -> Application:

        db.add(application)
        db.commit()
        db.refresh(application)

        return application

    def get_by_student_and_job(
        self,
        db: Session,
        student_id: int,
        job_id: int
    ) -> Application | None:

        return (
            db.query(Application)
            .filter(
                Application.student_id == student_id,
                Application.job_id == job_id
            )
            .first()
        )

    def get_by_job(
        self,
        db: Session,
        job_id: int,
        page: int,
        limit: int,
        status: str | None = None,
        search: str | None = None
    ):

        query = (
            db.query(Application)
            .join(
                User,
                Application.student_id == User.id
            )
            .options(
                contains_eager(Application.student)
            )
            .filter(
                Application.job_id == job_id
            )
        )

        if status:
            query = query.filter(
                Application.status == status
            )

        if search:
            query = query.filter(
                or_(
                    User.full_name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%")
                )
            )

        return (
            query
            .order_by(Application.id.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

    def get_by_student(
        self,
        db: Session,
        student_id: int
    ):

        return (
            db.query(Application)
            .join(
                Job,
                Application.job_id == Job.id
            )
            .filter(
                Application.student_id == student_id
            )
            .order_by(
                Application.id.desc()
            )
            .all()
        )

    def get_by_id(
        self,
        db: Session,
        application_id: int
    ) -> Application | None:

        return (
            db.query(Application)
            .filter(
                Application.id == application_id
            )
            .first()
        )

    # ========================================================
    # APPLICATION DETAILS
    # ========================================================

    def get_application_details(
        self,
        db: Session,
        application_id: int
    ) -> Application | None:

        return (
            db.query(Application)
            .join(
                Application.job
            )
            .filter(
                Application.id == application_id
            )
            .first()
        )

    # ========================================================
    # UPDATE / DELETE
    # ========================================================

    def update(
        self,
        db: Session,
        application: Application
    ) -> Application:

        db.commit()
        db.refresh(application)

        return application

    def delete(
        self,
        db: Session,
        application: Application
    ):

        db.delete(application)
        db.commit()

    # ========================================================
    # APPLICATION STATISTICS
    # ========================================================

    def get_application_stats(
        self,
        db: Session,
        job_id: int
    ):

        applications = (
            db.query(Application)
            .filter(
                Application.job_id == job_id
            )
            .all()
        )

        stats = {
            "total": len(applications),
            "applied": 0,
            "shortlisted": 0,
            "interview_scheduled": 0,
            "rejected": 0,
            "hired": 0,
        }

        for application in applications:

            if application.status == "Applied":
                stats["applied"] += 1

            elif application.status == "Shortlisted":
                stats["shortlisted"] += 1

            elif application.status == "Interview Scheduled":
                stats["interview_scheduled"] += 1

            elif application.status == "Rejected":
                stats["rejected"] += 1

            elif application.status == "Hired":
                stats["hired"] += 1

        return stats

    # ========================================================
    # RECRUITER DASHBOARD
    # ========================================================

    def count_by_recruiter(
        self,
        db: Session,
        recruiter_id: int
    ) -> int:

        return (
            db.query(Application)
            .join(Application.job)
            .filter(
                Job.posted_by == recruiter_id
            )
            .count()
        )

    def count_by_status_for_recruiter(
        self,
        db: Session,
        recruiter_id: int,
        status: str
    ) -> int:

        return (
            db.query(Application)
            .join(Application.job)
            .filter(
                Job.posted_by == recruiter_id,
                Application.status == status
            )
            .count()
        )

    def get_status_counts_by_recruiter(
        self,
        db: Session,
        recruiter_id: int
    ) -> dict[str, int]:

        results = (
            db.query(
                Application.status,
                func.count(Application.id)
            )
            .join(Application.job)
            .filter(
                Job.posted_by == recruiter_id
            )
            .group_by(
                Application.status
            )
            .all()
        )

        status_counts = {
            "Applied": 0,
            "Shortlisted": 0,
            "Interview Scheduled": 0,
            "Rejected": 0,
            "Hired": 0
        }

        for application_status, count in results:

            if application_status in status_counts:
                status_counts[application_status] = count

        return status_counts

    def get_recent_by_recruiter(
        self,
        db: Session,
        recruiter_id: int,
        page: int = 1,
        limit: int = 5
    ):

        return (
            db.query(Application)
            .join(Application.job)
            .filter(
                Job.posted_by == recruiter_id
            )
            .order_by(
                Application.id.desc()
            )
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

    # ========================================================
    # STUDENT DASHBOARD
    # ========================================================

    def count_by_student(
        self,
        db: Session,
        student_id: int
    ) -> int:

        return (
            db.query(Application)
            .filter(
                Application.student_id == student_id
            )
            .count()
        )

    def count_by_status_for_student(
        self,
        db: Session,
        student_id: int,
        status: str
    ) -> int:

        return (
            db.query(Application)
            .filter(
                Application.student_id == student_id,
                Application.status == status
            )
            .count()
        )

    def get_status_counts_by_student(
        self,
        db: Session,
        student_id: int
    ) -> dict[str, int]:

        results = (
            db.query(
                Application.status,
                func.count(Application.id)
            )
            .filter(
                Application.student_id == student_id
            )
            .group_by(
                Application.status
            )
            .all()
        )

        status_counts = {
            "Applied": 0,
            "Shortlisted": 0,
            "Interview Scheduled": 0,
            "Rejected": 0,
            "Hired": 0
        }

        for application_status, count in results:

            if application_status in status_counts:
                status_counts[application_status] = count

        return status_counts

    def get_recent_by_student(
        self,
        db: Session,
        student_id: int,
        page: int = 1,
        limit: int = 5
    ):

        return (
            db.query(Application)
            .join(Application.job)
            .filter(
                Application.student_id == student_id
            )
            .order_by(
                Application.id.desc()
            )
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )
    def count_recent_by_student(
            self,
            db: Session,
            student_id: int
    )-> int:
        return(
            db.query(Application)
            .filter(
                Application.student_id == student_id
            )
            .count()
        )


application_repository = ApplicationRepository()