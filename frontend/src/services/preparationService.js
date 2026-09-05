import api from "../api/axios";


// ========================================================
// DSA OVERVIEW
// ========================================================

export const getDSAOverview = async () => {

    const response = await api.get(
        "/preparation/dsa/overview"
    );

    return response.data;
};


// ========================================================
// GET ALL DSA TOPICS
// ========================================================

export const getDSATopics = async () => {

    const response = await api.get(
        "/preparation/dsa/topics"
    );

    return response.data;
};


// ========================================================
// GET DSA PROBLEMS
// ========================================================

export const getDSAProblems = async ({
    topicId = null
} = {}) => {

    const response = await api.get(
        "/preparation/dsa/problems",
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
// GET SINGLE DSA PROBLEM
// ========================================================

export const getDSAProblem = async (
    problemId
) => {

    const response = await api.get(
        `/preparation/dsa/problems/${problemId}`
    );

    return response.data;
};


// ========================================================
// UPDATE DSA PROGRESS
// ========================================================

export const updateDSAProgress = async (
    problemId,
    completed
) => {

    const response = await api.put(
        `/preparation/dsa/problems/${problemId}/progress`,
        {
            completed
        }
    );

    return response.data;
};


// ========================================================
// MARK PROBLEM COMPLETE
// ========================================================

export const markDSAProblemComplete = async (
    problemId
) => {

    const response = await api.post(
        `/preparation/dsa/problems/${problemId}/complete`
    );

    return response.data;
};


// ========================================================
// MARK PROBLEM INCOMPLETE
// ========================================================

export const markDSAProblemIncomplete = async (
    problemId
) => {

    const response = await api.post(
        `/preparation/dsa/problems/${problemId}/incomplete`
    );

    return response.data;
};