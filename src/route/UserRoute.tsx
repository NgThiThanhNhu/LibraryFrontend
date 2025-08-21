import { Navigate } from "react-router-dom";
import { useAuth } from "../pages/Authentication/AuthContext";
import type { JSX, ReactNode } from "react";


export const UserRoute = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;
    if (!user || user.role !== "user") return <Navigate to="/unauthorized" />;

    return children;
};
