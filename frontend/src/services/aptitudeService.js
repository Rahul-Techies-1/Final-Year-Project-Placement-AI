import api from "../api/axios";


// ========================================================
// GET APTITUDE OVERVIEW
// ========================================================

export const getAptitudeOverview = async () => {

    const response = await api.get(
        "/preparation/aptitude/overview"
    );

    return response.data;
};


// ========================================================
// GET APTITUDE TOPICS
// ========================================================

export const getAptitudeTopics = async () => {

    const response = await api.get(
        "/preparation/aptitude/topics"
    );

    return response.data;
};


// ========================================================
// GET APTITUDE QUESTIONS
// ========================================================

export const getAptitudeQuestions = async ({
    topicId = null
} = {}) => {

    const response = await api.get(
        "/preparation/aptitude/questions",
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
// GET SINGLE APTITUDE QUESTION
// ========================================================

export const getAptitudeQuestionById = async (
    questionId
) => {

    const response = await api.get(
        `/preparation/aptitude/questions/${questionId}`
    );

    return response.data;
};


// ========================================================
// SUBMIT APTITUDE ANSWER
// ========================================================

export const submitAptitudeAnswer = async (
    questionId,
    answer
) => {

    const response = await api.post(
        `/preparation/aptitude/questions/${questionId}/answer`,
        {
            answer
        }
    );

    return response.data;
};


// ========================================================
// UPDATE APTITUDE PROGRESS
// ========================================================

export const updateAptitudeProgress = async (
    questionId,
    completed
) => {

    const response = await api.put(
        `/preparation/aptitude/questions/${questionId}/progress`,
        {
            completed
        }
    );

    return response.data;
};


// ========================================================
// MARK APTITUDE QUESTION COMPLETE
// ========================================================

export const markAptitudeQuestionCompleted = async (
    questionId
) => {

    const response = await api.post(
        `/preparation/aptitude/questions/${questionId}/complete`
    );

    return response.data;
};


// ========================================================
// MARK APTITUDE QUESTION INCOMPLETE
// ========================================================

export const markAptitudeQuestionIncomplete = async (
    questionId
) => {

    const response = await api.post(
        `/preparation/aptitude/questions/${questionId}/incomplete`
    );

    return response.data;
};