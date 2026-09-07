from datetime import datetime

from sqlalchemy.orm import Session

from app.models.mock_interview import MockInterview
from app.models.mock_interview_question import MockInterviewQuestion

from app.repositories.mock_interview_repository import (
    mock_interview_repository
)

from app.repositories.mock_interview_question_repository import (
    mock_interview_question_repository
)

from app.data.mock_interview_questions import (
    MOCK_INTERVIEW_QUESTIONS
)

from app.services.mock_interview_ai_service import (
    mock_interview_ai_service
)


class MockInterviewService:

    # ========================================================
    # CREATE MOCK INTERVIEW
    # ========================================================

    def create_interview(
        self,
        db: Session,
        user_id: int,
        interview_type: str,
        difficulty: str,
        total_questions: int
    ):

        # ----------------------------------------------------
        # Validate total questions
        # ----------------------------------------------------

        if total_questions <= 0:

            raise ValueError(
                "Total questions must be greater than zero."
            )

        # ----------------------------------------------------
        # Normalize input
        # ----------------------------------------------------

        interview_type = (
            interview_type.strip().lower()
        )

        difficulty = (
            difficulty.strip().lower()
        )

        # ----------------------------------------------------
        # Validate interview type
        # ----------------------------------------------------

        if interview_type not in MOCK_INTERVIEW_QUESTIONS:

            raise ValueError(
                "Invalid interview type. "
                "Supported types are: technical, hr."
            )

        # ----------------------------------------------------
        # Validate difficulty
        # ----------------------------------------------------

        if difficulty not in MOCK_INTERVIEW_QUESTIONS[
            interview_type
        ]:

            raise ValueError(
                "Invalid difficulty. "
                "Supported difficulties are: easy, medium, hard."
            )

        # ----------------------------------------------------
        # Get available questions
        # ----------------------------------------------------

        available_questions = (
            MOCK_INTERVIEW_QUESTIONS[
                interview_type
            ][
                difficulty
            ]
        )

        # ----------------------------------------------------
        # Validate question availability
        # ----------------------------------------------------

        if not available_questions:

            raise ValueError(
                "No questions available for the selected "
                "interview type and difficulty."
            )

        # ----------------------------------------------------
        # Validate requested question count
        # ----------------------------------------------------

        if total_questions > len(available_questions):

            raise ValueError(
                f"Only {len(available_questions)} questions "
                f"are available for {interview_type} "
                f"{difficulty} interviews."
            )

        # ----------------------------------------------------
        # Create interview
        # ----------------------------------------------------

        interview = MockInterview(

            user_id=user_id,

            interview_type=interview_type,

            difficulty=difficulty,

            total_questions=total_questions,

            questions_answered=0,

            score=None,

            status="in_progress",

            started_at=datetime.utcnow(),

            completed_at=None
        )

        interview = (
            mock_interview_repository.create(
                db,
                interview
            )
        )

        # ----------------------------------------------------
        # Select questions
        #
        # Currently sequential selection is used.
        #
        # Later we can add:
        # - Random selection
        # - AI-generated questions
        # - Adaptive difficulty
        # - Company-specific questions
        # ----------------------------------------------------

        selected_questions = (
            available_questions[
                :total_questions
            ]
        )

        # ----------------------------------------------------
        # Create interview question records
        # ----------------------------------------------------

        for index, question_data in enumerate(
            selected_questions,
            start=1
        ):

            interview_question = MockInterviewQuestion(

                interview_id=interview.id,

                question=question_data[
                    "question"
                ],

                question_type=question_data[
                    "question_type"
                ],

                expected_answer=question_data.get(
                    "expected_answer"
                ),

                student_answer=None,

                score=None,

                feedback=None,

                question_order=index
            )

            mock_interview_question_repository.create(
                db,
                interview_question
            )

        return interview


    # ========================================================
    # GET STUDENT INTERVIEWS
    # ========================================================

    def get_user_interviews(
        self,
        db: Session,
        user_id: int
    ):

        return (
            mock_interview_repository.get_by_user(
                db,
                user_id
            )
        )


    # ========================================================
    # GET MOCK INTERVIEW PERFORMANCE ANALYTICS
    # ========================================================

    def get_performance_analytics(
        self,
        db: Session,
        user_id: int
    ):

        # ----------------------------------------------------
        # Get all student interviews
        # ----------------------------------------------------

        interviews = (
            mock_interview_repository.get_by_user(
                db,
                user_id
            )
        )

        # ----------------------------------------------------
        # Basic interview statistics
        # ----------------------------------------------------

        total_interviews = len(interviews)

        completed_interviews = sum(

            1

            for interview in interviews

            if interview.status == "completed"
        )

        in_progress_interviews = sum(

            1

            for interview in interviews

            if interview.status == "in_progress"
        )

        # ----------------------------------------------------
        # Completed interviews with scores
        # ----------------------------------------------------

        scored_interviews = [

            interview

            for interview in interviews

            if (
                interview.score is not None
                and
                interview.status == "completed"
            )
        ]

        # ----------------------------------------------------
        # Average score
        # ----------------------------------------------------

        if scored_interviews:

            total_score = sum(

                interview.score

                for interview in scored_interviews
            )

            average_score = round(

                total_score /
                len(scored_interviews),

                2
            )

        else:

            average_score = None

        # ----------------------------------------------------
        # Best score
        # ----------------------------------------------------

        if scored_interviews:

            best_score = max(

                interview.score

                for interview in scored_interviews
            )

        else:

            best_score = None

        # ----------------------------------------------------
        # Total questions
        # ----------------------------------------------------

        total_questions = sum(

            interview.total_questions

            for interview in interviews
        )

        # ----------------------------------------------------
        # Total answered questions
        # ----------------------------------------------------

        total_questions_answered = sum(

            interview.questions_answered

            for interview in interviews
        )

        # ----------------------------------------------------
        # Question answering rate
        # ----------------------------------------------------

        if total_questions > 0:

            answer_rate = round(

                (
                    total_questions_answered /
                    total_questions
                ) * 100,

                2
            )

        else:

            answer_rate = 0

        # ----------------------------------------------------
        # Interview completion rate
        # ----------------------------------------------------

        if total_interviews > 0:

            completion_rate = round(

                (
                    completed_interviews /
                    total_interviews
                ) * 100,

                2
            )

        else:

            completion_rate = 0

        # ----------------------------------------------------
        # Performance by interview type
        # ----------------------------------------------------

        technical_interviews = [

            interview

            for interview in interviews

            if interview.interview_type == "technical"
        ]

        hr_interviews = [

            interview

            for interview in interviews

            if interview.interview_type == "hr"
        ]

        # ----------------------------------------------------
        # Technical average score
        # ----------------------------------------------------

        technical_scored = [

            interview

            for interview in technical_interviews

            if interview.score is not None
        ]

        if technical_scored:

            technical_average_score = round(

                sum(
                    interview.score
                    for interview in technical_scored
                )
                /
                len(technical_scored),

                2
            )

        else:

            technical_average_score = None

        # ----------------------------------------------------
        # HR average score
        # ----------------------------------------------------

        hr_scored = [

            interview

            for interview in hr_interviews

            if interview.score is not None
        ]

        if hr_scored:

            hr_average_score = round(

                sum(
                    interview.score
                    for interview in hr_scored
                )
                /
                len(hr_scored),

                2
            )

        else:

            hr_average_score = None

        # ----------------------------------------------------
        # Recent interviews
        # ----------------------------------------------------

        sorted_interviews = sorted(

            interviews,

            key=lambda interview:
                interview.started_at
                or datetime.min,

            reverse=True
        )

        recent_interviews = [

            {
                "id":
                    interview.id,

                "interview_type":
                    interview.interview_type,

                "difficulty":
                    interview.difficulty,

                "status":
                    interview.status,

                "total_questions":
                    interview.total_questions,

                "questions_answered":
                    interview.questions_answered,

                "score":
                    interview.score,

                "started_at":
                    interview.started_at,

                "completed_at":
                    interview.completed_at
            }

            for interview in sorted_interviews[:5]
        ]

        # ----------------------------------------------------
        # Final analytics response
        # ----------------------------------------------------

        return {

            "total_interviews":
                total_interviews,

            "completed_interviews":
                completed_interviews,

            "in_progress_interviews":
                in_progress_interviews,

            "average_score":
                average_score,

            "best_score":
                best_score,

            "total_questions":
                total_questions,

            "total_questions_answered":
                total_questions_answered,

            "answer_rate":
                answer_rate,

            "completion_rate":
                completion_rate,

            "technical_average_score":
                technical_average_score,

            "hr_average_score":
                hr_average_score,

            "recent_interviews":
                recent_interviews
        }


    # ========================================================
    # GET INTERVIEW BY ID
    # ========================================================

    def get_interview(
        self,
        db: Session,
        user_id: int,
        interview_id: int
    ):

        interview = (
            mock_interview_repository.get_by_id(
                db,
                interview_id
            )
        )

        # ----------------------------------------------------
        # Interview does not exist
        # ----------------------------------------------------

        if not interview:

            raise ValueError(
                "Mock interview not found."
            )

        # ----------------------------------------------------
        # Authorization check
        # ----------------------------------------------------

        if interview.user_id != user_id:

            raise ValueError(
                "You are not authorized to access "
                "this interview."
            )

        return interview


    # ========================================================
    # GET INTERVIEW DETAIL
    # ========================================================

    def get_interview_detail(
        self,
        db: Session,
        user_id: int,
        interview_id: int
    ):

        interview = self.get_interview(
            db=db,
            user_id=user_id,
            interview_id=interview_id
        )

        questions = (
            mock_interview_question_repository
            .get_by_interview(
                db,
                interview_id
            )
        )

        return {

            "id":
                interview.id,

            "user_id":
                interview.user_id,

            "interview_type":
                interview.interview_type,

            "difficulty":
                interview.difficulty,

            "status":
                interview.status,

            "total_questions":
                interview.total_questions,

            "questions_answered":
                interview.questions_answered,

            "score":
                interview.score,

            "started_at":
                interview.started_at,

            "completed_at":
                interview.completed_at,

            "questions":
                questions
        }


    # ========================================================
    # ADD QUESTION
    # ========================================================

    def add_question(
        self,
        db: Session,
        user_id: int,
        interview_id: int,
        question: str,
        question_type: str,
        question_order: int,
        expected_answer: str | None = None
    ):

        interview = self.get_interview(
            db=db,
            user_id=user_id,
            interview_id=interview_id
        )

        # ----------------------------------------------------
        # Prevent adding questions to completed interview
        # ----------------------------------------------------

        if interview.status == "completed":

            raise ValueError(
                "Cannot add questions to a completed interview."
            )

        # ----------------------------------------------------
        # Validate question
        # ----------------------------------------------------

        if not question or not question.strip():

            raise ValueError(
                "Question cannot be empty."
            )

        # ----------------------------------------------------
        # Validate question type
        # ----------------------------------------------------

        if not question_type or not question_type.strip():

            raise ValueError(
                "Question type cannot be empty."
            )

        # ----------------------------------------------------
        # Validate question order
        # ----------------------------------------------------

        if question_order <= 0:

            raise ValueError(
                "Question order must be greater than zero."
            )

        # ----------------------------------------------------
        # Create question
        # ----------------------------------------------------

        interview_question = MockInterviewQuestion(

            interview_id=interview_id,

            question=question.strip(),

            question_type=question_type.strip().lower(),

            expected_answer=expected_answer,

            student_answer=None,

            score=None,

            feedback=None,

            question_order=question_order
        )

        return (
            mock_interview_question_repository.create(
                db,
                interview_question
            )
        )


    # ========================================================
    # GET INTERVIEW QUESTIONS
    # ========================================================

    def get_interview_questions(
        self,
        db: Session,
        user_id: int,
        interview_id: int
    ):

        # ----------------------------------------------------
        # Authorization
        # ----------------------------------------------------

        self.get_interview(
            db=db,
            user_id=user_id,
            interview_id=interview_id
        )

        # ----------------------------------------------------
        # Get questions
        # ----------------------------------------------------

        return (
            mock_interview_question_repository
            .get_by_interview(
                db,
                interview_id
            )
        )


    # ========================================================
    # SUBMIT ANSWER
    # ========================================================

    def submit_answer(
        self,
        db: Session,
        user_id: int,
        interview_id: int,
        question_id: int,
        student_answer: str
    ):

        # ----------------------------------------------------
        # Validate interview
        # ----------------------------------------------------

        interview = self.get_interview(
            db=db,
            user_id=user_id,
            interview_id=interview_id
        )

        # ----------------------------------------------------
        # Prevent answering completed interview
        # ----------------------------------------------------

        if interview.status == "completed":

            raise ValueError(
                "This interview has already been completed."
            )

        # ----------------------------------------------------
        # Validate answer
        # ----------------------------------------------------

        if (
            not student_answer
            or not student_answer.strip()
        ):

            raise ValueError(
                "Student answer cannot be empty."
            )

        cleaned_answer = (
            student_answer.strip()
        )

        # ----------------------------------------------------
        # Get question
        # ----------------------------------------------------

        question = (
            mock_interview_question_repository
            .get_by_id(
                db,
                question_id
            )
        )

        if not question:

            raise ValueError(
                "Interview question not found."
            )

        # ----------------------------------------------------
        # Validate question ownership
        # ----------------------------------------------------

        if question.interview_id != interview_id:

            raise ValueError(
                "Question does not belong to this interview."
            )

        # ----------------------------------------------------
        # Check whether question was already answered
        # ----------------------------------------------------

        was_answered = (
            question.student_answer is not None
            and
            question.student_answer.strip() != ""
        )

        # ----------------------------------------------------
        # Save student answer
        # ----------------------------------------------------

        question.student_answer = cleaned_answer

        # ====================================================
        # AI ANSWER EVALUATION
        # ====================================================

        try:

            evaluation = (
                mock_interview_ai_service.evaluate_answer(

                    question=question.question,

                    expected_answer=question.expected_answer,

                    student_answer=cleaned_answer,

                    question_type=question.question_type
                )
            )

        except Exception as e:

            raise ValueError(
                f"AI evaluation failed: {str(e)}"
            )

        # ----------------------------------------------------
        # Validate AI evaluation response
        # ----------------------------------------------------

        if not isinstance(evaluation, dict):

            raise ValueError(
                "Invalid response received from "
                "AI evaluation service."
            )

        # ----------------------------------------------------
        # Save score
        # ----------------------------------------------------

        question.score = evaluation.get(
            "score"
        )

        # ----------------------------------------------------
        # Save feedback
        # ----------------------------------------------------

        question.feedback = evaluation.get(
            "feedback"
        )

        # ----------------------------------------------------
        # Update question
        # ----------------------------------------------------

        mock_interview_question_repository.update(
            db,
            question
        )

        # ----------------------------------------------------
        # Increase answered count only once
        # ----------------------------------------------------

        if not was_answered:

            interview.questions_answered += 1

        # ----------------------------------------------------
        # Update interview
        # ----------------------------------------------------

        mock_interview_repository.update(
            db,
            interview
        )

        return {

            "question_id":
                question.id,

            "student_answer":
                question.student_answer,

            "score":
                question.score,

            "feedback":
                question.feedback,

            "completed":
                True
        }


    # ========================================================
    # COMPLETE INTERVIEW
    # ========================================================

    def complete_interview(
        self,
        db: Session,
        user_id: int,
        interview_id: int
    ):

        # ----------------------------------------------------
        # Validate interview
        # ----------------------------------------------------

        interview = self.get_interview(
            db=db,
            user_id=user_id,
            interview_id=interview_id
        )

        # ----------------------------------------------------
        # Prevent duplicate completion
        # ----------------------------------------------------

        if interview.status == "completed":

            raise ValueError(
                "This interview is already completed."
            )

        # ----------------------------------------------------
        # Get questions
        # ----------------------------------------------------

        questions = (
            mock_interview_question_repository
            .get_by_interview(
                db,
                interview_id
            )
        )

        # ----------------------------------------------------
        # Validate questions
        # ----------------------------------------------------

        if not questions:

            raise ValueError(
                "Cannot complete an interview "
                "without questions."
            )

        # ----------------------------------------------------
        # Calculate answered questions
        # ----------------------------------------------------

        interview.questions_answered = sum(

            1

            for question in questions

            if (
                question.student_answer
                and
                question.student_answer.strip()
            )
        )

        # ----------------------------------------------------
        # Calculate final score
        # ----------------------------------------------------

        scored_questions = [

            question

            for question in questions

            if question.score is not None
        ]

        if scored_questions:

            total_score = sum(

                question.score

                for question in scored_questions
            )

            interview.score = round(

                total_score /
                len(scored_questions)
            )

        else:

            interview.score = None

        # ----------------------------------------------------
        # Mark interview completed
        # ----------------------------------------------------

        interview.status = "completed"

        interview.completed_at = (
            datetime.utcnow()
        )

        # ----------------------------------------------------
        # Save interview
        # ----------------------------------------------------

        mock_interview_repository.update(
            db,
            interview
        )

        return {

            "interview_id":
                interview.id,

            "status":
                interview.status,

            "total_questions":
                interview.total_questions,

            "questions_answered":
                interview.questions_answered,

            "score":
                interview.score,

            "completed_at":
                interview.completed_at
        }


    # ========================================================
    # DELETE INTERVIEW
    # ========================================================

    def delete_interview(
        self,
        db: Session,
        user_id: int,
        interview_id: int
    ):

        # ----------------------------------------------------
        # Validate ownership
        # ----------------------------------------------------

        interview = self.get_interview(
            db=db,
            user_id=user_id,
            interview_id=interview_id
        )

        # ----------------------------------------------------
        # Delete interview
        #
        # Questions are automatically deleted because
        # MockInterview -> MockInterviewQuestion uses
        # cascade="all, delete-orphan".
        # ----------------------------------------------------

        mock_interview_repository.delete(
            db,
            interview
        )


# ============================================================
# SERVICE INSTANCE
# ============================================================

mock_interview_service = MockInterviewService()