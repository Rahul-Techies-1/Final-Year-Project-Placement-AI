import {
    useEffect,
    useState
} from "react";

import aiMentorService
    from "../../../services/aiMentorService";


function AIMentor() {

    // ========================================================
    // PDF UPLOAD STATE
    // ========================================================

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [uploading, setUploading] =
        useState(false);

    const [uploadResult, setUploadResult] =
        useState(null);


    // ========================================================
    // DOCUMENT LIBRARY STATE
    // ========================================================

    const [documents, setDocuments] =
        useState([]);

    const [loadingDocuments, setLoadingDocuments] =
        useState(true);

    const [deletingDocumentId, setDeletingDocumentId] =
        useState(null);


    // ========================================================
    // QUESTION STATE
    // ========================================================

    const [question, setQuestion] =
        useState("");

    const [asking, setAsking] =
        useState(false);


    // ========================================================
    // CHAT HISTORY STATE
    // ========================================================

    const [messages, setMessages] =
        useState([]);

    const [sessionId, setSessionId] =
        useState(null);

    const [chatSessions, setChatSessions] =
        useState([]);

    const [loadingSessions, setLoadingSessions] =
        useState(false);

    const [deletingSessionId, setDeletingSessionId] =
        useState(null);


    // ========================================================
    // ERROR STATE
    // ========================================================

    const [error, setError] =
        useState("");


    // ========================================================
    // LOAD DOCUMENTS
    // ========================================================

    const loadDocuments = async () => {

        try {

            setLoadingDocuments(true);

            const result =
                await aiMentorService.getDocuments();

            setDocuments(
                result.documents || []
            );

        } catch (error) {

            console.error(
                "AI Mentor documents error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to load your study documents."
            );

        } finally {

            setLoadingDocuments(false);

        }
    };


    // ========================================================
    // LOAD CHAT SESSIONS
    // ========================================================

    const loadChatSessions = async () => {

        try {

            setLoadingSessions(true);

            const result =
                await aiMentorService.getChatSessions();

            setChatSessions(
                result.sessions || []
            );

        } catch (error) {

            console.error(
                "AI Mentor chat sessions error:",
                error
            );

        } finally {

            setLoadingSessions(false);

        }
    };


    // ========================================================
    // LOAD DATA WHEN PAGE OPENS
    // ========================================================

    useEffect(() => {

        loadDocuments();

        loadChatSessions();

    }, []);


    // ========================================================
    // FILE SELECTION
    // ========================================================

    const handleFileChange = (event) => {

        const file =
            event.target.files[0];

        setError("");

        setUploadResult(null);


        if (!file) {

            setSelectedFile(null);

            return;
        }


        // ----------------------------------------------------
        // Validate PDF
        // ----------------------------------------------------

        if (
            file.type !== "application/pdf"
        ) {

            setError(
                "Please select a PDF file."
            );

            setSelectedFile(null);

            return;
        }


        // ----------------------------------------------------
        // File size validation
        // ----------------------------------------------------

        const maxSize =
            10 * 1024 * 1024;

        if (file.size > maxSize) {

            setError(
                "PDF size must be 10 MB or less."
            );

            setSelectedFile(null);

            return;
        }


        setSelectedFile(file);

    };


    // ========================================================
    // UPLOAD PDF
    // ========================================================

    const handleUpload = async () => {

        if (!selectedFile) {

            setError(
                "Please select a PDF file first."
            );

            return;
        }


        try {

            setUploading(true);

            setError("");

            setUploadResult(null);


            const result =
                await aiMentorService.uploadDocument(
                    selectedFile
                );


            setUploadResult(result);


            // ------------------------------------------------
            // Refresh document library
            // ------------------------------------------------

            await loadDocuments();


            // ------------------------------------------------
            // Start fresh conversation
            // ------------------------------------------------

            setMessages([]);

            setSessionId(null);

            setQuestion("");

            setSelectedFile(null);


        } catch (error) {

            console.error(
                "AI Mentor upload error:",
                error
            );


            setError(
                error.response?.data?.detail ||
                "Failed to upload PDF. Please try again."
            );


        } finally {

            setUploading(false);

        }

    };


    // ========================================================
    // DELETE DOCUMENT
    // ========================================================

    const handleDeleteDocument = async (
        documentId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this study document?"
            );


        if (!confirmed) {

            return;
        }


        try {

            setDeletingDocumentId(
                documentId
            );

            setError("");


            await aiMentorService.deleteDocument(
                documentId
            );


            // ------------------------------------------------
            // Remove document from UI immediately
            // ------------------------------------------------

            setDocuments(
                (previousDocuments) =>
                    previousDocuments.filter(
                        (document) =>
                            document.document_id !==
                            documentId
                    )
            );


            // ------------------------------------------------
            // Clear upload success
            // ------------------------------------------------

            setUploadResult(null);


            // ------------------------------------------------
            // Start fresh conversation
            // ------------------------------------------------

            setMessages([]);

            setSessionId(null);

            setQuestion("");


        } catch (error) {

            console.error(
                "AI Mentor document deletion error:",
                error
            );


            setError(
                error.response?.data?.detail ||
                "Failed to delete document. Please try again."
            );

        } finally {

            setDeletingDocumentId(null);

        }

    };


    // ========================================================
    // ASK QUESTION
    // ========================================================

    const handleAskQuestion = async () => {

        const trimmedQuestion =
            question.trim();


        if (!trimmedQuestion) {

            setError(
                "Please enter a question."
            );

            return;
        }


        try {

            setAsking(true);

            setError("");


            // ------------------------------------------------
            // Build chat history BEFORE adding new question
            // ------------------------------------------------

            const chatHistory =
                messages.map(
                    (message) => ({

                        role:
                            message.type === "user"
                                ? "user"
                                : "assistant",

                        content:
                            message.content

                    })
                );


            // ------------------------------------------------
            // Add user message immediately
            // ------------------------------------------------

            setMessages(
                (previousMessages) => [

                    ...previousMessages,

                    {
                        type: "user",
                        content: trimmedQuestion
                    }

                ]
            );


            // ------------------------------------------------
            // Clear input
            // ------------------------------------------------

            setQuestion("");


            // ------------------------------------------------
            // Ask backend
            // ------------------------------------------------

            const result =
                await aiMentorService.askQuestion(
                    trimmedQuestion,
                    chatHistory,
                    sessionId
                );


            // ------------------------------------------------
            // Store returned session ID
            // ------------------------------------------------

            setSessionId(
                result.session_id
            );


            // ------------------------------------------------
            // Refresh chat sessions
            // ------------------------------------------------

            await loadChatSessions();


            // ------------------------------------------------
            // Add AI response
            // ------------------------------------------------

            setMessages(
                (previousMessages) => [

                    ...previousMessages,

                    {
                        type: "assistant",
                        content: result.answer,
                        sources:
                            result.sources || []
                    }

                ]
            );


        } catch (error) {

            console.error(
                "AI Mentor question error:",
                error
            );


            // ------------------------------------------------
            // Remove optimistic user message
            // ------------------------------------------------

            setMessages(
                (previousMessages) =>
                    previousMessages.slice(
                        0,
                        -1
                    )
            );


            setError(
                error.response?.data?.detail ||
                "Failed to get an answer. Please try again."
            );


        } finally {

            setAsking(false);

        }

    };


    // ========================================================
    // CREATE NEW CHAT
    // ========================================================

    const handleNewChat = () => {

        setSessionId(null);

        setMessages([]);

        setQuestion("");

        setError("");

        setUploadResult(null);

    };


    // ========================================================
    // OPEN PREVIOUS CHAT
    // ========================================================

    const handleOpenChat = async (
        selectedSessionId
    ) => {

        if (
            asking ||
            selectedSessionId === sessionId
        ) {

            if (
                selectedSessionId === sessionId
            ) {

                return;

            }

        }


        try {

            setError("");

            const result =
                await aiMentorService.getChatSession(
                    selectedSessionId
                );


            // ------------------------------------------------
            // Store active session
            // ------------------------------------------------

            setSessionId(
                result.session_id
            );


            // ------------------------------------------------
            // Convert backend messages
            // ------------------------------------------------

            setMessages(
                (result.messages || []).map(
                    (message) => ({

                        type:
                            message.role === "user"
                                ? "user"
                                : "assistant",

                        content:
                            message.content,

                        sources: []

                    })
                )
            );


            setQuestion("");

            setUploadResult(null);


        } catch (error) {

            console.error(
                "Failed to open AI Mentor chat:",
                error
            );


            setError(
                error.response?.data?.detail ||
                "Unable to open this chat."
            );

        }

    };


    // ========================================================
    // DELETE CHAT SESSION
    // ========================================================

    const handleDeleteChat = async (
        selectedSessionId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this chat?"
            );


        if (!confirmed) {

            return;
        }


        try {

            setDeletingSessionId(
                selectedSessionId
            );

            setError("");


            await aiMentorService.deleteChatSession(
                selectedSessionId
            );


            // ------------------------------------------------
            // Remove deleted chat from UI
            // ------------------------------------------------

            setChatSessions(
                (previousSessions) =>
                    previousSessions.filter(
                        (session) =>
                            session.session_id !==
                            selectedSessionId
                    )
            );


            // ------------------------------------------------
            // If active chat was deleted,
            // start a new chat
            // ------------------------------------------------

            if (
                sessionId ===
                selectedSessionId
            ) {

                handleNewChat();

            }


        } catch (error) {

            console.error(
                "Failed to delete AI Mentor chat:",
                error
            );


            setError(
                error.response?.data?.detail ||
                "Unable to delete this chat."
            );

        } finally {

            setDeletingSessionId(
                null
            );

        }

    };


    // ========================================================
    // HANDLE ENTER KEY
    // ========================================================

    const handleQuestionKeyDown = (
        event
    ) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();


            if (!asking) {

                handleAskQuestion();

            }

        }

    };


    // ========================================================
    // CLEAR CURRENT CHAT
    // ========================================================

    const handleClearChat = () => {

        setMessages([]);

        setQuestion("");

        setError("");

        setSessionId(null);

    };


    // ========================================================
    // PAGE
    // ========================================================

    return (

        <div className="ai-mentor-page">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        AI Mentor
                    </h1>

                    <p>
                        Upload your study material and
                        learn through an AI-powered
                        document assistant.
                    </p>

                </div>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="error-state">

                    <p>
                        {error}
                    </p>

                </div>

            )}


            {/* ==================================================
                PDF UPLOAD
            ================================================== */}

            <section className="ai-mentor-card">

                <div>

                    <h2>
                        📄 Study Material
                    </h2>

                    <p>
                        Upload a PDF containing your
                        notes, syllabus, interview
                        preparation material, or other
                        study resources.
                    </p>

                </div>


                <div className="ai-mentor-upload">

                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                    />


                    {selectedFile && (

                        <p>

                            Selected file:{" "}

                            <strong>
                                {selectedFile.name}
                            </strong>

                        </p>

                    )}


                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={
                            !selectedFile ||
                            uploading
                        }
                    >

                        {uploading
                            ? "Processing PDF..."
                            : "Upload PDF"
                        }

                    </button>

                </div>


                {/* ==================================================
                    UPLOAD SUCCESS
                ================================================== */}

                {uploadResult && (

                    <div className="ai-mentor-success">

                        <h3>
                            ✓ PDF Ready for AI Mentor
                        </h3>


                        <p>

                            <strong>
                                Document:
                            </strong>{" "}

                            {uploadResult.filename}

                        </p>


                        <p>

                            <strong>
                                Knowledge chunks:
                            </strong>{" "}

                            {uploadResult.total_chunks}

                        </p>


                        <p>
                            {uploadResult.message}
                        </p>

                    </div>

                )}

            </section>


            {/* ==================================================
                DOCUMENT LIBRARY
            ================================================== */}

            <section className="ai-mentor-card">

                <div className="ai-chat-header">

                    <div>

                        <h2>
                            📚 My Study Documents
                        </h2>

                        <p>
                            Manage the PDFs currently
                            available to your AI Mentor.
                        </p>

                    </div>

                    {!loadingDocuments && (

                        <span>
                            {documents.length}{" "}
                            {documents.length === 1
                                ? "document"
                                : "documents"
                            }
                        </span>

                    )}

                </div>


                {/* ==================================================
                    DOCUMENT LOADING
                    ================================================== */}

                {loadingDocuments && (

                    <div className="ai-chat-empty">

                        <p>
                            Loading your study documents...
                        </p>

                    </div>

                )}


                {/* ==================================================
                    NO DOCUMENTS
                    ================================================== */}

                {!loadingDocuments &&
                    documents.length === 0 && (

                        <div className="ai-chat-empty">

                            <div className="ai-chat-empty-icon">
                                📚
                            </div>

                            <h3>
                                No study documents yet
                            </h3>

                            <p>
                                Upload your first PDF above
                                to build your personal AI
                                knowledge base.
                            </p>

                        </div>

                    )}


                {/* ==================================================
                    DOCUMENT LIST
                    ================================================== */}

                {!loadingDocuments &&
                    documents.length > 0 && (

                        <div className="ai-document-list">

                            {documents.map(
                                (document) => (

                                    <div
                                        key={
                                            document.document_id
                                        }
                                        className="ai-document-item"
                                    >

                                        <div className="ai-document-info">

                                            <div className="ai-document-icon">
                                                📄
                                            </div>


                                            <div>

                                                <h3>
                                                    {
                                                        document.filename
                                                    }
                                                </h3>


                                                <p>

                                                    {document.total_chunks}
                                                    {" "}
                                                    knowledge chunks
                                                    {" • "}
                                                    {document.status}

                                                </p>


                                                {document.created_at && (

                                                    <small>
                                                        Added{" "}
                                                        {new Date(
                                                            document.created_at
                                                        ).toLocaleDateString()}
                                                    </small>

                                                )}

                                            </div>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteDocument(
                                                    document.document_id
                                                )
                                            }
                                            disabled={
                                                deletingDocumentId ===
                                                document.document_id
                                            }
                                        >

                                            {deletingDocumentId ===
                                            document.document_id
                                                ? "Deleting..."
                                                : "Delete"
                                            }

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

            </section>


            {/* ==================================================
                CHAT HISTORY
                ================================================== */}

            <section className="ai-chat-sidebar">

                <div className="ai-chat-sidebar-header">

                    <div>

                        <h3>
                            💬 Chat History
                        </h3>

                    </div>


                    <button
                        type="button"
                        className="new-chat-button"
                        onClick={handleNewChat}
                    >
                        + New Chat
                    </button>

                </div>


                <div className="ai-chat-session-list">

                    {loadingSessions ? (

                        <p className="chat-session-loading">
                            Loading chats...
                        </p>

                    ) : chatSessions.length === 0 ? (

                        <p className="chat-session-empty">
                            No previous chats yet.
                        </p>

                    ) : (

                        chatSessions.map(
                            (session) => (

                                <div
                                    key={
                                        session.session_id
                                    }
                                    className={
                                        `ai-chat-session-item ${
                                            session.session_id ===
                                            sessionId
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                >

                                    <button
                                        type="button"
                                        className="chat-session-open"
                                        onClick={() =>
                                            handleOpenChat(
                                                session.session_id
                                            )
                                        }
                                    >

                                        <span className="chat-session-title">

                                            {session.title}

                                        </span>


                                        <span className="chat-session-date">

                                            {new Date(
                                                session.updated_at
                                            ).toLocaleDateString()}

                                        </span>

                                    </button>


                                    <button
                                        type="button"
                                        className="chat-session-delete"
                                        disabled={
                                            deletingSessionId ===
                                            session.session_id
                                        }
                                        onClick={() =>
                                            handleDeleteChat(
                                                session.session_id
                                            )
                                        }
                                        title="Delete chat"
                                    >

                                        {deletingSessionId ===
                                        session.session_id
                                            ? "..."
                                            : "×"
                                        }

                                    </button>

                                </div>

                            )
                        )

                    )}

                </div>

            </section>


            {/* ==================================================
                CHAT SECTION
                ================================================== */}

            <section className="ai-mentor-card ai-chat-card">


                {/* ==================================================
                    CHAT HEADER
                    ================================================== */}

                <div className="ai-chat-header">

                    <div>

                        <h2>
                            🤖 AI Mentor
                        </h2>

                        <p>
                            Ask questions from your
                            uploaded study material.
                        </p>

                    </div>


                    {messages.length > 0 && (

                        <button
                            type="button"
                            className="clear-chat-button"
                            onClick={handleClearChat}
                        >
                            Clear Chat
                        </button>

                    )}

                </div>


                {/* ==================================================
                    ACTIVE CHAT INDICATOR
                    ================================================== */}

                {sessionId && (

                    <div className="ai-chat-session-indicator">

                        <span>
                            Active conversation
                        </span>

                    </div>

                )}


                {/* ==================================================
                    EMPTY CHAT STATE
                    ================================================== */}

                {messages.length === 0 && (

                    <div className="ai-chat-empty">

                        <div className="ai-chat-empty-icon">
                            🤖
                        </div>

                        <h3>
                            Start learning with AI Mentor
                        </h3>

                        <p>
                            Upload a PDF and ask questions
                            about its content.
                        </p>


                        <div className="ai-suggestion-list">

                            <button
                                type="button"
                                onClick={() =>
                                    setQuestion(
                                        "Summarize the main concepts in this document."
                                    )
                                }
                            >
                                Summarize this document
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setQuestion(
                                        "Explain the most important topics from this document."
                                    )
                                }
                            >
                                Explain important topics
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setQuestion(
                                        "What are the key points I should remember for an interview?"
                                    )
                                }
                            >
                                Give interview key points
                            </button>

                        </div>

                    </div>

                )}


                {/* ==================================================
                    CHAT MESSAGES
                    ================================================== */}

                {messages.length > 0 && (

                    <div className="ai-chat-messages">

                        {messages.map(
                            (message, index) => (

                                <div
                                    key={index}
                                    className={
                                        message.type === "user"
                                            ? "chat-message user-message"
                                            : "chat-message assistant-message"
                                    }
                                >

                                    <div className="message-label">

                                        {message.type === "user"
                                            ? "You"
                                            : "AI Mentor"
                                        }

                                    </div>


                                    <div className="message-content">

                                        {message.content}

                                    </div>


                                    {/* ======================================
                                        SOURCES
                                        ====================================== */}

                                    {message.type === "assistant" &&
                                        message.sources?.length > 0 && (

                                            <div className="message-sources">

                                                <strong>
                                                    Sources
                                                </strong>

                                                <ul>

                                                    {message.sources.map(
                                                        (
                                                            source,
                                                            sourceIndex
                                                        ) => (

                                                            <li
                                                                key={
                                                                    sourceIndex
                                                                }
                                                            >
                                                                {source}
                                                            </li>

                                                        )
                                                    )}

                                                </ul>

                                            </div>

                                        )}

                                </div>

                            )
                        )}


                        {/* ==================================================
                            AI THINKING
                            ================================================== */}

                        {asking && (

                            <div className="chat-message assistant-message">

                                <div className="message-label">
                                    AI Mentor
                                </div>

                                <div className="ai-thinking">

                                    <span></span>
                                    <span></span>
                                    <span></span>

                                    <span className="thinking-text">
                                        AI Mentor is thinking...
                                    </span>

                                </div>

                            </div>

                        )}

                    </div>

                )}


                {/* ==================================================
                    QUESTION INPUT
                    ================================================== */}

                <div className="ai-chat-input">

                    <textarea
                        value={question}
                        onChange={(event) =>
                            setQuestion(
                                event.target.value
                            )
                        }
                        onKeyDown={
                            handleQuestionKeyDown
                        }
                        placeholder={
                            "Ask something about your PDF..."
                        }
                        rows={3}
                        disabled={asking}
                    />


                    <div className="ai-chat-input-footer">

                        <span>
                            Press Enter to ask • Shift + Enter for new line
                        </span>


                        <button
                            type="button"
                            onClick={
                                handleAskQuestion
                            }
                            disabled={
                                asking ||
                                !question.trim()
                            }
                        >

                            {asking
                                ? "Thinking..."
                                : "Ask AI Mentor"
                            }

                        </button>

                    </div>

                </div>

            </section>

        </div>

    );

}


export default AIMentor;