import api from "../api/axios";


// ========================================================
// GET MY APPLICATIONS
// ========================================================

export const getMyApplications = async () => {

    const response = await api.get(
        "/applications/my"
    );

    return response.data;
};


// ========================================================
// GET APPLICATION DETAILS
// ========================================================

export const getApplicationById = async (
    applicationId
) => {

    const response = await api.get(
        `/applications/${applicationId}`
    );

    return response.data;
};


// ========================================================
// WITHDRAW APPLICATION
// ========================================================

export const withdrawApplication = async (
    applicationId
) => {

    const response = await api.delete(
        `/applications/${applicationId}`
    );

    return response.data;
};
// ========================================================
// RECRUITER - GET APPLICATIONS FOR JOB
// ========================================================

export const getJobApplications = async ({
    jobId,
    page = 1,
    limit = 10,
    status = "",
    search = ""
}) => {

    const response = await api.get(
        `/applications/job/${jobId}`,
        {
            params: {
                page,
                limit,
                application_status:
                    status || undefined,
                search:
                    search || undefined
            }
        }
    );

    return response.data;
};

// ========================================================
// UPDATE APPLICATION STATUS - RECRUITER
// ========================================================

export const updateApplicationStatus = async (
    applicationId,
    status
) => {

    const response = await api.put(
        `/applications/${applicationId}/status`,
        {
            status
        }
    );

    return response.data;
};