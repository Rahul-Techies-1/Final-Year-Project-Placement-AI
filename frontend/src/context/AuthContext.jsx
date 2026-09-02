import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../api/axios";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        () => localStorage.getItem("access_token")
    );

    const [user, setUser] = useState(() => {

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        try {

            return JSON.parse(storedUser);

        } catch {

            localStorage.removeItem("user");

            return null;
        }
    });


    const [loading, setLoading] = useState(true);


    // ========================================================
    // LOGIN
    // ========================================================

    const login = async (accessToken) => {

        localStorage.setItem(
            "access_token",
            accessToken
        );

        setToken(accessToken);

        try {

            /*
             * Get the complete logged-in user
             * from the backend.
             *
             * Backend endpoint:
             * GET /users/me
             */

            const response = await api.get(
                "/users/me"
            );

            const userData = response.data;


            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            setUser(userData);


            return userData;

        } catch (error) {

            /*
             * If token is invalid,
             * completely clear authentication.
             */

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "user"
            );

            setToken(null);
            setUser(null);

            throw error;
        }
    };


    // ========================================================
    // LOGOUT
    // ========================================================

    const logout = () => {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "user"
        );

        setToken(null);
        setUser(null);
    };


    // ========================================================
    // RESTORE AUTHENTICATION
    // ========================================================

    useEffect(() => {

        const restoreAuthentication = async () => {

            const storedToken =
                localStorage.getItem("access_token");


            /*
             * No token means the user is simply
             * not logged in.
             */

            if (!storedToken) {

                setLoading(false);

                return;
            }


            try {

                /*
                 * Verify the stored token by calling
                 * our backend.
                 */

                const response = await api.get(
                    "/users/me"
                );

                const userData = response.data;


                /*
                 * Store fresh user information.
                 */

                localStorage.setItem(
                    "user",
                    JSON.stringify(userData)
                );


                setToken(storedToken);
                setUser(userData);

            } catch (error) {

                /*
                 * Token is invalid/expired.
                 * Clear everything.
                 */

                localStorage.removeItem(
                    "access_token"
                );

                localStorage.removeItem(
                    "user"
                );

                setToken(null);
                setUser(null);

            } finally {

                /*
                 * Authentication restoration
                 * is now complete.
                 */

                setLoading(false);
            }
        };


        restoreAuthentication();

    }, []);


    // ========================================================
    // AUTHENTICATION STATE
    // ========================================================

    const isAuthenticated =
        Boolean(token && user);


    // ========================================================
    // CONTEXT PROVIDER
    // ========================================================

    return (

        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated,
                loading,
            }}
        >

            {children}

        </AuthContext.Provider>
    );
}


// ============================================================
// USE AUTH HOOK
// ============================================================

export function useAuth() {

    const context =
        useContext(AuthContext);


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }


    return context;
}