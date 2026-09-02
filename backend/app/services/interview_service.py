from sqlalchemy.orm import Session

from app.models.interview import Interview

from app.repositories.interview_repository import (
    interview_repository
)

from app.repositories.application_repository import (
    application_repository
)

from app.repositories.job_repository import (
    job_repository
)

from app.schemas.interview_schema import (
    InterviewCreateRequest,
    InterviewStatusUpdateRequest,
)


class InterviewService:

    # ============================================================
    # RECRUITER - CREATE INTERVIEW
    # ============================================================

    def create_interview(
        self,
        db: Session,
        request: InterviewCreateRequest,
        current_user
    ):

        # Check whether application exists
        application = application_repository.get_by_id(
            db,
            request.application_id
        )

        if not application:
            raise ValueError(
                "Application not found."
            )

        # Get the job associated with the application
        job = job_repository.get_by_id(
            db,
            application.job_id
        )

        if not job:
            raise ValueError(
                "Job not found."
            )

        # Verify recruiter owns the job
        if job.posted_by != current_user.id:
            raise ValueError(
                "You can schedule interviews only for your own jobs."
            )

        # Interview can only be scheduled for shortlisted application
        if application.status != "Shortlisted":
            raise ValueError(
                "Interview can be scheduled only for shortlisted applications."
            )

        # Check whether an interview already exists
        existing_interview = (
            interview_repository.get_by_application_id(
                db,
                request.application_id
            )
        )

        if existing_interview:
            raise ValueError(
                "Interview already exists for this application."
            )

        # Create interview
        interview = Interview(
            application_id=request.application_id,
            scheduled_at=request.scheduled_at,
            interview_type=request.interview_type,
            meeting_link=request.meeting_link,
            status="scheduled"
        )

        # Update application status
        application.status = "Interview Scheduled"

        created_interview = interview_repository.create(
            db,
            interview
        )

        db.commit()
        db.refresh(application)

        return created_interview

    # ============================================================
    # GET SINGLE INTERVIEW
    # ============================================================

    def get_interview(
        self,
        db: Session,
        interview_id: int,
        current_user
    ):

        # Get interview
        interview = interview_repository.get_by_id(
            db,
            interview_id
        )

        if not interview:
            return None

        # Get application associated with interview
        application = application_repository.get_by_id(
            db,
            interview.application_id
        )

        if not application:
            raise ValueError(
                "Application not found."
            )

        # Get job associated with application
        job = job_repository.get_by_id(
            db,
            application.job_id
        )

        if not job:
            raise ValueError(
                "Job not found."
            )

        # Recruiter can view interviews only for their own jobs
        if current_user.role == "recruiter":

            if job.posted_by != current_user.id:
                raise PermissionError(
                    "You don't have permission to view this interview."
                )

        # Student can view interviews only for their own applications
        elif current_user.role == "student":

            if application.student_id != current_user.id:
                raise PermissionError(
                    "You don't have permission to view this interview."
                )

        # Any other role is not allowed
        else:
            raise PermissionError(
                "You don't have permission to view this interview."
            )

        return interview

    # ============================================================
    # GET ALL INTERVIEWS
    # ============================================================

    def get_all_interviews(
        self,
        db: Session,
        page: int = 1,
        limit: int = 10,
        status: str | None = None,
        interview_type: str | None = None,
        recruiter_id: int | None = None
    ):

        interviews, total = interview_repository.get_all(
            db,
            page,
            limit,
            status,
            interview_type,
            recruiter_id
        )

        total_pages = (
            (total + limit - 1) // limit
            if total > 0
            else 0
        )

        return {
            "items": interviews,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }

    # ============================================================
    # RECRUITER - UPDATE INTERVIEW STATUS
    # ============================================================

    def update_status(
        self,
        db: Session,
        interview_id: int,
        request: InterviewStatusUpdateRequest,
        recruiter_id: int
    ):

        interview = interview_repository.get_by_id(
            db,
            interview_id
        )

        if not interview:
            raise ValueError(
                "Interview not found."
            )

        # Verify recruiter owns the interview
        self._verify_recruiter_ownership(
            db,
            interview,
            recruiter_id
        )

        current_status = interview.status.lower()
        new_status = request.status.lower()

        allowed_transitions = {
            "scheduled": {
                "completed",
                "cancelled"
            },
            "completed": set(),
            "cancelled": set()
        }

        if new_status not in allowed_transitions.get(
            current_status,
            set()
        ):
            raise ValueError(
                f"Cannot change interview status "
                f"from '{interview.status}' "
                f"to '{request.status}'."
            )

        updated_interview = interview_repository.update_status(
            db,
            interview,
            new_status
        )

        # If interview is cancelled,
        # move application back to shortlisted
        if new_status == "cancelled":

            application = application_repository.get_by_id(
                db,
                interview.application_id
            )

            if application:
                application.status = "Shortlisted"

                db.commit()
                db.refresh(application)

        return updated_interview

    # ============================================================
    # RECRUITER - DELETE INTERVIEW
    # ============================================================

    def delete_interview(
        self,
        db: Session,
        interview_id: int,
        recruiter_id: int
    ):

        interview = interview_repository.get_by_id(
            db,
            interview_id
        )

        if not interview:
            raise ValueError(
                "Interview not found."
            )

        # Verify recruiter owns the interview
        self._verify_recruiter_ownership(
            db,
            interview,
            recruiter_id
        )

        application = application_repository.get_by_id(
            db,
            interview.application_id
        )

        interview_repository.delete(
            db,
            interview
        )

        # Move application back to shortlisted
        if application and application.status == "Interview Scheduled":

            application.status = "Shortlisted"

            db.commit()
            db.refresh(application)

    # ============================================================
    # STUDENT - GET MY INTERVIEWS
    # ============================================================

    def get_student_interviews(
        self,
        db: Session,
        student_id: int
    ):

        interviews = (
            interview_repository.get_by_student_id(
                db,
                student_id
            )
        )

        result = []

        for interview in interviews:

            # Get application
            application = application_repository.get_by_id(
                db,
                interview.application_id
            )

            if not application:
                continue

            # Get job
            job = job_repository.get_by_id(
                db,
                application.job_id
            )

            if not job:
                continue

            result.append({
                "id": interview.id,
                "application_id": interview.application_id,
                "job_id": job.id,
                "job_title": job.title,
                "company": job.company,
                "scheduled_at": interview.scheduled_at,
                "interview_type": interview.interview_type,
                "status": interview.status,
                "meeting_link": interview.meeting_link,
                "interviewer_notes": interview.interviewer_notes,
                "created_at": interview.created_at
            })

        return result

    # ============================================================
    # VERIFY RECRUITER OWNERSHIP
    # ============================================================

    def _verify_recruiter_ownership(
        self,
        db: Session,
        interview: Interview,
        recruiter_id: int
    ):

        application = application_repository.get_by_id(
            db,
            interview.application_id
        )

        if not application:
            raise ValueError(
                "Application not found."
            )

        job = job_repository.get_by_id(
            db,
            application.job_id
        )

        if not job:
            raise ValueError(
                "Job not found."
            )

        if job.posted_by != recruiter_id:
            raise PermissionError(
                "You don't have permission to manage this interview."
            )


interview_service = InterviewService()