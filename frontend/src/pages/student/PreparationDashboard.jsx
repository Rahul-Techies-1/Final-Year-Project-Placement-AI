import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PreparationService from "../../services/PreparationService";
import {
    getSQLOverview
} from "../../services/sqlService";


function PreparationDashboard() {

    const navigate = useNavigate();

    const [dsaProgress, setDsaProgress] = useState({
        total_problems: 0,
        completed_problems: 0,
        remaining_problems: 0,
        progress_percentage: 0
    });

    const [sqlProgress, setSqlProgress] = useState({
        total_problems: 0,
        completed_problems: 0,
        remaining_problems: 0,
        progress_percentage: 0
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================================
    // PREPARATION MODULES
    // ========================================================

    const preparationModules = [

        {
            title: "DSA",
            description:
                "Practice data structures and algorithms for coding rounds.",
            progress: dsaProgress.progress_percentage,
            path: "/student/preparation/dsa"
        },

        {
            title: "SQL",
            description:
                "Improve SQL and database skills for placement interviews.",
            progress: sqlProgress.progress_percentage,
            path: "/student/preparation/sql"
        },

        {
            title: "Core CS",
            description:
                "Prepare DBMS, OS, Computer Networks and OOP concepts.",
            progress: 0,
            path: "/student/preparation/core-cs"
        },

        {
            title: "Aptitude",
            description:
                "Practice quantitative, logical and verbal aptitude.",
            progress: 0,
            path: "/student/preparation/aptitude"
        },

        {
            title: "Mock Interviews",
            description:
                "Practice technical and placement interviews.",
            progress: 0,
            path: "/student/preparation/interviews"
        },

        {
            title: "PDF / AI Mentor",
            description:
                "Upload study material and ask questions using AI.",
            progress: 0,
            path: "/student/preparation/ai-mentor"
        }

    ];


    // ========================================================
    // LOAD PREPARATION DATA
    // ========================================================

    useEffect(() => {

        loadPreparationData();

    }, []);


    const loadPreparationData = async () => {

        try {

            setLoading(true);

            setError("");


            // ------------------------------------------------
            // Load DSA + SQL progress together
            // ------------------------------------------------

            const [
                dsaResponse,
                sqlResponse
            ] = await Promise.all([

                PreparationService.getDSAOverview(),

                getSQLOverview()

            ]);


            // ------------------------------------------------
            // Set DSA progress
            // ------------------------------------------------

            if (dsaResponse?.progress) {

                setDsaProgress(
                    dsaResponse.progress
                );

            }


            // ------------------------------------------------
            // Set SQL progress
            // ------------------------------------------------

            if (sqlResponse?.progress) {

                setSqlProgress(
                    sqlResponse.progress
                );

            }

        } catch (error) {

            console.error(
                "Failed to load preparation data:",
                error
            );

            setError(
                "Unable to load preparation progress."
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // OVERALL PREPARATION PROGRESS
    // ========================================================

    /*
        Currently DSA and SQL are implemented.

        Therefore overall preparation progress
        is calculated using the average of:

        DSA progress
        SQL progress

        Later we will include:

        Core CS
        Aptitude
        Mock Interviews
        AI Mentor
    */

    const overallProgress =
        Math.round(
            (
                dsaProgress.progress_percentage +
                sqlProgress.progress_percentage
            ) / 2
        );


    return (

        <div className="preparation-dashboard">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        Preparation Dashboard
                    </h1>

                    <p>
                        Prepare smarter and track your placement
                        readiness in one place.
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

                    <button
                        type="button"
                        onClick={loadPreparationData}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* ==================================================
                OVERALL PROGRESS
            ================================================== */}

            <section className="preparation-overview">

                <div>

                    <p>
                        Overall Preparation
                    </p>

                    <h2>
                        {loading
                            ? "..."
                            : `${overallProgress}%`
                        }
                    </h2>

                    <p>
                        {loading
                            ? "Loading preparation progress..."
                            : "Based on your current preparation activity."
                        }
                    </p>

                </div>


                <div>

                    <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow={
                            overallProgress
                        }
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >

                        <div
                            className="progress-bar-fill"
                            style={{
                                width:
                                    `${overallProgress}%`
                            }}
                        />

                    </div>

                </div>

            </section>


            {/* ==================================================
                PREPARATION MODULES
            ================================================== */}

            <section>

                <div className="section-header">

                    <div>

                        <h2>
                            Preparation Modules
                        </h2>

                        <p>
                            Choose an area and start preparing.
                        </p>

                    </div>

                </div>


                <div className="preparation-grid">

                    {preparationModules.map(
                        (module) => (

                            <div
                                className="preparation-card"
                                key={module.title}
                            >

                                <div>

                                    <h3>
                                        {module.title}
                                    </h3>

                                    <p>
                                        {module.description}
                                    </p>

                                </div>


                                <div>

                                    <p>
                                        Progress:{" "}
                                        {module.progress}%
                                    </p>

                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        aria-valuenow={
                                            module.progress
                                        }
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >

                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width:
                                                    `${module.progress}%`
                                            }}
                                        />

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            module.path
                                        )
                                    }
                                >
                                    Start Preparing
                                </button>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* ==================================================
                PLACEMENT READINESS
            ================================================== */}

            <section className="readiness-section">

                <h2>
                    Placement Readiness
                </h2>

                <p>
                    Your readiness score will be calculated from
                    your activity across DSA, SQL, Core CS,
                    Aptitude, interviews and other preparation
                    activities.
                </p>

                <div>

                    <strong>
                        Readiness Score
                    </strong>

                    <h2>
                        Not calculated yet
                    </h2>

                </div>

            </section>

        </div>
    );
}


export default PreparationDashboard;