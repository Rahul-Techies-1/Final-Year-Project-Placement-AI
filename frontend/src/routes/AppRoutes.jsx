import {
    Routes,
    Route
} from "react-router-dom";


// ========================================================
// PUBLIC
// ========================================================

import Login from "../pages/auth/Login";


// ========================================================
// ROUTE PROTECTION
// ========================================================

import ProtectedRoute from "./ProtectedRoute";


// ========================================================
// STUDENT LAYOUT
// ========================================================

import StudentLayout from "../components/common/StudentLayout";


// ========================================================
// STUDENT PAGES
// ========================================================

import StudentDashboard from "../pages/student/StudentDashboard";
import Jobs from "../pages/student/Jobs";
import JobDetails from "../pages/student/JobDetails";
import ApplyJob from "../pages/student/ApplyJob";
import MyApplications from "../pages/student/MyApplications";
import ApplicationDetails from "../pages/student/ApplicationDetails";

import PreparationDashboard
    from "../pages/student/PreparationDashboard";

import DSAPreparation
    from "../pages/student/preparation/DSAPreparation";

import Interviews
    from "../pages/student/Interviews";

import RecruiterInterviews
    from "../pages/recruiter/RecruiterInterviews";

import ScheduleInterview
    from "../pages/recruiter/ScheduleInterview";

import RecruiterApplications
    from "../pages/recruiter/RecruiterApplications";

import RecruiterJobs
    from "../pages/recruiter/RecruiterJobs";

import RecruiterDashboard
    from "../pages/recruiter/RecruiterDashboard";






// ========================================================
// HOME
// ========================================================

function Home() {

    return (

        <div>

            <h1>
                PlacementAI
            </h1>

            <p>
                Welcome to PlacementAI
            </p>

        </div>
    );
}


// ========================================================
// RECRUITER DASHBOARD
// ========================================================

function RecruiterDashboard() {

    return (

        <div>

            <h1>
                Recruiter Dashboard
            </h1>

            <p>
                Recruiter dashboard coming soon.
            </p>

        </div>
    );
}


// ========================================================
// APPLICATION ROUTES
// ========================================================

function AppRoutes() {

    return (

        <Routes>


            {/* ==================================================
                PUBLIC ROUTES
            ================================================== */}

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={<Login />}
            />


            {/* ==================================================
                STUDENT ROUTES
            ================================================== */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["student"]}
                    />
                }
            >

                {/* Student Layout */}

                <Route
                    element={<StudentLayout />}
                >


                    {/* ==================================================
                        STUDENT DASHBOARD
                    ================================================== */}

                    <Route
                        path="/student/dashboard"
                        element={
                            <StudentDashboard />
                        }
                    />


                    {/* ==================================================
                        JOBS
                    ================================================== */}

                    <Route
                        path="/student/jobs"
                        element={
                            <Jobs />
                        }
                    />


                    {/* ==================================================
                        JOB DETAILS
                    ================================================== */}

                    <Route
                        path="/student/jobs/:jobId"
                        element={
                            <JobDetails />
                        }
                    />


                    {/* ==================================================
                        APPLY FOR JOB
                    ================================================== */}

                    <Route
                        path="/student/jobs/:jobId/apply"
                        element={
                            <ApplyJob />
                        }
                    />


                    {/* ==================================================
                        MY APPLICATIONS
                    ================================================== */}

                    <Route
                        path="/student/applications"
                        element={
                            <MyApplications />
                        }
                    />


                    {/* ==================================================
                        APPLICATION DETAILS
                    ================================================== */}

                    <Route
                        path="/student/applications/:applicationId"
                        element={
                            <ApplicationDetails />
                        }
                    />


                    {/* ==================================================
                        STUDENT INTERVIEWS
                    ================================================== */}

                    <Route
                        path="/student/interviews"
                        element={
                            <Interviews />
                        }
                    />


                    {/* ==================================================
                        PREPARATION DASHBOARD
                    ================================================== */}

                    <Route
                        path="/student/preparation"
                        element={
                            <PreparationDashboard />
                        }
                    />


                    {/* ==================================================
                        DSA PREPARATION
                    ================================================== */}

                    <Route
                        path="/student/preparation/dsa"
                        element={
                            <DSAPreparation />
                        }
                    />


                </Route>

            </Route>


            {/* ==================================================
                RECRUITER ROUTES
            ================================================== */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["recruiter"]}
                    />
                }
            >

                <Route
                    path="/recruiter/dashboard"
                    element={
                        <RecruiterDashboard />
                    }
                />
                <Route
                    path="/recruiter/jobs"
                    element={
                        <RecruiterJobs />
                    }
                />
                <Route
                    path="/recruiter/jobs/:jobId/applications"
                    element={
                        <RecruiterApplications />
                    }
                />
                <Route
                    path="/recruiter/interviews"
                    element={
                        <RecruiterInterviews />
                    }
                />
                <Route
                    path="/recruiter/interviews/schedule"
                    element={
                        <ScheduleInterview />
                    }
                />
                

            </Route>


        </Routes>
    );
}


export default AppRoutes;