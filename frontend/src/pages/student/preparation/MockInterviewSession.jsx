import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getMockInterviewById,
    submitMockInterviewAnswer,
    completeMockInterview
} from "../../../services/mockInterviewService";


const MockInterviewSession = () => {

    const { interviewId } = useParams();
    const navigate = useNavigate();

    // ========================================================
    // STATE
    // ========================================================

    const [interview, setInterview] = useState(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] =
        useState(0);

    const [answer, setAnswer] = useState("");

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [completing, setCompleting] = useState(false);

    const [error, setError] = useState("");


    // ========================================================
    // LOAD INTERVIEW
    // ========================================================

    useEffect(() => {
        loadInterview();
    }, [interviewId]);


    const loadInterview = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getMockInterviewById(interviewId);

            setInterview(data);

            const firstQuestion =
                data?.questions?.[0];

            setAnswer(
                firstQuestion?.student_answer || ""
            );

        } catch (err) {

            console.error(
                "Failed to load mock interview:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                "Failed to load mock interview."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // CURRENT QUESTION
    // ========================================================

    const questions =
        interview?.questions || [];

    const currentQuestion =
        questions[currentQuestionIndex];


    // ========================================================
    // ANSWERED QUESTIONS
    // ========================================================

    const answeredQuestions =
        questions.filter(
            (question) =>
                question.student_answer !== null &&
                question.student_answer !== undefined &&
                question.student_answer.trim() !== ""
        ).length;


    const progressPercentage =
        questions.length > 0
            ? Math.round(
                (answeredQuestions / questions.length) * 100
            )
            : 0;


    // ========================================================
    // SUBMIT CURRENT ANSWER
    // ========================================================

    const handleSubmitAnswer = async () => {

        if (!currentQuestion) {
            return;
        }

        if (!answer.trim()) {

            setError(
                "Please enter your answer before submitting."
            );

            return;
        }

        try {

            setSubmitting(true);
            setError("");

            await submitMockInterviewAnswer(
                interviewId,
                currentQuestion.id,
                answer.trim()
            );

            setInterview((previous) => {

                if (!previous) {
                    return previous;
                }

                const updatedQuestions =
                    previous.questions.map(
                        (question) => {

                            if (
                                question.id ===
                                currentQuestion.id
                            ) {

                                return {
                                    ...question,
                                    student_answer:
                                        answer.trim()
                                };

                            }

                            return question;

                        }
                    );

                const answered =
                    updatedQuestions.filter(
                        (question) =>
                            question.student_answer !== null &&
                            question.student_answer !== undefined &&
                            question.student_answer.trim() !== ""
                    ).length;

                return {
                    ...previous,
                    questions: updatedQuestions,
                    questions_answered: answered
                };

            });

            if (
                currentQuestionIndex <
                questions.length - 1
            ) {

                const nextQuestion =
                    questions[
                        currentQuestionIndex + 1
                    ];

                setCurrentQuestionIndex(
                    (previous) =>
                        previous + 1
                );

                setAnswer(
                    nextQuestion?.student_answer || ""
                );

            }

        } catch (err) {

            console.error(
                "Failed to submit answer:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                "Failed to submit answer."
            );

        } finally {

            setSubmitting(false);

        }
    };


    // ========================================================
    // COMPLETE INTERVIEW
    // ========================================================

    const handleCompleteInterview = async () => {

        if (completing || submitting) {
            return;
        }

        try {

            setCompleting(true);
            setError("");

            if (
                currentQuestion &&
                answer.trim() &&
                answer.trim() !==
                (currentQuestion.student_answer || "").trim()
            ) {

                await submitMockInterviewAnswer(
                    interviewId,
                    currentQuestion.id,
                    answer.trim()
                );

            }

            const response =
                await completeMockInterview(
                    interviewId
                );

            navigate(
                `/student/preparation/mock-interviews/${interviewId}/results`,
                {
                    state: {
                        result: response
                    }
                }
            );

        } catch (err) {

            console.error(
                "Failed to complete mock interview:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                "Failed to complete mock interview."
            );

        } finally {

            setCompleting(false);

        }
    };


    // ========================================================
    // PREVIOUS QUESTION
    // ========================================================

    const handlePreviousQuestion = () => {

        if (currentQuestionIndex === 0) {
            return;
        }

        const previousQuestion =
            questions[
                currentQuestionIndex - 1
            ];

        setCurrentQuestionIndex(
            (previous) =>
                previous - 1
        );

        setAnswer(
            previousQuestion?.student_answer || ""
        );

        setError("");

    };


    // ========================================================
    // NEXT QUESTION
    // ========================================================

    const handleNextQuestion = () => {

        if (
            currentQuestionIndex >=
            questions.length - 1
        ) {
            return;
        }

        const nextQuestion =
            questions[
                currentQuestionIndex + 1
            ];

        setCurrentQuestionIndex(
            (previous) =>
                previous + 1
        );

        setAnswer(
            nextQuestion?.student_answer || ""
        );

        setError("");

    };


    // ========================================================
    // SPECIFIC QUESTION
    // ========================================================

    const handleQuestionNavigation = (index) => {

        const question =
            questions[index];

        setCurrentQuestionIndex(index);

        setAnswer(
            question?.student_answer || ""
        );

        setError("");

    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="mock-session-page">

                <div className="mock-session-loading">

                    <div className="mock-session-spinner" />

                    <h2>
                        Preparing your interview
                    </h2>

                    <p>
                        Loading questions and interview details...
                    </p>

                </div>

            </div>

        );
    }


    // ========================================================
    // ERROR / NO INTERVIEW
    // ========================================================

    if (!interview) {

        return (

            <div className="mock-session-page">

                <div className="mock-session-error">

                    <div className="mock-session-error-icon">
                        !
                    </div>

                    <h2>
                        Mock Interview Not Found
                    </h2>

                    <p>
                        {error ||
                            "We couldn't load this interview."
                        }
                    </p>

                    <button
                        type="button"
                        className="mock-session-primary-btn"
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
    // NO QUESTIONS
    // ========================================================

    if (questions.length === 0) {

        return (

            <div className="mock-session-page">

                <div className="mock-session-error">

                    <div className="mock-session-error-icon">
                        !
                    </div>

                    <h2>
                        No Questions Available
                    </h2>

                    <p>
                        This interview does not have any
                        questions yet.
                    </p>

                    <button
                        type="button"
                        className="mock-session-primary-btn"
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
    // QUESTION STATE
    // ========================================================

    const isCurrentQuestionAnswered =
        Boolean(
            currentQuestion?.student_answer &&
            currentQuestion.student_answer.trim()
        );

    const isLastQuestion =
        currentQuestionIndex ===
        questions.length - 1;


    // ========================================================
    // SESSION UI
    // ========================================================

    return (

        <div className="mock-session-page">

            {/* ==================================================
                TOP HEADER
            ================================================== */}

            <header className="mock-session-header">

                <div className="mock-session-header-left">

                    <button
                        type="button"
                        className="mock-session-back-btn"
                        onClick={() =>
                            navigate(
                                "/student/preparation/mock-interviews"
                            )
                        }
                        disabled={
                            submitting ||
                            completing
                        }
                    >
                        ←
                    </button>

                    <div>

                        <span className="mock-session-label">
                            MOCK INTERVIEW
                        </span>

                        <h1>
                            {interview.interview_type === "technical"
                                ? "Technical Interview"
                                : "HR Interview"
                            }
                        </h1>

                    </div>

                </div>


                <div className="mock-session-header-right">

                    <div className="mock-session-meta">

                        <span className="mock-session-meta-label">
                            Difficulty
                        </span>

                        <strong>
                            {interview.difficulty}
                        </strong>

                    </div>

                    <div className="mock-session-divider" />

                    <div className="mock-session-meta">

                        <span className="mock-session-meta-label">
                            Questions
                        </span>

                        <strong>
                            {questions.length}
                        </strong>

                    </div>

                    <div className="mock-session-divider" />

                    <div className="mock-session-progress-text">

                        <strong>
                            {answeredQuestions}
                        </strong>

                        <span>
                            / {questions.length} answered
                        </span>

                    </div>

                </div>

            </header>


            {/* ==================================================
                PROGRESS
            ================================================== */}

            <div className="mock-session-progress-wrapper">

                <div className="mock-session-progress-top">

                    <span>
                        Interview Progress
                    </span>

                    <strong>
                        {progressPercentage}%
                    </strong>

                </div>

                <div
                    className="mock-session-progress-bar"
                    role="progressbar"
                    aria-valuenow={progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >

                    <div
                        className="mock-session-progress-fill"
                        style={{
                            width:
                                `${progressPercentage}%`
                        }}
                    />

                </div>

            </div>


            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <main className="mock-session-content">


                {/* ==================================================
                    LEFT QUESTION NAVIGATION
                ================================================== */}

                <aside className="mock-session-sidebar">

                    <div className="mock-session-sidebar-card">

                        <div className="mock-session-sidebar-heading">

                            <div>

                                <span>
                                    INTERVIEW
                                </span>

                                <h3>
                                    Questions
                                </h3>

                            </div>

                            <span className="mock-session-question-count">
                                {answeredQuestions}/{questions.length}
                            </span>

                        </div>


                        <p className="mock-session-sidebar-description">
                            Select a question to review
                            or edit your answer.
                        </p>


                        <div className="mock-session-question-list">

                            {questions.map(
                                (question, index) => {

                                    const answered =
                                        Boolean(
                                            question.student_answer &&
                                            question.student_answer.trim()
                                        );

                                    const active =
                                        index ===
                                        currentQuestionIndex;

                                    return (

                                        <button
                                            type="button"
                                            key={question.id}
                                            className={`mock-session-question-nav ${
                                                active
                                                    ? "active"
                                                    : ""
                                            } ${
                                                answered
                                                    ? "answered"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleQuestionNavigation(
                                                    index
                                                )
                                            }
                                            disabled={
                                                submitting ||
                                                completing
                                            }
                                        >

                                            <span className="mock-session-question-number">

                                                {answered
                                                    ? "✓"
                                                    : index + 1
                                                }

                                            </span>

                                            <span className="mock-session-question-nav-text">

                                                <strong>
                                                    Question {index + 1}
                                                </strong>

                                                <small>
                                                    {answered
                                                        ? "Answered"
                                                        : "Not answered"
                                                    }
                                                </small>

                                            </span>

                                        </button>

                                    );

                                }
                            )}

                        </div>


                        <div className="mock-session-sidebar-tip">

                            <span className="mock-session-tip-icon">
                                💡
                            </span>

                            <p>
                                Take your time and answer
                                as you would in a real interview.
                            </p>

                        </div>

                    </div>

                </aside>


                {/* ==================================================
                    RIGHT QUESTION AREA
                ================================================== */}

                <section className="mock-session-main">


                    {/* ==================================================
                        QUESTION CARD
                    ================================================== */}

                    <div className="mock-session-question-card">


                        <div className="mock-session-question-header">

                            <div>

                                <span className="mock-session-question-eyebrow">
                                    QUESTION {currentQuestionIndex + 1}
                                    {" OF "}
                                    {questions.length}
                                </span>

                                <div className="mock-session-question-tags">

                                    <span>
                                        {currentQuestion.question_type}
                                    </span>

                                    <span>
                                        {interview.difficulty}
                                    </span>

                                </div>

                            </div>


                            <div className="mock-session-question-status">

                                {isCurrentQuestionAnswered ? (
                                    <>
                                        <span className="mock-session-status-dot answered-dot" />
                                        Answered
                                    </>
                                ) : (
                                    <>
                                        <span className="mock-session-status-dot" />
                                        Pending
                                    </>
                                )}

                            </div>

                        </div>


                        <div className="mock-session-question-body">

                            <h2>
                                {currentQuestion.question}
                            </h2>

                        </div>


                        {/* ==================================================
                            ANSWER AREA
                        ================================================== */}

                        <div className="mock-session-answer-section">

                            <div className="mock-session-answer-header">

                                <label
                                    htmlFor="mock-interview-answer"
                                >
                                    Your Answer
                                </label>

                                <span>
                                    {answer.length} characters
                                </span>

                            </div>


                            <textarea
                                id="mock-interview-answer"
                                className="mock-session-answer-input"
                                value={answer}
                                onChange={(event) =>
                                    setAnswer(
                                        event.target.value
                                    )
                                }
                                placeholder="Write your answer here. Explain your approach clearly and use examples where appropriate..."
                                rows={10}
                                disabled={
                                    submitting ||
                                    completing
                                }
                            />

                            <div className="mock-session-answer-hint">
                                <span>AI Evaluation</span>
                                <p>
                                    Your answer will be evaluated
                                    by the AI interviewer after submission.
                                </p>
                            </div>

                        </div>


                        {/* ==================================================
                            ERROR
                        ================================================== */}

                        {error && (

                            <div className="mock-session-inline-error">

                                <span>
                                    !
                                </span>

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* ==================================================
                            ACTION BAR
                        ================================================== */}

                        <div className="mock-session-actions">


                            <button
                                type="button"
                                className="mock-session-secondary-btn"
                                onClick={
                                    handlePreviousQuestion
                                }
                                disabled={
                                    currentQuestionIndex === 0 ||
                                    submitting ||
                                    completing
                                }
                            >
                                ← Previous
                            </button>


                            <div className="mock-session-actions-right">


                                <button
                                    type="button"
                                    className="mock-session-submit-btn"
                                    onClick={
                                        handleSubmitAnswer
                                    }
                                    disabled={
                                        submitting ||
                                        completing ||
                                        !answer.trim()
                                    }
                                >

                                    {submitting
                                        ? "Evaluating..."
                                        : isCurrentQuestionAnswered
                                            ? "Update Answer"
                                            : "Submit Answer"
                                    }

                                </button>


                                {!isLastQuestion && (

                                    <button
                                        type="button"
                                        className="mock-session-next-btn"
                                        onClick={
                                            handleNextQuestion
                                        }
                                        disabled={
                                            submitting ||
                                            completing
                                        }
                                    >
                                        Next →
                                    </button>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        COMPLETE INTERVIEW
                    ================================================== */}

                    <div className="mock-session-complete-card">

                        <div>

                            <span className="mock-session-complete-icon">
                                ✓
                            </span>

                            <div>

                                <h3>
                                    Ready to finish?
                                </h3>

                                <p>
                                    Make sure you have answered
                                    all questions before completing
                                    the interview.
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="mock-session-complete-btn"
                            onClick={
                                handleCompleteInterview
                            }
                            disabled={
                                submitting ||
                                completing
                            }
                        >

                            {completing
                                ? "Completing..."
                                : "Complete Interview"
                            }

                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
};


export default MockInterviewSession;