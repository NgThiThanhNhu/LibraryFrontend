import React from "react";
import { Box } from "@mui/material";
import Footer from "../Footer";
import HeaderGuest from "../headers/HeaderGuest";

type Props = {
    children: React.ReactNode;
};

const MainLayoutGuest: React.FC<Props> = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'grey.50',
            }}
        >
            <HeaderGuest />

            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                {children}
            </Box>

            <Footer />
        </Box>
    );
};

export default MainLayoutGuest;