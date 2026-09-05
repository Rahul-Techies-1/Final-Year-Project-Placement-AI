from fastapi import APIRouter

router = APIRouter(
    prefix="/sql",
    tags=["SQL"]
)