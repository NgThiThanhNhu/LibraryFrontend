import { FaCog, FaHome, FaUsers } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";

interface Props {
    isOpen: boolean,

}
export default function Sidebar({ isOpen }: Props) {

    return (
        <>
            <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} `}>
                <div className="p-4 text-lg font-bold">My Library</div>
                <ul className="space-y-2 p-4">
                    <li><a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"><FaHome /> Dashboard</a></li>
                    <li><a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"><FaBook /> Books</a></li>
                    <li><a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"><FaUsers /> Users</a></li>
                    <li><a href="#" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded"><FaCog /> Settings</a></li>
                </ul>
            </div>
        </>
    );
}



