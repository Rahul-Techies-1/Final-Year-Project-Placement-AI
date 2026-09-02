import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
    getDashboardOverview
} from "../../services/studentDashboardService";

import ApplicationOverview from "../../components/dashboard/ApplicationOverview";
import RecentApplications from "../../components/dashboard/RecentApplications";
import UpcomingInterviews from "../../components/dashboard/UpcomingInterviews";


function StudentDashboard() {

    const navigate = useNavigate();

    const { user } = useAuth();

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================================
    // FETCH DASHBOARD DATA
    // ========================================================

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getDashboardOverview();

                setDashboard(data);

            } catch (error) {

                console.error(
                    "Student dashboard error:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Unable to load your dashboard."
                );

            } finally {

                setLoading(false);
            }
        };


        fetchDashboard();

    }, []);


    // ========================================================
    // LOADING STATE
    // ========================================================

    if (loading) {

        return (
            <div className="dashboard-page">

                <div className="dashboard-loading">

                    <h2>
                        Loading your dashboard...
                    </h2>

                    <p>
                        Please wait while we fetch your
                        placement information.
                    </p>

                </div>

            </div>
        );
    }


    // ========================================================
    // ERROR STATE
    // ========================================================

    if (error) {

        return (
            <div className="dashboard-page">

                <div className="dashboard-error">

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    // ========================================================
    // SAFETY CHECK
    // ========================================================

    if (!dashboard) {
        return null;
    }


    // ========================================================
    // EXTRACT DATA
    // ========================================================

    const statistics =
        dashboard.statistics || {};

    const recentApplications =
        dashboard.recent_applications || [];

    const upcomingInterviews =
        dashboard.upcoming_interviews || [];


    // ========================================================
    // NORMALIZE INTERVIEW COUNT
    // ========================================================
    /*
     * Different backend responses may use either:
     *
     * interview_scheduled
     *
     * or
     *
     * total_interviews
     *
     * We normalize it here so ApplicationOverview
     * receives the field it already expects.
     */

    const normalizedStatistics = {

        ...statistics,

        interview_scheduled:
            statistics.interview_scheduled ??
            statistics.total_interviews ??
            0,
    };


    // ========================================================
    // DASHBOARD
    // ========================================================

    return (

        <div className="dashboard-page">


            {/* =================================================
                WELCOME HEADER
            ================================================= */}

            <section className="dashboard-header">

                <div>

                    <p className="dashboard-eyebrow">
                        Student Dashboard
                    </p>

                    <h1>
                        Welcome back,
                        {" "}
                        {user?.full_name || "Student"} 👋
                    </h1>

                    <p>
                        Track your applications,
                        interviews and placement journey
                        from one place.
                    </p>

                </div>


                <div className="dashboard-actions">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/student/jobs")
                        }
                    >
                        Explore Jobs
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/student/applications"
                            )
                        }
                    >
                        My Applications
                    </button>

                </div>

            </section>


            {/* =================================================
                APPLICATION OVERVIEW
            ================================================= */}

            <ApplicationOverview
                statistics={normalizedStatistics}
            />


            {/* =================================================
                RECENT APPLICATIONS
            ================================================= */}

            <RecentApplications
                applications={recentApplications}
            />


            {/* =================================================
                UPCOMING INTERVIEWS
            ================================================= */}

            <UpcomingInterviews
                interviews={upcomingInterviews}
            />


        </div>
    );
}


export default StudentDashboard;