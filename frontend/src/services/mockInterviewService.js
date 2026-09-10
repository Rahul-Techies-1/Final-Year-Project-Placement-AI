import api from "../api/axios";


// ========================================================
// CREATE MOCK INTERVIEW
// ========================================================

export const createMockInterview = async ({
    interviewType,
    difficulty,
    totalQuestions
}) => {

    const response = await api.post(
        "/preparation/mock-interviews",
        {
            interview_type: interviewType,
            difficulty: difficulty,
            total_questions: totalQuestions
        }
    );

    return response.data;
};


// ========================================================
// GET STUDENT MOCK INTERVIEWS
// ========================================================

export const getMockInterviews = async () => {

    const response = await api.get(
        "/preparation/mock-interviews"
    );

    return response.data;
};


// ========================================================
// GET MOCK INTERVIEW DETAIL
// ========================================================

export const getMockInterviewById = async (
    interviewId
) => {

    const response = await api.get(
        `/preparation/mock-interviews/${interviewId}`
    );

    return response.data;
};


// ========================================================
// GET INTERVIEW QUESTIONS
// ========================================================

export const getMockInterviewQuestions = async (
    interviewId
) => {

    const response = await api.get(
        `/preparation/mock-interviews/${interviewId}/questions`
    );

    return response.data;
};


// ========================================================
// ADD INTERVIEW QUESTION
// ========================================================

export const addMockInterviewQuestion = async ({
    interviewId,
    question,
    questionType,
    questionOrder,
    expectedAnswer = null
}) => {

    const response = await api.post(
        `/preparation/mock-interviews/${interviewId}/questions`,
        {
            question,
            question_type: questionType,
            question_order: questionOrder,
            expected_answer: expectedAnswer
        }
    );

    return response.data;
};


// ========================================================
// SUBMIT INTERVIEW ANSWER
// ========================================================

export const submitMockInterviewAnswer = async ({
    interviewId,
    questionId,
    studentAnswer
}) => {

    const response = await api.post(
        `/preparation/mock-interviews/${interviewId}/questions/${questionId}/answer`,
        {
            student_answer: studentAnswer
        }
    );

    return response.data;
};


// ========================================================
// COMPLETE MOCK INTERVIEW
// ========================================================

export const completeMockInterview = async (
    interviewId
) => {

    const response = await api.post(
        `/preparation/mock-interviews/${interviewId}/complete`
    );

    return response.data;
};


// ========================================================
// DELETE MOCK INTERVIEW
// ========================================================

export const deleteMockInterview = async (
    interviewId
) => {

    await api.delete(
        `/preparation/mock-interviews/${interviewId}`
    );
};





// ============================================================
// GET MOCK INTERVIEW ANALYTICS
// ============================================================

export const getMockInterviewAnalytics = async () => {

    const response = await api.get(
        "/preparation/mock-interviews/analytics"
    );

    return response.data;
};