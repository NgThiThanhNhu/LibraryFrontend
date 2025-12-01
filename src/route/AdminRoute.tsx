import { Navigate } from "react-router-dom";
import { useAuth } from "../pages/Authentication/AuthContext";
import type { JSX, ReactNode } from "react";
import Cookies from "js-cookie";


export const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();
    const token = Cookies.get("jwtToken");
    if (isLoading) return <div>Loading...</div>;
    if (user?.roleName !== "admin") {
        return <Navigate to={`/login`} />;
    }
    if (!user || user.roleName !== "admin") return <Navigate to="/unauthorized" />;
    return children;
};
