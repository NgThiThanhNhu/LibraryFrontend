import { Route, Routes } from "react-router-dom"
import { PublisherPage } from "../pages/PublisherPage"

import { AdminRoute } from "../route/AdminRoute"


import ReserveBookPage from "../pages/ReserveBookPage"
import BorrowStatusPage from "../pages/BorrowStatusPage"
import BookExportBookPage from "../pages/BookExportPage"
import ManageBookItemsPage from "../pages/ManageBookItemPage"
import BorrowAndManageWrapper from "../pages/BorrowAndManageWrapper"
import ExportHistoryPage from "../pages/BookExport"
import ManageUsers from "../pages/ManageUser"
import BookExportPage from "../pages/BookExportPage"
import { AuthorPage } from "../pages/AuthorPage"
import { BookCategoryPage } from "../pages/BookCategoryPage"
import { BookChapterPage } from "../pages/BookChapterPage"
import { FloorPage } from "../pages/warehouse/FloorPage"
import { RoomPage } from "../pages/warehouse/RoomPage"
import { BookShelfPage } from "../pages/warehouse/BookShelfPage"
import { ShelfPage } from "../pages/warehouse/ShelfPage"
import { ShelfSectionPage } from "../pages/warehouse/ShelfSectionPage"
import { BookImportPage } from "../pages/warehouse/BookImportPage"
import { BookFilePage } from "../pages/BookFilePage"
import { BookImportTransactionPage } from "../pages/warehouse/BookImportTransaction"


export const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/publisher" element={<AdminRoute> <PublisherPage /> </AdminRoute>} />
            <Route path="/author" element={<AdminRoute> <AuthorPage /></AdminRoute>} />
            <Route path="/bookcategory" element={<AdminRoute> <BookCategoryPage /> </AdminRoute>} />
            <Route path="/bookchapter" element={<AdminRoute> <BookChapterPage /> </AdminRoute>} />
            <Route path="/warehouse/floor" element={<AdminRoute><FloorPage /> </AdminRoute>} />
            <Route path="/warehouse/room" element={<AdminRoute><RoomPage /> </AdminRoute>} />
            <Route path="/warehouse/bookshelf" element={<AdminRoute><BookShelfPage /> </AdminRoute>} />
            <Route path="/warehouse/shelf" element={<AdminRoute><ShelfPage /> </AdminRoute>} />
            <Route path="/warehouse/shelfsection" element={<AdminRoute><ShelfSectionPage /> </AdminRoute>} />
            <Route path="/bookimport" element={<AdminRoute><BookImportPage /> </AdminRoute>} />
            <Route path="/bookonline" element={<AdminRoute><BookFilePage /> </AdminRoute>} />
            <Route path="/importtransaction" element={<AdminRoute><BookImportTransactionPage /> </AdminRoute>} />

            <Route path="/bookreserve" element={<AdminRoute><ReserveBookPage /> </AdminRoute>} />
            <Route path="/bookexport" element={<AdminRoute><BookExportPage /> </AdminRoute>} />
            <Route path="/borrow-manage" element={<AdminRoute><BorrowAndManageWrapper /></AdminRoute>} />
            <Route path="/bookexporthistory" element={<AdminRoute><ExportHistoryPage /></AdminRoute>} />
            <Route path="/manageusers" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        </Routes>
    )
}