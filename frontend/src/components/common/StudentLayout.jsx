import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function StudentLayout() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();


    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = () => {

        logout();

        navigate(
            "/login",
            { replace: true }
        );
    };


    return (

        <div className="student-layout">


            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside className="student-sidebar">


                {/* ==================================================
                    BRAND
                ================================================== */}

                <div className="student-brand">

                    <h2>
                        PlacementAI
                    </h2>

                    <p>
                        Student Portal
                    </p>

                </div>


                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <nav className="student-navigation">


                    {/* ==================================================
                        MAIN NAVIGATION
                    ================================================== */}

                    <NavLink
                        to="/student/dashboard"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Dashboard
                    </NavLink>


                    <NavLink
                        to="/student/jobs"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Find Jobs
                    </NavLink>


                    <NavLink
                        to="/student/applications"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        My Applications
                    </NavLink>


                    {/* ==================================================
                        PREPARATION NAVIGATION
                        Section heading removed intentionally.
                    ================================================== */}

                    {/* PREPARATION DASHBOARD */}

                    <NavLink
                        to="/student/preparation"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Preparation Dashboard
                    </NavLink>


                    {/* DSA */}

                    <NavLink
                        to="/student/preparation/dsa"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        DSA Preparation
                    </NavLink>


                    {/* SQL */}

                    <NavLink
                        to="/student/preparation/sql"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        SQL Preparation
                    </NavLink>


                    {/* CORE CS */}

                    <NavLink
                        to="/student/preparation/core-cs"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Core CS Preparation
                    </NavLink>


                    {/* APTITUDE */}

                    <NavLink
                        to="/student/preparation/aptitude"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Aptitude Preparation
                    </NavLink>


                    {/* MOCK INTERVIEWS */}

                    <NavLink
                        to="/student/preparation/mock-interviews"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Mock Interviews
                    </NavLink>


                    {/* AI MENTOR */}

                    <NavLink
                        to="/student/preparation/ai-mentor"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        AI Mentor
                    </NavLink>


                </nav>


                {/* ==================================================
                    USER AREA
                ================================================== */}

                <div className="student-sidebar-footer">

                    <div>

                        <strong>
                            {user?.full_name || "Student"}
                        </strong>

                        <p>
                            {user?.email || ""}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>


            </aside>


            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <main className="student-main">

                <Outlet />

            </main>


        </div>
    );
}


export default StudentLayout;