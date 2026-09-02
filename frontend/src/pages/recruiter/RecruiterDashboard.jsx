import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getRecruiterDashboard
} from "../../services/recruiterDashboardService";


function RecruiterDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================================
    // FETCH DASHBOARD
    // ========================================================

    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getRecruiterDashboard();

            setDashboard(data);

        } catch (error) {

            console.error(
                "Failed to fetch recruiter dashboard:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load recruiter dashboard."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // LOAD DASHBOARD
    // ========================================================

    useEffect(() => {

        fetchDashboard();

    }, []);


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-loading">

                    <h2>
                        Loading recruiter dashboard...
                    </h2>

                    <p>
                        Please wait while we fetch
                        your recruiter data.
                    </p>

                </div>

            </div>
        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-error">

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchDashboard}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    const stats =
        dashboard?.stats || {};

    const recentApplications =
        dashboard?.recent_applications || [];


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
                        Recruiter Dashboard
                    </h1>

                    <p>
                        Manage your jobs, candidates
                        and recruitment process.
                    </p>

                </div>

            </section>


            {/* ==================================================
                QUICK ACTIONS
            ================================================== */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Quick Actions
                        </h2>

                        <p>
                            Manage your recruitment
                            workflow.
                        </p>

                    </div>

                </div>


                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap"
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/recruiter/jobs"
                            )
                        }
                    >
                        Manage Jobs
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/recruiter/interviews"
                            )
                        }
                    >
                        Manage Interviews
                    </button>

                </div>

            </section>


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Recruitment Overview
                        </h2>

                        <p>
                            Current recruitment
                            statistics.
                        </p>

                    </div>

                </div>


                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "15px"
                    }}
                >


                    {/* TOTAL JOBS */}

                    <article>

                        <h3>
                            Total Jobs
                        </h3>

                        <p>
                            {stats.total_jobs ?? 0}
                        </p>

                    </article>


                    {/* ACTIVE JOBS */}

                    <article>

                        <h3>
                            Active Jobs
                        </h3>

                        <p>
                            {stats.active_jobs ?? 0}
                        </p>

                    </article>


                    {/* TOTAL APPLICATIONS */}

                    <article>

                        <h3>
                            Total Applications
                        </h3>

                        <p>
                            {stats.total_applications ?? 0}
                        </p>

                    </article>


                    {/* APPLIED */}

                    <article>

                        <h3>
                            Applied
                        </h3>

                        <p>
                            {stats.applied ?? 0}
                        </p>

                    </article>


                    {/* SHORTLISTED */}

                    <article>

                        <h3>
                            Shortlisted
                        </h3>

                        <p>
                            {stats.shortlisted ?? 0}
                        </p>

                    </article>


                    {/* INTERVIEW */}

                    <article>

                        <h3>
                            Interviews
                        </h3>

                        <p>
                            {stats.interview_scheduled ?? 0}
                        </p>

                    </article>


                    {/* REJECTED */}

                    <article>

                        <h3>
                            Rejected
                        </h3>

                        <p>
                            {stats.rejected ?? 0}
                        </p>

                    </article>


                    {/* HIRED */}

                    <article>

                        <h3>
                            Hired
                        </h3>

                        <p>
                            {stats.hired ?? 0}
                        </p>

                    </article>

                </div>

            </section>


            {/* ==================================================
                RECENT APPLICATIONS
            ================================================== */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Recent Applications
                        </h2>

                        <p>
                            Latest candidates who
                            applied to your jobs.
                        </p>

                    </div>

                </div>


                {recentApplications.length === 0 ? (

                    <div>

                        <h3>
                            No recent applications
                        </h3>

                        <p>
                            Applications will appear
                            here when candidates apply
                            to your jobs.
                        </p>

                    </div>

                ) : (

                    <div>

                        {recentApplications.map(
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
                                            "15px",
                                        marginBottom:
                                            "10px"
                                    }}
                                >

                                    <h3>
                                        {application.job_title}
                                    </h3>

                                    <p>

                                        <strong>
                                            Application ID:
                                        </strong>{" "}

                                        {application.id}

                                    </p>

                                    <p>

                                        <strong>
                                            Student ID:
                                        </strong>{" "}

                                        {application.student_id}

                                    </p>

                                    <p>

                                        <strong>
                                            Status:
                                        </strong>{" "}

                                        {application.status}

                                    </p>

                                    <p>

                                        <strong>
                                            Applied:
                                        </strong>{" "}

                                        {application.applied_at
                                            ? new Date(
                                                application.applied_at
                                            ).toLocaleString()
                                            : "—"}

                                    </p>


                                    {application.status ===
                                        "Shortlisted" && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/recruiter/jobs/${application.job_id}/applications`
                                                )
                                            }
                                        >
                                            View Applications
                                        </button>

                                    )}

                                </article>

                            )
                        )}

                    </div>
                )}

            </section>

        </div>
    );
}


export default RecruiterDashboard;