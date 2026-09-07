import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getMockInterviewById
} from "../../../services/mockInterviewService";


const MockInterviewResults = () => {

    const { interviewId } = useParams();

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [interview, setInterview] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================================
    // LOAD INTERVIEW RESULTS
    // ========================================================

    useEffect(() => {

        loadResults();

    }, [interviewId]);


    const loadResults = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getMockInterviewById(
                    interviewId
                );

            setInterview(data);

        } catch (err) {

            console.error(
                "Failed to load mock interview results:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                "Failed to load mock interview results."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="mock-interview-results">

                <div className="page-header">

                    <div>

                        <h1>
                            Mock Interview Results
                        </h1>

                        <p>
                            Loading your interview results...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (!interview) {

        return (

            <div className="mock-interview-results">

                <div className="error-state">

                    <h2>
                        Unable to Load Results
                    </h2>

                    <p>
                        {error ||
                            "Mock interview not found."
                        }
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/student/preparation/mock-interviews"
                            )
                        }
                    >
                        Back to Mock Interviews
                    </button>

                </div>

            </div>
        );
    }


    // ========================================================
    // QUESTIONS
    // ========================================================

    const questions =
        interview.questions || [];


    // ========================================================
    // SCORE CALCULATIONS
    // ========================================================

    const scoredQuestions =
        questions.filter(
            (question) =>
                question.score !== null &&
                question.score !== undefined
        );


    const answeredQuestions =
        questions.filter(
            (question) =>
                question.student_answer &&
                question.student_answer.trim() !== ""
        );


    const calculatedScore =
        scoredQuestions.length > 0

            ? Math.round(
                scoredQuestions.reduce(
                    (
                        total,
                        question
                    ) =>
                        total + question.score,
                    0
                ) /
                scoredQuestions.length
            )

            : null;


    const overallScore =
        interview.score !== null &&
        interview.score !== undefined

            ? interview.score

            : calculatedScore;


    // ========================================================
    // PERFORMANCE MESSAGE
    // ========================================================

    const getPerformanceMessage = () => {

        if (overallScore === null) {

            return (
                "Your answers have not been evaluated yet."
            );
        }

        if (overallScore >= 85) {

            return (
                "Excellent performance! "
                + "You demonstrated strong understanding "
                + "and interview readiness."
            );
        }

        if (overallScore >= 70) {

            return (
                "Good performance. "
                + "You have a solid foundation, but "
                + "there is still room for improvement."
            );
        }

        if (overallScore >= 50) {

            return (
                "Fair performance. "
                + "Focus on improving your explanation, "
                + "technical depth, and examples."
            );
        }

        return (
            "You need more preparation. "
            + "Review the concepts and practice "
            + "answering interview questions."
        );
    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <div className="mock-interview-results">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        Mock Interview Results
                    </h1>

                    <p>
                        Review your performance and
                        AI-generated feedback.
                    </p>

                </div>

            </div>


            {/* ==================================================
                INTERVIEW SUMMARY
            ================================================== */}

            <section className="preparation-overview">


                <div>

                    <p>
                        Interview Type
                    </p>

                    <h3>
                        {interview.interview_type}
                    </h3>

                </div>


                <div>

                    <p>
                        Difficulty
                    </p>

                    <h3>
                        {interview.difficulty}
                    </h3>

                </div>


                <div>

                    <p>
                        Questions Answered
                    </p>

                    <h3>
                        {answeredQuestions.length}
                        {" / "}
                        {interview.total_questions}
                    </h3>

                </div>


                <div>

                    <p>
                        Overall Score
                    </p>

                    <h3>

                        {overallScore !== null
                            ? `${overallScore}%`
                            : "Not evaluated"
                        }

                    </h3>

                </div>


            </section>


            {/* ==================================================
                PERFORMANCE SUMMARY
            ================================================== */}

            <section className="preparation-problem-card">

                <h2>
                    Performance Summary
                </h2>

                <p>
                    {getPerformanceMessage()}
                </p>

            </section>


            {/* ==================================================
                QUESTION RESULTS
            ================================================== */}

            <section>

                <div className="page-header">

                    <div>

                        <h2>
                            Question-wise Feedback
                        </h2>

                        <p>
                            Review your answers and
                            AI evaluation for each question.
                        </p>

                    </div>

                </div>


                {questions.length === 0 ? (

                    <div className="error-state">

                        <p>
                            No questions found for this interview.
                        </p>

                    </div>

                ) : (

                    questions.map(
                        (
                            question,
                            index
                        ) => (

                            <article
                                key={question.id}
                                className="preparation-problem-card"
                            >


                                {/* ==================================
                                    QUESTION HEADER
                                ================================== */}

                                <div>

                                    <p>

                                        Question{" "}
                                        {index + 1}
                                        {" / "}
                                        {questions.length}

                                    </p>

                                    <h3>
                                        {question.question}
                                    </h3>

                                </div>


                                {/* ==================================
                                    QUESTION TYPE
                                ================================== */}

                                <p>

                                    <strong>
                                        Type:
                                    </strong>{" "}

                                    {question.question_type}

                                </p>


                                {/* ==================================
                                    STUDENT ANSWER
                                ================================== */}

                                <div>

                                    <h4>
                                        Your Answer
                                    </h4>

                                    {question.student_answer ? (

                                        <p>
                                            {
                                                question.student_answer
                                            }
                                        </p>

                                    ) : (

                                        <p>
                                            No answer submitted.
                                        </p>

                                    )}

                                </div>


                                {/* ==================================
                                    AI SCORE
                                ================================== */}

                                <div>

                                    <h4>
                                        AI Score
                                    </h4>

                                    <p>

                                        {
                                            question.score !== null &&
                                            question.score !== undefined

                                                ? `${question.score}%`

                                                : "Not evaluated"
                                        }

                                    </p>

                                </div>


                                {/* ==================================
                                    AI FEEDBACK
                                ================================== */}

                                <div>

                                    <h4>
                                        AI Feedback
                                    </h4>

                                    {question.feedback ? (

                                        <p>
                                            {
                                                question.feedback
                                            }
                                        </p>

                                    ) : (

                                        <p>
                                            Feedback is not available
                                            for this question.
                                        </p>

                                    )}

                                </div>


                            </article>

                        )
                    )

                )}

            </section>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/student/preparation/mock-interviews"
                        )
                    }
                >
                    Back to Mock Interviews
                </button>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/student/preparation/mock-interviews/${interviewId}`
                        )
                    }
                >
                    View Interview
                </button>

            </div>


        </div>
    );
};


export default MockInterviewResults;