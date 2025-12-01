import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Cookies from "js-cookie";

export const GuestRoutes = () => {
    const token = Cookies.get("jwtToken");
    return (
        <Routes>
            <Route path="/" element={
                token ? <Navigate to="/user/books" replace /> : <HomePage />
            } />
        </Routes>
    );
};
