import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Skeleton,
    Paper,
    InputBase,
    IconButton,
    alpha,
    Tabs,
    Tab,
    Avatar,
    LinearProgress,
    Button,
    Card,
    CardContent,
    Breadcrumbs,
    Link,
    Collapse,
    Chip,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BookCard from "../layout/BookCard";
import { BookImportWarehouseApi } from "../apis";
import MainLayoutUser from "../layout/mainLayout/MainLayoutUser";
import type { BookImportResponse } from "../response/Warehouse/BookImportResponse";
import { useNavigate } from "react-router-dom";

const UserHomePage: React.FC = () => {
    const [books, setBooks] = useState<BookImportResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTab, setSelectedTab] = useState(0);
    const [showProgress, setShowProgress] = useState(true);
    const [showAchievements, setShowAchievements] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await BookImportWarehouseApi.getAllBookImport();
                setBooks(response.data);
            } catch (error) {
                alert("Lỗi khi tải sách: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const newBooks = filteredBooks.slice(0, 10);
    const popularBooks = filteredBooks.slice(0, 10);
    const recommendedBooks = filteredBooks.slice(0, 10);

    return (
        <MainLayoutUser>
            {/* Breadcrumbs Navigation */}
            <Box
                sx={{
                    bgcolor: 'white',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 1.5,
                    mb: 3,
                }}
            >
                <Container maxWidth="xl">
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        sx={{
                            '& .MuiBreadcrumbs-separator': {
                                color: 'text.disabled',
                            }
                        }}
                    >
                        <Link
                            component="button"
                            onClick={() => navigate('/user/books')}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: 'primary.main',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                '&:hover': {
                                    textDecoration: 'underline',
                                }
                            }}
                        >
                            <HomeIcon sx={{ fontSize: 18 }} />
                            Trang chủ
                        </Link>
                        <Typography
                            sx={{
                                color: 'text.primary',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                            }}
                        >
                            Khám phá sách
                        </Typography>
                    </Breadcrumbs>
                </Container>
            </Box>

            {/* Welcome Banner */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: 4,
                    mb: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        right: '-10%',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-30%',
                        left: '-5%',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                    }
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    👋 Chào mừng trở lại!
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Khám phá những cuốn sách mới và tiếp tục hành trình đọc của bạn
                                </Typography>
                            </Box>

                            {/* Quick Stats */}
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>12</Typography>
                                    <Typography variant="caption">Đã mượn</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>3</Typography>
                                    <Typography variant="caption">Đang đọc</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>24</Typography>
                                    <Typography variant="caption">Yêu thích</Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Search Bar */}
                        <Paper
                            elevation={4}
                            sx={{
                                p: '4px 8px',
                                display: 'flex',
                                alignItems: 'center',
                                mt: 3,
                                borderRadius: 3,
                            }}
                        >
                            <SearchIcon sx={{ ml: 1, color: 'text.secondary' }} />
                            <InputBase
                                sx={{ ml: 2, flex: 1 }}
                                placeholder="Tìm kiếm sách, tác giả..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <IconButton
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                    mr: 0.5,
                                }}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mb: 6 }}>
                {/* Reading Progress - Collapsible */}
                <Paper
                    elevation={2}
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: 4,
                        }
                    }}
                >
                    <Box
                        onClick={() => setShowProgress(!showProgress)}
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            transition: 'background 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #e8ecf1 0%, #b8c6db 100%)',
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                                <AutoStoriesIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    📖 Tiếp tục đọc
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Bạn đã đọc 65% trong tháng này
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton>
                            {showProgress ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>

                    <Collapse in={showProgress}>
                        <Box sx={{ p: 3, pt: 2, bgcolor: 'white' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Mục tiêu: 20 cuốn/tháng
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                    13/20 cuốn
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={65}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: alpha('#000', 0.08),
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 5,
                                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<BookmarkIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Xem chi tiết
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </Paper>

                {/* Achievement Banner - Collapsible */}
                <Paper
                    elevation={2}
                    sx={{
                        mb: 4,
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: 4,
                        }
                    }}
                >
                    <Box
                        onClick={() => setShowAchievements(!showAchievements)}
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            transition: 'opacity 0.3s ease',
                            '&:hover': {
                                opacity: 0.95,
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                                <EmojiEventsIcon sx={{ color: '#FFD700' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    🏆 Thành tích của bạn
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    3 huy hiệu đã đạt được
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton sx={{ color: 'white' }}>
                            {showAchievements ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>

                    <Collapse in={showAchievements}>
                        <Box sx={{ p: 3, bgcolor: 'white' }}>
                            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                                <Card
                                    sx={{
                                        minWidth: 200,
                                        background: 'linear-gradient(135deg, #FFD89B 0%, #19547B 100%)',
                                        color: 'white',
                                        transition: 'transform 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 4,
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <EmojiEventsIcon sx={{ fontSize: 48, mb: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Top Reader
                                        </Typography>
                                        <Typography variant="caption">Tháng 11/2024</Typography>
                                    </CardContent>
                                </Card>

                                <Card
                                    sx={{
                                        minWidth: 200,
                                        background: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
                                        transition: 'transform 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 4,
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <StarIcon sx={{ fontSize: 48, mb: 1, color: '#FFD700' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            12 Sách
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Đã hoàn thành
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card
                                    sx={{
                                        minWidth: 200,
                                        background: 'linear-gradient(135deg, #FEE140 0%, #FA709A 100%)',
                                        color: 'white',
                                        transition: 'transform 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 4,
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <LocalFireDepartmentIcon sx={{ fontSize: 48, mb: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            7 Ngày
                                        </Typography>
                                        <Typography variant="caption">Streak đọc sách</Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                    </Collapse>
                </Paper>

                {/* Tabs Navigation */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                    <Tabs
                        value={selectedTab}
                        onChange={(e, newValue) => setSelectedTab(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                minHeight: 48,
                            }
                        }}
                    >
                        <Tab icon={<LocalFireDepartmentIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Đề xuất cho bạn" />
                        <Tab icon={<NewReleasesIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Sách mới" />
                        <Tab icon={<TrendingUpIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Phổ biến" />
                        <Tab icon={<StarIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Đánh giá cao" />
                    </Tabs>
                </Box>

                {/* Books Section */}
                {loading ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Box key={index} sx={{ width: 220 }}>
                                <Skeleton variant="rectangular" height={460} sx={{ borderRadius: 3 }} />
                            </Box>
                        ))}
                    </Box>
                ) : filteredBooks.length === 0 ? (
                    <Paper sx={{ p: 8, textAlign: 'center', bgcolor: alpha('#667eea', 0.05), borderRadius: 3, border: '2px dashed', borderColor: alpha('#667eea', 0.2) }}>
                        <AutoStoriesIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Không tìm thấy sách nào</Typography>
                        <Typography variant="body2" color="text.secondary">Thử tìm kiếm với từ khóa khác</Typography>
                    </Paper>
                ) : (
                    <>
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {selectedTab === 0 && '🔥 Đề xuất cho bạn'}
                                {selectedTab === 1 && '✨ Sách mới nhất'}
                                {selectedTab === 2 && '📈 Sách phổ biến'}
                                {selectedTab === 3 && '⭐ Đánh giá cao nhất'}
                            </Typography>
                            <Chip label={`${filteredBooks.length} kết quả`} color="primary" variant="outlined" />
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                            {(selectedTab === 0 ? recommendedBooks : selectedTab === 1 ? newBooks : selectedTab === 2 ? popularBooks : filteredBooks).map((book) => (
                                <Box key={book.id} sx={{ width: 220 }}>
                                    <BookCard bookInformation={book} />
                                </Box>
                            ))}
                        </Box>
                    </>
                )}
            </Container>
        </MainLayoutUser>
    );
};

export default UserHomePage;