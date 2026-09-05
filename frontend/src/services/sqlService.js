import api from "../api/axios";


// ========================================================
// GET SQL OVERVIEW
// ========================================================

export const getSQLOverview = async () => {

    const response = await api.get(
        "/preparation/sql/overview"
    );

    return response.data;
};


// ========================================================
// GET SQL TOPICS
// ========================================================

export const getSQLTopics = async () => {

    const response = await api.get(
        "/preparation/sql/topics"
    );

    return response.data;
};


// ========================================================
// GET SQL PROBLEMS
// ========================================================

export const getSQLProblems = async ({
    topicId = null
} = {}) => {

    const response = await api.get(
        "/preparation/sql/problems",
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
// GET SINGLE SQL PROBLEM
// ========================================================

export const getSQLProblemById = async (
    problemId
) => {

    const response = await api.get(
        `/preparation/sql/problems/${problemId}`
    );

    return response.data;
};


// ========================================================
// UPDATE SQL PROGRESS
// ========================================================

export const updateSQLProgress = async (
    problemId,
    completed
) => {

    const response = await api.put(
        `/preparation/sql/problems/${problemId}/progress`,
        {
            completed
        }
    );

    return response.data;
};


// ========================================================
// MARK SQL PROBLEM COMPLETE
// ========================================================

export const markSQLProblemCompleted = async (
    problemId
) => {

    const response = await api.post(
        `/preparation/sql/problems/${problemId}/complete`
    );

    return response.data;
};


// ========================================================
// MARK SQL PROBLEM INCOMPLETE
// ========================================================

export const markSQLProblemIncomplete = async (
    problemId
) => {

    const response = await api.post(
        `/preparation/sql/problems/${problemId}/incomplete`
    );

    return response.data;
};