import { Routes, Route } from "react-router-dom";


import BookListUserHomePage from "../pages/UserHomePage";

import MyBookList from "../pages/MyBookList";
import BorrowingStatusPage from "../pages/BorrowingStatusPage";
import { BookDetailPage } from "../pages/BookDetailPage";
import { UserRoute } from "../route/UserRoute";






export const ClientUserRoutes = () => {
    return (
        <Routes>
            <Route path="/books" element={<UserRoute><BookListUserHomePage /></UserRoute>} />
            <Route path="/books/:slug" element={<UserRoute><BookDetailPage /></UserRoute>} />
            <Route path="/mybooklist" element={<UserRoute><MyBookList /></UserRoute>} />
            <Route path="/borrowingstatus" element={<UserRoute><BorrowingStatusPage /></UserRoute>} />
        </Routes>
    );
};