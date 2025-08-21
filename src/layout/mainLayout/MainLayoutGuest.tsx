// layout/mainLayout/MainLayoutGuest.tsx
import React from "react";
import Footer from "../Footer";
import HeaderGuest from "../headers/HeaderGuest";

type Props = {
    children: React.ReactNode;
};

const MainLayoutGuest: React.FC<Props> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <HeaderGuest />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

export default MainLayoutGuest;
