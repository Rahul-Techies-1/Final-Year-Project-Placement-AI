from openai import OpenAI

from app.config.settings import settings


def get_llm_client() -> OpenAI:
    """
    One place to configure the chat LLM.
    Works with any OpenAI-compatible API (Groq, Gemini, OpenRouter...).
    Change provider/model from Render environment variables only.
    """

    if not settings.LLM_API_KEY:

        raise ValueError(
            "LLM_API_KEY is not set. Add it in the environment variables."
        )

    return OpenAI(
        base_url=settings.LLM_BASE_URL,
        api_key=settings.LLM_API_KEY,
        timeout=60,
        max_retries=2,
    )