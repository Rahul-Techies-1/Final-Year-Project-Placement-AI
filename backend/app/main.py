from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.exceptions.custom_exceptions import EmailAlreadyExistsException
from app.exceptions.handlers import email_exists_handler

from app.routers.user_router import router as user_router
from app.routers.auth_router import router as auth_router
from app.routers.profile_router import router as profile_router
from app.routers.admin_router import router as admin_router
from app.routers.job_router import router as job_router
from app.routers.application_router import router as application_router
from app.routers.interview_router import router as interview_router
from app.routers.dashboard_router import router as dashboard_router

from app.routers.student_dashboard_router import (
    router as student_dashboard_router
)

from app.routers.recruiter_dashboard_router import (
    router as recruiter_dashboard_router
)

from app.routers.preparation_router import (
    router as preparation_router
)

from app.routers.sql_router import (
    router as sql_router
)

from app.routers.core_cs_router import (
    router as core_cs_router
)

from app.routers.aptitude_router import (
    router as aptitude_router
)
from app.routers.mock_interview_router import router as mock_interview_router
from app.routers.ai_mentor_router import router as ai_mentor_router


app = FastAPI(
    title="PlacementAI API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(
    EmailAlreadyExistsException,
    email_exists_handler,
)


app.include_router(auth_router)

app.include_router(user_router)

app.include_router(profile_router)

app.include_router(admin_router)

app.include_router(job_router)

app.include_router(application_router)

app.include_router(interview_router)

app.include_router(dashboard_router)

app.include_router(student_dashboard_router)

app.include_router(
    recruiter_dashboard_router
)

app.include_router(
    preparation_router
)

app.include_router(sql_router)

app.include_router(core_cs_router)

app.include_router(aptitude_router)

app.include_router(mock_interview_router)

app.include_router(ai_mentor_router)


@app.get("/")
def root():

    return {
        "message": "PlacementAI Backend Running 🚀"
    }