import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createJob } from "../../services/jobService";


function CreateJob() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        requirements: ""
    });


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ========================================================
    // HANDLE INPUT
    // ========================================================

    const handleChange = (event) => {

        const { name, value } = event.target;

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

            setError("Job title is required.");
            return;
        }

        if (!formData.company.trim()) {

            setError("Company name is required.");
            return;
        }

        if (!formData.location.trim()) {

            setError("Location is required.");
            return;
        }

        if (!formData.description.trim()) {

            setError("Job description is required.");
            return;
        }

        if (!formData.requirements.trim()) {

            setError("Job requirements are required.");
            return;
        }


        setLoading(true);


        try {

            await createJob({

                title: formData.title.trim(),

                company: formData.company.trim(),

                location: formData.location.trim(),

                salary:
                    formData.salary.trim()
                        ? Number(formData.salary)
                        : null,

                description:
                    formData.description.trim(),

                requirements:
                    formData.requirements.trim()
            });


            setSuccess(
                "Job created successfully."
            );


            setTimeout(() => {

                navigate(
                    "/recruiter/jobs"
                );

            }, 800);


        } catch (error) {

            console.error(
                "Failed to create job:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to create job."
            );

        } finally {

            setLoading(false);
        }
    };


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
                        Create New Job
                    </h1>

                    <p>
                        Publish a new job opportunity
                        for students.
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
                            Provide the information candidates
                            need to understand this opportunity.
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
                            placeholder="e.g. Software Engineer"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={loading}
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
                            placeholder="e.g. ABC Technologies"
                            value={formData.company}
                            onChange={handleChange}
                            disabled={loading}
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
                            placeholder="e.g. Delhi / Remote"
                            value={formData.location}
                            onChange={handleChange}
                            disabled={loading}
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
                            placeholder="e.g. 600000"
                            value={formData.salary}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <p>
                            Enter annual salary in INR.
                            Leave empty if not specified.
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
                            placeholder="Describe the role, responsibilities and expectations..."
                            value={formData.description}
                            onChange={handleChange}
                            disabled={loading}
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
                            placeholder="Enter required skills, qualifications and experience..."
                            value={formData.requirements}
                            onChange={handleChange}
                            disabled={loading}
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
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Job..."
                                : "Create Job"
                            }

                        </button>

                    </div>

                </form>

            </section>

        </div>
    );
}


export default CreateJob;