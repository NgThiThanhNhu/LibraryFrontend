import React from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
    children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
    return (
        <div >
            <Header />
            <div style={{ display: "flex", flex: 1 }}>
                <Sidebar />
                <main style={{ flex: 1, padding: "20px" }}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
