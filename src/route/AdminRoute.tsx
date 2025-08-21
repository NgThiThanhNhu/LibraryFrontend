import { Navigate } from "react-router-dom";
import { useAuth } from "../pages/Authentication/AuthContext";
import type { JSX, ReactNode } from "react";


export const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();
    console.log(user)
    if (isLoading) return <div>Loading...</div>;
    if (!user || user.role !== "admin") return <Navigate to="/unauthorized" />;

    return children;
};
