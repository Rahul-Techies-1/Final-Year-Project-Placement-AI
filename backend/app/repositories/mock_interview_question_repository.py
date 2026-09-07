from sqlalchemy.orm import Session

from app.models.mock_interview_question import MockInterviewQuestion


class MockInterviewQuestionRepository:

    # ========================================================
    # CREATE QUESTION
    # ========================================================

    def create(
        self,
        db: Session,
        question: MockInterviewQuestion
    ) -> MockInterviewQuestion:

        db.add(question)

        db.commit()

        db.refresh(question)

        return question


    # ========================================================
    # GET QUESTION BY ID
    # ========================================================

    def get_by_id(
        self,
        db: Session,
        question_id: int
    ) -> MockInterviewQuestion | None:

        return (
            db.query(MockInterviewQuestion)
            .filter(
                MockInterviewQuestion.id == question_id
            )
            .first()
        )


    # ========================================================
    # GET QUESTIONS BY INTERVIEW
    # ========================================================

    def get_by_interview(
        self,
        db: Session,
        interview_id: int
    ):

        return (
            db.query(MockInterviewQuestion)
            .filter(
                MockInterviewQuestion.interview_id == interview_id
            )
            .order_by(
                MockInterviewQuestion.question_order.asc()
            )
            .all()
        )


    # ========================================================
    # UPDATE QUESTION
    # ========================================================

    def update(
        self,
        db: Session,
        question: MockInterviewQuestion
    ) -> MockInterviewQuestion:

        db.commit()

        db.refresh(question)

        return question


    # ========================================================
    # DELETE QUESTION
    # ========================================================

    def delete(
        self,
        db: Session,
        question: MockInterviewQuestion
    ) -> None:

        db.delete(question)

        db.commit()


mock_interview_question_repository = (
    MockInterviewQuestionRepository()
)