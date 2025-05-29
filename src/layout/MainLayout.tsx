import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
    children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev)
    }
    return (
        <div className={` min-h-screen bg-gray-100 relative overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'} `}>
            <Sidebar isOpen={sidebarOpen} />
            <Header onHandleSideBar={toggleSidebar} />
            <main style={{ flex: 1, padding: "20px" }}>
                {children}
            </main>
            <Footer />
        </div>

    );
};

export default MainLayout;
