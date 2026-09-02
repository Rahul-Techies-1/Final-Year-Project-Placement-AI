from sqlalchemy.orm import sessionmaker

from app.database.connection import engine

# Create Session Factory
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)


# Dependency
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()