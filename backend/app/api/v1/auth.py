from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.get("/health")
def health_check():
    return {
        "status": "Authentication API is working 🚀"
    }