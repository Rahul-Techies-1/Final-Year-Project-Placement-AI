import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getJobById,
    updateJob
} from "../../services/jobService";


function EditJob() {

    const navigate = useNavigate();

    const { jobId } = useParams();


    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        requirements: ""
    });


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ========================================================
    // FETCH JOB
    // ========================================================

    useEffect(() => {

        const fetchJob = async () => {

            try {

                setLoading(true);
                setError("");

                const job =
                    await getJobById(jobId);

                setFormData({
                    title: job.title || "",
                    company: job.company || "",
                    location: job.location || "",
                    salary:
                        job.salary !== null &&
                        job.salary !== undefined
                            ? String(job.salary)
                            : "",
                    description:
                        job.description || "",
                    requirements:
                        job.requirements || ""
                });

            } catch (error) {

                console.error(
                    "Failed to fetch job:",
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


        if (jobId) {
            fetchJob();
        }

    }, [jobId]);


    // ========================================================
    // HANDLE INPUT
    // ========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };


    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (!formData.title.trim()) {

            setError(
                "Job title is required."
            );

            return;
        }


        if (!formData.company.trim()) {

            setError(
                "Company name is required."
            );

            return;
        }


        if (!formData.location.trim()) {

            setError(
                "Location is required."
            );

            return;
        }


        if (!formData.description.trim()) {

            setError(
                "Job description is required."
            );

            return;
        }


        if (!formData.requirements.trim()) {

            setError(
                "Job requirements are required."
            );

            return;
        }


        setSaving(true);


        try {

            await updateJob(
                Number(jobId),
                {
                    title:
                        formData.title.trim(),

                    company:
                        formData.company.trim(),

                    location:
                        formData.location.trim(),

                    salary:
                        formData.salary.trim()
                            ? Number(formData.salary)
                            : null,

                    description:
                        formData.description.trim(),

                    requirements:
                        formData.requirements.trim()
                }
            );


            setSuccess(
                "Job updated successfully."
            );


            setTimeout(() => {

                navigate(
                    "/recruiter/jobs"
                );

            }, 800);


        } catch (error) {

            console.error(
                "Failed to update job:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to update job."
            );

        } finally {

            setSaving(false);
        }
    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-loading">

                    <h2>
                        Loading job...
                    </h2>

                    <p>
                        Please wait while we load
                        the job details.
                    </p>

                </div>

            </div>
        );
    }


    // ========================================================
    // ERROR WHILE LOADING
    // ========================================================

    if (error && !formData.title) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-error">

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/recruiter/jobs"
                            )
                        }
                    >
                        Back to My Jobs
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
                        Recruiter
                    </p>

                    <h1>
                        Edit Job
                    </h1>

                    <p>
                        Update the details of your
                        job opportunity.
                    </p>

                </div>

            </section>


            {/* ==================================================
                FORM
            ================================================== */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Job Details
                        </h2>

                        <p>
                            Modify the information
                            candidates will see.
                        </p>

                    </div>

                </div>


                <form
                    onSubmit={handleSubmit}
                >


                    {/* ==================================================
                        TITLE
                    ================================================== */}

                    <div>

                        <label htmlFor="title">
                            Job Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={saving}
                        />

                    </div>


                    {/* ==================================================
                        COMPANY
                    ================================================== */}

                    <div>

                        <label htmlFor="company">
                            Company
                        </label>

                        <input
                            id="company"
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleChange}
                            disabled={saving}
                        />

                    </div>


                    {/* ==================================================
                        LOCATION
                    ================================================== */}

                    <div>

                        <label htmlFor="location">
                            Location
                        </label>

                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            disabled={saving}
                        />

                    </div>


                    {/* ==================================================
                        SALARY
                    ================================================== */}

                    <div>

                        <label htmlFor="salary">
                            Salary
                        </label>

                        <input
                            id="salary"
                            name="salary"
                            type="number"
                            min="0"
                            value={formData.salary}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <p>
                            Enter annual salary in INR.
                        </p>

                    </div>


                    {/* ==================================================
                        DESCRIPTION
                    ================================================== */}

                    <div>

                        <label htmlFor="description">
                            Job Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="6"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={saving}
                        />

                    </div>


                    {/* ==================================================
                        REQUIREMENTS
                    ================================================== */}

                    <div>

                        <label htmlFor="requirements">
                            Requirements
                        </label>

                        <textarea
                            id="requirements"
                            name="requirements"
                            rows="6"
                            value={formData.requirements}
                            onChange={handleChange}
                            disabled={saving}
                        />

                    </div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div className="dashboard-error">

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {success && (

                        <div>

                            <p>
                                {success}
                            </p>

                        </div>

                    )}


                    {/* ==================================================
                        ACTIONS
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
                            onClick={() =>
                                navigate(
                                    "/recruiter/jobs"
                                )
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : "Save Changes"
                            }

                        </button>

                    </div>

                </form>

            </section>

        </div>
    );
}


export default EditJob;