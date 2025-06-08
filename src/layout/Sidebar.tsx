import { useState } from "react";
import { FaCog, FaHome, FaUsers } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface Props {
    isOpen: boolean;
}

export default function Sidebar({ isOpen }: Props) {
    const [isBooksOpen, setIsBooksOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
    const [isStorageAreaOpen, setIsStorageAreaOpen] = useState(false);
    const [isBookStatusOpen, setIsBookStatusOpen] = useState(false);
    const [isImportHistory, setIsImportHistory] = useState(false);
    const [isHistory, setIsHistory] = useState(false);

    return (
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            <div className="p-4 text-lg font-bold">My Library</div>
            <ul className="space-y-2 p-4 text-base">
                <li>
                    <a href="/" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                        <FaHome className="text-lg" />
                        Dashboard
                    </a>
                </li>

                {/* Books */}
                <li>
                    <div
                        onClick={() => setIsBooksOpen(!isBooksOpen)}
                        className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded cursor-pointer"
                    >
                        <FaBook className="text-lg" />
                        Books
                    </div>
                    {isBooksOpen && (
                        <ul className="mt-1 ml-4 space-y-1 text-sm">
                            <li>
                                <a href="/bookcategory" className="block px-4 py-1 hover:text-blue-400">Loại sách</a>
                            </li>
                            <li>
                                <a href="/bookchapter" className="block px-4 py-1 hover:text-blue-400">Số tập</a>
                            </li>
                            <li>
                                <a href="/bookitem" className="block px-4 py-1 hover:text-blue-400">Từng cuốn sách</a>
                            </li>
                        </ul>
                    )}
                </li>

                {/* Authors */}
                <li>
                    <a href="/author" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                        <FaUsers className="text-lg" />
                        Book Authors
                    </a>
                </li>

                {/* Publishers */}
                <li>
                    <a href="/publisher" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                        <FaUsers className="text-lg" />
                        Publishers
                    </a>
                </li>

                {/* Trạng thái */}
                <li>
                    <div
                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                        className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded cursor-pointer"
                    >
                        <AutorenewIcon className="text-lg" />
                        Quản lý trạng thái
                    </div>

                    {isStatusOpen && (
                        <ul className="mt-1 ml-4 space-y-1 text-sm">
                            <li>
                                <div
                                    onClick={() => setIsStorageAreaOpen(!isStorageAreaOpen)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                                >
                                    <AutorenewIcon className="text-lg" />
                                    Trạng thái của kho sách
                                </div>
                                {isStorageAreaOpen && (
                                    <ul className="mt-1 ml-4 space-y-1">
                                        <li><a href="/bookimport" className="block px-4 py-1 hover:text-blue-400">Nhập sách</a></li>
                                        <li><a href="/book-export" className="block px-4 py-1 hover:text-blue-400">Xuất sách</a></li>
                                    </ul>
                                )}
                            </li>

                            <li>
                                <div
                                    onClick={() => setIsBookStatusOpen(!isBookStatusOpen)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                                >
                                    <AutorenewIcon className="text-lg" />
                                    Trạng thái sách
                                </div>
                                {isBookStatusOpen && (
                                    <ul className="mt-1 ml-4 space-y-1">
                                        <li><a href="/book-status" className="block px-4 py-1 hover:text-blue-400">Mượn - Trả - Đặt trước</a></li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    )}
                </li>

                {/* Kho sách */}
                <li>
                    <div
                        onClick={() => setIsWarehouseOpen(!isWarehouseOpen)}
                        className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded cursor-pointer"
                    >
                        <WarehouseIcon className="text-lg" />
                        Kho sách
                    </div>
                    {isWarehouseOpen && (
                        <ul className="mt-1 ml-4 space-y-1 text-sm">
                            <li>
                                <div
                                    onClick={() => setIsStorageAreaOpen(!isStorageAreaOpen)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                                >
                                    <LocationOnIcon className="text-lg" />
                                    Quản lý khu vực lưu trữ
                                </div>
                                {isStorageAreaOpen && (
                                    <ul className="mt-1 ml-4 space-y-1">
                                        <li><a href="/warehouse/floor" className="block px-4 py-1 hover:text-blue-400">Tầng</a></li>
                                        <li><a href="/warehouse/room" className="block px-4 py-1 hover:text-blue-400">Phòng</a></li>
                                        <li><a href="/warehouse/bookshelf" className="block px-4 py-1 hover:text-blue-400">Tủ sách</a></li>
                                        <li><a href="/warehouse/shelf" className="block px-4 py-1 hover:text-blue-400">Kệ sách</a></li>
                                        <li><a href="/warehouse/shelfsection" className="block px-4 py-1 hover:text-blue-400">Ô sách</a></li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    )}
                </li>

                {/* Users */}
                <li>
                    <a href="/users" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                        <FaUsers className="text-lg" />
                        Users
                    </a>
                </li>
                <li>
                    <div
                        onClick={() => setIsHistory(!isHistory)}
                        className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded cursor-pointer"
                    >
                        <WarehouseIcon className="text-lg" />
                        Quản lý lịch sử
                    </div>
                    {isHistory && (
                        <ul className="mt-1 ml-4 space-y-1 text-sm">
                            <li>
                                <div
                                    onClick={() => setIsImportHistory(!isImportHistory)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                                >
                                    <LocationOnIcon className="text-lg" />
                                    Nhập sách
                                </div>
                                {isImportHistory && (
                                    <ul className="mt-1 ml-4 space-y-1">
                                        <li><a href="#" className="block px-4 py-1 hover:text-blue-400">Lịch sử nhập sách</a></li>

                                    </ul>
                                )}
                            </li>
                        </ul>
                    )}
                </li>
                {/* Settings */}
                <li>
                    <a href="/settings" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                        <FaCog className="text-lg" />
                        Settings
                    </a>
                </li>
            </ul>
        </div>
    );
}
