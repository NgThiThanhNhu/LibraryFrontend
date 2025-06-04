import { Button } from "@mui/material";
import { FaCog, FaHome, FaUsers } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WarehouseIcon from '@mui/icons-material/Warehouse';

interface Props {
    isOpen: boolean,

}
export default function Sidebar({ isOpen }: Props) {

    return (
        <>
            <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} `}>
                <div className="p-4 text-lg font-bold">My Library</div>
                <ul className="space-y-2 p-4 text-base">
                    <li>
                        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                            <FaHome className="text-lg" />
                            Dashboard
                        </a>
                    </li>

                    <li className="group relative">
                        <div className="flex items-center justify-between hover:bg-gray-700 p-2 rounded cursor-pointer">
                            <span className="flex items-center gap-2">
                                <FaBook className="text-lg" />
                                Books
                            </span>

                        </div>

                        <ul className="hidden group-hover:block mt-1 ml-4 space-y-1 text-sm">
                            <li>
                                <a href="/bookcategory" className="flex items-center gap-2 px-4 py-1 hover:text-blue-400">

                                    Loại sách
                                </a>
                            </li>
                            <li>
                                <a href="/bookchapter" className="block px-4 py-1 hover:text-blue-400">Số tập</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-1 hover:text-blue-400">Từng cuốn sách</a>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <a href="/author" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                            <FaUsers className="text-lg" />
                            Book Authors
                        </a>
                    </li>

                    <li>
                        <a href="/publisher" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                            <FaUsers className="text-lg" />
                            Publishers
                        </a>
                    </li>

                    <li className="relative group">
                        {/* Mục chính */}
                        <div className="flex items-center justify-between hover:bg-gray-700 p-2 rounded cursor-pointer">
                            <span className="flex items-center gap-2">
                                <AutorenewIcon className="text-lg" />
                                Quản lý trạng thái
                            </span>
                        </div>

                        <ul className="hidden group-hover:block mt-1 ml-4 space-y-1 text-sm">

                            <li className="relative group/item">
                                <div className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                                    <AutorenewIcon className="text-lg" />
                                    Trạng thái của kho sách
                                </div>


                                <ul className="hidden group-hover/item:block mt-1 ml-4 space-y-1 text-sm">
                                    <li>
                                        <a href="/bookcategory" className="block px-4 py-1 hover:text-blue-400">Nhập sách</a>
                                    </li>
                                    <li>
                                        <a href="/bookchapter" className="block px-4 py-1 hover:text-blue-400">Xuất sách</a>
                                    </li>
                                </ul>
                            </li>


                            <li className="relative group/item2">
                                <div className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                                    <AutorenewIcon className="text-lg" />
                                    Trạng thái sách
                                </div>


                                <ul className="hidden group-hover/item2:block  mt-1 ml-4 space-y-1 text-sm">
                                    <li>
                                        <a href="#" className="block px-4 py-1 hover:text-blue-400">Mượn - Trả - Đặt trước</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li className="group relative">
                        <div className="flex items-center justify-between hover:bg-gray-700 p-2 rounded cursor-pointer">
                            <span className="flex items-center gap-2">
                                <WarehouseIcon className="text-lg" />
                                Kho Sách
                            </span>

                        </div>

                        <ul className="hidden group-hover:block mt-1 ml-4 space-y-1 text-sm">
                            <li>
                                <a href="#" className="flex items-center gap-2 px-4 py-1 hover:text-blue-400">

                                    Quản lý khu vực lưu trữ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-1 hover:text-blue-400">Số tập</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-1 hover:text-blue-400">Từng cuốn sách</a>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                            <FaUsers className="text-lg" />
                            Users
                        </a>
                    </li>

                    <li>
                        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                            <FaCog className="text-lg" />
                            Settings
                        </a>
                    </li>
                </ul>

            </div>
        </>
    );
}



