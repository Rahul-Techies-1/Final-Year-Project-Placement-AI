import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAvailableJobs } from "../../services/jobService";


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
        currentPage = page
    ) => {

        setLoading(true);
        setError("");

        try {

            const data = await getAvailableJobs({
                page: currentPage,
                limit,
                search: search.trim()
            });


            // ------------------------------------------------
            // Backend currently returns a list
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
                error.response?.data?.detail ||
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

        fetchJobs(1);

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);


    // ========================================================
    // SEARCH
    // ========================================================

    const handleSearch = (event) => {

        event.preventDefault();

        setPage(1);

        fetchJobs(1);
    };


    // ========================================================
    // CLEAR FILTERS
    // ========================================================

    const handleClearFilters = () => {

        setSearch("");

        setLocation("");

        setPage(1);

        // Fetch without filters
        fetchJobsWithoutFilters();
    };


    const fetchJobsWithoutFilters = async () => {

        setLoading(true);
        setError("");

        try {

            const data = await getAvailableJobs({
                page: 1,
                limit,
                search: "",
                location: ""
            });


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
                error.response?.data?.detail ||
                "Failed to load jobs. Please try again."
            );

        } finally {

            setLoading(false);
        }
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

        fetchJobs(nextPage);
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

        fetchJobs(previousPage);
    };


    // ========================================================
    // RETRY
    // ========================================================

    const handleRetry = () => {

        fetchJobs(page);
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
    // UI
    // ========================================================

    return (

        <div className="jobs-page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="jobs-header">

                <div>

                    <h1>
                        Available Jobs
                    </h1>

                    <p>
                        Explore placement opportunities and find
                        the right job for you.
                    </p>

                </div>

            </div>


            {/* ==================================================
                SEARCH / FILTER
            ================================================== */}

            <form
                className="jobs-search-form"
                onSubmit={handleSearch}
            >

                <div>

                    <label htmlFor="job-search">
                        Search
                    </label>

                    <input
                        id="job-search"
                        type="text"
                        placeholder="Search by job title or company..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        disabled={loading}
                    />

                </div>


                <div>

                    <label htmlFor="job-location">
                        Location
                    </label>

                    <input
                        id="job-location"
                        type="text"
                        placeholder="e.g. Delhi, Bangalore..."
                        value={location}
                        onChange={(event) =>
                            setLocation(event.target.value)
                        }
                        disabled={loading}
                    />

                </div>


                <div className="jobs-search-actions">

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        Search
                    </button>


                    <button
                        type="button"
                        onClick={handleClearFilters}
                        disabled={loading}
                    >
                        Clear
                    </button>

                </div>

            </form>


            {/* ==================================================
                LOADING
            ================================================== */}

            {loading && (

                <div className="jobs-loading">

                    <p>
                        Loading available jobs...
                    </p>

                </div>

            )}


            {/* ==================================================
                ERROR
            ================================================== */}

            {!loading && error && (

                <div className="jobs-error">

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={handleRetry}
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
                jobs.length === 0 && (

                    <div className="jobs-empty-state">

                        <h2>
                            No jobs found
                        </h2>

                        <p>
                            There are currently no available jobs
                            matching your search.
                        </p>

                        <button
                            type="button"
                            onClick={handleClearFilters}
                        >
                            View All Jobs
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

                        {jobs.map((job) => (

                            <article
                                className="job-card"
                                key={job.id}
                            >

                                <div className="job-card-content">


                                    {/* JOB TITLE */}

                                    <h2>
                                        {job.title}
                                    </h2>


                                    {/* COMPANY */}

                                    <p>
                                        <strong>
                                            Company:
                                        </strong>{" "}
                                        {job.company || "Not specified"}
                                    </p>


                                    {/* LOCATION */}

                                    <p>
                                        <strong>
                                            Location:
                                        </strong>{" "}
                                        {job.location || "Not specified"}
                                    </p>


                                    {/* DESCRIPTION */}

                                    {job.description && (

                                        <p>
                                            {job.description.length > 180
                                                ? `${job.description.substring(
                                                    0,
                                                    180
                                                )}...`
                                                : job.description}
                                        </p>

                                    )}


                                    {/* JOB TYPE */}

                                    {job.job_type && (

                                        <span>
                                            {job.job_type}
                                        </span>

                                    )}

                                </div>


                                {/* ACTION */}

                                <div className="job-card-actions">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewDetails(
                                                job.id
                                            )
                                        }
                                    >
                                        View Details
                                    </button>

                                </div>

                            </article>

                        ))}

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
                            Previous
                        </button>


                        <span>
                            Page {page}
                        </span>


                        <button
                            type="button"
                            onClick={handleNextPage}
                            disabled={
                                !hasMore ||
                                loading
                            }
                        >
                            Next
                        </button>

                    </div>

                )}

        </div>
    );
}


export default Jobs;