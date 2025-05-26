import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
    children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    return (
        <div className="relative min-h-screen bg-gray-100">
            <Header onOpenSidebar={() => setSidebarOpen(true)} /> {/* ✅ Truyền props */}
            <div style={{ display: "flex", flex: 1 }}>
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main style={{ flex: 1, padding: "20px" }}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
