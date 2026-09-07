import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createMockInterview,
    getMockInterviews,
    deleteMockInterview
} from "../../../services/mockInterviewService";


const MockInterviews = () => {

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [interviews, setInterviews] = useState([]);

    const [loading, setLoading] = useState(true);

    const [creating, setCreating] = useState(false);

    const [error, setError] = useState("");


    const [interviewType, setInterviewType] =
        useState("technical");

    const [difficulty, setDifficulty] =
        useState("medium");

    const [totalQuestions, setTotalQuestions] =
        useState(10);


    // ========================================================
    // LOAD INTERVIEWS
    // ========================================================

    useEffect(() => {

        loadInterviews();

    }, []);


    const loadInterviews = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getMockInterviews();

            setInterviews(
                data?.items || []
            );

        } catch (err) {

            console.error(
                "Failed to load mock interviews:",
                err
            );

            setError(
                "Failed to load mock interviews."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // CREATE INTERVIEW
    // ========================================================

    const handleCreateInterview = async () => {

        try {

            setCreating(true);

            setError("");

            const interview =
                await createMockInterview({

                    interviewType,

                    difficulty,

                    totalQuestions
                });


            /*
                After creating the interview,
                open the interview detail page.
            */

            navigate(
                `/student/preparation/mock-interviews/${interview.id}`
            );

        } catch (err) {

            console.error(
                "Failed to create mock interview:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                "Failed to create mock interview."
            );

        } finally {

            setCreating(false);

        }
    };


    // ========================================================
    // DELETE INTERVIEW
    // ========================================================

    const handleDeleteInterview = async (
        interviewId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this mock interview?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setError("");

            await deleteMockInterview(
                interviewId
            );


            setInterviews(
                (previous) =>
                    previous.filter(
                        (interview) =>
                            interview.id !== interviewId
                    )
            );

        } catch (err) {

            console.error(
                "Failed to delete mock interview:",
                err
            );

            setError(
                "Failed to delete mock interview."
            );
        }
    };


    // ========================================================
    // OPEN INTERVIEW
    // ========================================================

    const handleOpenInterview = (
        interviewId
    ) => {

        navigate(
            `/student/preparation/mock-interviews/${interviewId}`
        );
    };


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };


    // ========================================================
    // FORMAT STATUS
    // ========================================================

    const formatStatus = (
        status
    ) => {

        if (!status) {
            return "Unknown";
        }

        return status
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (character) =>
                    character.toUpperCase()
            );
    };


    // ========================================================
    // SUMMARY
    // ========================================================

    const totalInterviews =
        interviews.length;

    const completedInterviews =
        interviews.filter(
            (interview) =>
                interview.status === "completed"
        ).length;

    const inProgressInterviews =
        interviews.filter(
            (interview) =>
                interview.status === "in_progress"
        ).length;


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div className="mock-interviews-page">

                <div className="page-header">

                    <div>

                        <h1>
                            Mock Interviews
                        </h1>

                        <p>
                            Practice realistic placement
                            interviews and improve your
                            interview performance.
                        </p>

                    </div>

                </div>

                <p>
                    Loading mock interviews...
                </p>

            </div>
        );
    }


    // ========================================================
    // UI
    // ========================================================

    return (

        <div className="mock-interviews-page">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        Mock Interviews
                    </h1>

                    <p>
                        Practice realistic placement
                        interviews and track your
                        performance.
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

                    <button
                        type="button"
                        onClick={loadInterviews}
                    >
                        Retry
                    </button>

                </div>
            )}


            {/* ==================================================
                SUMMARY
            ================================================== */}

            <section className="mock-interview-summary">

                <div>

                    <p>
                        Total Interviews
                    </p>

                    <h2>
                        {totalInterviews}
                    </h2>

                </div>


                <div>

                    <p>
                        Completed
                    </p>

                    <h2>
                        {completedInterviews}
                    </h2>

                </div>


                <div>

                    <p>
                        In Progress
                    </p>

                    <h2>
                        {inProgressInterviews}
                    </h2>

                </div>

            </section>


            {/* ==================================================
                CREATE INTERVIEW
            ================================================== */}

            <section className="mock-interview-create">

                <div className="section-header">

                    <div>

                        <h2>
                            Start a Mock Interview
                        </h2>

                        <p>
                            Configure your interview and
                            begin practicing.
                        </p>

                    </div>

                </div>


                <div className="mock-interview-form">


                    {/* INTERVIEW TYPE */}

                    <div>

                        <label htmlFor="interview-type">

                            Interview Type

                        </label>

                        <select
                            id="interview-type"
                            value={interviewType}
                            onChange={(event) =>
                                setInterviewType(
                                    event.target.value
                                )
                            }
                        >

                            <option value="technical">
                                Technical
                            </option>

                            <option value="hr">
                                HR
                            </option>

                            <option value="behavioral">
                                Behavioral
                            </option>

                            <option value="mixed">
                                Mixed
                            </option>

                        </select>

                    </div>


                    {/* DIFFICULTY */}

                    <div>

                        <label htmlFor="difficulty">

                            Difficulty

                        </label>

                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(event) =>
                                setDifficulty(
                                    event.target.value
                                )
                            }
                        >

                            <option value="easy">
                                Easy
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="hard">
                                Hard
                            </option>

                        </select>

                    </div>


                    {/* TOTAL QUESTIONS */}

                    <div>

                        <label htmlFor="total-questions">

                            Number of Questions

                        </label>

                        <select
                            id="total-questions"
                            value={totalQuestions}
                            onChange={(event) =>
                                setTotalQuestions(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                        >

                            <option value={5}>
                                5 Questions
                            </option>

                            <option value={10}>
                                10 Questions
                            </option>

                            <option value={15}>
                                15 Questions
                            </option>

                            <option value={20}>
                                20 Questions
                            </option>

                        </select>

                    </div>


                    {/* START */}

                    <div>

                        <button
                            type="button"
                            onClick={
                                handleCreateInterview
                            }
                            disabled={creating}
                        >

                            {creating
                                ? "Creating..."
                                : "Start Mock Interview"
                            }

                        </button>

                    </div>

                </div>

            </section>


            {/* ==================================================
                PREVIOUS INTERVIEWS
            ================================================== */}

            <section className="mock-interview-history">

                <div className="section-header">

                    <div>

                        <h2>
                            Previous Interviews
                        </h2>

                        <p>
                            Review your previous mock
                            interview sessions.
                        </p>

                    </div>

                </div>


                {interviews.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No mock interviews yet
                        </h3>

                        <p>
                            Start your first mock interview
                            to begin practicing.
                        </p>

                    </div>

                ) : (

                    <div className="mock-interview-list">

                        {interviews.map(
                            (interview) => (

                                <div
                                    key={interview.id}
                                    className="mock-interview-card"
                                >

                                    {/* HEADER */}

                                    <div>

                                        <h3>
                                            {interview.interview_type
                                                ?.replace(
                                                    /\b\w/g,
                                                    (character) =>
                                                        character.toUpperCase()
                                                )
                                            }{" "}
                                            Interview
                                        </h3>

                                        <p>
                                            Started{" "}
                                            {formatDate(
                                                interview.started_at
                                            )}
                                        </p>

                                    </div>


                                    {/* DETAILS */}

                                    <div>

                                        <p>

                                            <strong>
                                                Difficulty:
                                            </strong>{" "}

                                            {interview.difficulty
                                                ?.replace(
                                                    /\b\w/g,
                                                    (character) =>
                                                        character.toUpperCase()
                                                )
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Questions:
                                            </strong>{" "}

                                            {
                                                interview.questions_answered
                                            }

                                            {" / "}

                                            {
                                                interview.total_questions
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Status:
                                            </strong>{" "}

                                            {
                                                formatStatus(
                                                    interview.status
                                                )
                                            }

                                        </p>


                                        {interview.score !== null && (

                                            <p>

                                                <strong>
                                                    Score:
                                                </strong>{" "}

                                                {
                                                    interview.score
                                                }%

                                            </p>

                                        )}

                                    </div>


                                    {/* ACTIONS */}

                                    <div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleOpenInterview(
                                                    interview.id
                                                )
                                            }
                                        >

                                            {interview.status ===
                                            "completed"
                                                ? "View Results"
                                                : "Continue Interview"
                                            }

                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteInterview(
                                                    interview.id
                                                )
                                            }
                                        >

                                            Delete

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>
    );
};


export default MockInterviews;