import { useEffect, useState } from "react";

import {
    getDSAOverview,
    getDSATopics,
    getDSAProblems,
    updateDSAProgress
} from "../../../services/preparationService";


function DSAPreparation() {

    const [selectedTopic, setSelectedTopic] =
        useState(null);

    const [topics, setTopics] =
        useState([]);

    const [problems, setProblems] =
        useState([]);

    const [progress, setProgress] =
        useState({
            total_problems: 0,
            completed_problems: 0,
            remaining_problems: 0,
            progress_percentage: 0
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [updatingProblemId, setUpdatingProblemId] =
        useState(null);


    // ========================================================
    // LOAD DSA DATA
    // ========================================================

    useEffect(() => {

        loadDSAData();

    }, [selectedTopic]);


    const loadDSAData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                overviewData,
                topicsData,
                problemsData
            ] = await Promise.all([

                getDSAOverview(),

                getDSATopics(),

                getDSAProblems({
                    topicId: selectedTopic
                })

            ]);


            setProgress(
                overviewData.progress
            );

            setTopics(
                topicsData
            );

            setProblems(
                problemsData.items
            );

        } catch (err) {

            console.error(
                "Failed to load DSA data:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Failed to load DSA preparation data."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // UPDATE PROBLEM PROGRESS
    // ========================================================

    const handleProgressChange = async (
        problemId,
        completed
    ) => {

        try {

            setUpdatingProblemId(
                problemId
            );

            setError("");


            const updatedProgress =
                await updateDSAProgress(
                    problemId,
                    completed
                );


            // Update problem locally
            setProblems(
                (currentProblems) =>
                    currentProblems.map(
                        (problem) =>
                            problem.id === problemId
                                ? {
                                    ...problem,
                                    completed:
                                        updatedProgress.completed,
                                    completed_at:
                                        updatedProgress.completed_at
                                }
                                : problem
                    )
            );


            // Reload overview so overall progress
            // always comes from backend
            const overview =
                await getDSAOverview();

            setProgress(
                overview.progress
            );

        } catch (err) {

            console.error(
                "Failed to update DSA progress:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Failed to update problem progress."
            );

        } finally {

            setUpdatingProblemId(
                null
            );

        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="dsa-preparation">

                <div className="page-header">

                    <div>

                        <h1>
                            DSA Preparation
                        </h1>

                        <p>
                            Loading your DSA preparation...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <div className="dsa-preparation">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        DSA Preparation
                    </h1>

                    <p>
                        Practice Data Structures and Algorithms
                        for placement coding rounds.
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

            <section className="preparation-overview">

                <div>

                    <p>
                        DSA Progress
                    </p>

                    <h2>
                        {progress.progress_percentage}%
                    </h2>

                    <p>
                        {progress.completed_problems} of{" "}
                        {progress.total_problems} problems completed
                    </p>

                </div>


                <div>

                    <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow={
                            progress.progress_percentage
                        }
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >

                        <div
                            className="progress-bar-fill"
                            style={{
                                width:
                                    `${progress.progress_percentage}%`
                            }}
                        />

                    </div>

                </div>

            </section>


            {/* ==================================================
                TOPICS
            ================================================== */}

            <section>

                <div className="section-header">

                    <div>

                        <h2>
                            DSA Topics
                        </h2>

                        <p>
                            Select a topic to practice.
                        </p>

                    </div>

                </div>


                <div className="topic-list">


                    {/* ALL */}

                    <button
                        type="button"
                        className={
                            selectedTopic === null
                                ? "topic-button active"
                                : "topic-button"
                        }
                        onClick={() =>
                            setSelectedTopic(null)
                        }
                    >
                        All
                    </button>


                    {/* BACKEND TOPICS */}

                    {topics.map(
                        (topic) => (

                            <button
                                key={topic.id}
                                type="button"
                                className={
                                    selectedTopic === topic.id
                                        ? "topic-button active"
                                        : "topic-button"
                                }
                                onClick={() =>
                                    setSelectedTopic(
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

            <section>

                <div className="section-header">

                    <div>

                        <h2>
                            Problems
                        </h2>

                        <p>
                            Solve problems and track your progress.
                        </p>

                    </div>

                </div>


                {problems.length === 0 ? (

                    <div className="empty-state">

                        <p>
                            No DSA problems available for
                            this topic.
                        </p>

                    </div>

                ) : (

                    <div className="problems-list">

                        {problems.map(
                            (problem) => (

                                <div
                                    className="problem-card"
                                    key={problem.id}
                                >


                                    {/* PROBLEM INFO */}

                                    <div>

                                        <h3>
                                            {problem.title}
                                        </h3>

                                        <p>
                                            {problem.description}
                                        </p>

                                    </div>


                                    {/* PROBLEM ACTIONS */}

                                    <div>

                                        <span>
                                            {problem.difficulty}
                                        </span>


                                        {problem.external_url && (

                                            <a
                                                href={
                                                    problem.external_url
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Open Problem
                                            </a>

                                        )}


                                        <button
                                            type="button"
                                            disabled={
                                                updatingProblemId ===
                                                problem.id
                                            }
                                            onClick={() =>
                                                handleProgressChange(
                                                    problem.id,
                                                    !problem.completed
                                                )
                                            }
                                        >

                                            {updatingProblemId ===
                                            problem.id
                                                ? "Updating..."
                                                : problem.completed
                                                    ? "Mark Incomplete"
                                                    : "Mark Complete"
                                            }

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>
    );
}


export default DSAPreparation;