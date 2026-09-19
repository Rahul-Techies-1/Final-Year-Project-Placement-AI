import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";


function Login() {

    const navigate = useNavigate();

    const {
        login,
        logout
    } = useAuth();


    // ========================================================
    // STATE
    // ========================================================

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [role, setRole] = useState("student");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    // ========================================================
    // HANDLE LOGIN
    // ========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setLoading(true);

        try {

            // ------------------------------------------------
            // STEP 1
            // AUTHENTICATE WITH FASTAPI
            // ------------------------------------------------

            const response = await loginUser({
                email,
                password
            });


            // ------------------------------------------------
            // STEP 2
            // STORE TOKEN + FETCH USER
            // ------------------------------------------------

            const userData = await login(
                response.access_token
            );


            // ------------------------------------------------
            // STEP 3
            // VERIFY SELECTED ROLE
            // ------------------------------------------------

            if (userData.role !== role) {

                logout();

                setError(
                    `This account is registered as a ${
                        userData.role === "recruiter"
                            ? "Recruiter"
                            : "Student"
                    }. Please select the correct login option.`
                );

                return;
            }


            // ------------------------------------------------
            // STEP 4
            // ROLE-BASED NAVIGATION
            // ------------------------------------------------

            if (userData.role === "recruiter") {

                navigate(
                    "/recruiter/dashboard",
                    {
                        replace: true
                    }
                );

            } else if (userData.role === "student") {

                navigate(
                    "/student/dashboard",
                    {
                        replace: true
                    }
                );

            } else {

                logout();

                setError(
                    "Your account does not have a valid role."
                );
            }

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Login failed. Please check your email and password."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // UI
    // ========================================================

    return (

        <div className="login-page">


            {/* ==================================================
                LEFT HERO
            ================================================== */}

            <section className="login-hero">

                <div className="login-hero-content">


                    {/* BRAND */}

                    <div className="login-brand">

                        <div className="login-brand-icon">
                            AI
                        </div>

                        <span>
                            PlacementAI
                        </span>

                    </div>


                    {/* HERO CONTENT */}

                    <div className="login-hero-main">

                        <span className="login-eyebrow">
                            AI-POWERED PLACEMENT PLATFORM
                        </span>

                        <h1>
                            Prepare smarter.
                            <br />
                            Get placed faster.
                        </h1>

                        <p>
                            One intelligent platform to prepare for
                            placements, practice interviews, discover
                            opportunities and track your career journey.
                        </p>


                        {/* FEATURES */}

                        <div className="login-feature-list">


                            <div className="login-feature">

                                <span className="login-feature-icon">
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        AI-powered preparation
                                    </strong>

                                    <span>
                                        Learn with your personal AI Mentor.
                                    </span>

                                </div>

                            </div>


                            <div className="login-feature">

                                <span className="login-feature-icon">
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Mock interviews
                                    </strong>

                                    <span>
                                        Practice and improve your interview performance.
                                    </span>

                                </div>

                            </div>


                            <div className="login-feature">

                                <span className="login-feature-icon">
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Complete placement journey
                                    </strong>

                                    <span>
                                        Jobs, applications, interviews and analytics in one place.
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* FOOTER */}

                    <div className="login-hero-footer">

                        <span>
                            © {new Date().getFullYear()} PlacementAI
                        </span>

                        <span>
                            Built for smarter placements
                        </span>

                    </div>

                </div>

            </section>


            {/* ==================================================
                RIGHT LOGIN SECTION
            ================================================== */}

            <section className="login-form-section">

                <div className="login-form-container">


                    {/* MOBILE BRAND */}

                    <div className="login-mobile-brand">

                        <div className="login-brand-icon">
                            AI
                        </div>

                        <span>
                            PlacementAI
                        </span>

                    </div>


                    {/* LOGIN CARD */}

                    <div className="login-card">


                        {/* HEADER */}

                        <div className="login-card-header">

                            <span className="login-welcome">
                                WELCOME BACK
                            </span>

                            <h2>
                                Sign in to your account
                            </h2>

                            <p>
                                Continue your placement journey with PlacementAI.
                            </p>

                        </div>


                        {/* ROLE SELECTOR */}

                        <div className="login-role-section">

                            <label>
                                Login as
                            </label>


                            <div className="login-role-options">


                                {/* STUDENT */}

                                <button
                                    type="button"
                                    className={
                                        role === "student"
                                            ? "login-role-option active"
                                            : "login-role-option"
                                    }
                                    onClick={() => {
                                        setRole("student");
                                        setError("");
                                    }}
                                    disabled={loading}
                                >

                                    <span className="login-role-icon">
                                        🎓
                                    </span>

                                    <span>

                                        <strong>
                                            Student
                                        </strong>

                                        <small>
                                            Prepare & get placed
                                        </small>

                                    </span>

                                </button>


                                {/* RECRUITER */}

                                <button
                                    type="button"
                                    className={
                                        role === "recruiter"
                                            ? "login-role-option active"
                                            : "login-role-option"
                                    }
                                    onClick={() => {
                                        setRole("recruiter");
                                        setError("");
                                    }}
                                    disabled={loading}
                                >

                                    <span className="login-role-icon">
                                        💼
                                    </span>

                                    <span>

                                        <strong>
                                            Recruiter
                                        </strong>

                                        <small>
                                            Hire talented students
                                        </small>

                                    </span>

                                </button>

                            </div>

                        </div>


                        {/* FORM */}

                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                        >


                            {/* EMAIL */}

                            <div className="login-field">

                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div className="login-input-wrapper">

                                    <svg
                                        className="login-input-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        aria-hidden="true"
                                    >

                                        <path d="M4 6h16v12H4z" />

                                        <path d="m4 7 8 6 8-6" />

                                    </svg>

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="login-field">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="login-input-wrapper">

                                    <svg
                                        className="login-input-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        aria-hidden="true"
                                    >

                                        <rect
                                            x="5"
                                            y="10"
                                            width="14"
                                            height="10"
                                            rx="2"
                                        />

                                        <path
                                            d="M8 10V7a4 4 0 0 1 8 0v3"
                                        />

                                    </svg>

                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            {/* ERROR */}

                            {error && (

                                <div
                                    className="login-error"
                                    role="alert"
                                >

                                    <span className="login-error-icon">
                                        !
                                    </span>

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            )}


                            {/* LOGIN BUTTON */}

                            <button
                                className="login-submit-button"
                                type="submit"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span className="login-spinner"></span>
                                        Signing in...
                                    </>

                                ) : (

                                    <>
                                        Sign in

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            aria-hidden="true"
                                        >

                                            <path d="M5 12h14" />

                                            <path d="m13 6 6 6-6 6" />

                                        </svg>

                                    </>

                                )}

                            </button>

                        </form>


                        {/* REGISTER LINK */}

                        <div className="login-register-section">

                            <span>
                                Don't have an account?
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/register")
                                }
                            >
                                Create account
                            </button>

                        </div>


                        {/* SECURITY NOTE */}

                        <div className="login-security-note">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                aria-hidden="true"
                            >

                                <path
                                    d="M12 3 5 6v5c0 4.6 2.9 8.4 7 10 4.1-1.6 7-5.4 7-10V6l-7-3Z"
                                />

                                <path d="m9 12 2 2 4-4" />

                            </svg>

                            <span>
                                Your account is securely protected.
                            </span>

                        </div>

                    </div>


                    {/* BOTTOM TEXT */}

                    <p className="login-bottom-text">

                        PlacementAI helps students prepare, practice and
                        navigate their placement journey from one platform.

                    </p>

                </div>

            </section>

        </div>
    );
}


export default Login;