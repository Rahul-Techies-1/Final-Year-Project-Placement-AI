from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ========================================================
    # DATABASE
    # ========================================================

    DATABASE_URL: str

    @field_validator("DATABASE_URL")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        # Render / Neon / Supabase give postgres:// or postgresql://
        # but this project uses psycopg v3 -> needs postgresql+psycopg://
        value = value.strip()
        if value.startswith("postgres://"):
            value = "postgresql+psycopg://" + value[len("postgres://"):]
        elif value.startswith("postgresql://"):
            value = "postgresql+psycopg://" + value[len("postgresql://"):]
        return value


    # ========================================================
    # AUTHENTICATION
    # ========================================================

    SECRET_KEY: str

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60


    # ========================================================
    # HUGGING FACE
    # ========================================================

    HF_TOKEN: str

    HF_MODEL: str

    # ========================================================
    # CORS (comma separated list of deployed frontend URLs)
    # ========================================================

    FRONTEND_URL: str 


    # ========================================================
    # ENVIRONMENT CONFIGURATION
    # ========================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()