import api from "../api/axios";


// ========================================================
// STUDENT - GET MY INTERVIEWS
// ========================================================

export const getMyInterviews = async () => {

    const response = await api.get(
        "/interviews/my"
    );

    return response.data;
};


// ========================================================
// GET SINGLE INTERVIEW
// ========================================================

export const getInterviewById = async (
    interviewId
) => {

    const response = await api.get(
        `/interviews/${interviewId}`
    );

    return response.data;
};


// ========================================================
// RECRUITER - GET ALL INTERVIEWS
// ========================================================

export const getInterviews = async ({
    page = 1,
    limit = 10,
    status = "",
    interviewType = ""
} = {}) => {

    const response = await api.get(
        "/interviews",
        {
            params: {
                page,
                limit,
                status: status || undefined,
                interview_type:
                    interviewType || undefined
            }
        }
    );

    return response.data;
};


// ========================================================
// RECRUITER - CREATE INTERVIEW
// ========================================================

export const createInterview = async ({
    applicationId,
    scheduledAt,
    interviewType,
    meetingLink = null
}) => {

    const response = await api.post(
        "/interviews",
        {
            application_id: applicationId,
            scheduled_at: scheduledAt,
            interview_type: interviewType,
            meeting_link: meetingLink
        }
    );

    return response.data;
};


// ========================================================
// RECRUITER - UPDATE INTERVIEW STATUS
// ========================================================

export const updateInterviewStatus = async (
    interviewId,
    status
) => {

    const response = await api.patch(
        `/interviews/${interviewId}/status`,
        {
            status
        }
    );

    return response.data;
};


// ========================================================
// RECRUITER - DELETE INTERVIEW
// ========================================================

export const deleteInterview = async (
    interviewId
) => {

    const response = await api.delete(
        `/interviews/${interviewId}`
    );

    return response.data;
};