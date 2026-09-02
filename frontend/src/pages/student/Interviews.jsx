import { useEffect, useState } from "react";

import {
    getMyInterviews
} from "../../services/interviewService";


function Interviews() {

    const [interviews, setInterviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================================
    // FETCH MY INTERVIEWS
    // ========================================================

    const fetchInterviews = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getMyInterviews();

            setInterviews(data || []);

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

    }, []);


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
                        your interview schedule.
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
                        onClick={fetchInterviews}
                    >
                        Try Again
                    </button>

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
                        Student
                    </p>

                    <h1>
                        My Interviews
                    </h1>

                    <p>
                        View and manage your upcoming
                        placement interviews.
                    </p>

                </div>

            </section>


            {/* ==================================================
                INTERVIEW LIST
            ================================================== */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Interview Schedule
                        </h2>

                        <p>
                            Your scheduled placement
                            interviews.
                        </p>

                    </div>

                </div>


                {interviews.length === 0 ? (

                    <div>

                        <h3>
                            No interviews scheduled
                        </h3>

                        <p>
                            Your scheduled interviews
                            will appear here.
                        </p>

                    </div>

                ) : (

                    <div>

                        {interviews.map(
                            (interview) => (

                                <article
                                    key={
                                        interview.id
                                    }
                                    style={{
                                        border:
                                            "1px solid #ddd",
                                        borderRadius:
                                            "10px",
                                        padding:
                                            "20px",
                                        marginBottom:
                                            "15px"
                                    }}
                                >

                                    <h2>
                                        {interview.job_title ||
                                            "Interview"}
                                    </h2>


                                    <p>
                                        <strong>
                                            Company:
                                        </strong>{" "}

                                        {interview.company ||
                                            "—"}
                                    </p>


                                    <p>
                                        <strong>
                                            Interview Date:
                                        </strong>{" "}

                                        {interview.scheduled_at
                                            ? new Date(
                                                interview.scheduled_at
                                            ).toLocaleDateString()
                                            : "—"}
                                    </p>


                                    <p>
                                        <strong>
                                            Interview Time:
                                        </strong>{" "}

                                        {interview.scheduled_at
                                            ? new Date(
                                                interview.scheduled_at
                                            ).toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                }
                                            )
                                            : "—"}
                                    </p>


                                    <p>
                                        <strong>
                                            Interview Type:
                                        </strong>{" "}

                                        {interview.interview_type ||
                                            "—"}
                                    </p>


                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}

                                        {interview.status ||
                                            "Scheduled"}
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
                                                Join Interview
                                            </a>

                                        </p>

                                    )}


                                    {interview.notes && (

                                        <p>

                                            <strong>
                                                Notes:
                                            </strong>{" "}

                                            {interview.notes}

                                        </p>

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


export default Interviews;