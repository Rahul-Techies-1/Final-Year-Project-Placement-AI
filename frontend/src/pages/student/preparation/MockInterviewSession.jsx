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

    const [interview, setInterview] =
        useState(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] =
        useState(0);

    const [answer, setAnswer] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [completing, setCompleting] =
        useState(false);

    const [error, setError] =
        useState("");


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
                await getMockInterviewById(
                    interviewId
                );

            setInterview(data);


            // ------------------------------------------------
            // Load existing answer of first question
            // ------------------------------------------------

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


            // ------------------------------------------------
            // Update local question state
            // ------------------------------------------------

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


                const answeredQuestions =
                    updatedQuestions.filter(
                        (question) =>
                            question.student_answer !== null &&
                            question.student_answer !== undefined &&
                            question.student_answer.trim() !== ""
                    ).length;


                return {
                    ...previous,

                    questions:
                        updatedQuestions,

                    questions_answered:
                        answeredQuestions
                };

            });


            // ------------------------------------------------
            // Move to next question
            // ------------------------------------------------

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


            // ------------------------------------------------
            // If current question has an unsaved answer,
            // submit it first.
            // ------------------------------------------------

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


            // ------------------------------------------------
            // Complete interview
            // ------------------------------------------------

            const response =
                await completeMockInterview(
                    interviewId
                );


            // ------------------------------------------------
            // Navigate directly to results page
            // ------------------------------------------------

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
    // GO TO PREVIOUS QUESTION
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
    // GO TO NEXT QUESTION
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
    // GO TO SPECIFIC QUESTION
    // ========================================================

    const handleQuestionNavigation = (
        index
    ) => {

        const question =
            questions[index];


        setCurrentQuestionIndex(
            index
        );


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

            <div className="mock-interview-session">

                <div className="page-header">

                    <h1>
                        Mock Interview
                    </h1>

                </div>

                <p>
                    Loading interview...
                </p>

            </div>
        );
    }


    // ========================================================
    // ERROR / NO INTERVIEW
    // ========================================================

    if (!interview) {

        return (

            <div className="mock-interview-session">

                <div className="error-state">

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
    // NO QUESTIONS
    // ========================================================

    if (questions.length === 0) {

        return (

            <div className="mock-interview-session">

                <div className="error-state">

                    <h2>
                        No Questions Available
                    </h2>

                    <p>
                        This interview does not have any
                        questions yet.
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
    // CALCULATE PROGRESS
    // ========================================================

    const answeredQuestions =
        questions.filter(
            (question) =>
                question.student_answer !== null &&
                question.student_answer !== undefined &&
                question.student_answer.trim() !== ""
        ).length;


    const progressPercentage =
        Math.round(
            (
                answeredQuestions /
                questions.length
            ) * 100
        );


    // ========================================================
    // SESSION UI
    // ========================================================

    return (

        <div className="mock-interview-session">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        Mock Interview
                    </h1>

                    <p>
                        Answer each question as if you were
                        in a real interview.
                    </p>

                </div>

            </div>


            {/* ==================================================
                INTERVIEW INFORMATION
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
                        Progress
                    </p>

                    <h3>
                        {answeredQuestions}
                        {" / "}
                        {questions.length}
                    </h3>

                </div>

            </section>


            {/* ==================================================
                PROGRESS BAR
            ================================================== */}

            <section>

                <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuenow={
                        progressPercentage
                    }
                    aria-valuemin="0"
                    aria-valuemax="100"
                >

                    <div
                        className="progress-bar-fill"
                        style={{
                            width:
                                `${progressPercentage}%`
                        }}
                    />

                </div>

            </section>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="error-state">

                    <p>
                        {error}
                    </p>

                </div>

            )}


            {/* ==================================================
                QUESTION
            ================================================== */}

            <section className="preparation-problem-card">


                <div>

                    <p>
                        Question{" "}
                        {currentQuestionIndex + 1}
                        {" / "}
                        {questions.length}
                    </p>

                    <h2>
                        {currentQuestion.question}
                    </h2>

                </div>


                {/* ==================================================
                    QUESTION TYPE
                ================================================== */}

                <p>

                    <strong>
                        Type:
                    </strong>{" "}

                    {currentQuestion.question_type}

                </p>


                {/* ==================================================
                    ANSWER
                ================================================== */}

                <div>

                    <label
                        htmlFor="mock-interview-answer"
                    >
                        Your Answer
                    </label>

                    <textarea
                        id="mock-interview-answer"
                        value={answer}
                        onChange={(event) =>
                            setAnswer(
                                event.target.value
                            )
                        }
                        placeholder="Type your answer here..."
                        rows={8}
                        disabled={
                            submitting ||
                            completing
                        }
                    />

                </div>


                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <div>


                    <button
                        type="button"
                        onClick={
                            handlePreviousQuestion
                        }
                        disabled={
                            currentQuestionIndex === 0 ||
                            submitting ||
                            completing
                        }
                    >
                        Previous
                    </button>


                    <button
                        type="button"
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
                            ? "Submitting..."
                            : currentQuestion.student_answer
                                ? "Update Answer"
                                : "Submit Answer"
                        }

                    </button>


                    {currentQuestionIndex <
                        questions.length - 1 && (

                        <button
                            type="button"
                            onClick={
                                handleNextQuestion
                            }
                            disabled={
                                submitting ||
                                completing
                            }
                        >
                            Next
                        </button>

                    )}

                </div>


                {/* ==================================================
                    COMPLETE INTERVIEW
                ================================================== */}

                <div>

                    <button
                        type="button"
                        onClick={
                            handleCompleteInterview
                        }
                        disabled={
                            submitting ||
                            completing
                        }
                    >

                        {completing
                            ? "Completing Interview..."
                            : "Complete Interview"
                        }

                    </button>

                </div>

            </section>


            {/* ==================================================
                QUESTION NAVIGATION
            ================================================== */}

            <section>

                <h3>
                    Questions
                </h3>


                <div>

                    {questions.map(
                        (question, index) => (

                            <button
                                type="button"
                                key={question.id}
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

                                {index + 1}

                                {question.student_answer
                                    ? " ✓"
                                    : ""
                                }

                            </button>

                        )
                    )}

                </div>

            </section>

        </div>
    );
};


export default MockInterviewSession;