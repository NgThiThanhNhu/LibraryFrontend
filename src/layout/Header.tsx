import { useState } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import NotificationsIcon from '@mui/icons-material/Notifications';

interface Props {
    onHandleSideBar: () => void

}

const Header = ({ onHandleSideBar }: Props) => {

    return (
        <header className="bg-white shadow p-4 flex items-center">
            <div>
                <button
                    onClick={onHandleSideBar}

                    className="text-gray-700 hover:text-black"
                >
                    <FaBars size={24} />
                </button>
                <h1 className="ml-4 text-xl font-bold">Thư viện điện tử</h1>
            </div>
            <div>
                <button>
                    <FaBell size={17} />
                </button>
            </div>
        </header>
    );
};

export default Header;
