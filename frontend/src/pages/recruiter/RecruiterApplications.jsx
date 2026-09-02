import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getJobApplications,
    updateApplicationStatus
} from "../../services/applicationService";


function RecruiterApplications() {

    const navigate = useNavigate();

    const { jobId } = useParams();


    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [updatingId, setUpdatingId] =
        useState(null);


    // ========================================================
    // FETCH APPLICATIONS
    // ========================================================

    const fetchApplications = async (
        currentPage = page,
        currentSearch = search
    ) => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getJobApplications({
                    jobId,
                    page: currentPage,
                    limit: 10,
                    status: statusFilter,
                    search: currentSearch.trim()
                });

            setApplications(
                data || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch applications:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load applications."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // LOAD APPLICATIONS
    // ========================================================

    useEffect(() => {

        if (jobId) {

            fetchApplications(
                page,
                search
            );

        }

    }, [
        jobId,
        page,
        statusFilter
    ]);


    // ========================================================
    // SEARCH
    // ========================================================

    const handleSearch = async (event) => {

        event.preventDefault();

        setPage(1);

        await fetchApplications(
            1,
            search
        );
    };


    // ========================================================
    // UPDATE APPLICATION STATUS
    // ========================================================

    const handleStatusUpdate = async (
        applicationId,
        newStatus
    ) => {

        try {

            setError("");

            setUpdatingId(
                applicationId
            );

            await updateApplicationStatus(
                applicationId,
                newStatus
            );

            await fetchApplications(
                page,
                search
            );

        } catch (error) {

            console.error(
                "Failed to update application status:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to update application status."
            );

        } finally {

            setUpdatingId(null);
        }
    };


    // ========================================================
    // SCHEDULE INTERVIEW
    // ========================================================

    const handleScheduleInterview = (
        applicationId
    ) => {

        navigate(
            `/recruiter/interviews/schedule?applicationId=${applicationId}`
        );
    };


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (date) => {

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
                        Loading applications...
                    </h2>

                    <p>
                        Please wait while we fetch
                        candidate applications.
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
                        Job Applications
                    </h1>

                    <p>
                        Review applications and manage
                        candidate progress.
                    </p>

                </div>

            </section>


            {/* ==================================================
                FILTERS
            ================================================== */}

            <section>

                <form
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        placeholder="Search candidate name or email..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />


                    <select
                        value={statusFilter}
                        onChange={(event) => {

                            setPage(1);

                            setStatusFilter(
                                event.target.value
                            );

                        }}
                    >

                        <option value="">
                            All Applications
                        </option>

                        <option value="Applied">
                            Applied
                        </option>

                        <option value="Shortlisted">
                            Shortlisted
                        </option>

                        <option value="Interview Scheduled">
                            Interview Scheduled
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>

                        <option value="Hired">
                            Hired
                        </option>

                    </select>


                    <button
                        type="submit"
                    >
                        Search
                    </button>

                </form>

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
                        onClick={() =>
                            fetchApplications(
                                page,
                                search
                            )
                        }
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!error &&
                applications.length === 0 && (

                    <div>

                        <h2>
                            No applications found
                        </h2>

                        <p>
                            No candidates have applied
                            for this job yet.
                        </p>

                    </div>
                )
            }


            {/* ==================================================
                APPLICATION LIST
            ================================================== */}

            {!error &&
                applications.length > 0 && (

                    <section>

                        {applications.map(
                            (application) => (

                                <article
                                    key={
                                        application.id
                                    }
                                    style={{
                                        border:
                                            "1px solid #ddd",
                                        borderRadius:
                                            "10px",
                                        padding:
                                            "20px",
                                        margin:
                                            "15px 0"
                                    }}
                                >

                                    <h2>
                                        Application #
                                        {application.id}
                                    </h2>


                                    {/* ==================================
                                        CANDIDATE INFORMATION
                                    ================================== */}

                                    <p>
                                        <strong>
                                            Candidate:
                                        </strong>{" "}

                                        {application.student_name ||
                                            application.student_full_name ||
                                            application.full_name ||
                                            `Student #${application.student_id}`}
                                    </p>


                                    <p>
                                        <strong>
                                            Email:
                                        </strong>{" "}

                                        {application.student_email ||
                                            application.email ||
                                            "—"}
                                    </p>


                                    <p>
                                        <strong>
                                            Student ID:
                                        </strong>{" "}

                                        {application.student_id}
                                    </p>


                                    {/* ==================================
                                        APPLICATION INFORMATION
                                    ================================== */}

                                    <p>
                                        <strong>
                                            Applied At:
                                        </strong>{" "}

                                        {formatDate(
                                            application.applied_at
                                        )}
                                    </p>


                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}

                                        {application.status}
                                    </p>


                                    {/* ==================================================
                                        ACTIONS
                                    ================================================== */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap:
                                                "10px",
                                            marginTop:
                                                "15px",
                                            flexWrap:
                                                "wrap"
                                        }}
                                    >

                                        {/* ============================================
                                            APPLIED
                                        ============================================ */}

                                        {application.status ===
                                            "Applied" && (

                                            <>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        application.id
                                                    }
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            application.id,
                                                            "Shortlisted"
                                                        )
                                                    }
                                                >
                                                    {updatingId ===
                                                        application.id
                                                        ? "Updating..."
                                                        : "Shortlist"}
                                                </button>


                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        application.id
                                                    }
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            application.id,
                                                            "Rejected"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                            </>

                                        )}


                                        {/* ============================================
                                            SHORTLISTED
                                        ============================================ */}

                                        {application.status ===
                                            "Shortlisted" && (

                                            <>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        application.id
                                                    }
                                                    onClick={() =>
                                                        handleScheduleInterview(
                                                            application.id
                                                        )
                                                    }
                                                >
                                                    Schedule Interview
                                                </button>


                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        application.id
                                                    }
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            application.id,
                                                            "Rejected"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                            </>

                                        )}


                                        {/* ============================================
                                            INTERVIEW SCHEDULED
                                        ============================================ */}

                                        {application.status ===
                                            "Interview Scheduled" && (

                                            <>

                                                <span>
                                                    Interview Scheduled
                                                </span>


                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        application.id
                                                    }
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            application.id,
                                                            "Hired"
                                                        )
                                                    }
                                                >
                                                    Mark Hired
                                                </button>


                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        application.id
                                                    }
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            application.id,
                                                            "Rejected"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                            </>

                                        )}


                                        {/* ============================================
                                            REJECTED
                                        ============================================ */}

                                        {application.status ===
                                            "Rejected" && (

                                            <span>
                                                Application Rejected
                                            </span>

                                        )}


                                        {/* ============================================
                                            HIRED
                                        ============================================ */}

                                        {application.status ===
                                            "Hired" && (

                                            <span>
                                                Candidate Hired
                                            </span>

                                        )}

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

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px"
                }}
            >

                <button
                    type="button"
                    disabled={
                        page <= 1
                    }
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
                    Page {page}
                </span>


                <button
                    type="button"
                    disabled={
                        applications.length < 10
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

        </div>
    );
}


export default RecruiterApplications;