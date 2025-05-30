import { useState } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';

interface Props {
    onHandleSideBar: () => void

}

const Header = ({ onHandleSideBar }: Props) => {

    return (
        <header className="bg-white shadow p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onHandleSideBar}

                    className="text-gray-700 hover:text-black"
                >
                    <FaBars size={24} />
                </button>
                <h1 className="ml-4 text-xl font-bold">Thư viện điện tử</h1>
            </div>

            <div className="flex items-center space-x-4 ">
                <IconButton className="text-gray-600 hover:text-black">
                    <FaBell size={17} />
                </IconButton>
                <IconButton className="text-gray-600 hover:text-black">
                    <EmailIcon />
                </IconButton>
                <div className="relative group">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <img src="" className="w-8 h-8 rounded-full object-cover" />

                        <span className="font-medium text-sm text-gray-700">
                            Thanh Như
                        </span>
                    </div>
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 transform -translate-y-2 z-50">
                        <ul>
                            <li>
                                <button

                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <LogoutIcon className="mr-2" />
                                    Đăng xuất
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
