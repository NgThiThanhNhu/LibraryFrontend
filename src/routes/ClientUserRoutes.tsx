import { Routes, Route } from "react-router-dom";


import BookListUserHomePage from "../pages/UserHomePage";

import MyBookList from "../pages/MyBookList";
import BorrowingStatusPage from "../pages/BorrowingStatusPage";
import { BookDetailPage } from "../pages/BookDetailPage";






export const ClientUserRoutes = () => {
    return (
        <Routes>
            <Route path="/books" element={<BookListUserHomePage />} />
            <Route path="/books/:slug" element={<BookDetailPage />} />
            <Route path="/mybooklist" element={<MyBookList />} />
            <Route path="/borrowingstatus" element={<BorrowingStatusPage />} />

        </Routes>
    );
};