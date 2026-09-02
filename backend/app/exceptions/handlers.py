from fastapi import Request
from fastapi.responses import JSONResponse

from app.exceptions.custom_exceptions import (
    EmailAlreadyExistsException,
)


async def email_exists_handler(
    request: Request,
    exc: EmailAlreadyExistsException,
):
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "message": exc.message,
        },
    )