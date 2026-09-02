import api from "../api/axios";


// ========================================================
// GET STUDENT DASHBOARD STATISTICS
// ========================================================

export const getStudentDashboard = async () => {

    const response = await api.get(
        "/student/dashboard"
    );

    return response.data;
};


// ========================================================
// GET RECENT APPLICATIONS
// ========================================================

export const getRecentApplications = async (
    page = 1,
    limit = 5
) => {

    const response = await api.get(
        "/student/dashboard/recent-applications",
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
// GET UPCOMING INTERVIEWS
// ========================================================

export const getUpcomingInterviews = async (
    limit = 5
) => {

    const response = await api.get(
        "/student/dashboard/upcoming-interviews",
        {
            params: {
                limit
            }
        }
    );

    return response.data;
};


// ========================================================
// GET COMPLETE DASHBOARD OVERVIEW
// ========================================================

export const getDashboardOverview = async () => {

    const response = await api.get(
        "/student/dashboard/overview"
    );

    return response.data;
};