import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { applyForJob } from "../../services/applicationService";


function ApplyJob() {

    const { jobId } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ========================================================
    // HANDLE APPLICATION
    // ========================================================

    const handleApply = async () => {

        setLoading(true);
        setError("");
        setSuccess("");

        try {

            await applyForJob(jobId);

            setSuccess(
                "Application submitted successfully!"
            );

        } catch (error) {

            console.error(
                "Application error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to submit application."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // UI
    // ========================================================

    return (

        <div>

            <button
                onClick={() =>
                    navigate(
                        `/student/jobs/${jobId}`
                    )
                }
            >
                ← Back to Job
            </button>


            <h1>
                Apply for Job
            </h1>


            <p>
                You are applying for this job.
            </p>


            {!success && (

                <button
                    onClick={handleApply}
                    disabled={loading}
                >
                    {loading
                        ? "Submitting..."
                        : "Confirm Application"
                    }
                </button>

            )}


            {error && (

                <p>
                    {error}
                </p>

            )}


            {success && (

                <div>

                    <h2>
                        Application Submitted ✓
                    </h2>

                    <p>
                        {success}
                    </p>


                    <button
                        onClick={() =>
                            navigate(
                                "/student/applications"
                            )
                        }
                    >
                        View My Applications
                    </button>


                    <button
                        onClick={() =>
                            navigate(
                                "/student/jobs"
                            )
                        }
                    >
                        Browse More Jobs
                    </button>

                </div>

            )}

        </div>
    );
}


export default ApplyJob;