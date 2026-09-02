from sqlalchemy.orm import Session

from app.repositories.job_repository import job_repository
from app.repositories.application_repository import application_repository
from app.repositories.interview_repository import interview_repository


class DashboardService:

    def get_recruiter_dashboard(
        self,
        db: Session,
        recruiter_id: int
    ):

        total_jobs = (
            job_repository.count_jobs_by_recruiter(
                db,
                recruiter_id
            )
        )

        active_jobs = (
            job_repository.count_active_jobs_by_recruiter(
                db,
                recruiter_id
            )
        )

        total_applications = (
            application_repository.count_by_recruiter(
                db,
                recruiter_id
            )
        )

        shortlisted = (
            application_repository.count_by_status_for_recruiter(
                db,
                recruiter_id,
                "Shortlisted"
            )
        )

        hired = (
            application_repository.count_by_status_for_recruiter(
                db,
                recruiter_id,
                "Hired"
            )
        )

        interviews = (
            interview_repository.count_by_recruiter(
                db,
                recruiter_id
            )
        )

        status_counts = (
            application_repository.get_status_counts_by_recruiter(
                db,
                recruiter_id
            )
        )

        return {
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "total_applications": total_applications,
            "shortlisted": shortlisted,
            "interviews": interviews,
            "hired": hired,

            "application_status": {
                "applied": status_counts["Applied"],
                "shortlisted": status_counts["Shortlisted"],
                "interview_scheduled": status_counts[
                    "Interview Scheduled"
                ],
                "rejected": status_counts["Rejected"],
                "hired": status_counts["Hired"]
            }
        }

    def get_recent_applications(
        self,
        db: Session,
        recruiter_id: int,
        page: int = 1,
        limit: int = 5
    ):

        if page < 1:
            raise ValueError(
                "Page must be greater than or equal to 1."
            )

        if limit < 1:
            raise ValueError(
                "Limit must be greater than or equal to 1."
            )

        if limit > 20:
            raise ValueError(
                "Limit cannot be greater than 20."
            )

        total = (
            application_repository.count_by_recruiter(
                db,
                recruiter_id
            )
        )

        applications = (
            application_repository.get_recent_by_recruiter(
                db,
                recruiter_id,
                page,
                limit
            )
        )

        items = []

        for application in applications:

            items.append({
                "application_id": application.id,
                "student_id": application.student_id,
                "job_id": application.job_id,
                "job_title": application.job.title,
                "company": application.job.company,
                "status": application.status
            })

        total_pages = (
            (total + limit - 1) // limit
            if total > 0
            else 0
        )

        return {
            "items": items,
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": total_pages
        }

    def get_upcoming_interviews(
        self,
        db: Session,
        recruiter_id: int,
        limit: int = 5
    ):

        if limit < 1:
            raise ValueError(
                "Limit must be greater than or equal to 1."
            )

        if limit > 20:
            raise ValueError(
                "Limit cannot be greater than 20."
            )

        interviews = (
            interview_repository.get_upcoming_by_recruiter(
                db,
                recruiter_id,
                limit
            )
        )

        result = []

        for interview in interviews:

            result.append({
                "interview_id": interview.id,
                "application_id": interview.application_id,
                "scheduled_at": interview.scheduled_at,
                "interview_type": interview.interview_type,
                "meeting_link": interview.meeting_link,
                "status": interview.status
            })

        return result

    def get_dashboard_overview(
        self,
        db: Session,
        recruiter_id: int
    ):

        statistics = self.get_recruiter_dashboard(
            db,
            recruiter_id
        )

        recent_applications = (
            self.get_recent_applications(
                db,
                recruiter_id,
                page=1,
                limit=5
            )["items"]
        )

        upcoming_interviews = (
            self.get_upcoming_interviews(
                db,
                recruiter_id,
                limit=5
            )
        )

        return {
            "statistics": statistics,
            "recent_applications": recent_applications,
            "upcoming_interviews": upcoming_interviews
        }


dashboard_service = DashboardService()