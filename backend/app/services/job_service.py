from sqlalchemy.orm import Session

from app.models.job import Job
from app.repositories.job_repository import job_repository
from app.schemas.job_schema import JobUpdateRequest
from app.schemas.job_schema import (
    JobCreateRequest,
)


class JobService:

    def create_job(
        self,
        db: Session,
        request: JobCreateRequest,
        current_user
    ):

        job = Job(
            title=request.title,
            company=request.company,
            location=request.location,
            salary=request.salary,
            description=request.description,
            requirements=request.requirements,
            posted_by=current_user.id
        )

        return job_repository.create(
            db,
            job
        )

    def get_all_jobs(
        self,
        db: Session,
        page:int,
        limit:int,
        search:str,
        location:str
    ):

        return job_repository.get_all_jobs(
            db,
            page,
            limit,
            search,
            location
        )

    def get_job_by_id(
        self,
        db: Session,
        job_id: int
    ):

        return job_repository.get_by_id(
            db,
            job_id
        )
    
    def get_available_job_by_id(
            self,
            db: Session,
            job_id: int
    ):
        job = job_repository.get_by_id(
            db,
            job_id
        )
        if not job:
            return None
        if not job.is_active:
            return None
        return job
  
    def update_job(
            self,
            db:Session,
            job_id:int,
            request,
            recruiter_id: int
    ):
        job = job_repository.get_by_id(
            db,
            job_id
        )
        if not job:
            return None
        self._verify_job_ownership(
            job,
            recruiter_id
        )
        if request.title is not None:
            job.title = request.title
        if request.description is not None:
            job.description = request.description
        if request.company is not None:
            job.company = request.company
        if request.location is not None:
            job.location = request.location
        if request.salary is not None:
            job.salary = request.salary
        if request.requirements is not None:
            job.requirements = request.requirements
        if request.is_active is not None:
            job.is_active = request.is_active
        return job_repository.update(
            db,
            job
        )
    
        
    def delete_job(
            self,
            db:Session,
            job_id:int,
            recruiter_id: int
    ):
        job = job_repository.get_by_id(
            db,
            job_id
        )
        if not job:
            return None
        self._verify_job_ownership(
            job,
            recruiter_id
        )
        job_repository.delete(
            db,
            job
        )
        return True
    def get_available_jobs(
            self,
            db: Session,
            page: int=1,
            limit: int=10,
            search: str | None = None
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
        if search:
            search = search.strip()
            if len(search) > 100:
                raise ValueError(
                    "Search query cannot exceed 100 characters."
                )
        return job_repository.get_available_jobs(
            db,
            page,
            limit,
            search
        )
    def get_job_details(
            self,
            db: Session,
            job_id: int
    ):
        job = job_repository.get_by_id(
            db,
            job_id
        )
        if not job:
            raise ValueError(
                "Job not found."
            )
        if not job.is_active:
            raise ValueError(
                "This job is no longer available."
            )
        return job
    def _verify_job_ownership(
            self,
            job: Job,
            recruiter_id: int
    ):
        if job.posted_by != recruiter_id:
            raise ValueError(
                "You can manage only your own jobs."
            )
    def close_job(
            self,
            db: Session,
            job_id: int,
            recruiter_id: int

    ):
        job = job_repository.get_by_id(
            db,
            job_id
        )
        if not job:
            return None
        if job.posted_by != recruiter_id:
            raise ValueError(
                "You can manage only your own jobs."
            )
        if not job.is_active:
            raise ValueError(
                "Job is already closed."
            )
        job.is_active = False
        return job_repository.update(
            db,
            job
        )
    def get_recruiter_jobs(
            self,
            db: Session,
            recruiter_id: int,
            page: int = 1,
            limit: int = 10
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
        return job_repository.get_jobs_by_recruiter(
            db,
            recruiter_id,
            page,
            limit
        )



job_service = JobService()