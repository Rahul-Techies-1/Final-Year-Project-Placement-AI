import { useEffect, useState } from "react";

import {
    getAptitudeOverview,
    getAptitudeTopics,
    getAptitudeQuestions,
    markAptitudeQuestionCompleted,
    markAptitudeQuestionIncomplete
} from "../../../services/aptitudeService";


const AptitudePreparation = () => {

    const [overview, setOverview] = useState(null);

    const [topics, setTopics] = useState([]);

    const [questions, setQuestions] = useState([]);

    const [selectedTopic, setSelectedTopic] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [questionsLoading, setQuestionsLoading] =
        useState(false);

    const [updatingQuestionId, setUpdatingQuestionId] =
        useState(null);

    const [error, setError] =
        useState("");


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadAptitudeData();

    }, []);


    // ========================================================
    // LOAD OVERVIEW + TOPICS + QUESTIONS
    // ========================================================

    const loadAptitudeData = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                overviewData,
                topicsData,
                questionsData
            ] = await Promise.all([

                getAptitudeOverview(),

                getAptitudeTopics(),

                getAptitudeQuestions()

            ]);


            setOverview(
                overviewData
            );


            setTopics(
                topicsData || []
            );


            setQuestions(
                questionsData?.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load Aptitude data:",
                err
            );

            setError(
                "Failed to load Aptitude preparation data."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // LOAD QUESTIONS BY TOPIC
    // ========================================================

    const handleTopicChange = async (
        topicId
    ) => {

        try {

            setSelectedTopic(
                topicId
            );

            setQuestionsLoading(
                true
            );

            setError("");


            const data =
                await getAptitudeQuestions({
                    topicId
                });


            setQuestions(
                data?.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load Aptitude questions:",
                err
            );

            setError(
                "Failed to load Aptitude questions."
            );

        } finally {

            setQuestionsLoading(
                false
            );

        }
    };


    // ========================================================
    // SHOW ALL QUESTIONS
    // ========================================================

    const handleShowAll = async () => {

        try {

            setSelectedTopic(
                null
            );

            setQuestionsLoading(
                true
            );

            setError("");


            const data =
                await getAptitudeQuestions();


            setQuestions(
                data?.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load Aptitude questions:",
                err
            );

            setError(
                "Failed to load Aptitude questions."
            );

        } finally {

            setQuestionsLoading(
                false
            );

        }
    };


    // ========================================================
    // TOGGLE QUESTION PROGRESS
    // ========================================================

    const handleToggleProgress = async (
        question
    ) => {

        try {

            setError("");

            setUpdatingQuestionId(
                question.id
            );


            // ------------------------------------------------
            // Mark Complete / Incomplete
            // ------------------------------------------------

            if (question.completed) {

                await markAptitudeQuestionIncomplete(
                    question.id
                );

            } else {

                await markAptitudeQuestionCompleted(
                    question.id
                );

            }


            // ------------------------------------------------
            // Refresh overview + questions
            // ------------------------------------------------

            const [
                overviewData,
                questionsData
            ] = await Promise.all([

                getAptitudeOverview(),

                selectedTopic !== null
                    ? getAptitudeQuestions({
                        topicId:
                            selectedTopic
                    })
                    : getAptitudeQuestions()

            ]);


            setOverview(
                overviewData
            );


            setQuestions(
                questionsData?.items || []
            );

        } catch (err) {

            console.error(
                "Failed to update Aptitude progress:",
                err
            );

            setError(
                "Failed to update question progress."
            );

        } finally {

            setUpdatingQuestionId(
                null
            );

        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="aptitude-preparation">

                <div className="page-header">

                    <div>

                        <h1>
                            Aptitude Preparation
                        </h1>

                        <p>
                            Loading your aptitude preparation...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // ========================================================
    // INITIAL ERROR
    // ========================================================

    if (error && !overview) {

        return (

            <div className="aptitude-preparation">

                <div className="error-state">

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadAptitudeData}
                    >
                        Retry
                    </button>

                </div>

            </div>
        );
    }


    // ========================================================
    // UI
    // ========================================================

    return (

        <div className="aptitude-preparation">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        Aptitude Preparation
                    </h1>

                    <p>
                        Practice quantitative, logical and
                        verbal aptitude questions for
                        placement interviews.
                    </p>

                </div>

            </div>


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
                PROGRESS
            ================================================== */}

            {overview?.progress && (

                <section>

                    <h2>
                        Your Progress
                    </h2>

                    <p>
                        Completed:{" "}
                        {
                            overview.progress.completed_questions
                        }
                        {" / "}
                        {
                            overview.progress.total_questions
                        }
                    </p>

                    <p>
                        Remaining:{" "}
                        {
                            overview.progress.remaining_questions
                        }
                    </p>

                    <p>
                        Progress:{" "}
                        {
                            overview.progress.progress_percentage
                        }%
                    </p>


                    <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow={
                            overview.progress
                                .progress_percentage
                        }
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >

                        <div
                            className="progress-bar-fill"
                            style={{
                                width:
                                    `${overview.progress.progress_percentage}%`
                            }}
                        />

                    </div>

                </section>

            )}


            {/* ==================================================
                TOPICS
            ================================================== */}

            <section>

                <h2>
                    Aptitude Topics
                </h2>


                <div>

                    <button
                        type="button"
                        onClick={handleShowAll}
                        disabled={
                            questionsLoading
                        }
                    >

                        All Topics

                    </button>


                    {topics.map(
                        (topic) => (

                            <button
                                type="button"
                                key={topic.id}
                                onClick={() =>
                                    handleTopicChange(
                                        topic.id
                                    )
                                }
                                disabled={
                                    questionsLoading
                                }
                            >

                                {topic.name}

                            </button>

                        )
                    )}

                </div>

            </section>


            {/* ==================================================
                QUESTIONS
            ================================================== */}

            <section>

                <h2>
                    Aptitude Questions
                </h2>


                {/* ------------------------------------------------
                    QUESTION LOADING
                ------------------------------------------------ */}

                {questionsLoading ? (

                    <p>
                        Loading questions...
                    </p>

                ) : questions.length === 0 ? (

                    /* --------------------------------------------
                       EMPTY STATE
                    -------------------------------------------- */

                    <p>
                        No Aptitude questions found.
                    </p>

                ) : (

                    /* --------------------------------------------
                       QUESTION LIST
                    -------------------------------------------- */

                    questions.map(
                        (question, index) => (

                            <div
                                key={question.id}
                                className="preparation-problem-card"
                            >

                                {/* --------------------------------
                                    QUESTION NUMBER
                                -------------------------------- */}

                                <h3>
                                    Question {index + 1}
                                </h3>


                                {/* --------------------------------
                                    QUESTION
                                -------------------------------- */}

                                <p>
                                    {question.question}
                                </p>


                                {/* --------------------------------
                                    OPTIONS
                                -------------------------------- */}

                                <div>

                                    <p>

                                        <strong>
                                            A.
                                        </strong>{" "}

                                        {question.option_a}

                                    </p>


                                    <p>

                                        <strong>
                                            B.
                                        </strong>{" "}

                                        {question.option_b}

                                    </p>


                                    <p>

                                        <strong>
                                            C.
                                        </strong>{" "}

                                        {question.option_c}

                                    </p>


                                    <p>

                                        <strong>
                                            D.
                                        </strong>{" "}

                                        {question.option_d}

                                    </p>

                                </div>


                                {/* --------------------------------
                                    DIFFICULTY
                                -------------------------------- */}

                                <p>

                                    Difficulty:{" "}

                                    {question.difficulty}

                                </p>


                                {/* --------------------------------
                                    COMPLETION STATUS
                                -------------------------------- */}

                                <p>

                                    Status:{" "}

                                    {question.completed
                                        ? "Completed"
                                        : "Not Completed"
                                    }

                                </p>


                                {/* --------------------------------
                                    PROGRESS BUTTON
                                -------------------------------- */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleToggleProgress(
                                            question
                                        )
                                    }
                                    disabled={
                                        updatingQuestionId ===
                                        question.id
                                    }
                                >

                                    {updatingQuestionId ===
                                    question.id

                                        ? "Updating..."

                                        : question.completed

                                            ? "Mark Incomplete"

                                            : "Mark Complete"

                                    }

                                </button>


                                {/* --------------------------------
                                    COMPLETED INDICATOR
                                -------------------------------- */}

                                {question.completed && (

                                    <p>

                                        ✓ Completed

                                    </p>

                                )}

                            </div>

                        )
                    )

                )}

            </section>

        </div>
    );
};


export default AptitudePreparation;