import api from "../api/axios";


// ========================================================
// GET ALL JOBS
// ========================================================

export const getJobs = async ({
    page = 1,
    limit = 10,
    search = "",
    location = ""
} = {}) => {

    const response = await api.get(
        "/jobs",
        {
            params: {
                page,
                limit,
                search: search || undefined,
                location: location || undefined
            }
        }
    );

    return response.data;
};


// ========================================================
// GET AVAILABLE JOBS - STUDENT
// ========================================================

export const getAvailableJobs = async ({
    page = 1,
    limit = 10,
    search = ""
} = {}) => {

    const response = await api.get(
        "/jobs/available",
        {
            params: {
                page,
                limit,
                search: search || undefined
            }
        }
    );

    return response.data;
};


// ========================================================
// GET SINGLE JOB
// ========================================================

export const getJobById = async (jobId) => {

    const response = await api.get(
        `/jobs/${jobId}`
    );

    return response.data;
};


// ========================================================
// APPLY FOR JOB
// ========================================================

export const applyForJob = async (jobId) => {

    const response = await api.post(
        "/applications",
        {
            job_id: jobId
        }
    );

    return response.data;
};


// ========================================================
// RECRUITER - GET MY JOBS
// ========================================================

export const getRecruiterJobs = async ({
    page = 1,
    limit = 10
} = {}) => {

    const response = await api.get(
        "/jobs/my",
        {
            params: {
                page,
                limit
            }
        }
    );

    return response.data;
};


// ========================================================
// RECRUITER - CREATE JOB
// ========================================================

export const createJob = async (jobData) => {

    const response = await api.post(
        "/jobs",
        jobData
    );

    return response.data;
};


// ========================================================
// RECRUITER - UPDATE JOB
// ========================================================

export const updateJob = async (
    jobId,
    jobData
) => {

    const response = await api.put(
        `/jobs/${jobId}`,
        jobData
    );

    return response.data;
};


// ========================================================
// RECRUITER - DELETE JOB
// ========================================================

export const deleteJob = async (
    jobId
) => {

    const response = await api.delete(
        `/jobs/${jobId}`
    );

    return response.data;
};


// ========================================================
// RECRUITER - CLOSE JOB
// ========================================================

export const closeJob = async (
    jobId
) => {

    const response = await api.patch(
        `/jobs/${jobId}/close`
    );

    return response.data;
};