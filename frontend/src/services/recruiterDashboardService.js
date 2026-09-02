import api from "../api/axios";


// ========================================================
// GET RECRUITER DASHBOARD
// ========================================================

export const getRecruiterDashboard = async () => {

    const response = await api.get(
        "/recruiter/dashboard"
    );

    return response.data;
};