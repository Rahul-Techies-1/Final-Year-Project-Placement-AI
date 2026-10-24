import { useEffect, useState } from "react";

import {
    getInterviews,
    updateInterviewStatus,
    deleteInterview,
} from "../../services/interviewService";

function formatStatus(status) {
    if (!status) return "Unknown";

    return String(status)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getInterviewStatusClass(status) {
    const normalized = String(status || "")
        .toLowerCase()
        .replaceAll("_", " ")
        .trim();

    if (normalized === "scheduled") return "interview-status-scheduled";
    if (normalized === "completed") return "interview-status-completed";
    if (normalized === "cancelled") return "interview-status-cancelled";

    return "interview-status-default";
}

function formatDate(date) {
    if (!date) return "Not scheduled";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function RecruiterInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalInterviews, setTotalInterviews] = useState(0);
    const [actionInterviewId, setActionInterviewId] = useState(null);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getInterviews({
                page,
                limit: 10,
                status: statusFilter,
            });

            setInterviews(
                Array.isArray(data?.items) ? data.items : []
            );

            setTotalPages(Number(data?.total_pages) || 0);
            setTotalInterviews(
                Number(data?.total) ||
                (Array.isArray(data?.items) ? data.items.length : 0)
            );
        } catch (err) {
            console.error("Failed to fetch interviews:", err);

            setError(
                err?.response?.data?.detail ||
                "Failed to load interviews. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, [page, statusFilter]);

    const handleStatusUpdate = async (interviewId, newStatus) => {
        try {
            setActionInterviewId(interviewId);
            setError("");

            await updateInterviewStatus(interviewId, newStatus);
            await fetchInterviews();
        } catch (err) {
            console.error("Failed to update interview:", err);

            setError(
                err?.response?.data?.detail ||
                "Failed to update the interview status."
            );
        } finally {
            setActionInterviewId(null);
        }
    };

    const handleDelete = async (interviewId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this interview?"
            )
        ) {
            return;
        }

        try {
            setActionInterviewId(interviewId);
            setError("");

            await deleteInterview(interviewId);
            await fetchInterviews();
        } catch (err) {
            console.error("Failed to delete interview:", err);

            setError(
                err?.response?.data?.detail ||
                "Failed to delete the interview."
            );
        } finally {
            setActionInterviewId(null);
        }
    };

    const scheduledCount = interviews.filter(
        (interview) =>
            String(interview.status).toLowerCase() === "scheduled"
    ).length;

    const completedCount = interviews.filter(
        (interview) =>
            String(interview.status).toLowerCase() === "completed"
    ).length;

    const cancelledCount = interviews.filter(
        (interview) =>
            String(interview.status).toLowerCase() === "cancelled"
    ).length;

    if (loading) {
        return (
            <div className="recruiter-management-page">
                <div className="recruiter-management-state">
                    <div className="recruiter-management-spinner" />
                    <h2>Loading interviews</h2>
                    <p>
                        Fetching your interview schedule. Please wait.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="recruiter-management-page">
            <section className="recruiter-management-hero">
                <div className="recruiter-management-hero-copy">
                    <span className="recruiter-management-eyebrow">
                        RECRUITER WORKSPACE
                    </span>

                    <h1>Interview Management</h1>

                    <p>
                        Track scheduled interviews, manage candidate
                        meetings and record interview outcomes.
                    </p>
                </div>
            </section>

            {error && (
                <div
                    className="recruiter-management-alert"
                    role="alert"
                >
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={fetchInterviews}
                    >
                        Try Again
                    </button>
                </div>
            )}

            <section className="recruiter-management-metrics">
                <article className="recruiter-management-metric">
                    <div className="recruiter-management-metric-icon metric-blue">
                        📅
                    </div>
                    <div>
                        <p>Interviews in results</p>
                        <h2>{totalInterviews}</h2>
                    </div>
                </article>

                <article className="recruiter-management-metric">
                    <div className="recruiter-management-metric-icon metric-orange">
                        ◷
                    </div>
                    <div>
                        <p>Scheduled on this page</p>
                        <h2>{scheduledCount}</h2>
                    </div>
                </article>

                <article className="recruiter-management-metric">
                    <div className="recruiter-management-metric-icon metric-green">
                        ✓
                    </div>
                    <div>
                        <p>Completed on this page</p>
                        <h2>{completedCount}</h2>
                    </div>
                </article>

                <article className="recruiter-management-metric">
                    <div className="recruiter-management-metric-icon metric-red">
                        ×
                    </div>
                    <div>
                        <p>Cancelled on this page</p>
                        <h2>{cancelledCount}</h2>
                    </div>
                </article>
            </section>

            <section className="recruiter-interviews-section">
                <div className="recruiter-management-section-heading recruiter-interviews-heading">
                    <div>
                        <span className="recruiter-management-eyebrow">
                            CANDIDATE MEETINGS
                        </span>

                        <h2>Interview Schedule</h2>

                        <p>
                            Review scheduled meetings and update
                            interview outcomes.
                        </p>
                    </div>

                    <div className="recruiter-interview-filter">
                        <label htmlFor="recruiter-interview-status">
                            Filter status
                        </label>

                        <select
                            id="recruiter-interview-status"
                            value={statusFilter}
                            onChange={(event) => {
                                setPage(1);
                                setStatusFilter(event.target.value);
                            }}
                        >
                            <option value="">All interviews</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {interviews.length === 0 ? (
                    <div className="recruiter-management-empty">
                        <div className="recruiter-management-empty-icon">
                            📅
                        </div>

                        <h3>No interviews found</h3>

                        <p>
                            There are no interviews matching this filter.
                            Interviews will appear here when they are
                            scheduled for your applications.
                        </p>

                        {statusFilter && (
                            <button
                                type="button"
                                className="recruiter-management-secondary"
                                onClick={() => {
                                    setPage(1);
                                    setStatusFilter("");
                                }}
                            >
                                Show all interviews
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="recruiter-interview-list">
                        {interviews.map((interview) => {
                            const normalizedStatus = String(
                                interview.status || ""
                            ).toLowerCase();

                            const isScheduled =
                                normalizedStatus === "scheduled";

                            const isBusy =
                                actionInterviewId === interview.id;

                            return (
                                <article
                                    key={interview.id}
                                    className="recruiter-interview-card"
                                >
                                    <div className="recruiter-interview-date-tile">
                                        <span aria-hidden="true">📆</span>
                                        <strong>
                                            #{interview.id}
                                        </strong>
                                    </div>

                                    <div className="recruiter-interview-details">
                                        <div className="recruiter-interview-title-row">
                                            <h3>
                                                Interview #{interview.id}
                                            </h3>

                                            <span
                                                className={`recruiter-status-badge ${getInterviewStatusClass(
                                                    interview.status
                                                )}`}
                                            >
                                                <span className="recruiter-status-dot" />
                                                {formatStatus(
                                                    interview.status
                                                )}
                                            </span>
                                        </div>

                                        <div className="recruiter-interview-info-grid">
                                            <div>
                                                <span>Application</span>
                                                <strong>
                                                    #
                                                    {interview.application_id ??
                                                        "—"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Interview type</span>
                                                <strong>
                                                    {formatStatus(
                                                        interview.interview_type
                                                    )}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Scheduled date</span>
                                                <strong>
                                                    {formatDate(
                                                        interview.scheduled_at
                                                    )}
                                                </strong>
                                            </div>
                                        </div>

                                        {interview.meeting_link && (
                                            <a
                                                className="recruiter-interview-meeting-link"
                                                href={interview.meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <span aria-hidden="true">
                                                    ↗
                                                </span>
                                                Open meeting link
                                            </a>
                                        )}

                                        <div className="recruiter-interview-actions">
                                            {isScheduled && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="recruiter-management-primary"
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                interview.id,
                                                                "completed"
                                                            )
                                                        }
                                                        disabled={isBusy}
                                                    >
                                                        {isBusy
                                                            ? "Updating..."
                                                            : "✓ Mark Completed"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="recruiter-management-secondary"
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                interview.id,
                                                                "cancelled"
                                                            )
                                                        }
                                                        disabled={isBusy}
                                                    >
                                                        Cancel Interview
                                                    </button>
                                                </>
                                            )}

                                            <button
                                                type="button"
                                                className="recruiter-interview-delete"
                                                onClick={() =>
                                                    handleDelete(interview.id)
                                                }
                                                disabled={isBusy}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="recruiter-interview-pagination">
                        <button
                            type="button"
                            className="recruiter-management-secondary"
                            disabled={page <= 1}
                            onClick={() =>
                                setPage((current) => current - 1)
                            }
                        >
                            ← Previous
                        </button>

                        <span>
                            Page <strong>{page}</strong> of{" "}
                            <strong>{totalPages}</strong>
                        </span>

                        <button
                            type="button"
                            className="recruiter-management-secondary"
                            disabled={page >= totalPages}
                            onClick={() =>
                                setPage((current) => current + 1)
                            }
                        >
                            Next →
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default RecruiterInterviews;