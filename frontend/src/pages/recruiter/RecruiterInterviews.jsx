import { useEffect, useState } from "react";

import {
    getInterviews,
    updateInterviewStatus,
    deleteInterview
} from "../../services/interviewService";


function RecruiterInterviews() {

    const [interviews, setInterviews] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(0);


    // ========================================================
    // FETCH INTERVIEWS
    // ========================================================

    const fetchInterviews = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getInterviews({
                page,
                limit: 10,
                status: statusFilter
            });

            setInterviews(
                data.items || []
            );

            setTotalPages(
                data.total_pages || 0
            );

        } catch (error) {

            console.error(
                "Failed to fetch interviews:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load interviews."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // LOAD INTERVIEWS
    // ========================================================

    useEffect(() => {

        fetchInterviews();

    }, [page, statusFilter]);


    // ========================================================
    // UPDATE STATUS
    // ========================================================

    const handleStatusUpdate = async (
        interviewId,
        newStatus
    ) => {

        try {

            await updateInterviewStatus(
                interviewId,
                newStatus
            );

            await fetchInterviews();

        } catch (error) {

            console.error(
                "Failed to update interview:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to update interview status."
            );
        }
    };


    // ========================================================
    // DELETE INTERVIEW
    // ========================================================

    const handleDelete = async (
        interviewId
    ) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this interview?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteInterview(
                interviewId
            );

            await fetchInterviews();

        } catch (error) {

            console.error(
                "Failed to delete interview:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to delete interview."
            );
        }
    };


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "—";
        }

        return new Date(
            date
        ).toLocaleString();
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-loading">

                    <h2>
                        Loading interviews...
                    </h2>

                    <p>
                        Please wait while we fetch
                        recruiter interview data.
                    </p>

                </div>

            </div>
        );
    }


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <div className="dashboard-page">


            {/* ==================================================
                HEADER
            ================================================== */}

            <section className="dashboard-header">

                <div>

                    <p className="dashboard-eyebrow">
                        Recruiter
                    </p>

                    <h1>
                        Interview Management
                    </h1>

                    <p>
                        Manage scheduled interviews,
                        candidate meetings and interview
                        outcomes.
                    </p>

                </div>

            </section>


            {/* ==================================================
                FILTER
            ================================================== */}

            <section>

                <label htmlFor="status-filter">
                    Filter by status:
                </label>

                {" "}

                <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(event) => {

                        setPage(1);

                        setStatusFilter(
                            event.target.value
                        );

                    }}
                >

                    <option value="">
                        All
                    </option>

                    <option value="scheduled">
                        Scheduled
                    </option>

                    <option value="completed">
                        Completed
                    </option>

                    <option value="cancelled">
                        Cancelled
                    </option>

                </select>

            </section>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="dashboard-error">

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchInterviews}
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!error &&
                interviews.length === 0 && (

                    <div>

                        <h2>
                            No interviews found
                        </h2>

                        <p>
                            There are no interviews matching
                            the selected filter.
                        </p>

                    </div>
                )
            }


            {/* ==================================================
                INTERVIEW LIST
            ================================================== */}

            {!error &&
                interviews.length > 0 && (

                    <section>

                        {interviews.map(
                            (interview) => (

                                <article
                                    key={interview.id}
                                    style={{
                                        border: "1px solid #ddd",
                                        borderRadius: "10px",
                                        padding: "20px",
                                        margin: "15px 0"
                                    }}
                                >

                                    <h2>
                                        Interview #
                                        {interview.id}
                                    </h2>


                                    <p>
                                        <strong>
                                            Application ID:
                                        </strong>{" "}
                                        {interview.application_id}
                                    </p>


                                    <p>
                                        <strong>
                                            Scheduled:
                                        </strong>{" "}
                                        {formatDate(
                                            interview.scheduled_at
                                        )}
                                    </p>


                                    <p>
                                        <strong>
                                            Interview Type:
                                        </strong>{" "}
                                        {interview.interview_type}
                                    </p>


                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}
                                        {interview.status}
                                    </p>


                                    {interview.meeting_link && (

                                        <p>

                                            <strong>
                                                Meeting:
                                            </strong>{" "}

                                            <a
                                                href={
                                                    interview.meeting_link
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Join Meeting
                                            </a>

                                        </p>
                                    )}


                                    {/* ==================================
                                        ACTIONS
                                    ================================== */}

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            marginTop: "15px"
                                        }}
                                    >

                                        {interview.status ===
                                            "scheduled" && (

                                            <>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            interview.id,
                                                            "completed"
                                                        )
                                                    }
                                                >
                                                    Mark Completed
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            interview.id,
                                                            "cancelled"
                                                        )
                                                    }
                                                >
                                                    Cancel Interview
                                                </button>

                                            </>
                                        )}


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    interview.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </article>

                            )
                        )}

                    </section>
                )
            }


            {/* ==================================================
                PAGINATION
            ================================================== */}

            {totalPages > 1 && (

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "20px"
                    }}
                >

                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() =>
                            setPage(
                                (current) =>
                                    current - 1
                            )
                        }
                    >
                        Previous
                    </button>


                    <span>
                        Page {page} of {totalPages}
                    </span>


                    <button
                        type="button"
                        disabled={
                            page >= totalPages
                        }
                        onClick={() =>
                            setPage(
                                (current) =>
                                    current + 1
                            )
                        }
                    >
                        Next
                    </button>

                </div>
            )}

        </div>
    );
}


export default RecruiterInterviews;