import { useState } from "react";
import { FaBars } from "react-icons/fa";

interface Props {
    onOpenSidebar: () => void
}

const Header = ({ onOpenSidebar }: Props) => {

    return (
        <header className="bg-white shadow p-4 flex items-center">
            <button
                onClick={onOpenSidebar}

                className="text-gray-700 hover:text-black"
            >
                <FaBars size={24} />
            </button>
            <h1 className="ml-4 text-xl font-bold">Thư viện điện tử</h1>
        </header>
    );
};

export default Header;
