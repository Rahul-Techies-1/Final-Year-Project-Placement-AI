import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDSAOverview } from "../../services/PreparationService";
import { getSQLOverview } from "../../services/sqlService";
import { getAptitudeOverview } from "../../services/aptitudeService";
import { getCoreCSOverview } from "../../services/coreCSService";
import { getMockInterviewAnalytics } from "../../services/mockInterviewService";

import "./PreparationDashboard.css";


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
    // LOAD PREPARATION DATA
    // ========================================================

    useEffect(() => {

        loadPreparationData();

    }, []);


    const loadPreparationData = async () => {

        try {

            setLoading(true);

            setError("");


            // ====================================================
            // LOAD ALL PREPARATION APIs INDEPENDENTLY
            // ====================================================

            const results = await Promise.allSettled([

                getDSAOverview(),

                getSQLOverview(),

                getAptitudeOverview(),

                getCoreCSOverview(),

                getMockInterviewAnalytics()

            ]);


            console.log(
                "Preparation Dashboard API Results:",
                results
            );


            // ====================================================
            // DSA RESPONSE
            // ====================================================

            const dsaResult = results[0];

            if (dsaResult.status === "fulfilled") {

                console.log(
                    "DSA Overview Response:",
                    dsaResult.value
                );


                if (dsaResult.value?.progress) {

                    setDsaProgress(
                        dsaResult.value.progress
                    );

                }

            } else {

                console.error(
                    "DSA Overview API failed:",
                    dsaResult.reason
                );

            }


            // ====================================================
            // SQL RESPONSE
            // ====================================================

            const sqlResult = results[1];

            if (sqlResult.status === "fulfilled") {

                console.log(
                    "SQL Overview Response:",
                    sqlResult.value
                );


                if (sqlResult.value?.progress) {

                    setSqlProgress(
                        sqlResult.value.progress
                    );

                }

            } else {

                console.error(
                    "SQL Overview API failed:",
                    sqlResult.reason
                );

            }


            // ====================================================
            // APTITUDE RESPONSE
            // ====================================================

            const aptitudeResult = results[2];

            if (aptitudeResult.status === "fulfilled") {

                console.log(
                    "Aptitude Overview Response:",
                    aptitudeResult.value
                );


                if (aptitudeResult.value?.progress) {

                    setAptitudeProgress(
                        aptitudeResult.value.progress
                    );

                }

            } else {

                console.error(
                    "Aptitude Overview API failed:",
                    aptitudeResult.reason
                );

            }


            // ====================================================
            // CORE CS RESPONSE
            // ====================================================

            const coreCSResult = results[3];

            if (coreCSResult.status === "fulfilled") {

                console.log(
                    "Core CS Overview Response:",
                    coreCSResult.value
                );


                if (coreCSResult.value?.progress) {

                    setCoreCSProgress(
                        coreCSResult.value.progress
                    );

                }

            } else {

                console.error(
                    "Core CS Overview API failed:",
                    coreCSResult.reason
                );

            }


            // ====================================================
            // MOCK INTERVIEW RESPONSE
            // ====================================================

            const mockInterviewResult = results[4];

            if (mockInterviewResult.status === "fulfilled") {

                console.log(
                    "Mock Interview Analytics Response:",
                    mockInterviewResult.value
                );


                if (mockInterviewResult.value) {

                    setMockInterviewAnalytics(
                        mockInterviewResult.value
                    );

                }

            } else {

                console.error(
                    "Mock Interview Analytics API failed:",
                    mockInterviewResult.reason
                );

            }


            // ====================================================
            // CHECK IF ANY API FAILED
            // ====================================================

            const failedAPIs = [];


            if (dsaResult.status === "rejected") {
                failedAPIs.push("DSA");
            }


            if (sqlResult.status === "rejected") {
                failedAPIs.push("SQL");
            }


            if (aptitudeResult.status === "rejected") {
                failedAPIs.push("Aptitude");
            }


            if (coreCSResult.status === "rejected") {
                failedAPIs.push("Core CS");
            }


            if (mockInterviewResult.status === "rejected") {
                failedAPIs.push("Mock Interviews");
            }


            if (failedAPIs.length > 0) {

                console.error(
                    "Failed Preparation APIs:",
                    failedAPIs
                );


                setError(
                    `Unable to load: ${failedAPIs.join(", ")}. Check the browser console for the exact API error.`
                );

            }

        } catch (error) {

            console.error(
                "Preparation Dashboard Error:",
                error
            );


            setError(
                error.response?.data?.detail ||
                error.message ||
                "Unable to load preparation progress."
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // OVERALL PREPARATION PROGRESS
    // ========================================================

    const progressValues = [

        dsaProgress.progress_percentage,

        sqlProgress.progress_percentage,

        coreCSProgress.progress_percentage,

        aptitudeProgress.progress_percentage,

        mockInterviewAnalytics.completion_rate

    ];


    const overallProgress = Math.round(

        progressValues.reduce(

            (total, value) =>
                total + (Number(value) || 0),

            0

        ) / progressValues.length

    );


    // ========================================================
    // PREPARATION MODULES
    // ========================================================

    const preparationModules = [

        {
            title: "DSA",

            shortTitle:
                "Data Structures & Algorithms",

            description:
                "Master data structures and algorithms for coding rounds.",

            progress:
                Number(
                    dsaProgress.progress_percentage
                ) || 0,

            completed:
                dsaProgress.completed_problems,

            total:
                dsaProgress.total_problems,

            icon:
                "⌘",

            accent:
                "blue",

            path:
                "/student/preparation/dsa"
        },


        {
            title: "SQL",

            shortTitle:
                "SQL & Databases",

            description:
                "Build strong SQL and database skills for technical interviews.",

            progress:
                Number(
                    sqlProgress.progress_percentage
                ) || 0,

            completed:
                sqlProgress.completed_problems,

            total:
                sqlProgress.total_problems,

            icon:
                "DB",

            accent:
                "purple",

            path:
                "/student/preparation/sql"
        },


        {
            title: "Core CS",

            shortTitle:
                "Computer Science Fundamentals",

            description:
                "Prepare DBMS, OS, Networks and OOP concepts.",

            progress:
                Number(
                    coreCSProgress.progress_percentage
                ) || 0,

            completed:
                coreCSProgress.completed_questions,

            total:
                coreCSProgress.total_questions,

            icon:
                "CS",

            accent:
                "green",

            path:
                "/student/preparation/core-cs"
        },


        {
            title: "Aptitude",

            shortTitle:
                "Quantitative & Logical Ability",

            description:
                "Improve quantitative, logical and verbal aptitude.",

            progress:
                Number(
                    aptitudeProgress.progress_percentage
                ) || 0,

            completed:
                aptitudeProgress.completed_questions,

            total:
                aptitudeProgress.total_questions,

            icon:
                "A",

            accent:
                "orange",

            path:
                "/student/preparation/aptitude"
        },


        {
            title: "Mock Interviews",

            shortTitle:
                "Interview Practice",

            description:
                "Practice technical and HR interviews in a realistic environment.",

            progress:
                Number(
                    mockInterviewAnalytics.completion_rate
                ) || 0,

            completed:
                mockInterviewAnalytics.completed_interviews,

            total:
                mockInterviewAnalytics.total_interviews,

            icon:
                "MI",

            accent:
                "pink",

            path:
                "/student/preparation/mock-interviews"
        },


        {
            title: "AI Mentor",

            shortTitle:
                "AI-Powered Learning",

            description:
                "Upload study material and get answers using your AI mentor.",

            progress:
                null,

            completed:
                null,

            total:
                null,

            icon:
                "AI",

            accent:
                "cyan",

            path:
                "/student/preparation/ai-mentor"
        }

    ];


    // ========================================================
    // READINESS LABEL
    // ========================================================

    const getReadinessLabel = () => {

        if (overallProgress >= 80) {

            return "Strong Progress";

        }

        if (overallProgress >= 60) {

            return "Good Progress";

        }

        if (overallProgress >= 40) {

            return "Building Momentum";

        }

        return "Getting Started";

    };


    // ========================================================
    // DASHBOARD
    // ========================================================

    return (

        <div className="preparation-dashboard">


            {/* ==================================================
                HERO HEADER
            ================================================== */}

            <header className="preparation-hero">

                <div className="hero-content">

                    <div className="hero-badge">

                        <span className="hero-badge-dot"></span>

                        Placement Preparation

                    </div>


                    <h1>
                        Preparation Dashboard
                    </h1>


                    <p>
                        Build the skills, confidence and interview
                        readiness you need to crack your placement.
                    </p>

                </div>


                <button
                    type="button"
                    className="hero-jobs-button"
                    onClick={() =>
                        navigate("/student/jobs")
                    }
                >

                    Explore Jobs

                    <span>
                        →
                    </span>

                </button>

            </header>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="preparation-error">

                    <div className="error-icon">
                        !
                    </div>


                    <div className="error-content">

                        <strong>
                            Some preparation data could not be loaded
                        </strong>

                        <span>
                            {error}
                        </span>

                    </div>


                    <button
                        type="button"
                        onClick={loadPreparationData}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* ==================================================
                OVERALL READINESS
            ================================================== */}

            <section className="overall-card">


                <div className="overall-card-content">

                    <div className="section-eyebrow">
                        OVERALL PREPARATION
                    </div>


                    <h2>
                        Your placement journey starts here.
                    </h2>


                    <p>
                        Track your progress across technical
                        skills, aptitude and interview preparation.
                    </p>


                    <div className="overall-stats">

                        <div className="overall-score">

                            <strong>

                                {loading

                                    ? "..."

                                    : `${overallProgress}%`

                                }

                            </strong>


                            <span>
                                Overall Progress
                            </span>

                        </div>


                        <div className="overall-status">

                            <span className="status-dot"></span>

                            {loading

                                ? "Loading..."

                                : getReadinessLabel()

                            }

                        </div>

                    </div>


                    <div className="overall-progress-container">

                        <div className="overall-progress-track">

                            <div
                                className="overall-progress-fill"

                                style={{
                                    width:
                                        `${overallProgress}%`
                                }}

                            />

                        </div>


                        <div className="progress-labels">

                            <span>
                                Preparation Progress
                            </span>

                            <span>
                                {overallProgress}%
                            </span>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    CIRCULAR SCORE
                ================================================== */}

                <div className="readiness-circle-wrapper">

                    <div
                        className="readiness-circle"

                        style={{
                            "--progress":
                                `${overallProgress * 3.6}deg`
                        }}

                    >

                        <div className="readiness-circle-inner">

                            <strong>

                                {loading

                                    ? "..."

                                    : overallProgress

                                }

                            </strong>


                            <span>
                                READINESS
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================================
                PREPARATION MODULES
            ================================================== */}

            <section className="modules-section">


                <div className="section-heading">

                    <div>

                        <span className="section-eyebrow">
                            PREPARATION
                        </span>


                        <h2>
                            Preparation Modules
                        </h2>


                        <p>
                            Choose a skill area and continue
                            building your placement readiness.
                        </p>

                    </div>

                </div>


                <div className="preparation-grid">

                    {preparationModules.map(

                        (module) => (

                            <article
                                className="preparation-card"
                                key={module.title}
                            >


                                {/* CARD TOP */}

                                <div className="card-top">

                                    <div
                                        className={`module-icon ${module.accent}`}
                                    >
                                        {module.icon}
                                    </div>


                                    <span className="module-arrow">
                                        ↗
                                    </span>

                                </div>


                                {/* CARD TITLE */}

                                <div className="card-title-area">

                                    <span className="module-category">
                                        {module.shortTitle}
                                    </span>


                                    <h3>
                                        {module.title}
                                    </h3>


                                    <p>
                                        {module.description}
                                    </p>

                                </div>


                                {/* PROGRESS */}

                                {module.progress !== null ? (

                                    <div className="module-progress">

                                        <div className="module-progress-header">

                                            <span>
                                                Progress
                                            </span>


                                            <strong>
                                                {module.progress}%
                                            </strong>

                                        </div>


                                        <div className="module-progress-track">

                                            <div
                                                className={`module-progress-fill ${module.accent}`}

                                                style={{
                                                    width:
                                                        `${module.progress}%`
                                                }}

                                            />

                                        </div>


                                        {module.total > 0 && (

                                            <span className="module-count">

                                                {module.completed} of{" "}

                                                {module.total}

                                                {" "}completed

                                            </span>

                                        )}

                                    </div>

                                ) : (

                                    <div className="ai-module-status">

                                        <span>
                                            ✦
                                        </span>

                                        AI Powered Learning

                                    </div>

                                )}


                                {/* BUTTON */}

                                <button
                                    type="button"
                                    className="module-button"

                                    onClick={() =>
                                        navigate(
                                            module.path
                                        )
                                    }

                                >

                                    {module.progress > 0

                                        ? "Continue Preparing"

                                        : "Start Preparing"

                                    }


                                    <span>
                                        →
                                    </span>

                                </button>

                            </article>

                        )

                    )}

                </div>

            </section>


            {/* ==================================================
                MOCK INTERVIEW PERFORMANCE
            ================================================== */}

            <section className="performance-section">


                <div className="section-heading">

                    <div>

                        <span className="section-eyebrow">
                            INTERVIEW PRACTICE
                        </span>


                        <h2>
                            Mock Interview Performance
                        </h2>


                        <p>
                            Review your interview practice and
                            keep improving your performance.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="section-action"

                        onClick={() =>
                            navigate(
                                "/student/preparation/mock-interviews"
                            )
                        }

                    >
                        Practice Interview →
                    </button>

                </div>


                <div className="performance-grid">


                    {/* AVERAGE SCORE */}

                    <div className="performance-card">

                        <div className="performance-icon blue">
                            %
                        </div>


                        <div>

                            <span>
                                Average Score
                            </span>


                            <strong>

                                {
                                    mockInterviewAnalytics.average_score !== null

                                        ? `${mockInterviewAnalytics.average_score}%`

                                        : "—"
                                }

                            </strong>

                        </div>

                    </div>


                    {/* COMPLETED */}

                    <div className="performance-card">

                        <div className="performance-icon green">
                            ✓
                        </div>


                        <div>

                            <span>
                                Interviews Completed
                            </span>


                            <strong>

                                {
                                    mockInterviewAnalytics.completed_interviews
                                }

                            </strong>

                        </div>

                    </div>


                    {/* QUESTIONS */}

                    <div className="performance-card">

                        <div className="performance-icon purple">
                            Q
                        </div>


                        <div>

                            <span>
                                Questions Answered
                            </span>


                            <strong>

                                {
                                    mockInterviewAnalytics.total_questions_answered
                                }

                            </strong>

                        </div>

                    </div>


                    {/* BEST SCORE */}

                    <div className="performance-card">

                        <div className="performance-icon orange">
                            ★
                        </div>


                        <div>

                            <span>
                                Best Score
                            </span>


                            <strong>

                                {
                                    mockInterviewAnalytics.best_score !== null

                                        ? `${mockInterviewAnalytics.best_score}%`

                                        : "—"
                                }

                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================================
                FINAL READINESS SECTION
            ================================================== */}

            <section className="readiness-banner">


                <div className="readiness-banner-icon">
                    ✦
                </div>


                <div className="readiness-banner-content">

                    <span className="section-eyebrow">
                        PLACEMENT READINESS
                    </span>


                    <h2>
                        Keep building your preparation.
                    </h2>


                    <p>
                        Your readiness score combines your progress
                        across DSA, SQL, Core CS, Aptitude and Mock Interviews.
                    </p>

                </div>


                <div className="readiness-banner-score">

                    <strong>

                        {loading

                            ? "..."

                            : `${overallProgress}%`

                        }

                    </strong>


                    <span>
                        Current Score
                    </span>

                </div>

            </section>


        </div>

    );
}


export default PreparationDashboard;