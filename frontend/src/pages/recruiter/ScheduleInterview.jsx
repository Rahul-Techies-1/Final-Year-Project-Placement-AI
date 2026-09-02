import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { createInterview } from "../../services/interviewService";


function ScheduleInterview() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const applicationId =
        searchParams.get("applicationId");


    const [scheduledAt, setScheduledAt] =
        useState("");

    const [interviewType, setInterviewType] =
        useState("");

    const [meetingLink, setMeetingLink] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // Application ID check

        if (!applicationId) {

            setError(
                "Application ID is missing."
            );

            return;
        }


        // Required fields

        if (!scheduledAt) {

            setError(
                "Please select interview date and time."
            );

            return;
        }


        if (!interviewType.trim()) {

            setError(
                "Please enter interview type."
            );

            return;
        }


        setLoading(true);


        try {

            await createInterview({

                applicationId:
                    Number(applicationId),

                scheduledAt:

                    new Date(
                        scheduledAt
                    ).toISOString(),

                interviewType:
                    interviewType.trim(),

                meetingLink:
                    meetingLink.trim() || null
            });


            setSuccess(
                "Interview scheduled successfully."
            );


            // Redirect after successful scheduling

            setTimeout(() => {

                navigate(
                    "/recruiter/interviews"
                );

            }, 1000);


        } catch (error) {

            console.error(
                "Schedule interview error:",
                error
            );


            setError(

                error.response?.data?.detail ||

                "Failed to schedule interview."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // UI
    // ========================================================

    return (

        <div className="dashboard-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="dashboard-header">

                <div>

                    <p className="dashboard-eyebrow">
                        Recruiter
                    </p>

                    <h1>
                        Schedule Interview
                    </h1>

                    <p>
                        Schedule an interview with
                        the shortlisted candidate.
                    </p>

                </div>

            </section>


            {/* =================================================
                FORM
            ================================================= */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Interview Details
                        </h2>

                        <p>
                            Enter the interview schedule
                            and meeting information.
                        </p>

                    </div>

                </div>


                {/* Application ID */}

                <div>

                    <label>
                        Application ID
                    </label>

                    <input
                        type="text"
                        value={
                            applicationId || ""
                        }
                        disabled
                    />

                </div>


                <form
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                        DATE & TIME
                    ================================================= */}

                    <div>

                        <label>
                            Interview Date & Time
                        </label>

                        <input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(event) =>
                                setScheduledAt(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* =================================================
                        INTERVIEW TYPE
                    ================================================= */}

                    <div>

                        <label>
                            Interview Type
                        </label>

                        <select
                            value={interviewType}
                            onChange={(event) =>
                                setInterviewType(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        >

                            <option value="">
                                Select interview type
                            </option>

                            <option value="Technical">
                                Technical
                            </option>

                            <option value="HR">
                                HR
                            </option>

                            <option value="Coding">
                                Coding
                            </option>

                            <option value="Managerial">
                                Managerial
                            </option>

                            <option value="Final">
                                Final Interview
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        MEETING LINK
                    ================================================= */}

                    <div>

                        <label>
                            Meeting Link
                        </label>

                        <input
                            type="url"
                            placeholder="https://meet.google.com/..."
                            value={meetingLink}
                            onChange={(event) =>
                                setMeetingLink(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="dashboard-error">

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {success && (

                        <div>

                            <p>
                                {success}
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(-1)
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Scheduling..."
                                : "Schedule Interview"
                            }

                        </button>

                    </div>


                </form>

            </section>

        </div>
    );
}


export default ScheduleInterview;