import { useEffect, useState } from "react";

import {
    getSQLTopics,
    getSQLProblems,
    getSQLOverview,
    executeSQLQuery,
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
    // SQL EDITOR STATE
    // ========================================================

    const [queries, setQueries] =
        useState({});

    const [executingProblemId, setExecutingProblemId] =
        useState(null);

    const [queryResults, setQueryResults] =
        useState({});

    const [queryErrors, setQueryErrors] =
        useState({});


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
                err.response?.data?.detail ||
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

            setError("");

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
                err.response?.data?.detail ||
                "Failed to load SQL problems."
            );
        }
    };


    // ========================================================
    // SHOW ALL PROBLEMS
    // ========================================================

    const handleShowAll = async () => {

        try {

            setError("");

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
                err.response?.data?.detail ||
                "Failed to load SQL problems."
            );
        }
    };


    // ========================================================
    // HANDLE QUERY CHANGE
    // ========================================================

    const handleQueryChange = (
        problemId,
        value
    ) => {

        setQueries(
            (currentQueries) => ({
                ...currentQueries,
                [problemId]: value
            })
        );

        // Remove old result/error when user changes query

        setQueryErrors(
            (currentErrors) => ({
                ...currentErrors,
                [problemId]: ""
            })
        );
    };


    // ========================================================
    // EXECUTE SQL QUERY
    // ========================================================

    const handleExecuteQuery = async (
        problem
    ) => {

        const query =
            queries[problem.id]?.trim() || "";

        if (!query) {

            setQueryErrors(
                (currentErrors) => ({
                    ...currentErrors,
                    [problem.id]:
                        "Please write a SQL query before running it."
                })
            );

            return;
        }

        try {

            setExecutingProblemId(
                problem.id
            );

            setQueryErrors(
                (currentErrors) => ({
                    ...currentErrors,
                    [problem.id]: ""
                })
            );

            setQueryResults(
                (currentResults) => ({
                    ...currentResults,
                    [problem.id]: null
                })
            );


            const result =
                await executeSQLQuery(
                    problem.id,
                    query
                );


            setQueryResults(
                (currentResults) => ({
                    ...currentResults,
                    [problem.id]: result
                })
            );


        } catch (err) {

            console.error(
                "Failed to execute SQL query:",
                err
            );

            const message =
                err.response?.data?.detail ||
                err.message ||
                "Failed to execute SQL query.";

            setQueryErrors(
                (currentErrors) => ({
                    ...currentErrors,
                    [problem.id]: message
                })
            );

        } finally {

            setExecutingProblemId(
                null
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

            setError("");

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
                err.response?.data?.detail ||
                "Failed to update problem progress."
            );
        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <div className="sql-preparation">

                <div className="sql-loading-state">

                    <div className="sql-loading-spinner"></div>

                    <h2>
                        Loading SQL Preparation
                    </h2>

                    <p>
                        Preparing your SQL practice environment...
                    </p>

                </div>

            </div>
        );
    }


    // ========================================================
    // INITIAL ERROR
    // ========================================================

    if (error && !overview) {

        return (
            <div className="sql-preparation">

                <div className="sql-error-state">

                    <h2>
                        Unable to Load SQL Preparation
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadSQLData}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    // ========================================================
    // UI
    // ========================================================

    return (

        <div className="sql-preparation">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="sql-page-header">

                <div>

                    <p className="sql-page-eyebrow">
                        PLACEMENT PREPARATION
                    </p>

                    <h1>
                        SQL Preparation
                    </h1>

                    <p className="sql-page-description">
                        Practice SQL problems, write queries,
                        execute them and track your progress.
                    </p>

                </div>

            </div>


            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (

                <div className="sql-inline-error">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {/* ==================================================
                PROGRESS OVERVIEW
            ================================================== */}

            {overview && (

                <section className="sql-progress-card">

                    <div className="sql-progress-content">

                        <div className="sql-progress-heading">

                            <p className="sql-card-eyebrow">
                                SQL PROGRESS
                            </p>

                            <h2>
                                {
                                    overview.progress
                                        .progress_percentage
                                }%
                            </h2>

                            <p>
                                {
                                    overview.progress
                                        .completed_problems
                                }
                                {" "}of{" "}
                                {
                                    overview.progress
                                        .total_problems
                                }
                                {" "}problems completed
                            </p>

                        </div>


                        <div className="sql-progress-bar-container">

                            <div
                                className="sql-progress-bar"
                                role="progressbar"
                                aria-valuenow={
                                    overview.progress
                                        .progress_percentage
                                }
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >

                                <div
                                    className="sql-progress-bar-fill"
                                    style={{
                                        width:
                                            `${overview.progress.progress_percentage}%`
                                    }}
                                />

                            </div>

                            <div className="sql-progress-summary">

                                <span>
                                    Completed:{" "}
                                    {
                                        overview.progress
                                            .completed_problems
                                    }
                                </span>

                                <span>
                                    Remaining:{" "}
                                    {
                                        overview.progress
                                            .remaining_problems
                                    }
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

            )}


            {/* ==================================================
                TOPICS
            ================================================== */}

            <section className="sql-topics-section">

                <div className="sql-section-header">

                    <div>

                        <p className="sql-section-eyebrow">
                            PRACTICE BY TOPIC
                        </p>

                        <h2>
                            SQL Topics
                        </h2>

                        <p>
                            Choose a topic to focus your preparation.
                        </p>

                    </div>

                </div>


                <div className="sql-topic-list">

                    <button
                        type="button"
                        className={
                            selectedTopic === null
                                ? "sql-topic-button active"
                                : "sql-topic-button"
                        }
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
                                type="button"
                                className={
                                    selectedTopic === topic.id
                                        ? "sql-topic-button active"
                                        : "sql-topic-button"
                                }
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

            </section>


            {/* ==================================================
                PROBLEMS
            ================================================== */}

            <section className="sql-problems-section">

                <div className="sql-section-header">

                    <div>

                        <p className="sql-section-eyebrow">
                            SQL PRACTICE
                        </p>

                        <h2>
                            SQL Problems
                        </h2>

                        <p>
                            Write and execute your own SQL query
                            for each problem.
                        </p>

                    </div>

                    <div className="sql-problem-count">

                        {problems.length}

                        <span>
                            {" "}problems
                        </span>

                    </div>

                </div>


                {problems.length === 0 ? (

                    <div className="sql-empty-state">

                        <div className="sql-empty-icon">
                            SQL
                        </div>

                        <h3>
                            No SQL Problems Found
                        </h3>

                        <p>
                            There are no problems available
                            for this topic.
                        </p>

                    </div>

                ) : (

                    <div className="sql-problems-list">

                        {problems.map(
                            (problem, index) => {

                                const result =
                                    queryResults[
                                        problem.id
                                    ];

                                const executionError =
                                    queryErrors[
                                        problem.id
                                    ];

                                const currentQuery =
                                    queries[
                                        problem.id
                                    ] || "";


                                return (

                                    <article
                                        className="sql-problem-card"
                                        key={problem.id}
                                    >


                                        {/* =========================
                                            PROBLEM HEADER
                                        ========================= */}

                                        <div className="sql-problem-header">

                                            <div className="sql-problem-number">

                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}

                                            </div>


                                            <div className="sql-problem-title-area">

                                                <div className="sql-problem-title-row">

                                                    <h3>
                                                        {
                                                            problem.title
                                                        }
                                                    </h3>

                                                    <span
                                                        className={
                                                            `sql-difficulty-badge ${String(
                                                                problem.difficulty
                                                            ).toLowerCase()}`
                                                        }
                                                    >
                                                        {
                                                            problem.difficulty
                                                        }
                                                    </span>

                                                </div>

                                                <p>
                                                    {
                                                        problem.description
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        {/* =========================
                                            SQL EDITOR
                                        ========================= */}

                                        <div className="sql-editor-section">

                                            <div className="sql-editor-header">

                                                <div>

                                                    <span className="sql-editor-label">
                                                        Your SQL Query
                                                    </span>

                                                    <span className="sql-editor-hint">
                                                        Write your solution below
                                                    </span>

                                                </div>

                                                <span className="sql-editor-language">
                                                    SQL
                                                </span>

                                            </div>


                                            <textarea
                                                className="sql-query-editor"
                                                value={
                                                    currentQuery
                                                }
                                                onChange={(event) =>
                                                    handleQueryChange(
                                                        problem.id,
                                                        event.target.value
                                                    )
                                                }
                                                placeholder={
                                                    "Write your SQL query here...\n\nExample:\nSELECT * FROM employees;"
                                                }
                                                spellCheck="false"
                                            />

                                        </div>


                                        {/* =========================
                                            ACTIONS
                                        ========================= */}

                                        <div className="sql-problem-actions">

                                            <button
                                                type="button"
                                                className="sql-run-button"
                                                disabled={
                                                    executingProblemId ===
                                                    problem.id
                                                }
                                                onClick={() =>
                                                    handleExecuteQuery(
                                                        problem
                                                    )
                                                }
                                            >

                                                {executingProblemId ===
                                                problem.id
                                                    ? (
                                                        <>
                                                            <span className="sql-button-spinner"></span>
                                                            Running...
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            ▶ Run Query
                                                        </>
                                                    )
                                                }

                                            </button>


                                            <button
                                                type="button"
                                                className={
                                                    problem.completed
                                                        ? "sql-complete-button completed"
                                                        : "sql-complete-button"
                                                }
                                                onClick={() =>
                                                    handleToggleProgress(
                                                        problem
                                                    )
                                                }
                                            >
                                                {
                                                    problem.completed
                                                        ? "✓ Completed"
                                                        : "Mark Complete"
                                                }
                                            </button>


                                            {problem.external_url && (

                                                <a
                                                    className="sql-practice-link"
                                                    href={
                                                        problem.external_url
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Practice Externally ↗
                                                </a>

                                            )}

                                        </div>


                                        {/* =========================
                                            EXECUTION ERROR
                                        ========================= */}

                                        {executionError && (

                                            <div className="sql-query-error">

                                                <div className="sql-result-icon">
                                                    !
                                                </div>

                                                <div>

                                                    <strong>
                                                        Query Error
                                                    </strong>

                                                    <p>
                                                        {
                                                            executionError
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )}


                                        {/* =========================
                                            QUERY RESULT
                                        ========================= */}

                                        {result && (

                                            <div className="sql-query-result">

                                                <div className="sql-result-header">

                                                    <div>

                                                        <p className="sql-result-eyebrow">
                                                            QUERY RESULT
                                                        </p>

                                                        <h4>
                                                            Execution Successful
                                                        </h4>

                                                    </div>

                                                    {result.row_count !==
                                                        undefined && (

                                                        <span className="sql-row-count">
                                                            {
                                                                result.row_count
                                                            }
                                                            {" "}
                                                            rows
                                                        </span>

                                                    )}

                                                </div>


                                                {/* --------------------------------
                                                    MESSAGE
                                                -------------------------------- */}

                                                {result.message && (

                                                    <div className="sql-result-message">
                                                        {
                                                            result.message
                                                        }
                                                    </div>

                                                )}


                                                {/* --------------------------------
                                                    TABLE RESULT
                                                -------------------------------- */}

                                                {Array.isArray(
                                                    result.rows
                                                ) &&
                                                result.rows.length >
                                                    0 ? (

                                                    <div className="sql-result-table-wrapper">

                                                        <table className="sql-result-table">

                                                            <thead>

                                                                <tr>

                                                                    {Object.keys(
                                                                        result.rows[0]
                                                                    ).map(
                                                                        (column) => (

                                                                            <th
                                                                                key={
                                                                                    column
                                                                                }
                                                                            >
                                                                                {
                                                                                    column
                                                                                }
                                                                            </th>

                                                                        )
                                                                    )}

                                                                </tr>

                                                            </thead>


                                                            <tbody>

                                                                {result.rows.map(
                                                                    (
                                                                        row,
                                                                        rowIndex
                                                                    ) => (

                                                                        <tr
                                                                            key={
                                                                                rowIndex
                                                                            }
                                                                        >

                                                                            {Object.keys(
                                                                                result.rows[0]
                                                                            ).map(
                                                                                (
                                                                                    column
                                                                                ) => (

                                                                                    <td
                                                                                        key={
                                                                                            column
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            row[
                                                                                                column
                                                                                            ] !==
                                                                                            null
                                                                                                ? String(
                                                                                                    row[
                                                                                                        column
                                                                                                    ]
                                                                                                )
                                                                                                : "NULL"
                                                                                        }
                                                                                    </td>

                                                                                )
                                                                            )}

                                                                        </tr>

                                                                    )
                                                                )}

                                                            </tbody>

                                                        </table>

                                                    </div>

                                                ) : (

                                                    !result.message && (

                                                        <div className="sql-no-results">
                                                            Query executed successfully.
                                                            No rows returned.
                                                        </div>

                                                    )

                                                )}

                                            </div>

                                        )}

                                    </article>

                                );

                            }
                        )}

                    </div>

                )}

            </section>

        </div>
    );
};


export default SQLPreparation;