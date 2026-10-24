import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    closeJob,
} from "../../services/jobService";

function RecruiterJobs() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [actionJobId, setActionJobId] = useState(null);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingJobId, setEditingJobId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const emptyForm = {
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        requirements: "",
    };

    const [formData, setFormData] = useState(emptyForm);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getJobs({
                page: 1,
                limit: 50,
            });

            const jobItems = Array.isArray(data)
                ? data
                : data?.items || [];

            setJobs(jobItems);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);

            setError(
                err?.response?.data?.detail ||
                "Failed to load jobs. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingJobId(null);
        setShowForm(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const jobData = {
                title: formData.title.trim(),
                company: formData.company.trim(),
                location: formData.location.trim(),
                salary:
                    formData.salary === ""
                        ? null
                        : Number(formData.salary),
                description: formData.description.trim(),
                requirements: formData.requirements.trim(),
            };

            if (editingJobId !== null) {
                await updateJob(editingJobId, jobData);
            } else {
                await createJob(jobData);
            }

            resetForm();
            await fetchJobs();
        } catch (err) {
            console.error("Failed to save job:", err);

            setError(
                err?.response?.data?.detail ||
                "Failed to save the job. Please check your details."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (job) => {
        setEditingJobId(job.id);

        setFormData({
            title: job.title || "",
            company: job.company || "",
            location: job.location || "",
            salary: job.salary ?? "",
            description: job.description || "",
            requirements: job.requirements || "",
        });

        setError("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (jobId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this job?"
            )
        ) {
            return;
        }

        try {
            setActionJobId(jobId);
            setError("");

            await deleteJob(jobId);
            await fetchJobs();
        } catch (err) {
            console.error("Failed to delete job:", err);

            setError(
                err?.response?.data?.detail ||
                "Failed to delete this job."
            );
        } finally {
            setActionJobId(null);
        }
    };

    const handleClose = async (jobId) => {
        if (
            !window.confirm(
                "Are you sure you want to close this job?"
            )
        ) {
            return;
        }

        try {
            setActionJobId(jobId);
            setError("");

            await closeJob(jobId);
            await fetchJobs();
        } catch (err) {
            console.error("Failed to close job:", err);

            setError(
                err?.response?.data?.detail ||
                "Failed to close this job."
            );
        } finally {
            setActionJobId(null);
        }
    };

    const filteredJobs = jobs.filter((job) => {
        const searchableText = [
            job.title,
            job.company,
            job.location,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesSearch = searchableText.includes(
            searchTerm.toLowerCase().trim()
        );

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && job.is_active) ||
            (statusFilter === "closed" && !job.is_active);

        return matchesSearch && matchesStatus;
    });

    const activeJobs = jobs.filter((job) => job.is_active).length;
    const closedJobs = jobs.length - activeJobs;

    const formatSalary = (salary) => {
        if (salary === null || salary === undefined || salary === "") {
            return "Not specified";
        }

        const amount = Number(salary);

        if (!Number.isFinite(amount)) {
            return String(salary);
        }

        return `₹${amount.toLocaleString("en-IN")}`;
    };

    if (loading) {
        return (
            <div className="recruiter-management-page">
                <div className="recruiter-management-state">
                    <div className="recruiter-management-spinner" />
                    <h2>Loading your jobs</h2>
                    <p>Fetching your job postings. Please wait.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recruiter-management-page">
            <section className="recruiter-management-hero">
                <div className="recruiter-management-hero-copy">
                    <span className="recruiter-management-eyebrow">
                        RECRUITER WORKSPACE
                    </span>

                    <h1>My Jobs</h1>

                    <p>
                        Create job opportunities, manage active
                        postings and find the right candidates.
                    </p>
                </div>

                <button
                    type="button"
                    className="recruiter-management-primary"
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setError("");
                            setShowForm(true);
                        }
                    }}
                >
                    <span aria-hidden="true">
                        {showForm ? "×" : "+"}
                    </span>
                    {showForm ? "Cancel" : "Create Job"}
                </button>
            </section>

            {error && (
                <div
                    className="recruiter-management-alert"
                    role="alert"
                >
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={fetchJobs}
                    >
                        Retry loading
                    </button>
                </div>
            )}

            <section className="recruiter-management-metrics">
                <article className="recruiter-management-metric">
                    <div className="recruiter-management-metric-icon metric-blue">
                        💼
                    </div>
                    <div>
                        <p>Total job postings</p>
                        <h2>{jobs.length}</h2>
                    </div>
                </article>

                <article className="recruiter-management-metric">
                    <div className="recruiter-management-metric-icon metric-green">
                        ✓
                    </div>
                    <div>
                        <p>Active jobs</p>
                        <h2>{activeJobs}</h2>
                    </div>
                </article>

                <article className="recruiter-management-metric">
                    <div className="recruiter-management-metric-icon metric-orange">
                        ◷
                    </div>
                    <div>
                        <p>Closed jobs</p>
                        <h2>{closedJobs}</h2>
                    </div>
                </article>
            </section>

            {showForm && (
                <section className="recruiter-job-form-panel">
                    <div className="recruiter-management-section-heading">
                        <div>
                            <span className="recruiter-management-eyebrow">
                                JOB DETAILS
                            </span>

                            <h2>
                                {editingJobId !== null
                                    ? "Edit job posting"
                                    : "Create a new job"}
                            </h2>

                            <p>
                                Provide the details candidates need
                                to understand this opportunity.
                            </p>
                        </div>
                    </div>

                    <form
                        className="recruiter-job-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="recruiter-job-form-grid">
                            <div className="recruiter-field">
                                <label htmlFor="job-title">
                                    Job title *
                                </label>
                                <input
                                    id="job-title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. AI Engineer"
                                    maxLength={200}
                                    required
                                />
                            </div>

                            <div className="recruiter-field">
                                <label htmlFor="job-company">
                                    Company *
                                </label>
                                <input
                                    id="job-company"
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Company name"
                                    maxLength={200}
                                    required
                                />
                            </div>

                            <div className="recruiter-field">
                                <label htmlFor="job-location">
                                    Location *
                                </label>
                                <input
                                    id="job-location"
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Remote or New Delhi"
                                    maxLength={200}
                                    required
                                />
                            </div>

                            <div className="recruiter-field">
                                <label htmlFor="job-salary">
                                    Salary (₹)
                                </label>
                                <input
                                    id="job-salary"
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="e.g. 600000"
                                    min="0"
                                    step="any"
                                />
                                <span className="recruiter-field-hint">
                                    Leave blank if salary is not specified.
                                </span>
                            </div>

                            <div className="recruiter-field recruiter-field-full">
                                <label htmlFor="job-description">
                                    Job description *
                                </label>
                                <textarea
                                    id="job-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the role, responsibilities and opportunity..."
                                    rows={5}
                                    required
                                />
                            </div>

                            <div className="recruiter-field recruiter-field-full">
                                <label htmlFor="job-requirements">
                                    Requirements *
                                </label>
                                <textarea
                                    id="job-requirements"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    placeholder="List the skills, qualifications and experience required..."
                                    rows={4}
                                    required
                                />
                            </div>
                        </div>

                        <div className="recruiter-job-form-actions">
                            <button
                                type="button"
                                className="recruiter-management-secondary"
                                onClick={resetForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="recruiter-management-primary"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingJobId !== null
                                      ? "Save Changes"
                                      : "Publish Job"}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="recruiter-jobs-section">
                <div className="recruiter-management-section-heading recruiter-jobs-heading">
                    <div>
                        <span className="recruiter-management-eyebrow">
                            YOUR OPPORTUNITIES
                        </span>

                        <h2>Your Job Postings</h2>

                        <p>
                            Manage your recruitment opportunities
                            and their current status.
                        </p>
                    </div>

                    <span className="recruiter-management-count">
                        {filteredJobs.length}{" "}
                        {filteredJobs.length === 1 ? "job" : "jobs"}
                    </span>
                </div>

                {jobs.length > 0 && (
                    <div className="recruiter-jobs-toolbar">
                        <div className="recruiter-job-search">
                            <span aria-hidden="true">⌕</span>
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Search title, company or location..."
                                aria-label="Search job postings"
                            />
                        </div>

                        <select
                            className="recruiter-job-status-filter"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            aria-label="Filter jobs by status"
                        >
                            <option value="all">All jobs</option>
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                )}

                {jobs.length === 0 ? (
                    <div className="recruiter-management-empty">
                        <div className="recruiter-management-empty-icon">
                            💼
                        </div>

                        <h3>No job postings yet</h3>

                        <p>
                            Create your first job posting to start
                            receiving applications from candidates.
                        </p>

                        <button
                            type="button"
                            className="recruiter-management-primary"
                            onClick={() => {
                                setError("");
                                setShowForm(true);
                            }}
                        >
                            + Create Your First Job
                        </button>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="recruiter-management-empty recruiter-management-empty-small">
                        <h3>No matching jobs</h3>
                        <p>
                            Try a different search term or status filter.
                        </p>
                        <button
                            type="button"
                            className="recruiter-management-secondary"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="recruiter-job-grid">
                        {filteredJobs.map((job) => (
                            <article
                                key={job.id}
                                className="recruiter-job-card"
                            >
                                <div className="recruiter-job-card-top">
                                    <div className="recruiter-job-avatar">
                                        {String(job.company || job.title || "J")
                                            .trim()
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <span
                                        className={`recruiter-job-status ${
                                            job.is_active
                                                ? "job-status-active"
                                                : "job-status-closed"
                                        }`}
                                    >
                                        <span />
                                        {job.is_active ? "Active" : "Closed"}
                                    </span>
                                </div>

                                <h3>{job.title || "Untitled position"}</h3>

                                <p className="recruiter-job-company">
                                    {job.company || "Company not specified"}
                                </p>

                                <div className="recruiter-job-meta">
                                    <span>
                                        <span aria-hidden="true">⌖</span>
                                        {job.location || "Location not specified"}
                                    </span>

                                    <span>
                                        <span aria-hidden="true">₹</span>
                                        {formatSalary(job.salary)}
                                    </span>
                                </div>

                                {job.description && (
                                    <p className="recruiter-job-description">
                                        {job.description.length > 160
                                            ? `${job.description.slice(0, 160)}…`
                                            : job.description}
                                    </p>
                                )}

                                <div className="recruiter-job-card-actions">
                                    <button
                                        type="button"
                                        className="recruiter-job-action-primary"
                                        onClick={() =>
                                            navigate(
                                                `/recruiter/jobs/${job.id}/applications`
                                            )
                                        }
                                    >
                                        View Applications
                                        <span aria-hidden="true">→</span>
                                    </button>

                                    <div className="recruiter-job-secondary-actions">
                                        <button
                                            type="button"
                                            className="recruiter-job-action-edit"
                                            onClick={() => handleEdit(job)}
                                            disabled={actionJobId === job.id}
                                        >
                                            Edit
                                        </button>

                                        {job.is_active && (
                                            <button
                                                type="button"
                                                className="recruiter-job-action-close"
                                                onClick={() =>
                                                    handleClose(job.id)
                                                }
                                                disabled={actionJobId === job.id}
                                            >
                                                {actionJobId === job.id
                                                    ? "Working..."
                                                    : "Close"}
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            className="recruiter-job-action-delete"
                                            onClick={() =>
                                                handleDelete(job.id)
                                            }
                                            disabled={actionJobId === job.id}
                                        >
                                            Delete
                                        </button>
                                    </div>
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