import { FaCog, FaHome, FaUsers } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";

interface Props {
    isOpen: boolean,
    onClose: () => void
}
export default function Sidebar({ isOpen, onClose }: Props) {

    return (
        <>
            {isOpen && (
                < div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
            )}
            <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out`} >
                <div className="p-4 text-lg font-bold"> My Library
                </div>
                <ul className="space-y-2 p-4">
                    <li>
                        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                            <FaHome /> Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                            <FaBook /> Books
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                            <FaUsers /> Users
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
                            <FaCog /> Settings
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
}



