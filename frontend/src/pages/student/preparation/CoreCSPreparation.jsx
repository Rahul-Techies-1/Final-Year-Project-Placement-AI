import { useEffect, useState } from "react";

import {
    getCoreCSOverview,
    getCoreCSTopics,
    getCoreCSProblems,
    markCoreCSProblemCompleted,
    markCoreCSProblemIncomplete
} from "../../../services/coreCSService";


const CoreCSPreparation = () => {

    const [overview, setOverview] = useState(null);

    const [topics, setTopics] = useState([]);

    const [problems, setProblems] = useState([]);

    const [selectedTopic, setSelectedTopic] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadCoreCSData();

    }, []);


    // ========================================================
    // LOAD OVERVIEW + TOPICS + PROBLEMS
    // ========================================================

    const loadCoreCSData = async () => {

        try {

            setLoading(true);

            setError("");

            const [
                overviewData,
                topicsData,
                problemsData
            ] = await Promise.all([

                getCoreCSOverview(),

                getCoreCSTopics(),

                getCoreCSProblems()

            ]);

            setOverview(
                overviewData
            );

            setTopics(
                topicsData
            );

            setProblems(
                problemsData.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load Core CS data:",
                err
            );

            setError(
                "Failed to load Core CS preparation data."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // FILTER BY TOPIC
    // ========================================================

    const handleTopicChange = async (
        topicId
    ) => {

        try {

            setSelectedTopic(
                topicId
            );

            setError("");

            const data =
                await getCoreCSProblems({
                    topicId
                });

            setProblems(
                data.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load Core CS problems:",
                err
            );

            setError(
                "Failed to load Core CS problems."
            );
        }
    };


    // ========================================================
    // SHOW ALL
    // ========================================================

    const handleShowAll = async () => {

        try {

            setSelectedTopic(null);

            setError("");

            const data =
                await getCoreCSProblems();

            setProblems(
                data.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load Core CS problems:",
                err
            );

            setError(
                "Failed to load Core CS problems."
            );
        }
    };


    // ========================================================
    // TOGGLE PROGRESS
    // ========================================================

    const handleToggleProgress = async (
        problem
    ) => {

        try {

            setError("");

            if (problem.completed) {

                await markCoreCSProblemIncomplete(
                    problem.id
                );

            } else {

                await markCoreCSProblemCompleted(
                    problem.id
                );
            }


            const [
                overviewData,
                problemsData
            ] = await Promise.all([

                getCoreCSOverview(),

                getCoreCSProblems({
                    topicId:
                        selectedTopic
                })

            ]);


            setOverview(
                overviewData
            );

            setProblems(
                problemsData.items || []
            );

        } catch (err) {

            console.error(
                "Failed to update Core CS progress:",
                err
            );

            setError(
                "Failed to update problem progress."
            );
        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <div>
                Loading Core CS preparation...
            </div>
        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error && !overview) {

        return (
            <div>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={loadCoreCSData}
                >
                    Retry
                </button>

            </div>
        );
    }


    // ========================================================
    // UI
    // ========================================================

    return (

        <div className="core-cs-preparation">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        Core CS Preparation
                    </h1>

                    <p>
                        Prepare DBMS, Operating Systems,
                        Computer Networks and OOP for
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

            {overview && overview.progress && (

                <section>

                    <h2>
                        Your Progress
                    </h2>

                    <p>
                        Completed:{" "}
                        {
                            overview.progress.completed_problems
                        }
                        {" / "}
                        {
                            overview.progress.total_problems
                        }
                    </p>

                    <p>
                        Remaining:{" "}
                        {
                            overview.progress.remaining_problems
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
                            overview.progress.progress_percentage
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
                    Core CS Topics
                </h2>

                <button
                    type="button"
                    onClick={handleShowAll}
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
                        >
                            {topic.name}
                        </button>

                    )
                )}

            </section>


            {/* ==================================================
                PROBLEMS
            ================================================== */}

            <section>

                <h2>
                    Core CS Questions
                </h2>


                {problems.length === 0 ? (

                    <p>
                        No Core CS questions found.
                    </p>

                ) : (

                    problems.map(
                        (problem) => (

                            <div
                                key={problem.id}
                                className="preparation-problem-card"
                            >

                                <h3>
                                    {problem.title}
                                </h3>


                                <p>
                                    {problem.description}
                                </p>


                                <p>
                                    Difficulty:{" "}
                                    {problem.difficulty}
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleToggleProgress(
                                            problem
                                        )
                                    }
                                >

                                    {
                                        problem.completed
                                            ? "Mark Incomplete"
                                            : "Mark Complete"
                                    }

                                </button>


                                {problem.external_url && (

                                    <a
                                        href={
                                            problem.external_url
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Practice Question
                                    </a>

                                )}

                            </div>

                        )
                    )

                )}

            </section>

        </div>
    );
};


export default CoreCSPreparation;