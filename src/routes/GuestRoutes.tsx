import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { UserRoute } from "../route/UserRoute";

export const GuestRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
    );
};
