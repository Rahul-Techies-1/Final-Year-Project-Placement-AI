from sqlalchemy.orm import Session

from app.repositories.job_repository import (
    job_repository
)

from app.repositories.application_repository import (
    application_repository
)


class RecruiterDashboardService:

    # ========================================================
    # GET RECRUITER DASHBOARD
    # ========================================================

    def get_dashboard(
        self,
        db: Session,
        recruiter_id: int
    ):

        # ----------------------------------------------------
        # JOB STATISTICS
        # ----------------------------------------------------

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


        # ----------------------------------------------------
        # APPLICATION STATISTICS
        # ----------------------------------------------------

        total_applications = (
            application_repository.count_by_recruiter(
                db,
                recruiter_id
            )
        )


        status_counts = (
            application_repository
            .get_status_counts_by_recruiter(
                db,
                recruiter_id
            )
        )


        # ----------------------------------------------------
        # RECENT APPLICATIONS
        # ----------------------------------------------------

        recent_applications = (
            application_repository
            .get_recent_by_recruiter(
                db,
                recruiter_id,
                page=1,
                limit=5
            )
        )


        recent_result = []


        for application in recent_applications:

            job = application.job


            if not job:
                continue


            recent_result.append({

                "id": application.id,

                "student_id":
                    application.student_id,

                "job_id":
                    application.job_id,

                "job_title":
                    job.title,

                "status":
                    application.status,

                "applied_at":
                    application.applied_at
            })


        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return {

            "stats": {

                "total_jobs":
                    total_jobs,

                "active_jobs":
                    active_jobs,

                "total_applications":
                    total_applications,

                "applied":
                    status_counts["Applied"],

                "shortlisted":
                    status_counts["Shortlisted"],

                "interview_scheduled":
                    status_counts[
                        "Interview Scheduled"
                    ],

                "rejected":
                    status_counts["Rejected"],

                "hired":
                    status_counts["Hired"]
            },

            "recent_applications":
                recent_result
        }


recruiter_dashboard_service = (
    RecruiterDashboardService()
)