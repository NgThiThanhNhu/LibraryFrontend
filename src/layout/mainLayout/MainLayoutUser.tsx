// layout/mainLayout/MainLayoutGuest.tsx
import React from "react";
import Footer from "../Footer";

import HeaderUser from "../headers/HeaderUser";

type Props = {
    children: React.ReactNode;
};

const MainLayoutUser: React.FC<Props> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <HeaderUser />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

export default MainLayoutUser;
