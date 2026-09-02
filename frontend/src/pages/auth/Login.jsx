import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";


function Login() {

    const navigate = useNavigate();

    const {
        login
    } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
            // Authenticate with FastAPI
            // ------------------------------------------------

            const response = await loginUser({
                email,
                password
            });


            // ------------------------------------------------
            // STEP 2
            // Store token and fetch current user
            // ------------------------------------------------

            const userData = await login(
                response.access_token
            );


            // ------------------------------------------------
            // STEP 3
            // Navigate according to user role
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

        <div>

            <h1>
                PlacementAI Login
            </h1>


            <form onSubmit={handleSubmit}>

                {/* EMAIL */}

                <div>

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Enter your email"
                        required
                        disabled={loading}
                    />

                </div>


                {/* PASSWORD */}

                <div>

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        required
                        disabled={loading}
                    />

                </div>


                {/* ERROR */}

                {error && (

                    <p>
                        {error}
                    </p>

                )}


                {/* LOGIN BUTTON */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Logging in..."
                        : "Login"
                    }

                </button>

            </form>

        </div>
    );
}


export default Login;