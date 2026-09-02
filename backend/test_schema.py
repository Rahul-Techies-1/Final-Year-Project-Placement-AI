from app.schemas.user_schema import UserRegisterRequest

user = UserRegisterRequest(
    full_name="Rahul Pal",
    email="rahu",
    password="Rahul123"
)

print(user)