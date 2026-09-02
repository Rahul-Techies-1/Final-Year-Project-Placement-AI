import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    closeJob
} from "../../services/jobService";


function RecruiterJobs() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingJobId, setEditingJobId] =
        useState(null);

    const [formData, setFormData] = useState({

        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        requirements: ""

    });


    // ========================================================
    // FETCH JOBS
    // ========================================================

    const fetchJobs = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getJobs({
                page: 1,
                limit: 50
            });

            setJobs(data || []);

        } catch (error) {

            console.error(
                "Failed to fetch jobs:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load jobs."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // LOAD
    // ========================================================

    useEffect(() => {

        fetchJobs();

    }, []);


    // ========================================================
    // FORM CHANGE
    // ========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(
            (current) => ({
                ...current,
                [name]: value
            })
        );
    };


    // ========================================================
    // RESET FORM
    // ========================================================

    const resetForm = () => {

        setFormData({

            title: "",
            company: "",
            location: "",
            salary: "",
            description: "",
            requirements: ""

        });

        setEditingJobId(null);

        setShowForm(false);
    };


    // ========================================================
    // CREATE / UPDATE JOB
    // ========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setError("");

            const jobData = {

                title: formData.title.trim(),

                company: formData.company.trim(),

                location: formData.location.trim(),

                salary:
                    formData.salary === ""
                        ? null
                        : Number(formData.salary),

                description:
                    formData.description.trim(),

                requirements:
                    formData.requirements.trim()

            };


            if (editingJobId) {

                await updateJob(
                    editingJobId,
                    jobData
                );

            } else {

                await createJob(
                    jobData
                );
            }


            resetForm();

            await fetchJobs();

        } catch (error) {

            console.error(
                "Failed to save job:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to save job."
            );
        }
    };


    // ========================================================
    // EDIT JOB
    // ========================================================

    const handleEdit = (job) => {

        setEditingJobId(job.id);

        setFormData({

            title: job.title || "",

            company: job.company || "",

            location: job.location || "",

            salary:
                job.salary ?? "",

            description:
                job.description || "",

            requirements:
                job.requirements || ""

        });

        setShowForm(true);
    };


    // ========================================================
    // DELETE JOB
    // ========================================================

    const handleDelete = async (jobId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this job?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setError("");

            await deleteJob(jobId);

            await fetchJobs();

        } catch (error) {

            console.error(
                "Failed to delete job:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to delete job."
            );
        }
    };


    // ========================================================
    // CLOSE JOB
    // ========================================================

    const handleClose = async (jobId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to close this job?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setError("");

            await closeJob(jobId);

            await fetchJobs();

        } catch (error) {

            console.error(
                "Failed to close job:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to close job."
            );
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
                        Loading jobs...
                    </h2>

                    <p>
                        Please wait while we fetch
                        your jobs.
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
                        My Jobs
                    </h1>

                    <p>
                        Create and manage your
                        job postings.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() => {

                        if (showForm) {

                            resetForm();

                        } else {

                            setShowForm(true);

                        }

                    }}
                >
                    {showForm
                        ? "Cancel"
                        : "Create Job"}
                </button>

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
                        onClick={fetchJobs}
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* ==================================================
                CREATE / EDIT FORM
            ================================================== */}

            {showForm && (

                <section
                    className="dashboard-section"
                >

                    <h2>
                        {editingJobId
                            ? "Edit Job"
                            : "Create New Job"}
                    </h2>


                    <form
                        onSubmit={handleSubmit}
                    >

                        <div>

                            <label>
                                Job Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        <div>

                            <label>
                                Company
                            </label>

                            <input
                                type="text"
                                name="company"
                                value={
                                    formData.company
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        <div>

                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={
                                    formData.location
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        <div>

                            <label>
                                Salary
                            </label>

                            <input
                                type="number"
                                name="salary"
                                value={
                                    formData.salary
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                            />

                        </div>


                        <div>

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                rows="5"
                            />

                        </div>


                        <div>

                            <label>
                                Requirements
                            </label>

                            <textarea
                                name="requirements"
                                value={
                                    formData.requirements
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                rows="5"
                            />

                        </div>


                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "15px"
                            }}
                        >

                            <button
                                type="submit"
                            >
                                {editingJobId
                                    ? "Update Job"
                                    : "Create Job"}
                            </button>


                            <button
                                type="button"
                                onClick={
                                    resetForm
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </section>
            )}


            {/* ==================================================
                JOB LIST
            ================================================== */}

            <section
                className="dashboard-section"
            >

                <div className="section-header">

                    <div>

                        <h2>
                            Your Job Postings
                        </h2>

                        <p>
                            Manage your current
                            recruitment opportunities.
                        </p>

                    </div>

                </div>


                {jobs.length === 0 ? (

                    <div>

                        <h3>
                            No jobs found
                        </h3>

                        <p>
                            Create your first job
                            posting to start receiving
                            applications.
                        </p>

                    </div>

                ) : (

                    <div>

                        {jobs.map((job) => (

                            <article
                                key={job.id}
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
                                    {job.title}
                                </h2>

                                <p>
                                    <strong>
                                        Company:
                                    </strong>{" "}
                                    {job.company}
                                </p>

                                <p>
                                    <strong>
                                        Location:
                                    </strong>{" "}
                                    {job.location}
                                </p>

                                <p>
                                    <strong>
                                        Salary:
                                    </strong>{" "}
                                    {job.salary
                                        ?? "Not specified"}
                                </p>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}

                                    {job.is_active
                                        ? "Active"
                                        : "Closed"}

                                </p>


                                <div
                                    style={{
                                        display:
                                            "flex",
                                        gap:
                                            "10px",
                                        flexWrap:
                                            "wrap",
                                        marginTop:
                                            "15px"
                                    }}
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/recruiter/jobs/${job.id}/applications`
                                            )
                                        }
                                    >
                                        View Applications
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEdit(job)
                                        }
                                    >
                                        Edit
                                    </button>


                                    {job.is_active && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleClose(
                                                    job.id
                                                )
                                            }
                                        >
                                            Close Job
                                        </button>

                                    )}


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                job.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </article>

                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}


export default RecruiterJobs;