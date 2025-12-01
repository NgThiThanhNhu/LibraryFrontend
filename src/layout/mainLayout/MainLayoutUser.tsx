import React from "react";
import { Box, Container } from "@mui/material";
import Footer from "../Footer";
import HeaderUser from "../headers/HeaderUser";

type Props = {
    children: React.ReactNode;
};

const MainLayoutUser: React.FC<Props> = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: '#f5f5f5',
            }}
        >
            <HeaderUser />

            <Box
                component="main"
                sx={{
                    flex: 1,
                    width: '100%',
                    py: { xs: 3, sm: 4 },
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
    );
};

export default MainLayoutUser;