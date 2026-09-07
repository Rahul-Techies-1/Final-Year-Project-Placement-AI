import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PreparationService from "../../services/PreparationService";

import {
    getSQLOverview
} from "../../services/sqlService";

import {
    getAptitudeOverview
} from "../../services/aptitudeService";


function PreparationDashboard() {

    const navigate = useNavigate();


    // ========================================================
    // DSA PROGRESS
    // ========================================================

    const [dsaProgress, setDsaProgress] = useState({
        total_problems: 0,
        completed_problems: 0,
        remaining_problems: 0,
        progress_percentage: 0
    });


    // ========================================================
    // SQL PROGRESS
    // ========================================================

    const [sqlProgress, setSqlProgress] = useState({
        total_problems: 0,
        completed_problems: 0,
        remaining_problems: 0,
        progress_percentage: 0
    });


    // ========================================================
    // APTITUDE PROGRESS
    // ========================================================

    const [aptitudeProgress, setAptitudeProgress] = useState({
        total_questions: 0,
        completed_questions: 0,
        remaining_questions: 0,
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

            progress:
                dsaProgress.progress_percentage,

            path:
                "/student/preparation/dsa"
        },


        {
            title: "SQL",

            description:
                "Improve SQL and database skills for placement interviews.",

            progress:
                sqlProgress.progress_percentage,

            path:
                "/student/preparation/sql"
        },


        {
            title: "Core CS",

            description:
                "Prepare DBMS, OS, Computer Networks and OOP concepts.",

            progress: 0,

            path:
                "/student/preparation/core-cs"
        },


        {
            title: "Aptitude",

            description:
                "Practice quantitative, logical and verbal aptitude.",

            progress:
                aptitudeProgress.progress_percentage,

            path:
                "/student/preparation/aptitude"
        },


        {
            title: "Mock Interviews",

            description:
                "Practice technical and placement interviews.",

            progress: 0,

            path:
                "/student/preparation/mock-interviews"
        },


        {
            title: "PDF / AI Mentor",

            description:
                "Upload study material and ask questions using AI.",

            progress: 0,

            path:
                "/student/preparation/ai-mentor"
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
            // Load DSA + SQL + Aptitude progress together
            // ------------------------------------------------

            const [
                dsaResponse,
                sqlResponse,
                aptitudeResponse
            ] = await Promise.all([

                PreparationService.getDSAOverview(),

                getSQLOverview(),

                getAptitudeOverview()

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


            // ------------------------------------------------
            // Set Aptitude progress
            // ------------------------------------------------

            if (aptitudeResponse?.progress) {

                setAptitudeProgress(
                    aptitudeResponse.progress
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
        Currently implemented modules:

        DSA
        SQL
        Aptitude

        Overall preparation progress is calculated
        using the average progress of these modules.

        Later we will include:

        Core CS
        Mock Interviews
        AI Mentor
    */

    const overallProgress =
        Math.round(
            (
                dsaProgress.progress_percentage +
                sqlProgress.progress_percentage +
                aptitudeProgress.progress_percentage
            ) / 3
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