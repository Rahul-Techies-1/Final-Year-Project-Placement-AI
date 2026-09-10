function MockInterviewAnalytics({
    analytics
}) {

    // ========================================================
    // SAFETY CHECK
    // ========================================================

    if (!analytics) {
        return null;
    }


    // ========================================================
    // EXTRACT ANALYTICS
    // ========================================================

    const {
        total_interviews = 0,

        completed_interviews = 0,

        in_progress_interviews = 0,

        average_score = null,

        best_score = null,

        total_questions = 0,

        questions_answered = 0,

        completion_rate = 0,

        interview_completion_rate = 0,

        technical_average_score = null,

        hr_average_score = null

    } = analytics;


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <section className="mock-interview-analytics">


            {/* =================================================
                SECTION HEADER
            ================================================= */}

            <div className="dashboard-section-header">

                <div>

                    <p className="dashboard-eyebrow">
                        Mock Interviews
                    </p>

                    <h2>
                        Interview Performance
                    </h2>

                    <p>
                        Track your mock interview progress
                        and performance.
                    </p>

                </div>

            </div>


            {/* =================================================
                PRIMARY INTERVIEW STATISTICS
            ================================================= */}

            <div className="mock-interview-stats">


                {/* TOTAL INTERVIEWS */}

                <div className="mock-interview-stat-card">

                    <span className="mock-interview-stat-label">
                        Total Interviews
                    </span>

                    <strong className="mock-interview-stat-value">
                        {total_interviews}
                    </strong>

                </div>


                {/* COMPLETED INTERVIEWS */}

                <div className="mock-interview-stat-card">

                    <span className="mock-interview-stat-label">
                        Completed
                    </span>

                    <strong className="mock-interview-stat-value">
                        {completed_interviews}
                    </strong>

                </div>


                {/* IN PROGRESS */}

                <div className="mock-interview-stat-card">

                    <span className="mock-interview-stat-label">
                        In Progress
                    </span>

                    <strong className="mock-interview-stat-value">
                        {in_progress_interviews}
                    </strong>

                </div>


                {/* AVERAGE SCORE */}

                <div className="mock-interview-stat-card">

                    <span className="mock-interview-stat-label">
                        Average Score
                    </span>

                    <strong className="mock-interview-stat-value">

                        {average_score !== null
                            ? `${average_score}%`
                            : "—"
                        }

                    </strong>

                </div>


                {/* BEST SCORE */}

                <div className="mock-interview-stat-card">

                    <span className="mock-interview-stat-label">
                        Best Score
                    </span>

                    <strong className="mock-interview-stat-value">

                        {best_score !== null
                            ? `${best_score}%`
                            : "—"
                        }

                    </strong>

                </div>


                {/* QUESTIONS ANSWERED */}

                <div className="mock-interview-stat-card">

                    <span className="mock-interview-stat-label">
                        Questions Answered
                    </span>

                    <strong className="mock-interview-stat-value">

                        {questions_answered}

                        <span className="mock-interview-stat-secondary">
                            {" "}/ {total_questions}
                        </span>

                    </strong>

                </div>

            </div>


            {/* =================================================
                COMPLETION ANALYTICS
            ================================================= */}

            <div className="mock-interview-stats">


                {/* QUESTION COMPLETION RATE */}

                <div className="mock-interview-stat-card">

                    <span className="mock-interview-stat-label">
                        Question Completion
                    </span>

                    <strong className="mock-interview-stat-value">

                        {completion_rate}%

                    </strong>

                </div>


                {/* INTERVIEW COMPLETION RATE */}

                <div className="mock-interview-stat-card">

                    <span className="mock-interview-stat-label">
                        Interview Completion
                    </span>

                    <strong className="mock-interview-stat-value">

                        {interview_completion_rate}%

                    </strong>

                </div>


                {/* TECHNICAL AVERAGE */}

                <div className="mock-interview-stat-card">

                    <span className="mock-interview-stat-label">
                        Technical Average
                    </span>

                    <strong className="mock-interview-stat-value">

                        {technical_average_score !== null
                            ? `${technical_average_score}%`
                            : "—"
                        }

                    </strong>

                </div>


                {/* HR AVERAGE */}

                <div className="mock-interview-stat-card">

                    <span className="mock-interview-stat-label">
                        HR Average
                    </span>

                    <strong className="mock-interview-stat-value">

                        {hr_average_score !== null
                            ? `${hr_average_score}%`
                            : "—"
                        }

                    </strong>

                </div>

            </div>


        </section>
    );
}


export default MockInterviewAnalytics;