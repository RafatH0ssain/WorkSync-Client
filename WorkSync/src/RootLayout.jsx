import { Outlet } from "react-router-dom";
import AuthProvider from "./components/Auth/AuthProvider";

const RootLayout = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
};

export default RootLayout;
