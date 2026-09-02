from sqlalchemy.orm import Session

from app.models.application import Application

from app.repositories.application_repository import (
    application_repository
)

from app.repositories.job_repository import (
    job_repository
)

from app.schemas.application_schema import (
    ApplicationCreateRequest,
    ApplicationStatusUpdateRequest,
)


class ApplicationService:

    # ============================================================
    # STUDENT - APPLY FOR JOB
    # ============================================================

    def apply_job(
        self,
        db: Session,
        request: ApplicationCreateRequest,
        current_user
    ):

        # Check whether the job exists
        job = job_repository.get_by_id(
            db,
            request.job_id
        )

        if not job:
            raise ValueError(
                "Job not found."
            )

        # Check whether the job is active
        if not job.is_active:
            raise ValueError(
                "This job is no longer available."
            )

        # Prevent duplicate applications
        existing_application = (
            application_repository.get_by_student_and_job(
                db,
                current_user.id,
                request.job_id
            )
        )

        if existing_application:
            raise ValueError(
                "You have already applied for this job."
            )

        # Create application
        application = Application(
            student_id=current_user.id,
            job_id=request.job_id,
            status="Applied"
        )

        return application_repository.create(
            db,
            application
        )

    # ============================================================
    # STUDENT - MY APPLICATIONS
    # ============================================================

    def get_my_applications(
        self,
        db: Session,
        current_user
    ):

        applications = (
            application_repository.get_by_student(
                db,
                current_user.id
            )
        )

        result = []

        for application in applications:

            result.append({
                "id": application.id,
                "job_id": application.job_id,
                "job_title": application.job.title,
                "company": application.job.company,
                "location": application.job.location,
                "status": application.status
            })

        return result

    # ============================================================
    # STUDENT - APPLICATION DETAILS
    # ============================================================

    def get_application_details(
        self,
        db: Session,
        application_id: int,
        current_user
    ):

        application = (
            application_repository.get_application_details(
                db,
                application_id
            )
        )

        if not application:
            return None

        # Student can view only their own application
        if application.student_id != current_user.id:

            raise PermissionError(
                "You can view only your own application."
            )

        job = job_repository.get_by_id(
            db,
            application.job_id
        )

        if not job:
            raise ValueError(
                "Job not found."
            )

        return {
            "id": application.id,
            "student_id": application.student_id,
            "job_id": application.job_id,
            "job_title": job.title,
            "company": job.company,
            "location": job.location,
            "job_description": job.description,
            "status": application.status,
            "applied_at": application.applied_at
        }

    # ============================================================
    # RECRUITER - VIEW JOB APPLICATIONS
    # ============================================================

    def get_job_applications(
        self,
        db: Session,
        job_id: int,
        page: int,
        limit: int,
        status: str | None = None,
        search: str | None = None,
        current_user=None
    ):

        if page < 1:
            raise ValueError(
                "Page must be greater than or equal to 1."
            )

        if limit < 1:
            raise ValueError(
                "Limit must be greater than or equal to 1."
            )

        if limit > 50:
            raise ValueError(
                "Limit cannot be greater than 50."
            )

        job = job_repository.get_by_id(
            db,
            job_id
        )

        if not job:
            raise ValueError(
                "Job not found."
            )

        if job.posted_by != current_user.id:

            raise PermissionError(
                "You can view applications only "
                "for your own jobs."
            )

        if search:
            search = search.strip()

            if len(search) > 100:
                raise ValueError(
                    "Search query cannot exceed 100 characters."
                )

        applications= application_repository.get_by_job(
            db,
            job_id,
            page,
            limit,
            status,
            search
        )
        result = []
        for application in applications:
            student = application.student
            result.append({
                "id": application.id,

                "student_id": application.student_id,

                "student_name": student.full_name,

                "student_email": student.email,

                "college": student.college,

                "branch": student.branch,

                "semester": student.semester,

                "skills": student.skills,

                "bio": student.bio,
 
                "job_id": application.job_id,

                "status": application.status,

                "applied_at": application.applied_at
            })
        return result

    # ============================================================
    # RECRUITER - UPDATE APPLICATION STATUS
    # ============================================================

    def update_status(
        self,
        db: Session,
        application_id: int,
        request: ApplicationStatusUpdateRequest,
        current_user
    ):

        application = application_repository.get_by_id(
            db,
            application_id
        )

        if not application:
            return None

        job = job_repository.get_by_id(
            db,
            application.job_id
        )

        if not job:
            raise ValueError(
                "Job not found."
            )

        # Recruiter can update applications
        # only for their own jobs
        if job.posted_by != current_user.id:

            raise ValueError(
                "You can update applications only "
                "for your own jobs."
            )

        current_status = application.status
        new_status = request.status

        allowed_transitions = {

            "Applied": [
                "Shortlisted",
                "Rejected"
            ],

            "Shortlisted": [
                "Interview Scheduled",
                "Rejected"
            ],

            "Interview Scheduled": [
                "Hired",
                "Rejected"
            ],

            "Rejected": set(),

            "Hired": set()
        }

        if new_status not in allowed_transitions.get(
            current_status,
            set()
        ):

            raise ValueError(
                f"Cannot change application status "
                f"from '{current_status}' "
                f"to '{new_status}'."
            )

        application.status = new_status

        return application_repository.update(
            db,
            application
        )

    # ============================================================
    # STUDENT - WITHDRAW APPLICATION
    # ============================================================

    def withdraw_application(
        self,
        db: Session,
        application_id: int,
        current_user
    ):

        application = application_repository.get_by_id(
            db,
            application_id
        )

        if not application:
            return None

        # Student can withdraw only their own application
        if application.student_id != current_user.id:

            raise ValueError(
                "You can withdraw only "
                "your own application."
            )

        # Application can only be withdrawn
        # during these stages
        if application.status not in [
            "Applied",
            "Shortlisted"
        ]:

            raise ValueError(
                "Application cannot be withdrawn "
                "at this stage."
            )

        application_repository.delete(
            db,
            application
        )

        return True

    # ============================================================
    # RECRUITER - APPLICATION STATISTICS
    # ============================================================

    def get_application_stats(
        self,
        db: Session,
        job_id: int,
        current_user
    ):

        job = job_repository.get_by_id(
            db,
            job_id
        )

        if not job:
            return None

        # Recruiter can see statistics
        # only for their own jobs
        if job.posted_by != current_user.id:

            raise ValueError(
                "You can view statistics only "
                "for your own jobs."
            )

        return application_repository.get_application_stats(
            db,
            job_id
        )


application_service = ApplicationService()