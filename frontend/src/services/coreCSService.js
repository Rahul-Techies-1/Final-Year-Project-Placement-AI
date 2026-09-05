import api from "../api/axios";


// ========================================================
// GET CORE CS OVERVIEW
// ========================================================

export const getCoreCSOverview = async () => {

    const response = await api.get(
        "/preparation/core-cs/overview"
    );

    return response.data;
};


// ========================================================
// GET CORE CS TOPICS
// ========================================================

export const getCoreCSTopics = async () => {

    const response = await api.get(
        "/preparation/core-cs/topics"
    );

    return response.data;
};


// ========================================================
// GET CORE CS PROBLEMS
// ========================================================

export const getCoreCSProblems = async ({
    topicId = null
} = {}) => {

    const response = await api.get(
        "/preparation/core-cs/problems",
        {
            params: {
                topic_id:
                    topicId || undefined
            }
        }
    );

    return response.data;
};


// ========================================================
// GET SINGLE CORE CS PROBLEM
// ========================================================

export const getCoreCSProblemById = async (
    problemId
) => {

    const response = await api.get(
        `/preparation/core-cs/problems/${problemId}`
    );

    return response.data;
};


// ========================================================
// UPDATE CORE CS PROGRESS
// ========================================================

export const updateCoreCSProgress = async (
    problemId,
    completed
) => {

    const response = await api.put(
        `/preparation/core-cs/problems/${problemId}/progress`,
        {
            completed
        }
    );

    return response.data;
};


// ========================================================
// MARK CORE CS PROBLEM COMPLETE
// ========================================================

export const markCoreCSProblemCompleted = async (
    problemId
) => {

    const response = await api.post(
        `/preparation/core-cs/problems/${problemId}/complete`
    );

    return response.data;
};


// ========================================================
// MARK CORE CS PROBLEM INCOMPLETE
// ========================================================

export const markCoreCSProblemIncomplete = async (
    problemId
) => {

    const response = await api.post(
        `/preparation/core-cs/problems/${problemId}/incomplete`
    );

    return response.data;
};