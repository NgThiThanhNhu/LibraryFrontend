import { Box, Container, Typography, Link, IconButton, Divider, Stack } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        library: [
            { label: 'Giới thiệu', path: '/about' },
            { label: 'Danh mục sách', path: '/books' },
            { label: 'Sách mới', path: '/new-books' },
            { label: 'Sách phổ biến', path: '/popular' },
        ],
        services: [
            { label: 'Hướng dẫn mượn sách', path: '/guide' },
            { label: 'Chính sách thư viện', path: '/policy' },
            { label: 'Câu hỏi thường gặp', path: '/faq' },
            { label: 'Liên hệ hỗ trợ', path: '/support' },
        ],
    };

    const contactInfo = [
        { icon: <PhoneIcon fontSize="small" />, text: '(028) 3822 4526', href: 'tel:+842838224526' },
        { icon: <EmailIcon fontSize="small" />, text: 'library@university.edu.vn', href: 'mailto:library@university.edu.vn' },
        { icon: <LocationOnIcon fontSize="small" />, text: '268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM', href: '#' },
    ];

    const socialLinks = [
        { icon: <FacebookIcon />, label: 'Facebook', href: 'https://facebook.com' },
        { icon: <TwitterIcon />, label: 'Twitter', href: 'https://twitter.com' },
        { icon: <InstagramIcon />, label: 'Instagram', href: 'https://instagram.com' },
        { icon: <YouTubeIcon />, label: 'YouTube', href: 'https://youtube.com' },
    ];

    const legalLinks = [
        { label: 'Điều khoản sử dụng', path: '/terms' },
        { label: 'Chính sách bảo mật', path: '/privacy' },
        { label: 'Quy định chung', path: '/regulations' },
    ];

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#1a1a2e',
                color: 'grey.300',
                pt: 6,
                pb: 3,
                mt: 'auto',
                borderTop: '1px solid',
                borderColor: 'rgba(255,255,255,0.1)'
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        mb: 4,
                        justifyContent: 'space-between'
                    }}
                >
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 35%' }, minWidth: 280 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <MenuBookIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: 'white',
                                    fontSize: '1.3rem',
                                }}
                            >
                                Thư viện điện tử
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2.5, color: 'grey.400', lineHeight: 1.7, maxWidth: 400 }}>
                            Nền tảng thư viện số hiện đại, cung cấp hàng ngàn đầu sách chất lượng cao, phục vụ nhu cầu học tập và nghiên cứu.
                        </Typography>

                        <Stack direction="row" spacing={1.5}>
                            {socialLinks.map((social, index) => (
                                <IconButton
                                    key={index}
                                    component="a"
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    size="small"
                                    sx={{
                                        color: 'grey.400',
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        '&:hover': {
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 45%', md: '0 1 auto' },
                            display: 'flex',
                            gap: 4,
                            flexWrap: 'wrap'
                        }}
                    >
                        <Box sx={{ minWidth: 150 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    color: 'white',
                                    fontSize: '1rem',
                                }}
                            >
                                Thư viện
                            </Typography>
                            <Stack spacing={1.2}>
                                {footerLinks.library.map((link, index) => (
                                    <Link
                                        key={index}
                                        onClick={() => navigate(link.path)}
                                        sx={{
                                            color: 'grey.400',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            display: 'block',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                color: 'primary.main',
                                                paddingLeft: '8px',
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </Stack>
                        </Box>

                        <Box sx={{ minWidth: 150 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    color: 'white',
                                    fontSize: '1rem',
                                }}
                            >
                                Dịch vụ
                            </Typography>
                            <Stack spacing={1.2}>
                                {footerLinks.services.map((link, index) => (
                                    <Link
                                        key={index}
                                        onClick={() => navigate(link.path)}
                                        sx={{
                                            color: 'grey.400',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            display: 'block',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                color: 'primary.main',
                                                paddingLeft: '8px',
                                            },
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </Stack>
                        </Box>
                    </Box>

                    <Box sx={{ flex: { xs: '1 1 100%', md: '0 1 280px' }, minWidth: 250 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                mb: 2,
                                color: 'white',
                                fontSize: '1rem',
                            }}
                        >
                            Liên hệ
                        </Typography>
                        <Stack spacing={1.5}>
                            {contactInfo.map((contact, index) => (
                                <Box
                                    key={index}
                                    component="a"
                                    href={contact.href}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 1.5,
                                        color: 'grey.400',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        transition: 'color 0.2s ease',
                                        '&:hover': {
                                            color: 'primary.main',
                                        },
                                    }}
                                >
                                    <Box sx={{ color: 'primary.main', mt: 0.3 }}>
                                        {contact.icon}
                                    </Box>
                                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                        {contact.text}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>

                        <Box sx={{ mt: 3 }}>
                            <Typography
                                variant="body2"
                                sx={{ color: 'white', fontWeight: 600, mb: 1, fontSize: '0.875rem' }}
                            >
                                Giờ làm việc
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'grey.400', fontSize: '0.8rem' }}>
                                Thứ 2 - Thứ 6: 7:00 - 21:00
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'grey.400', fontSize: '0.8rem' }}>
                                Thứ 7 - CN: 8:00 - 17:00
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'grey.500',
                            fontSize: '0.85rem',
                            textAlign: { xs: 'center', md: 'left' },
                        }}
                    >
                        © {currentYear} Thư viện điện tử. All rights reserved.
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2.5}
                        sx={{
                            flexWrap: 'wrap',
                            justifyContent: { xs: 'center', md: 'flex-end' },
                        }}
                    >
                        {legalLinks.map((link, index) => (
                            <Link
                                key={index}
                                onClick={() => navigate(link.path)}
                                sx={{
                                    color: 'grey.500',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        color: 'primary.main',
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;