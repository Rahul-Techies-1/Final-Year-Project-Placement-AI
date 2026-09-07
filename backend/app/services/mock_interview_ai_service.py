import json
import re
from typing import Any

from huggingface_hub import InferenceClient

from app.config.settings import settings


class MockInterviewAIService:

    # ========================================================
    # INITIALIZE HUGGING FACE CLIENT
    # ========================================================

    def __init__(self):

        self.client = InferenceClient(
            provider="auto",
            api_key=settings.HF_TOKEN
        )

        self.model = settings.HF_MODEL


    # ========================================================
    # EVALUATE ANSWER
    # ========================================================

    def evaluate_answer(
        self,
        question: str,
        expected_answer: str | None,
        student_answer: str,
        question_type: str
    ) -> dict[str, Any]:

        """
        Evaluate a student's mock interview answer
        using a Hugging Face LLM.

        Returns:

        {
            "score": int,
            "feedback": str
        }
        """

        # ----------------------------------------------------
        # Validate question
        # ----------------------------------------------------

        if not question or not question.strip():

            raise ValueError(
                "Question cannot be empty."
            )


        # ----------------------------------------------------
        # Validate student answer
        # ----------------------------------------------------

        if (
            not student_answer
            or not student_answer.strip()
        ):

            raise ValueError(
                "Student answer cannot be empty."
            )


        # ----------------------------------------------------
        # Prepare expected answer
        # ----------------------------------------------------

        expected_answer_text = (
            expected_answer.strip()
            if expected_answer
            else "No expected answer was provided."
        )


        # ----------------------------------------------------
        # Build evaluation prompt
        # ----------------------------------------------------

        system_prompt = """
You are an expert technical and HR interview evaluator.

Your job is to evaluate a student's answer to a mock
interview question.

Evaluate the answer fairly and objectively.

Consider:

1. Correctness
2. Relevance
3. Technical understanding
4. Clarity
5. Completeness
6. Examples or practical understanding
7. Communication quality

For technical questions, prioritize technical correctness
and depth.

For HR questions, prioritize relevance, clarity,
professionalism, confidence, and completeness.

Give a score from 0 to 100.

Return ONLY valid JSON.

The JSON must have exactly these fields:

{
    "score": number,
    "feedback": "string"
}

Do not use markdown.
Do not add explanations outside the JSON.
"""


        user_prompt = f"""
Evaluate the following mock interview answer.

Interview Question:
{question}

Question Type:
{question_type}

Expected Answer / Evaluation Reference:
{expected_answer_text}

Student Answer:
{student_answer.strip()}

Return a score from 0 to 100 and concise but useful
feedback explaining:

- what the student did well
- what is missing or incorrect
- how the student can improve the answer

Return ONLY JSON.
"""


        # ----------------------------------------------------
        # Call Hugging Face LLM
        # ----------------------------------------------------

        try:

            response = (
                self.client.chat.completions.create(

                    model=self.model,

                    messages=[
                        {
                            "role": "system",
                            "content": system_prompt
                        },
                        {
                            "role": "user",
                            "content": user_prompt
                        }
                    ],

                    max_tokens=500,

                    temperature=0.2
                )
            )

        except Exception as exc:

            raise ValueError(
                f"AI evaluation failed: {str(exc)}"
            )


        # ----------------------------------------------------
        # Extract model response
        # ----------------------------------------------------

        try:

            content = (
                response
                .choices[0]
                .message
                .content
            )

        except Exception:

            raise ValueError(
                "AI evaluator returned an invalid response."
            )


        if not content:

            raise ValueError(
                "AI evaluator returned an empty response."
            )


        content = content.strip()


        # ----------------------------------------------------
        # Remove markdown JSON fences if model adds them
        # ----------------------------------------------------

        content = re.sub(
            r"^```json\s*",
            "",
            content,
            flags=re.IGNORECASE
        )

        content = re.sub(
            r"^```\s*",
            "",
            content
        )

        content = re.sub(
            r"\s*```$",
            "",
            content
        )

        content = content.strip()


        # ----------------------------------------------------
        # Parse JSON
        # ----------------------------------------------------

        try:

            evaluation = json.loads(
                content
            )

        except json.JSONDecodeError:

            raise ValueError(
                "AI evaluator returned invalid JSON."
            )


        # ----------------------------------------------------
        # Validate score
        # ----------------------------------------------------

        score = evaluation.get(
            "score"
        )

        if score is None:

            raise ValueError(
                "AI evaluator did not return a score."
            )


        try:

            score = int(
                round(
                    float(score)
                )
            )

        except (
            TypeError,
            ValueError
        ):

            raise ValueError(
                "AI evaluator returned an invalid score."
            )


        # ----------------------------------------------------
        # Keep score within valid range
        # ----------------------------------------------------

        score = max(
            0,
            min(
                100,
                score
            )
        )


        # ----------------------------------------------------
        # Validate feedback
        # ----------------------------------------------------

        feedback = evaluation.get(
            "feedback"
        )


        if not feedback:

            feedback = (
                "No detailed feedback was returned "
                "by the AI evaluator."
            )


        feedback = str(
            feedback
        ).strip()


        # ----------------------------------------------------
        # Final evaluation
        # ----------------------------------------------------

        return {

            "score": score,

            "feedback": feedback
        }


# ============================================================
# SERVICE INSTANCE
# ============================================================

mock_interview_ai_service = MockInterviewAIService()