import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";


function Register() {

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [role, setRole] = useState("student");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    // ========================================================
    // HANDLE REGISTER
    // ========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        // ----------------------------------------------------
        // PASSWORD VALIDATION
        // ----------------------------------------------------

        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        setLoading(true);


        try {

            // ------------------------------------------------
            // REGISTER USER
            // ------------------------------------------------

            await registerUser({

                full_name: fullName,

                email,

                password,

                role
            });


            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );


            // ------------------------------------------------
            // REDIRECT TO LOGIN
            // ------------------------------------------------

            setTimeout(() => {

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

            }, 1200);

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // UI
    // ========================================================

    return (

        <div className="register-page">


            {/* ==================================================
                BRAND
            ================================================== */}

            <div className="register-brand">

                <div className="register-brand-icon">
                    AI
                </div>

                <span>
                    PlacementAI
                </span>

            </div>


            {/* ==================================================
                REGISTER CARD
            ================================================== */}

            <div className="register-card">


                {/* HEADER */}

                <div className="register-header">

                    <span>
                        GET STARTED
                    </span>

                    <h1>
                        Create your account
                    </h1>

                    <p>
                        Join PlacementAI and start your placement journey.
                    </p>

                </div>


                {/* FORM */}

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >


                    {/* FULL NAME */}

                    <div className="register-field">

                        <label htmlFor="full-name">
                            Full name
                        </label>

                        <input
                            id="full-name"
                            type="text"
                            value={fullName}
                            onChange={(event) =>
                                setFullName(event.target.value)
                            }
                            placeholder="Enter your full name"
                            required
                            minLength={3}
                            maxLength={100}
                            disabled={loading}
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="register-field">

                        <label htmlFor="register-email">
                            Email address
                        </label>

                        <input
                            id="register-email"
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


                    {/* ROLE */}

                    <div className="register-field">

                        <label>
                            I am registering as
                        </label>


                        <div className="register-role-options">


                            {/* STUDENT */}

                            <button
                                type="button"
                                className={
                                    role === "student"
                                        ? "register-role-option active"
                                        : "register-role-option"
                                }
                                onClick={() => {
                                    setRole("student");
                                    setError("");
                                }}
                                disabled={loading}
                            >

                                <span className="register-role-icon">
                                    🎓
                                </span>

                                <span>

                                    <strong>
                                        Student
                                    </strong>

                                    <small>
                                        Prepare for placements
                                    </small>

                                </span>

                            </button>


                            {/* RECRUITER */}

                            <button
                                type="button"
                                className={
                                    role === "recruiter"
                                        ? "register-role-option active"
                                        : "register-role-option"
                                }
                                onClick={() => {
                                    setRole("recruiter");
                                    setError("");
                                }}
                                disabled={loading}
                            >

                                <span className="register-role-icon">
                                    💼
                                </span>

                                <span>

                                    <strong>
                                        Recruiter
                                    </strong>

                                    <small>
                                        Hire talented candidates
                                    </small>

                                </span>

                            </button>

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="register-field">

                        <label htmlFor="register-password">
                            Password
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Create a password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            maxLength={100}
                            disabled={loading}
                        />

                        <small className="register-help-text">
                            Password must contain at least 8 characters.
                        </small>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="register-field">

                        <label htmlFor="confirm-password">
                            Confirm password
                        </label>

                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div
                            className="register-error"
                            role="alert"
                        >

                            <span>
                                !
                            </span>

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div
                            className="register-success"
                            role="status"
                        >

                            <span>
                                ✓
                            </span>

                            <p>
                                {success}
                            </p>

                        </div>

                    )}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="register-submit-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating account..."
                            : "Create account"
                        }

                    </button>

                </form>


                {/* LOGIN */}

                <div className="register-login-link">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Sign in
                    </button>

                </div>

            </div>


            {/* FOOTER */}

            <p className="register-footer">
                © {new Date().getFullYear()} PlacementAI
            </p>

        </div>
    );
}


export default Register;