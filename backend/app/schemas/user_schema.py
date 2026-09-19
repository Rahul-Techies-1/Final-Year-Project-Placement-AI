from pydantic import BaseModel, EmailStr, Field


# ============================================================
# USER REGISTRATION
# ============================================================

class UserRegisterRequest(BaseModel):

    full_name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="User Full Name"
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        description="User Password"
    )

    role: str = Field(
        ...,
        pattern="^(student|recruiter)$",
        description="User role"
    )


class UserRegisterResponse(BaseModel):

    message: str


# ============================================================
# USER RESPONSE
# ============================================================

class UserResponse(BaseModel):

    id: int

    full_name: str

    email: EmailStr

    role: str

    class Config:
        from_attributes = True


# ============================================================
# USER LOGIN
# ============================================================

class UserLoginRequest(BaseModel):

    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        max_length=100
    )


class TokenResponse(BaseModel):

    access_token: str

    token_type: str


# ============================================================
# UPDATE USER ROLE
# ============================================================

class UpdateUserRoleRequest(BaseModel):

    role: str = Field(
        ...,
        pattern="^(student|recruiter|admin)$"
    )