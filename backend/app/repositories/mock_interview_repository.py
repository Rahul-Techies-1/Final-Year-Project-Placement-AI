from sqlalchemy.orm import Session

from app.models.mock_interview import MockInterview


class MockInterviewRepository:

    # ========================================================
    # CREATE INTERVIEW
    # ========================================================

    def create(
        self,
        db: Session,
        interview: MockInterview
    ) -> MockInterview:

        db.add(interview)

        db.commit()

        db.refresh(interview)

        return interview


    # ========================================================
    # GET INTERVIEW BY ID
    # ========================================================

    def get_by_id(
        self,
        db: Session,
        interview_id: int
    ) -> MockInterview | None:

        return (
            db.query(MockInterview)
            .filter(
                MockInterview.id == interview_id
            )
            .first()
        )


    # ========================================================
    # GET ALL INTERVIEWS FOR STUDENT
    # ========================================================

    def get_by_user(
        self,
        db: Session,
        user_id: int
    ):

        return (
            db.query(MockInterview)
            .filter(
                MockInterview.user_id == user_id
            )
            .order_by(
                MockInterview.started_at.desc()
            )
            .all()
        )


    # ========================================================
    # UPDATE INTERVIEW
    # ========================================================

    def update(
        self,
        db: Session,
        interview: MockInterview
    ) -> MockInterview:

        db.commit()

        db.refresh(interview)

        return interview


    # ========================================================
    # DELETE INTERVIEW
    # ========================================================

    def delete(
        self,
        db: Session,
        interview: MockInterview
    ) -> None:

        db.delete(interview)

        db.commit()


mock_interview_repository = MockInterviewRepository()