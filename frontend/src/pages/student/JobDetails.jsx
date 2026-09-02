import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getJobById,
    applyForJob
} from "../../services/jobService";


function JobDetails() {

    const { jobId } = useParams();

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [job, setJob] = useState(null);

    const [loading, setLoading] = useState(true);

    const [applying, setApplying] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ========================================================
    // FETCH JOB DETAILS
    // ========================================================

    useEffect(() => {

        const fetchJob = async () => {

            setLoading(true);
            setError("");

            try {

                const data = await getJobById(jobId);

                setJob(data);

            } catch (error) {

                console.error(
                    "Failed to fetch job details:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Failed to load job details."
                );

            } finally {

                setLoading(false);

            }
        };


        fetchJob();

    }, [jobId]);


    // ========================================================
    // APPLY FOR JOB
    // ========================================================

    const handleApply = async () => {

        setApplying(true);
        setError("");
        setSuccess("");

        try {

            await applyForJob(jobId);

            setSuccess(
                "Application submitted successfully!"
            );

        } catch (error) {

            console.error(
                "Failed to apply for job:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to submit application."
            );

        } finally {

            setApplying(false);

        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div>

                <p>
                    Loading job details...
                </p>

            </div>

        );
    }


    // ========================================================
    // ERROR / JOB NOT FOUND
    // ========================================================

    if (error && !job) {

        return (

            <div>

                <h1>
                    Job Details
                </h1>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate("/student/jobs")
                    }
                >
                    Back to Jobs
                </button>

            </div>

        );
    }


    // ========================================================
    // JOB DETAILS
    // ========================================================

    return (

        <div>

            {/* ==================================================
                HEADER
            ================================================== */}

            <div>

                <button
                    onClick={() =>
                        navigate("/student/jobs")
                    }
                >
                    ← Back to Jobs
                </button>

            </div>


            {/* ==================================================
                JOB INFORMATION
            ================================================== */}

            <div>

                <h1>
                    {job?.title}
                </h1>


                <h2>
                    {job?.company}
                </h2>


                {job?.location && (

                    <p>
                        📍 {job.location}
                    </p>

                )}


                {job?.job_type && (

                    <p>
                        Job Type: {job.job_type}
                    </p>

                )}


                {job?.salary && (

                    <p>
                        Salary: {job.salary}
                    </p>

                )}

            </div>


            {/* ==================================================
                JOB DESCRIPTION
            ================================================== */}

            {job?.description && (

                <div>

                    <h2>
                        Job Description
                    </h2>

                    <p>
                        {job.description}
                    </p>

                </div>

            )}


            {/* ==================================================
                REQUIRED SKILLS
            ================================================== */}

            {job?.skills && (

                <div>

                    <h2>
                        Required Skills
                    </h2>

                    <p>
                        {Array.isArray(job.skills)
                            ? job.skills.join(", ")
                            : job.skills}
                    </p>

                </div>

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
                SUCCESS
            ================================================== */}

            {success && (

                <div>

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

                </div>

            )}


            {/* ==================================================
                APPLY BUTTON
            ================================================== */}

            {!success && (

                <button
                    onClick={handleApply}
                    disabled={applying}
                >

                    {applying
                        ? "Applying..."
                        : "Apply for this Job"
                    }

                </button>

            )}

        </div>

    );
}


export default JobDetails;