import api from "../api/axios";

const aiMentorService = {

    // ========================================================
    // UPLOAD DOCUMENT
    // ========================================================

    uploadDocument: async (file) => {

        const formData = new FormData();

        formData.append(
            "file",
            file
        );

        const response = await api.post(
            "/preparation/ai-mentor/upload",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

        return response.data;
    },


    // ========================================================
    // ASK AI MENTOR
    // ========================================================

    askQuestion: async (
        question,
        chatHistory = [],
        sessionId = null
    ) => {

        const response = await api.post(
            "/preparation/ai-mentor/ask",
            {
                question: question,
                session_id: sessionId,
                chat_history: chatHistory
            }
        );

        return response.data;
    },


    // ========================================================
    // GET DOCUMENTS
    // ========================================================

    getDocuments: async () => {

        const response = await api.get(
            "/preparation/ai-mentor/documents"
        );

        return response.data;
    },


    // ========================================================
    // DELETE DOCUMENT
    // ========================================================

    deleteDocument: async (
        documentId
    ) => {

        const response = await api.delete(
            `/preparation/ai-mentor/documents/${documentId}`
        );

        return response.data;
    },


    // ========================================================
    // CREATE CHAT SESSION
    // ========================================================

    createChatSession: async (
        title = "New AI Mentor Chat"
    ) => {

        const response = await api.post(
            "/preparation/ai-mentor/sessions",
            {
                title: title
            }
        );

        return response.data;
    },


    // ========================================================
    // GET CHAT SESSIONS
    // ========================================================

    getChatSessions: async () => {

        const response = await api.get(
            "/preparation/ai-mentor/sessions"
        );

        return response.data;
    },


    // ========================================================
    // GET CHAT SESSION
    // ========================================================

    getChatSession: async (
        sessionId
    ) => {

        const response = await api.get(
            `/preparation/ai-mentor/sessions/${sessionId}`
        );

        return response.data;
    },


    // ========================================================
    // DELETE CHAT SESSION
    // ========================================================

    deleteChatSession: async (
        sessionId
    ) => {

        const response = await api.delete(
            `/preparation/ai-mentor/sessions/${sessionId}`
        );

        return response.data;
    }
};

export default aiMentorService;