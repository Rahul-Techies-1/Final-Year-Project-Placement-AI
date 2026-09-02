from sqlalchemy.orm import Session

from app.models.job import Job
from sqlalchemy import or_


class JobRepository:

    def create(
        self,
        db: Session,
        job: Job
    ) -> Job:

        db.add(job)
        db.commit()
        db.refresh(job)

        return job

    def get_all_jobs(
        self,
        db: Session,
        page:int,
        limit:int,
        search:str,
        location:str
    ):
        query = db.query(Job)
        if search:
            query=query.filter(
                or_(
                    Job.title.ilike(f"%{search}%"),
                    Job.company.ilike(f"%{search}%")
                )
            )
        if location:
            query=query.filter(
                Job.location.ilike(f"%{location}%")
            )
        return(
            query
            .order_by(Job.id.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )


    def get_by_id(
        self,
        db: Session,
        job_id: int
    ) -> Job | None:

        return (
            db.query(Job)
            .filter(Job.id == job_id)
            .first()
        )

    def update(
            self,
            db:Session,
            job:Job
    )-> Job:
        db.commit()
        db.refresh(job)

        return job
    def delete(
            self,
            db:Session,
            job:Job
    ):
        db.delete(job)
        db.commit()
    def get_available_jobs(
            self,
            db: Session,
            page: int,
            limit: int,
            search: str | None = None
    ):
        query=(
            db.query(Job)
            .filter(Job.is_active == True)
        )
        if search:
            query = query.filter(
                or_(
                    Job.title.ilike(f"%{search}%"),
                    Job.company.ilike(f"%{search}%"),
                    Job.location.ilike(f"%{search}%")
                )
            )
        return(
            query
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )
    def count_jobs_by_recruiter(
            self,
            db: Session,
            recruiter_id: int
    )-> int:
        return (
            db.query(Job)
            .filter(
                Job.posted_by == recruiter_id
            )
            .count()
        )
    def count_active_jobs_by_recruiter(
            self,
            db: Session,
            recruiter_id: int
    )-> int:
        return (
            db.query(Job)
            .filter(
                Job.posted_by == recruiter_id,
                Job.is_active.is_(True)
            )
            .count()
        )
    def get_jobs_by_recruiter(
            self,
            db: Session,
            recruiter_id: int,
            page: int,
            limit: int
    ):
        return(
            db.query(Job)
            .filter(
                Job.posted_by == recruiter_id
        )
            .order_by(
                Job.id.desc()
        )
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )


job_repository = JobRepository()