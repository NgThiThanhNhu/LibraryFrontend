import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Header from "../headers/Header";

type Props = {
    children: React.ReactNode;
};

const MainLayoutAdmin: React.FC<Props> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                bgcolor: '#f5f5f5',
            }}
        >
            <Sidebar isOpen={sidebarOpen} />

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    marginLeft: sidebarOpen ? '260px' : '0',
                    transition: 'margin-left 0.3s ease-in-out',
                    width: sidebarOpen ? 'calc(100% - 260px)' : '100%',
                }}
            >
                <Header onHandleSideBar={toggleSidebar} />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        py: { xs: 2, sm: 3 },
                    }}
                >
                    <Container
                        maxWidth="xl"
                        sx={{
                            px: { xs: 2, sm: 3 },
                        }}
                    >
                        {children}
                    </Container>
                </Box>

                <Footer />
            </Box>
        </Box>
    );
};

export default MainLayoutAdmin;