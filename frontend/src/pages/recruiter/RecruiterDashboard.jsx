import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRecruiterDashboard } from "../../services/recruiterDashboardService";

const STAT_CARDS = [
    {
        key: "total_jobs",
        label: "Total Jobs",
        icon: "💼",
        color: "blue",
        description: "All posted jobs",
    },
    {
        key: "active_jobs",
        label: "Active Jobs",
        icon: "🟢",
        color: "green",
        description: "Currently active",
    },
    {
        key: "total_applications",
        label: "Applications",
        icon: "📄",
        color: "purple",
        description: "Applications received",
    },
    {
        key: "applied",
        label: "Applied",
        icon: "📥",
        color: "cyan",
        description: "Awaiting review",
    },
    {
        key: "shortlisted",
        label: "Shortlisted",
        icon: "⭐",
        color: "orange",
        description: "Potential candidates",
    },
    {
        key: "interview_scheduled",
        label: "Interviews",
        icon: "📅",
        color: "indigo",
        description: "Scheduled interviews",
    },
    {
        key: "rejected",
        label: "Rejected",
        icon: "↗",
        color: "red",
        description: "Not moving forward",
    },
    {
        key: "hired",
        label: "Hired",
        icon: "🎉",
        color: "teal",
        description: "Successful candidates",
    },
];

function formatStatus(status) {
    if (!status) return "Unknown";

    return String(status)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusClass(status) {
    const normalizedStatus = String(status || "")
        .toLowerCase()
        .replaceAll("_", " ")
        .trim();

    if (normalizedStatus === "shortlisted") {
        return "shortlisted";
    }

    if (
        normalizedStatus === "interview scheduled" ||
        normalizedStatus === "interview"
    ) {
        return "interview";
    }

    if (normalizedStatus === "hired" || normalizedStatus === "selected") {
        return "hired";
    }

    if (normalizedStatus === "rejected") {
        return "rejected";
    }

    if (normalizedStatus === "applied" || normalizedStatus === "pending") {
        return "applied";
    }

    return "default";
}

function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function RecruiterDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getRecruiterDashboard();
            setDashboard(data);
        } catch (err) {
            console.error(
                "Failed to fetch recruiter dashboard:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                "Unable to load your recruitment dashboard. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="recruiter-dashboard">
                <div className="recruiter-state-card">
                    <div className="recruiter-loading-spinner" />
                    <h2>Preparing your dashboard</h2>
                    <p>
                        Fetching your jobs, applications and recruitment
                        statistics.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recruiter-dashboard">
                <div
                    className="recruiter-state-card recruiter-error-card"
                    role="alert"
                >
                    <div className="recruiter-state-icon">!</div>
                    <h2>Dashboard unavailable</h2>
                    <p>{error}</p>

                    <button
                        type="button"
                        className="recruiter-primary-button"
                        onClick={fetchDashboard}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const stats = dashboard?.stats || {};
    const recentApplications = Array.isArray(
        dashboard?.recent_applications
    )
        ? dashboard.recent_applications
        : [];

    return (
        <div className="recruiter-dashboard">
            {/* Welcome header */}
            <section className="recruiter-welcome">
                <div className="recruiter-welcome-content">
                    <span className="recruiter-welcome-label">
                        RECRUITER WORKSPACE
                    </span>

                    <h1>Recruitment at a glance.</h1>

                    <p>
                        Manage job openings, review candidates and keep
                        your hiring process moving forward.
                    </p>

                    <div className="recruiter-welcome-actions">
                        <button
                            type="button"
                            className="recruiter-primary-button recruiter-welcome-button"
                            onClick={() => navigate("/recruiter/jobs")}
                        >
                            <span aria-hidden="true">＋</span>
                            Manage Jobs
                        </button>

                        <button
                            type="button"
                            className="recruiter-outline-button"
                            onClick={() =>
                                navigate("/recruiter/interviews")
                            }
                        >
                            <span aria-hidden="true">▦</span>
                            Manage Interviews
                        </button>
                    </div>
                </div>

                <div
                    className="recruiter-welcome-art"
                    aria-hidden="true"
                >
                    <div className="recruiter-art-orbit recruiter-art-orbit-one" />
                    <div className="recruiter-art-orbit recruiter-art-orbit-two" />

                    <div className="recruiter-art-center">
                        <span>PA</span>
                    </div>

                    <div className="recruiter-art-bubble recruiter-art-bubble-one">
                        👥
                    </div>

                    <div className="recruiter-art-bubble recruiter-art-bubble-two">
                        ✓
                    </div>
                </div>
            </section>

            {/* Overview heading */}
            <section className="recruiter-overview-section">
                <div className="recruiter-section-heading">
                    <div>
                        <span className="recruiter-section-eyebrow">
                            YOUR RECRUITMENT
                        </span>
                        <h2>Recruitment Overview</h2>
                        <p>
                            A snapshot of your current hiring activity.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="recruiter-refresh-button"
                        onClick={fetchDashboard}
                    >
                        <span aria-hidden="true">↻</span>
                        Refresh data
                    </button>
                </div>

                <div className="recruiter-stats-grid">
                    {STAT_CARDS.map((item) => (
                        <article
                            key={item.key}
                            className={`recruiter-stat-card recruiter-stat-${item.color}`}
                        >
                            <div className="recruiter-stat-card-top">
                                <div className="recruiter-stat-icon">
                                    <span aria-hidden="true">
                                        {item.icon}
                                    </span>
                                </div>

                                <span className="recruiter-stat-indicator">
                                    ●
                                </span>
                            </div>

                            <p className="recruiter-stat-label">
                                {item.label}
                            </p>

                            <h3 className="recruiter-stat-value">
                                {stats[item.key] ?? 0}
                            </h3>

                            <p className="recruiter-stat-description">
                                {item.description}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Recent applications */}
            <section className="recruiter-applications-section">
                <div className="recruiter-section-heading">
                    <div>
                        <span className="recruiter-section-eyebrow">
                            CANDIDATE ACTIVITY
                        </span>
                        <h2>Recent Applications</h2>
                        <p>
                            Review the latest applications submitted to
                            your job openings.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="recruiter-secondary-button"
                        onClick={() =>
                            navigate("/recruiter/applications")
                        }
                    >
                        View Applications
                        <span aria-hidden="true">→</span>
                    </button>
                </div>

                {recentApplications.length === 0 ? (
                    <div className="recruiter-empty-state">
                        <div
                            className="recruiter-empty-icon"
                            aria-hidden="true"
                        >
                            <span>📋</span>
                        </div>

                        <h3>No applications yet</h3>

                        <p>
                            Applications will appear here when candidates
                            apply to your job openings.
                        </p>

                        <button
                            type="button"
                            className="recruiter-primary-button"
                            onClick={() => navigate("/recruiter/jobs")}
                        >
                            Explore Your Jobs
                        </button>
                    </div>
                ) : (
                    <div className="recruiter-application-list">
                        {recentApplications.map((application) => {
                            const status = String(
                                application.status || ""
                            )
                                .toLowerCase()
                                .replaceAll("_", " ")
                                .trim();

                            const canViewApplications =
                                status === "shortlisted";

                            return (
                                <article
                                    key={application.id}
                                    className="recruiter-application-card"
                                >
                                    <div className="recruiter-application-main">
                                        <div className="recruiter-company-avatar">
                                            {String(
                                                application.job_title ||
                                                "J"
                                            )
                                                .trim()
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="recruiter-application-info">
                                            <h3>
                                                {application.job_title ||
                                                    "Job Application"}
                                            </h3>

                                            <p>
                                                Application #
                                                {application.id}
                                                {" · "}
                                                Student #
                                                {application.student_id ?? "—"}
                                            </p>

                                            <span className="recruiter-application-date">
                                                Applied{" "}
                                                {formatDate(
                                                    application.applied_at
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="recruiter-application-actions">
                                        <span
                                            className={`recruiter-status-badge recruiter-status-${getStatusClass(
                                                application.status
                                            )}`}
                                        >
                                            <span
                                                className="recruiter-status-dot"
                                                aria-hidden="true"
                                            />
                                            {formatStatus(
                                                application.status
                                            )}
                                        </span>

                                        {canViewApplications && (
                                            <button
                                                type="button"
                                                className="recruiter-secondary-button recruiter-review-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/recruiter/jobs/${application.job_id}/applications`
                                                    )
                                                }
                                            >
                                                Review
                                                <span aria-hidden="true">
                                                    →
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            <footer className="recruiter-dashboard-footer">
                <span>
                    <span className="recruiter-footer-dot" />
                    PlacementAI Recruiter Workspace
                </span>

                <span>Manage talent. Build your team.</span>
            </footer>
        </div>
    );
}

export default RecruiterDashboard;