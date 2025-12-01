import { AppBar, Toolbar, Container, Button, Box, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const HeaderGuest = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        const token = Cookies.get("jwtToken");
        if (!token) {
            navigate("/login");
        }
    };

    return (
        <AppBar
            position="sticky"
            elevation={1}
            sx={{
                bgcolor: 'white',
                color: 'text.primary',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: { xs: 64, sm: 70 },
                        justifyContent: 'space-between'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            cursor: 'pointer',
                            '&:hover': {
                                opacity: 0.8
                            }
                        }}
                        onClick={() => navigate('/')}
                    >
                        <MenuBookIcon
                            sx={{
                                fontSize: 32,
                                color: 'primary.main'
                            }}
                        />
                        <Box>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '1.1rem', sm: '1.3rem' },
                                    color: 'text.primary',
                                    lineHeight: 1.2
                                }}
                            >
                                Thư viện điện tử
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '0.75rem',
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                Tri thức không giới hạn
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: 3,
                                mr: 2
                            }}
                        >
                            <Button
                                color="inherit"
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    color: 'text.secondary',
                                    '&:hover': {
                                        color: 'primary.main',
                                        bgcolor: 'transparent'
                                    }
                                }}
                            >
                                Giới thiệu
                            </Button>
                            <Button
                                color="inherit"
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    color: 'text.secondary',
                                    '&:hover': {
                                        color: 'primary.main',
                                        bgcolor: 'transparent'
                                    }
                                }}
                            >
                                Liên hệ
                            </Button>
                        </Box>

                        {/* Login Button */}
                        <Button
                            variant="contained"
                            startIcon={<LoginIcon />}
                            onClick={handleLogin}
                            sx={{
                                textTransform: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                boxShadow: 2,
                                '&:hover': {
                                    boxShadow: 4,
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default HeaderGuest;