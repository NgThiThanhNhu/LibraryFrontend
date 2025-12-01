import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Skeleton,
    Chip,
    Paper,
    InputBase,
    IconButton,
    alpha
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookCard from "../layout/BookCard";
import { BookImportWarehouseApi } from "../apis";
import MainLayoutGuest from "../layout/mainLayout/MainLayoutGuest";
import type { BookImportResponse } from "../response/Warehouse/BookImportResponse";

const HomePage: React.FC = () => {
    const [books, setBooks] = useState<BookImportResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await BookImportWarehouseApi.getAllBookImport();
                setBooks(response.data);
                console.log(response.data);
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

    return (
        <MainLayoutGuest>
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: { xs: 6, md: 8 },
                    mb: 5,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        pointerEvents: 'none',
                    }
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
                        <AutoStoriesIcon
                            sx={{
                                fontSize: { xs: 56, md: 72 },
                                mb: 2,
                                opacity: 0.95,
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                            }}
                        />
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                fontSize: { xs: '2rem', md: '3.5rem' },
                                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                letterSpacing: '-0.5px'
                            }}
                        >
                            Khám phá kho tàng tri thức
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                opacity: 0.95,
                                fontSize: { xs: '1rem', md: '1.3rem' },
                                fontWeight: 400,
                                maxWidth: 600,
                                mx: 'auto'
                            }}
                        >
                            Hàng ngàn đầu sách chất lượng cao đang chờ bạn khám phá
                        </Typography>
                    </Box>

                    {/* Search Bar */}
                    <Paper
                        elevation={8}
                        sx={{
                            p: '4px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            maxWidth: 700,
                            mx: 'auto',
                            borderRadius: 4,
                            position: 'relative',
                            zIndex: 1,
                            background: 'white',
                        }}
                    >
                        <SearchIcon sx={{ ml: 1, color: 'text.secondary' }} />
                        <InputBase
                            sx={{
                                ml: 2,
                                flex: 1,
                                fontSize: '1rem',
                                '& input::placeholder': {
                                    opacity: 0.7
                                }
                            }}
                            placeholder="Tìm kiếm sách, tác giả, thể loại..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <IconButton
                            type="button"
                            sx={{
                                p: 1.5,
                                bgcolor: 'primary.main',
                                color: 'white',
                                mr: 0.5,
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                }
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>

                    {/* Quick Stats - Inline */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 4,
                            mt: 4,
                            flexWrap: 'wrap'
                        }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {books.length}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Đầu sách
                            </Typography>
                        </Box>
                        <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)' }} />
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {Math.floor(books.length * 0.3)}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Sách mới
                            </Typography>
                        </Box>
                        <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)' }} />
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {Math.floor(books.length * 0.5)}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Đang mượn
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mb: 6 }}>
                <Box
                    sx={{
                        mb: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mb: 0.5,
                                fontSize: { xs: '1.75rem', md: '2.125rem' }
                            }}
                        >
                            Tất cả sách
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {filteredBooks.length} kết quả
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                            label="Mới nhất"
                            color="primary"
                            sx={{ fontWeight: 600, height: 32 }}
                        />
                        <IconButton
                            size="small"
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                            }}
                        >
                            <FilterListIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            justifyContent: 'center',
                        }}
                    >
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Box key={index} sx={{ width: 220 }}>
                                <Skeleton variant="rectangular" height={460} sx={{ borderRadius: 3 }} />
                            </Box>
                        ))}
                    </Box>
                ) : filteredBooks.length === 0 ? (
                    <Paper
                        sx={{
                            p: 8,
                            textAlign: 'center',
                            bgcolor: alpha('#667eea', 0.05),
                            borderRadius: 3,
                            border: '2px dashed',
                            borderColor: alpha('#667eea', 0.2),
                        }}
                    >
                        <AutoStoriesIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                            Không tìm thấy sách nào
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
                        </Typography>
                    </Paper>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            justifyContent: 'center', // Căn giữa
                        }}
                    >
                        {filteredBooks.map((book) => (
                            <Box
                                key={book.id}
                                sx={{
                                    width: 220, // Fixed width cho mỗi card
                                    flexShrink: 0,
                                }}
                            >
                                <BookCard bookInformation={book} />
                            </Box>
                        ))}
                    </Box>
                )}
            </Container>
        </MainLayoutGuest>
    );
};

export default HomePage;