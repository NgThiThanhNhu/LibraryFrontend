import { useState } from "react";
import { FaCog, FaHome, FaUsers } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HistoryIcon from '@mui/icons-material/History';
import { Link } from "react-router-dom";


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
    const [isExportHistory, setIsExportHistory] = useState(false);
    const [isHistory, setIsHistory] = useState(false);
    const [isBookOnline, setIsBookOnline] = useState(false);
    return (
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            <div className="p-4 text-lg font-bold">My Library</div>
            <ul className="space-y-2 p-4 text-base">
                <li>
                    <Link to="/" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                        <FaHome className="text-lg" />
                        Dashboard
                    </Link>
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
                                <Link to="/admin/bookcategory" className="block px-4 py-1 hover:text-blue-400">Loại sách</Link>
                            </li>
                            <li>
                                <Link to="/admin/bookchapter" className="block px-4 py-1 hover:text-blue-400">Số tập</Link>
                            </li>
                            <li>
                                <Link to="/admin/borrow-manage" className="block px-4 py-1 hover:text-blue-400">Quản lý cuốn sách và trạng thái phiếu mượn</Link>
                            </li>
                        </ul>
                    )}
                </li>

                <li>
                    <div
                        onClick={() => setIsBookOnline(!isBookOnline)}
                        className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded cursor-pointer"
                    >
                        <FaBook className="text-lg" />
                        Quản lý sách online
                    </div>
                    {isBookOnline && (
                        <ul className="mt-1 ml-4 space-y-1 text-sm">
                            <li>
                                <Link to="/admin/bookonline" className="block px-4 py-1 hover:text-blue-400">Tải Sách</Link>
                            </li>

                        </ul>
                    )}
                </li>

                {/* Authors */}
                <li>
                    <Link to="/admin/author" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                        <FaUsers className="text-lg" />
                        Book Authors
                    </Link>
                </li>

                {/* Publishers */}
                <li>
                    <Link to="/admin/publisher" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                        <FaUsers className="text-lg" />
                        Publishers
                    </Link>
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
                                        <li><Link to="/admin/bookimport" className="block px-4 py-1 hover:text-blue-400">Nhập sách</Link></li>
                                        <li><Link to="/admin/bookexport" className="block px-4 py-1 hover:text-blue-400">Xuất sách</Link></li>
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
                                        <li><Link to="/admin/borrow-manage" className="block px-4 py-1 hover:text-blue-400">Mượn - Trả </Link></li>
                                        <li><Link to="/admin/bookreserve" className="block px-4 py-1 hover:text-blue-400">Đặt trước</Link></li>
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
                                        <li><Link to="/admin/warehouse/floor" className="block px-4 py-1 hover:text-blue-400">Tầng</Link></li>
                                        <li><Link to="/admin/warehouse/room" className="block px-4 py-1 hover:text-blue-400">Phòng</Link></li>
                                        <li><Link to="/admin/warehouse/bookshelf" className="block px-4 py-1 hover:text-blue-400">Tủ sách</Link></li>
                                        <li><Link to="/admin/warehouse/shelf" className="block px-4 py-1 hover:text-blue-400">Kệ sách</Link></li>
                                        <li><Link to="/admin/warehouse/shelfsection" className="block px-4 py-1 hover:text-blue-400">Ô sách</Link></li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    )}
                </li>

                {/* Users */}
                <li>
                    <Link to="/admin/manageusers" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                        <FaUsers className="text-lg" />
                        Users
                    </Link>
                </li>
                <li>
                    <div
                        onClick={() => setIsHistory(!isHistory)}
                        className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded cursor-pointer"
                    >
                        <HistoryIcon className="text-lg" />
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
                                        <li><Link to="/admin/importtransaction" className="block px-4 py-1 hover:text-blue-400">Lịch sử nhập sách</Link></li>
                                        <li><Link to="/admin/bookexporthistory" className="block px-4 py-1 hover:text-blue-400">Lịch sử xuất sách</Link></li>
                                    </ul>
                                )}
                            </li>
                            <li>
                                <div
                                    onClick={() => setIsExportHistory(!isExportHistory)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                                >
                                    <LocationOnIcon className="text-lg" />
                                    Xuất sách
                                </div>
                                {isExportHistory && (
                                    <ul className="mt-1 ml-4 space-y-1">

                                        <li><Link to="/admin/bookexporthistory" className="block px-4 py-1 hover:text-blue-400">Lịch sử xuất sách</Link></li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    )}
                </li>
                {/* Settings */}
                <li>
                    <Link to="/settings" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                        <FaCog className="text-lg" />
                        Settings
                    </Link>
                </li>
            </ul>
        </div>
    );
}
