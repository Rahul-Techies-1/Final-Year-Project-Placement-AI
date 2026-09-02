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
    // UI
    // ========================================================

    return (

        <div className="my-applications-page">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        My Applications
                    </h1>

                    <p>
                        Track the jobs you have applied for.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate("/student/jobs")
                    }
                >
                    Explore Jobs
                </button>

            </div>


            {/* ==================================================
                LOADING
            ================================================== */}

            {loading && (

                <div>

                    <p>
                        Loading your applications...
                    </p>

                </div>

            )}


            {/* ==================================================
                ERROR
            ================================================== */}

            {!loading && error && (

                <div>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchApplications}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!loading &&
                !error &&
                applications.length === 0 && (

                    <div>

                        <h2>
                            No Applications Yet
                        </h2>

                        <p>
                            You haven't applied for any jobs yet.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/student/jobs")
                            }
                        >
                            Explore Available Jobs
                        </button>

                    </div>

                )}


            {/* ==================================================
                APPLICATION LIST
            ================================================== */}

            {!loading &&
                !error &&
                applications.length > 0 && (

                    <div className="applications-list">

                        {applications.map(
                            (application) => (

                                <div
                                    className="application-card"
                                    key={
                                        application.application_id ||
                                        application.id
                                    }
                                >

                                    <div>

                                        <h2>
                                            {
                                                application.job_title ||
                                                application.job?.title ||
                                                "Job Application"
                                            }
                                        </h2>


                                        <p>
                                            <strong>
                                                Company:
                                            </strong>{" "}

                                            {
                                                application.company ||
                                                application.job?.company ||
                                                "Not specified"
                                            }
                                        </p>


                                        {application.location && (

                                            <p>
                                                <strong>
                                                    Location:
                                                </strong>{" "}

                                                {
                                                    application.location
                                                }
                                            </p>

                                        )}

                                    </div>


                                    {/* STATUS */}

                                    <div>

                                        <span>
                                            {
                                                application.status ||
                                                "Unknown"
                                            }
                                        </span>

                                    </div>


                                    {/* DETAILS */}

                                    <div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/student/applications/${
                                                        application.application_id ||
                                                        application.id
                                                    }`
                                                )
                                            }
                                        >
                                            View Application
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

        </div>
    );
}


export default MyApplications;