import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

// Login gate only. The server is the authorization boundary: a signed-in
// user here proves identity to Firebase, nothing more. Role checks live in
// RoleRoute and are UI convenience, not access control.
const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
};

export default PrivateRoute;