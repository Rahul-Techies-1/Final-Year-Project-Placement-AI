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

                    <NavLink
                        to="/student/dashboard"
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


                    {/* Preparation */}

                    <div className="nav-section">

                        <p>
                            Preparation
                        </p>


                        <NavLink
                            to="/student/preparation"
                            className={({ isActive }) =>
                                isActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                        >
                            Preparation Dashboard
                        </NavLink>

                    </div>

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