import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDSAOverview } from "../../services/PreparationService";

import {
    getSQLOverview
} from "../../services/sqlService";

import {
    getAptitudeOverview
} from "../../services/aptitudeService";

import {
    getCoreCSOverview
} from "../../services/coreCSService";

import {
    getMockInterviewAnalytics
} from "../../services/mockInterviewService";


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


    // ========================================================
    // CORE CS PROGRESS
    // ========================================================

    const [coreCSProgress, setCoreCSProgress] = useState({
        total_questions: 0,
        completed_questions: 0,
        remaining_questions: 0,
        progress_percentage: 0
    });


    // ========================================================
    // MOCK INTERVIEW ANALYTICS
    // ========================================================

    const [mockInterviewAnalytics, setMockInterviewAnalytics] =
        useState({
            total_interviews: 0,
            completed_interviews: 0,
            in_progress_interviews: 0,
            average_score: null,
            best_score: null,
            total_questions: 0,
            total_questions_answered: 0,
            answer_rate: 0,
            completion_rate: 0,
            technical_average_score: null,
            hr_average_score: null,
            recent_interviews: []
        });


    // ========================================================
    // LOADING & ERROR
    // ========================================================

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

            progress:
                coreCSProgress.progress_percentage,

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

            progress:
                mockInterviewAnalytics.completion_rate,

            path:
                "/student/preparation/mock-interviews"
        },


        // ====================================================
        // AI MENTOR
        // ====================================================

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
            // Load all preparation data together
            // ------------------------------------------------

            const [
                dsaResponse,
                sqlResponse,
                aptitudeResponse,
                coreCSResponse,
                mockInterviewResponse
            ] = await Promise.all([

                getDSAOverview(),

                getSQLOverview(),

                getAptitudeOverview(),

                getCoreCSOverview(),

                getMockInterviewAnalytics()

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


            // ------------------------------------------------
            // Set Core CS progress
            // ------------------------------------------------

            if (coreCSResponse?.progress) {

                setCoreCSProgress(
                    coreCSResponse.progress
                );

            }


            // ------------------------------------------------
            // Set Mock Interview analytics
            // ------------------------------------------------

            if (mockInterviewResponse) {

                setMockInterviewAnalytics(
                    mockInterviewResponse
                );

            }

        } catch (error) {

            console.error(
                "Failed to load preparation data:",
                error
            );

            setError(
                error.response?.data?.detail ||
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
        Overall preparation progress is calculated
        from the modules for which measurable progress
        is currently available.

        Current modules:

        DSA
        SQL
        Core CS
        Aptitude
        Mock Interviews
    */

    const progressValues = [

        dsaProgress.progress_percentage,

        sqlProgress.progress_percentage,

        coreCSProgress.progress_percentage,

        aptitudeProgress.progress_percentage,

        mockInterviewAnalytics.completion_rate

    ];


    const overallProgress =
        Math.round(
            progressValues.reduce(
                (total, value) =>
                    total + (Number(value) || 0),
                0
            ) / progressValues.length
        );


    // ========================================================
    // DASHBOARD
    // ========================================================

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
                MOCK INTERVIEW SUMMARY
            ================================================== */}

            <section className="readiness-section">

                <h2>
                    Mock Interview Performance
                </h2>

                <p>
                    Track your interview practice and
                    performance.
                </p>


                <div>

                    <strong>
                        Average Score
                    </strong>

                    <h2>
                        {mockInterviewAnalytics.average_score !== null
                            ? `${mockInterviewAnalytics.average_score}%`
                            : "—"
                        }
                    </h2>

                </div>


                <div>

                    <strong>
                        Interviews Completed
                    </strong>

                    <h2>
                        {
                            mockInterviewAnalytics.completed_interviews
                        }
                    </h2>

                </div>


                <div>

                    <strong>
                        Questions Answered
                    </strong>

                    <h2>
                        {
                            mockInterviewAnalytics.total_questions_answered
                        }
                    </h2>

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
                    Your readiness score is based on your
                    preparation activity across DSA, SQL,
                    Core CS, Aptitude and Mock Interviews.
                </p>

                <div>

                    <strong>
                        Current Readiness Score
                    </strong>

                    <h2>
                        {loading
                            ? "..."
                            : `${overallProgress}%`
                        }
                    </h2>

                </div>

            </section>

        </div>
    );
}


export default PreparationDashboard;