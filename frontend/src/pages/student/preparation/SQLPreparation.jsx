import { useEffect, useState } from "react";

import {
    getSQLTopics,
    getSQLProblems,
    getSQLOverview,
    markSQLProblemCompleted,
    markSQLProblemIncomplete
} from "../../../services/sqlService";


const SQLPreparation = () => {

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
    // LOAD INITIAL SQL DATA
    // ========================================================

    useEffect(() => {

        loadSQLData();

    }, []);


    // ========================================================
    // LOAD SQL OVERVIEW + TOPICS + PROBLEMS
    // ========================================================

    const loadSQLData = async () => {

        try {

            setLoading(true);

            setError("");

            const [
                overviewData,
                topicsData,
                problemsData
            ] = await Promise.all([

                getSQLOverview(),

                getSQLTopics(),

                getSQLProblems()

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
                "Failed to load SQL data:",
                err
            );

            setError(
                "Failed to load SQL preparation data."
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

            const data =
                await getSQLProblems({
                    topicId
                });

            setProblems(
                data.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load SQL problems:",
                err
            );

            setError(
                "Failed to load SQL problems."
            );
        }
    };


    // ========================================================
    // SHOW ALL PROBLEMS
    // ========================================================

    const handleShowAll = async () => {

        try {

            setSelectedTopic(
                null
            );

            const data =
                await getSQLProblems();

            setProblems(
                data.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load SQL problems:",
                err
            );

            setError(
                "Failed to load SQL problems."
            );
        }
    };


    // ========================================================
    // TOGGLE PROBLEM COMPLETION
    // ========================================================

    const handleToggleProgress = async (
        problem
    ) => {

        try {

            if (problem.completed) {

                await markSQLProblemIncomplete(
                    problem.id
                );

            } else {

                await markSQLProblemCompleted(
                    problem.id
                );
            }

            // Refresh overview + current problem list

            const [
                overviewData,
                problemsData
            ] = await Promise.all([

                getSQLOverview(),

                getSQLProblems({
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
                "Failed to update SQL progress:",
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
                Loading SQL preparation...
            </div>
        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error && !overview) {

        return (
            <div>
                {error}
            </div>
        );
    }


    // ========================================================
    // UI
    // ========================================================

    return (

        <div>

            <h1>
                SQL Preparation
            </h1>


            {/* ==================================================
                PROGRESS
            ================================================== */}

            {overview && (

                <div>

                    <h2>
                        Your Progress
                    </h2>

                    <p>
                        Completed:{" "}
                        {
                            overview.progress
                                .completed_problems
                        }
                        {" / "}
                        {
                            overview.progress
                                .total_problems
                        }
                    </p>

                    <p>
                        Remaining:{" "}
                        {
                            overview.progress
                                .remaining_problems
                        }
                    </p>

                    <p>
                        Progress:{" "}
                        {
                            overview.progress
                                .progress_percentage
                        }%
                    </p>

                </div>
            )}


            {/* ==================================================
                TOPICS
            ================================================== */}

            <div>

                <h2>
                    SQL Topics
                </h2>

                <button
                    onClick={
                        handleShowAll
                    }
                >
                    All Topics
                </button>

                {topics.map(
                    (topic) => (

                        <button
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

            </div>


            {/* ==================================================
                PROBLEMS
            ================================================== */}

            <div>

                <h2>
                    SQL Problems
                </h2>

                {problems.length === 0 ? (

                    <p>
                        No SQL problems found.
                    </p>

                ) : (

                    problems.map(
                        (problem) => (

                            <div
                                key={
                                    problem.id
                                }
                            >

                                <h3>
                                    {
                                        problem.title
                                    }
                                </h3>

                                <p>
                                    {
                                        problem.description
                                    }
                                </p>

                                <p>
                                    Difficulty:{" "}
                                    {
                                        problem.difficulty
                                    }
                                </p>


                                <button
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
                                        Practice Problem
                                    </a>

                                )}

                            </div>

                        )
                    )

                )}

            </div>


            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (

                <p>
                    {error}
                </p>

            )}

        </div>
    );
};


export default SQLPreparation;