import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAvailableJobs } from "../../services/jobService";

import "./Jobs.css";


function Jobs() {

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [jobs, setJobs] = useState([]);

    const [search, setSearch] = useState("");

    const [location, setLocation] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [page, setPage] = useState(1);

    const [hasMore, setHasMore] = useState(false);


    const limit = 10;


    // ========================================================
    // FETCH AVAILABLE JOBS
    // ========================================================

    const fetchJobs = async (
        currentPage = 1,
        searchValue = search,
        locationValue = location
    ) => {

        setLoading(true);
        setError("");

        try {

            const data = await getAvailableJobs({

                page: currentPage,

                limit,

                search: searchValue.trim(),

                location: locationValue.trim()

            });


            // ------------------------------------------------
            // BACKEND MAY RETURN ARRAY
            // ------------------------------------------------

            if (Array.isArray(data)) {

                setJobs(data);

                setHasMore(
                    data.length === limit
                );

            } else {

                setJobs(
                    data?.items ||
                    data?.jobs ||
                    []
                );

                setHasMore(
                    data?.has_more ??
                    false
                );
            }

        } catch (error) {

            console.error(
                "Failed to fetch available jobs:",
                error
            );

            setJobs([]);

            setError(
                error?.response?.data?.detail ||
                "Failed to load available jobs. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        fetchJobs(1, "", "");

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);


    // ========================================================
    // SEARCH
    // ========================================================

    const handleSearch = (event) => {

        event.preventDefault();

        setPage(1);

        fetchJobs(
            1,
            search,
            location
        );
    };


    // ========================================================
    // CLEAR FILTERS
    // ========================================================

    const handleClearFilters = () => {

        setSearch("");

        setLocation("");

        setPage(1);

        fetchJobs(
            1,
            "",
            ""
        );
    };


    // ========================================================
    // NEXT PAGE
    // ========================================================

    const handleNextPage = () => {

        if (!hasMore || loading) {
            return;
        }

        const nextPage = page + 1;

        setPage(nextPage);

        fetchJobs(
            nextPage,
            search,
            location
        );
    };


    // ========================================================
    // PREVIOUS PAGE
    // ========================================================

    const handlePreviousPage = () => {

        if (page <= 1 || loading) {
            return;
        }

        const previousPage = page - 1;

        setPage(previousPage);

        fetchJobs(
            previousPage,
            search,
            location
        );
    };


    // ========================================================
    // RETRY
    // ========================================================

    const handleRetry = () => {

        fetchJobs(
            page,
            search,
            location
        );
    };


    // ========================================================
    // VIEW JOB DETAILS
    // ========================================================

    const handleViewDetails = (jobId) => {

        navigate(
            `/student/jobs/${jobId}`
        );
    };


    // ========================================================
    // FORMAT JOB TYPE
    // ========================================================

    const formatJobType = (jobType) => {

        if (!jobType) {
            return "Full Time";
        }

        return jobType
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase()
            );
    };


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (date) => {

        if (!date) {
            return null;
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <div className="jobs-page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <header className="jobs-page-header">

                <div>

                    <div className="jobs-eyebrow">

                        <span className="jobs-eyebrow-icon">
                            💼
                        </span>

                        CAREER OPPORTUNITIES

                    </div>


                    <h1>
                        Find your next
                        <span>
                            opportunity.
                        </span>
                    </h1>


                    <p>
                        Explore placement opportunities from
                        companies hiring talented students.
                    </p>

                </div>


                <div className="jobs-header-badge">

                    <span className="jobs-header-badge-icon">
                        ✦
                    </span>

                    <div>

                        <strong>
                            Placement Ready
                        </strong>

                        <span>
                            Discover opportunities
                        </span>

                    </div>

                </div>

            </header>


            {/* ==================================================
                SEARCH PANEL
            ================================================== */}

            <section className="jobs-search-panel">

                <div className="jobs-search-heading">

                    <div className="jobs-search-heading-icon">
                        🔎
                    </div>

                    <div>

                        <h2>
                            Search jobs
                        </h2>

                        <p>
                            Find opportunities that match your
                            skills and preferred location.
                        </p>

                    </div>

                </div>


                <form
                    className="jobs-search-form"
                    onSubmit={handleSearch}
                >


                    {/* SEARCH */}


                    <div className="jobs-field">

                        <label htmlFor="job-search">
                            Job title or company
                        </label>

                        <div className="jobs-input-wrapper">

                            <span>
                                🔍
                            </span>

                            <input
                                id="job-search"
                                type="text"
                                placeholder="e.g. AI Engineer, TCS..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* LOCATION */}


                    <div className="jobs-field">

                        <label htmlFor="job-location">
                            Location
                        </label>

                        <div className="jobs-input-wrapper">

                            <span>
                                📍
                            </span>

                            <input
                                id="job-location"
                                type="text"
                                placeholder="e.g. Delhi, Bangalore..."
                                value={location}
                                onChange={(event) =>
                                    setLocation(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* ACTIONS */}


                    <div className="jobs-search-actions">

                        <button
                            type="submit"
                            className="jobs-search-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Searching..."
                                : "Search Jobs"
                            }

                            {!loading && (
                                <span>
                                    →
                                </span>
                            )}

                        </button>


                        <button
                            type="button"
                            className="jobs-clear-button"
                            onClick={handleClearFilters}
                            disabled={loading}
                        >
                            Clear
                        </button>

                    </div>

                </form>

            </section>


            {/* ==================================================
                ERROR
            ================================================== */}

            {!loading && error && (

                <div className="jobs-error">

                    <div className="jobs-error-icon">
                        !
                    </div>

                    <div>

                        <strong>
                            Unable to load jobs
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleRetry}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* ==================================================
                RESULTS HEADER
            ================================================== */}

            {!error && (

                <div className="jobs-results-header">

                    <div>

                        <h2>
                            Available Jobs
                        </h2>

                        <p>
                            {loading
                                ? "Finding the best opportunities for you..."
                                : `${jobs.length} opportunit${jobs.length === 1 ? "y" : "ies"} available`
                            }
                        </p>

                    </div>


                    {!loading && jobs.length > 0 && (

                        <div className="jobs-page-indicator">

                            Page {page}

                        </div>

                    )}

                </div>

            )}


            {/* ==================================================
                LOADING
            ================================================== */}

            {loading && (

                <div className="jobs-loading-grid">

                    {[1, 2, 3].map(
                        (item) => (

                            <div
                                className="job-skeleton-card"
                                key={item}
                            >

                                <div className="job-skeleton-header">

                                    <div className="job-skeleton-logo" />

                                    <div className="job-skeleton-lines">

                                        <div />
                                        <div />

                                    </div>

                                </div>


                                <div className="job-skeleton-title" />

                                <div className="job-skeleton-description" />

                                <div className="job-skeleton-description short" />

                                <div className="job-skeleton-footer" />

                            </div>

                        )
                    )}

                </div>

            )}


            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!loading &&
                !error &&
                jobs.length === 0 && (

                    <div className="jobs-empty-state">

                        <div className="jobs-empty-icon">
                            🔎
                        </div>

                        <h2>
                            No jobs found
                        </h2>

                        <p>
                            We couldn't find any opportunities
                            matching your search.
                        </p>

                        <button
                            type="button"
                            onClick={handleClearFilters}
                        >
                            View All Jobs
                            <span>
                                →
                            </span>
                        </button>

                    </div>

                )}


            {/* ==================================================
                JOB LIST
            ================================================== */}

            {!loading &&
                !error &&
                jobs.length > 0 && (

                    <div className="jobs-list">

                        {jobs.map(
                            (job) => (

                                <article
                                    className="job-card"
                                    key={job.id}
                                >


                                    {/* JOB CARD TOP */}


                                    <div className="job-card-top">

                                        <div className="job-company-logo">

                                            {job.company
                                                ?.charAt(0)
                                                ?.toUpperCase() || "C"
                                            }

                                        </div>


                                        <div className="job-card-heading">

                                            <h3>
                                                {job.title}
                                            </h3>

                                            <p>
                                                {job.company ||
                                                    "Company not specified"
                                                }
                                            </p>

                                        </div>


                                        {job.job_type && (

                                            <span className="job-type-badge">

                                                {formatJobType(
                                                    job.job_type
                                                )}

                                            </span>

                                        )}

                                    </div>


                                    {/* JOB META */}


                                    <div className="job-meta">

                                        <span>
                                            <span className="job-meta-icon">
                                                📍
                                            </span>

                                            {job.location ||
                                                "Location not specified"
                                            }

                                        </span>


                                        {job.experience && (

                                            <span>
                                                <span className="job-meta-icon">
                                                    ◉
                                                </span>

                                                {job.experience}

                                            </span>

                                        )}


                                        {job.salary && (

                                            <span>
                                                <span className="job-meta-icon">
                                                    ₹
                                                </span>

                                                {job.salary}

                                            </span>

                                        )}

                                    </div>


                                    {/* DESCRIPTION */}


                                    {job.description && (

                                        <p className="job-description">

                                            {job.description.length > 180
                                                ? `${job.description.substring(
                                                    0,
                                                    180
                                                )}...`
                                                : job.description
                                            }

                                        </p>

                                    )}


                                    {/* SKILLS */}


                                    {Array.isArray(job.skills) &&
                                        job.skills.length > 0 && (

                                            <div className="job-skills">

                                                {job.skills
                                                    .slice(0, 4)
                                                    .map(
                                                        (skill) => (

                                                            <span
                                                                key={skill}
                                                            >
                                                                {skill}
                                                            </span>

                                                        )
                                                    )}

                                                {job.skills.length > 4 && (

                                                    <span>
                                                        +{job.skills.length - 4}
                                                    </span>

                                                )}

                                            </div>

                                        )}


                                    {/* CARD FOOTER */}


                                    <div className="job-card-footer">

                                        <div>

                                            {job.created_at && (

                                                <span className="job-posted-date">

                                                    Posted{" "}
                                                    {formatDate(
                                                        job.created_at
                                                    )}

                                                </span>

                                            )}

                                        </div>


                                        <button
                                            type="button"
                                            className="job-details-button"
                                            onClick={() =>
                                                handleViewDetails(
                                                    job.id
                                                )
                                            }
                                        >

                                            View Details

                                            <span>
                                                →
                                            </span>

                                        </button>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}


            {/* ==================================================
                PAGINATION
            ================================================== */}

            {!loading &&
                !error &&
                jobs.length > 0 && (

                    <div className="jobs-pagination">

                        <button
                            type="button"
                            onClick={handlePreviousPage}
                            disabled={
                                page === 1 ||
                                loading
                            }
                        >

                            ←
                            <span>
                                Previous
                            </span>

                        </button>


                        <div className="jobs-pagination-current">

                            <span>
                                Page
                            </span>

                            <strong>
                                {page}
                            </strong>

                        </div>


                        <button
                            type="button"
                            onClick={handleNextPage}
                            disabled={
                                !hasMore ||
                                loading
                            }
                        >

                            <span>
                                Next
                            </span>

                            →

                        </button>

                    </div>

                )}

        </div>
    );
}


export default Jobs;