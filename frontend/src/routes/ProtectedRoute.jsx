import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function ProtectedRoute({ allowedRoles }) {

    const {
        isAuthenticated,
        user,
        loading
    } = useAuth();


    // ========================================================
    // AUTHENTICATION RESTORATION
    // ========================================================

    if (loading) {

        return (
            <div>
                <h2>Loading PlacementAI...</h2>
            </div>
        );
    }


    // ========================================================
    // NOT AUTHENTICATED
    // ========================================================

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ========================================================
    // ROLE AUTHORIZATION
    // ========================================================

    if (
        allowedRoles &&
        !allowedRoles.includes(user?.role)
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    // ========================================================
    // ACCESS GRANTED
    // ========================================================

    return <Outlet />;
}


export default ProtectedRoute;