import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getApplicationById,
    withdrawApplication
} from "../../services/applicationService";


function ApplicationDetails() {

    const { applicationId } = useParams();

    const navigate = useNavigate();

    const [application, setApplication] = useState(null);

    const [loading, setLoading] = useState(true);

    const [withdrawing, setWithdrawing] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ========================================================
    // FETCH APPLICATION
    // ========================================================

    const fetchApplication = async () => {

        setLoading(true);
        setError("");

        try {

            const data = await getApplicationById(
                applicationId
            );

            setApplication(data);

        } catch (error) {

            console.error(
                "Failed to fetch application:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load application details."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchApplication();

    }, [applicationId]);


    // ========================================================
    // WITHDRAW APPLICATION
    // ========================================================

    const handleWithdraw = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to withdraw this application?"
        );

        if (!confirmed) {
            return;
        }

        setWithdrawing(true);
        setError("");
        setSuccess("");

        try {

            await withdrawApplication(
                applicationId
            );

            setSuccess(
                "Application withdrawn successfully."
            );

            setApplication((previous) => {

                if (!previous) {
                    return previous;
                }

                return {
                    ...previous,
                    status: "withdrawn"
                };
            });

        } catch (error) {

            console.error(
                "Failed to withdraw application:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to withdraw application."
            );

        } finally {

            setWithdrawing(false);
        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div>

                <p>
                    Loading application details...
                </p>

            </div>
        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error && !application) {

        return (

            <div>

                <h1>
                    Application Details
                </h1>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/student/applications"
                        )
                    }
                >
                    ← Back to Applications
                </button>

            </div>
        );
    }


    if (!application) {

        return (

            <div>

                <p>
                    Application not found.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/student/applications"
                        )
                    }
                >
                    Back to Applications
                </button>

            </div>
        );
    }


    // ========================================================
    // APPLICATION DETAILS
    // ========================================================

    const status =
        application.status || "Unknown";

    const normalizedStatus =
        status.toLowerCase();


    return (

        <div className="application-details-page">


            {/* ==================================================
                BACK
            ================================================== */}

            <button
                type="button"
                onClick={() =>
                    navigate(
                        "/student/applications"
                    )
                }
            >
                ← Back to Applications
            </button>


            {/* ==================================================
                HEADER
            ================================================== */}

            <div>

                <h1>
                    {application.job_title ||
                        application.job?.title ||
                        "Application Details"}
                </h1>

                <p>
                    {application.company ||
                        application.job?.company ||
                        "Company not specified"}
                </p>

            </div>


            {/* ==================================================
                STATUS
            ================================================== */}

            <div>

                <h2>
                    Application Status
                </h2>

                <span
                    className={
                        `status status-${normalizedStatus}`
                    }
                >
                    {status}
                </span>

            </div>


            {/* ==================================================
                JOB INFORMATION
            ================================================== */}

            <div>

                <h2>
                    Job Information
                </h2>


                {(application.location ||
                    application.job?.location) && (

                    <p>
                        <strong>
                            Location:
                        </strong>{" "}

                        {application.location ||
                            application.job?.location}
                    </p>

                )}


                {application.applied_at && (

                    <p>
                        <strong>
                            Applied On:
                        </strong>{" "}

                        {new Date(
                            application.applied_at
                        ).toLocaleString()}
                    </p>

                )}


                {application.created_at && (

                    <p>
                        <strong>
                            Application Created:
                        </strong>{" "}

                        {new Date(
                            application.created_at
                        ).toLocaleString()}
                    </p>

                )}

            </div>


            {/* ==================================================
                SUCCESS
            ================================================== */}

            {success && (

                <p>
                    {success}
                </p>

            )}


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* ==================================================
                WITHDRAW
            ================================================== */}

            {normalizedStatus !== "withdrawn" &&
                normalizedStatus !== "rejected" &&
                normalizedStatus !== "hired" && (

                    <button
                        type="button"
                        onClick={handleWithdraw}
                        disabled={withdrawing}
                    >

                        {withdrawing
                            ? "Withdrawing..."
                            : "Withdraw Application"
                        }

                    </button>

                )}

        </div>
    );
}


export default ApplicationDetails;