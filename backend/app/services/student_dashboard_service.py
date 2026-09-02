from sqlalchemy.orm import Session
from math import ceil

from app.repositories.application_repository import (
    application_repository
)

from app.repositories.interview_repository import (
    interview_repository
)


class StudentDashboardService:

    # ========================================================
    # STUDENT DASHBOARD STATISTICS
    # ========================================================

    def get_student_dashboard(
        self,
        db: Session,
        student_id: int
    ):

        total_applications = (
            application_repository.count_by_student(
                db,
                student_id
            )
        )

        applied = (
            application_repository.count_by_status_for_student(
                db,
                student_id,
                "Applied"
            )
        )

        shortlisted = (
            application_repository.count_by_status_for_student(
                db,
                student_id,
                "Shortlisted"
            )
        )

        interview_scheduled = (
            application_repository.count_by_status_for_student(
                db,
                student_id,
                "Interview Scheduled"
            )
        )

        rejected = (
            application_repository.count_by_status_for_student(
                db,
                student_id,
                "Rejected"
            )
        )

        hired = (
            application_repository.count_by_status_for_student(
                db,
                student_id,
                "Hired"
            )
        )

        total_interviews = (
            interview_repository.count_by_student(
                db,
                student_id
            )
        )

        return {
            "total_applications": total_applications,
            "applied": applied,
            "shortlisted": shortlisted,
            "interview_scheduled": interview_scheduled,
            "rejected": rejected,
            "hired": hired,
            "total_interviews": total_interviews
        }

    # ========================================================
    # STUDENT - RECENT APPLICATIONS
    # ========================================================

    def get_recent_applications(
        self,
        db: Session,
        student_id: int,
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

        applications = (
            application_repository.get_recent_by_student(
                db,
                student_id,
                page,
                limit
            )
        )

        total = (
            application_repository.count_by_student(
                db,
                student_id
            )
        )

        items = []

        for application in applications:

            items.append({
                "application_id": application.id,
                "job_id": application.job_id,
                "job_title": application.job.title,
                "company": application.job.company,
                "location": application.job.location,
                "status": application.status
            })

        total_pages = (
            ceil(total / limit)
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

    # ========================================================
    # STUDENT - UPCOMING INTERVIEWS
    # ========================================================

    def get_upcoming_interviews(
        self,
        db: Session,
        student_id: int,
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
            interview_repository.get_upcoming_by_student(
                db,
                student_id,
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

    # ========================================================
    # STUDENT - COMPLETE DASHBOARD OVERVIEW
    # ========================================================

    def get_dashboard_overview(
        self,
        db: Session,
        student_id: int
    ):

        statistics = (
            self.get_student_dashboard(
                db,
                student_id
            )
        )

        recent_applications = (
            self.get_recent_applications(
                db,
                student_id,
                page=1,
                limit=5
            )["items"]
        )

        upcoming_interviews = (
            self.get_upcoming_interviews(
                db,
                student_id,
                limit=5
            )
        )

        return {
            "statistics": statistics,
            "recent_applications": recent_applications,
            "upcoming_interviews": upcoming_interviews
        }


student_dashboard_service = StudentDashboardService()