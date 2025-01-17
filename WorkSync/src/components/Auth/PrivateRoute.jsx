import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
};

export default PrivateRoute;