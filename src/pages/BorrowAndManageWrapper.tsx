import React, { useState } from 'react';
import BorrowStatusPage from './BorrowStatusPage';
import ManageBookItemsPage from './ManageBookItemPage';
import { Box, Tab, Tabs } from '@mui/material';
import MainLayout from '../layout/mainLayout/MainLayout';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export type StatusType = 'available' | 'borrowed' | 'reserved' | 'damaged';

interface BookItem {
    id: number;
    code: string;
    title: string;
    position: string;
    status: StatusType;
}

const initialBookItems: BookItem[] = [
    { id: 1, code: 'CSHARP-001', title: 'Lập trình C# cơ bản', position: 'Kệ A2', status: 'borrowed' },
    { id: 2, code: 'ML-002', title: 'Kỹ thuật học máy', position: 'Kệ A1', status: 'borrowed' },
    { id: 3, code: 'DS-003', title: 'Cấu trúc dữ liệu', position: 'Kệ B2', status: 'reserved' },
    { id: 4, code: 'SYS-004', title: 'Phân tích hệ thống', position: 'Kệ C1', status: 'damaged' },
];


const BorrowAndManageWrapper: React.FC = () => {
    const [bookItems, setBookItems] = useState<BookItem[]>(initialBookItems);
    const [tabIndex, setTabIndex] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const updateBookItemStatus = (id: number, status: StatusType) => {
        setBookItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
    };

    const deleteBookItem = (id: number) => {
        setBookItems((prev) => prev.filter((item) => item.id !== id));
    };
    // const handleSelectTab = (index: number) => {
    //     setTabIndex(index);
    //     setDropdownOpen(false); // Đóng dropdown sau khi chọn
    // };

    return (
        <MainLayout>
            <Box className="relative z-10 px-6 pt-4">
                {/* Dropdown Button */}
                <div className="relative inline-block text-left">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center justify-between w-64 px-2 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition"
                    >
                        <span>
                            {tabIndex === 0 ? "📖 Trạng thái mượn trả" : "📦 Quản lý BookItem"}
                        </span>
                        {dropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </button>

                    {/* Dropdown List */}
                    {dropdownOpen && (
                        <div className="absolute mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                            <ul className="divide-y divide-gray-200">
                                <li
                                    onClick={() => {
                                        setTabIndex(0);
                                        setDropdownOpen(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    📖 Trạng thái mượn trả
                                </li>
                                <li
                                    onClick={() => {
                                        setTabIndex(1);
                                        setDropdownOpen(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    📦 Quản lý BookItem
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Tab content */}
                <Box mt={2}>
                    {tabIndex === 0 && (
                        <BorrowStatusPage
                            bookItems={bookItems}
                            updateBookItemStatus={updateBookItemStatus}
                        />
                    )}
                    {tabIndex === 1 && (
                        <ManageBookItemsPage
                            bookItems={bookItems}
                            updateBookItemStatus={updateBookItemStatus}
                            deleteBookItem={deleteBookItem}
                        />
                    )}
                </Box>
            </Box>
        </MainLayout>
    );

};


export default BorrowAndManageWrapper;
