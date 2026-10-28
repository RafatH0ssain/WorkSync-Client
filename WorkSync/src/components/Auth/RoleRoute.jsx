import { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

// UI convenience only. The server is the authorization boundary for every
// action behind these routes; hiding a page here is not access control.
const RoleRoute = ({ allowedRoles, children }) => {
    const { user, userDetails, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    // Role comes from the server's user record (see AuthProvider), never from
    // localStorage or a client-side token claim. Server re-checks on every call.
    const role = userDetails?.userType;
    if (!allowedRoles.includes(role)) {
        return (
            <div className="max-w-6xl mx-auto mt-20 text-center">
                <p className="text-gray-600">
                    This page belongs to the {allowedRoles.join(" / ")} panel.
                    Your account is signed in as {role || "employee"}.
                </p>
                <Link to="/" className="text-orange-600 hover:text-orange-700 font-semibold">
                    Back to home
                </Link>
            </div>
        );
    }

    return children;
};

export default RoleRoute;
