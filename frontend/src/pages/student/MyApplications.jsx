import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getMyApplications
} from "../../services/applicationService";


function MyApplications() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================================
    // FETCH MY APPLICATIONS
    // ========================================================

    const fetchApplications = async () => {

        setLoading(true);

        setError("");

        try {

            const data = await getMyApplications();

            setApplications(
                Array.isArray(data)
                    ? data
                    : data?.items || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch applications:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load your applications."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        fetchApplications();

    }, []);


    // ========================================================
    // STATUS FORMATTER
    // ========================================================

    const formatStatus = (status) => {

        if (!status) {
            return "Unknown";
        }

        return status
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase()
            );
    };


    // ========================================================
    // STATUS CLASS
    // ========================================================

    const getStatusClass = (status) => {

        switch (status?.toLowerCase()) {

            case "applied":
            case "submitted":
                return "status-applied";

            case "shortlisted":
                return "status-shortlisted";

            case "interview":
            case "interview_scheduled":
                return "status-interview";

            case "selected":
            case "accepted":
                return "status-selected";

            case "rejected":
                return "status-rejected";

            case "withdrawn":
                return "status-withdrawn";

            default:
                return "status-default";
        }
    };


    // ========================================================
    // UI
    // ========================================================

    return (

        <div className="my-applications-page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <header className="applications-page-header">

                <div className="applications-header-content">

                    <span className="applications-eyebrow">
                        APPLICATION TRACKER
                    </span>

                    <h1>
                        My Applications
                    </h1>

                    <p>
                        Track your job applications and
                        monitor your placement journey.
                    </p>

                </div>


                <button
                    type="button"
                    className="applications-primary-button"
                    onClick={() =>
                        navigate("/student/jobs")
                    }
                >

                    <span>
                        Explore Jobs
                    </span>

                    <span className="button-arrow">
                        →
                    </span>

                </button>

            </header>


            {/* ==================================================
                APPLICATION OVERVIEW
            ================================================== */}

            {!loading &&
                !error &&
                applications.length > 0 && (

                    <section className="applications-overview">

                        <div className="application-overview-card">

                            <div className="overview-icon">
                                ◎
                            </div>

                            <div>

                                <span>
                                    Total Applications
                                </span>

                                <strong>
                                    {applications.length}
                                </strong>

                            </div>

                        </div>


                        <div className="application-overview-card">

                            <div className="overview-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    Active Applications
                                </span>

                                <strong>
                                    {
                                        applications.filter(
                                            (application) =>
                                                ![
                                                    "rejected",
                                                    "withdrawn",
                                                    "selected",
                                                    "accepted"
                                                ].includes(
                                                    application.status?.toLowerCase()
                                                )
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>


                        <div className="application-overview-card">

                            <div className="overview-icon">
                                ★
                            </div>

                            <div>

                                <span>
                                    Selected
                                </span>

                                <strong>
                                    {
                                        applications.filter(
                                            (application) =>
                                                [
                                                    "selected",
                                                    "accepted"
                                                ].includes(
                                                    application.status?.toLowerCase()
                                                )
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>

                    </section>

                )}


            {/* ==================================================
                LOADING
            ================================================== */}

            {loading && (

                <section className="applications-state-card">

                    <div className="applications-loader"></div>

                    <h2>
                        Loading your applications
                    </h2>

                    <p>
                        We're getting your application
                        history ready.
                    </p>

                </section>

            )}


            {/* ==================================================
                ERROR
            ================================================== */}

            {!loading && error && (

                <section className="applications-state-card applications-error-card">

                    <div className="state-icon error-icon">
                        !
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        className="applications-secondary-button"
                        onClick={fetchApplications}
                    >
                        Try Again
                    </button>

                </section>

            )}


            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!loading &&
                !error &&
                applications.length === 0 && (

                    <section className="applications-state-card applications-empty-card">

                        <div className="empty-illustration">

                            <div className="empty-folder">
                                <span></span>
                            </div>

                        </div>

                        <span className="empty-eyebrow">
                            START YOUR JOURNEY
                        </span>

                        <h2>
                            No Applications Yet
                        </h2>

                        <p>
                            You haven't applied for any jobs yet.
                            Explore available opportunities and
                            start building your placement journey.
                        </p>

                        <button
                            type="button"
                            className="applications-primary-button"
                            onClick={() =>
                                navigate("/student/jobs")
                            }
                        >

                            <span>
                                Explore Available Jobs
                            </span>

                            <span className="button-arrow">
                                →
                            </span>

                        </button>

                    </section>

                )}


            {/* ==================================================
                APPLICATION LIST
            ================================================== */}

            {!loading &&
                !error &&
                applications.length > 0 && (

                    <section className="applications-list-section">


                        {/* SECTION HEADER */}

                        <div className="applications-section-header">

                            <div>

                                <span className="applications-eyebrow">
                                    YOUR APPLICATIONS
                                </span>

                                <h2>
                                    Application History
                                </h2>

                                <p>
                                    Review the jobs you've applied
                                    for and check their current status.
                                </p>

                            </div>

                            <span className="application-count-badge">
                                {applications.length}{" "}
                                {applications.length === 1
                                    ? "Application"
                                    : "Applications"
                                }
                            </span>

                        </div>


                        {/* APPLICATION CARDS */}

                        <div className="applications-list">

                            {applications.map(
                                (application) => {

                                    const applicationId =
                                        application.application_id ||
                                        application.id;

                                    const jobTitle =
                                        application.job_title ||
                                        application.job?.title ||
                                        "Job Application";

                                    const company =
                                        application.company ||
                                        application.job?.company ||
                                        "Company not specified";

                                    const location =
                                        application.location ||
                                        application.job?.location;

                                    const status =
                                        application.status ||
                                        "unknown";

                                    return (

                                        <article
                                            className="application-card"
                                            key={applicationId}
                                        >


                                            {/* CARD MAIN CONTENT */}

                                            <div className="application-card-main">

                                                <div className="company-avatar">

                                                    {company
                                                        .charAt(0)
                                                        .toUpperCase()
                                                    }

                                                </div>


                                                <div className="application-info">

                                                    <h3>
                                                        {jobTitle}
                                                    </h3>

                                                    <p className="application-company">
                                                        {company}
                                                    </p>


                                                    <div className="application-meta">

                                                        {location && (

                                                            <span>
                                                                <span className="meta-icon">
                                                                    ●
                                                                </span>

                                                                {location}
                                                            </span>

                                                        )}

                                                        <span>
                                                            <span className="meta-icon">
                                                                #
                                                            </span>

                                                            Application #
                                                            {applicationId}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* STATUS */}

                                            <div className="application-status-area">

                                                <span
                                                    className={`application-status ${getStatusClass(
                                                        status
                                                    )}`}
                                                >

                                                    <span className="status-dot"></span>

                                                    {formatStatus(
                                                        status
                                                    )}

                                                </span>

                                            </div>


                                            {/* ACTION */}

                                            <div className="application-card-action">

                                                <button
                                                    type="button"
                                                    className="application-view-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/student/applications/${applicationId}`
                                                        )
                                                    }
                                                >

                                                    View Details

                                                    <span>
                                                        →
                                                    </span>

                                                </button>

                                            </div>

                                        </article>

                                    );

                                }
                            )}

                        </div>

                    </section>

                )}

        </div>
    );
}


export default MyApplications;