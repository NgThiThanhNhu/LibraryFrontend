import { useEffect, useState } from "react"
import type { BookImportResponse } from "../response/Warehouse/BookImportResponse"
import { BookImportWarehouseApi } from "../apis"
import MainLayoutUser from "../layout/mainLayout/MainLayoutUser"
import {
    Box,
    Button,
    Container,
    Typography,
    Chip,
    Paper,
    Rating,
    Divider,
    Avatar,
    Tab,
    Tabs,
    IconButton,
    Breadcrumbs,
    Link,
    alpha,
    Grid,
} from "@mui/material"
import BookCard from "../layout/BookCard"
import { useParams, useNavigate } from "react-router-dom"
import ChooseBookItem from "../layout/ChooseBookItem"
import type { BookItemResponse } from "../response/BookItemResponse"
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InventoryIcon from '@mui/icons-material/Inventory';


export const BookDetailPage = () => {
    const initialBookDetail: BookImportResponse = {
        id: " ",
        title: " ",
        categoryId: " ",
        bookChapterId: " ",
        publisherId: " ",
        bookAuthorId: " ",
        authorName: " ",
        publisherName: " ",
        yearPublished: null,
        quantity: 0,
        totalPrice: null,
        unitPrice: null,
        categoryName: " ",
        titleBookChapter: " ",
        description: " ",
        slug: " ",
        bookFileId: [],
        imageUrls: [],
        fileUrls: []
    }

    const { slug } = useParams();
    const navigate = useNavigate();
    const [bookDetail, setBookDetail] = useState<BookImportResponse>(() => initialBookDetail)
    const [bookitem, setBookItem] = useState<BookItemResponse>()
    const [fileUrl, setFileUrl] = useState<string[]>([])
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [relatedBooks, setRelatedBooks] = useState<BookImportResponse[]>([]);

    const onHandleReadOnline = (bookDetail: BookImportResponse) => {
        if (!bookDetail.fileUrls || bookDetail.fileUrls.length === 0) {
            alert("Sách này chưa có file đọc online!");
            return;
        }
        window.open(bookDetail.fileUrls[0], "_blank");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await BookImportWarehouseApi.getBookImportBySlug(slug!);
                if (!response.data.isSuccess) {
                    alert('Không kết nối được')
                    return;
                }
                setBookDetail(response.data.data)

                // Fetch related books
                const allBooksResponse = await BookImportWarehouseApi.getAllBookImport();
                setRelatedBooks(allBooksResponse.data.slice(0, 4));
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [slug])

    return (
        <MainLayoutUser>
            {/* Breadcrumbs */}
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
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
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
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            <HomeIcon sx={{ fontSize: 18 }} />
                            Trang chủ
                        </Link>
                        <Link
                            component="button"
                            onClick={() => navigate('/user/books')}
                            sx={{
                                color: 'text.secondary',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Khám phá sách
                        </Link>
                        <Typography sx={{ color: 'text.primary', fontSize: '0.9rem', fontWeight: 600 }}>
                            {bookDetail?.title?.substring(0, 40)}{bookDetail?.title?.length > 40 ? '...' : ''}
                        </Typography>
                    </Breadcrumbs>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mb: 6 }}>
                {/* Main Content */}
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: 'white',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 4,
                            p: { xs: 3, md: 4 },
                        }}
                    >
                        {/* Book Image */}
                        <Box
                            sx={{
                                width: { xs: '100%', md: 320 },
                                flexShrink: 0,
                                position: 'relative',
                            }}
                        >
                            <Box
                                component="img"
                                src={bookDetail?.imageUrls?.[0] || "/default-book.jpg"}
                                alt={bookDetail?.title}
                                sx={{
                                    width: '100%',
                                    height: { xs: 400, md: 480 },
                                    objectFit: 'cover',
                                    borderRadius: 3,
                                    boxShadow: 4,
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                    }
                                }}
                            />

                            {/* Floating Badge */}
                            <Chip
                                label={bookDetail?.quantity > 0 ? "Có sẵn" : "Hết sách"}
                                color={bookDetail?.quantity > 0 ? "success" : "error"}
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    left: 16,
                                    fontWeight: 700,
                                    boxShadow: 2,
                                }}
                            />

                            {/* Favorite Button */}
                            <IconButton
                                onClick={() => setIsFavorite(!isFavorite)}
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    bgcolor: alpha('#fff', 0.9),
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: 'white',
                                        transform: 'scale(1.1) rotate(10deg)',
                                    }
                                }}
                            >
                                {isFavorite ? (
                                    <FavoriteIcon sx={{ color: 'error.main' }} />
                                ) : (
                                    <FavoriteBorderIcon sx={{ color: 'error.main' }} />
                                )}
                            </IconButton>

                            {/* View Count */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: 16,
                                    right: 16,
                                    bgcolor: alpha('#000', 0.7),
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 2,
                                    p: 1.5,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
                                    <VisibilityIcon sx={{ fontSize: 18 }} />
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                        1.2K lượt xem
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
                                    <FavoriteIcon sx={{ fontSize: 18 }} />
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                        248
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Book Info */}
                        <Box sx={{ flex: 1 }}>
                            {/* Category Chip */}
                            <Chip
                                label={bookDetail?.categoryName}
                                color="primary"
                                size="small"
                                sx={{ mb: 2, fontWeight: 600 }}
                            />

                            {/* Title */}
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                                    lineHeight: 1.2,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {bookDetail?.title}
                            </Typography>

                            {/* Rating */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Rating value={4.5} precision={0.5} readOnly size="large" />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    4.5
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    (128 đánh giá)
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Book Details Grid */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={6}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: alpha('#667eea', 0.05),
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: alpha('#667eea', 0.1),
                                                transform: 'translateX(5px)',
                                            }
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Tác giả
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {bookDetail?.authorName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: alpha('#f093fb', 0.05),
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: alpha('#f093fb', 0.1),
                                                transform: 'translateX(5px)',
                                            }
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: '#f093fb', width: 40, height: 40 }}>
                                            <BusinessIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Nhà xuất bản
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {bookDetail?.publisherName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: alpha('#4facfe', 0.05),
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: alpha('#4facfe', 0.1),
                                                transform: 'translateX(5px)',
                                            }
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: '#4facfe', width: 40, height: 40 }}>
                                            <InventoryIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Số lượng
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: bookDetail?.quantity > 0 ? 'success.main' : 'error.main'
                                                }}
                                            >
                                                {bookDetail?.quantity || 0} cuốn
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {bookDetail?.yearPublished && (
                                    <Grid item xs={12} sm={6}>
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: alpha('#fa709a', 0.05),
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: alpha('#fa709a', 0.1),
                                                    transform: 'translateX(5px)',
                                                }
                                            }}
                                        >
                                            <Avatar sx={{ bgcolor: '#fa709a', width: 40, height: 40 }}>
                                                <CalendarTodayIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Năm xuất bản
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {bookDetail?.yearPublished}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <ChooseBookItem bookId={bookDetail.id} />
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<MenuBookIcon />}
                                    onClick={() => onHandleReadOnline(bookDetail)}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 3,
                                        borderWidth: 2,
                                        '&:hover': {
                                            borderWidth: 2,
                                            transform: 'translateY(-2px)',
                                            boxShadow: 2,
                                        }
                                    }}
                                >
                                    Đọc online
                                </Button>
                                <IconButton
                                    sx={{
                                        border: '2px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            bgcolor: alpha('#667eea', 0.05),
                                        }
                                    }}
                                >
                                    <ShareIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>

                    {/* Tabs Section */}
                    <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                        <Tabs
                            value={selectedTab}
                            onChange={(e, newValue) => setSelectedTab(newValue)}
                            sx={{
                                px: 3,
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                }
                            }}
                        >
                            <Tab label="📖 Mô tả" />
                            <Tab label="📋 Chi tiết" />
                            <Tab label="⭐ Đánh giá" />
                        </Tabs>

                        <Box sx={{ p: 4 }}>
                            {selectedTab === 0 && (
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                        Giới thiệu về cuốn sách
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            lineHeight: 1.8,
                                            textAlign: 'justify',
                                            whiteSpace: 'pre-line',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        {bookDetail?.description || "Không có mô tả cho cuốn sách này."}
                                    </Typography>
                                </Box>
                            )}
                            {selectedTab === 1 && (
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                        Thông tin xuất bản
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: 'grey.50',
                                                '&:hover': { bgcolor: 'grey.100' }
                                            }}
                                        >
                                            <Typography sx={{ width: 200, fontWeight: 600 }}>Nhà xuất bản:</Typography>
                                            <Typography color="text.secondary">{bookDetail?.publisherName || 'N/A'}</Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: 'grey.50',
                                                '&:hover': { bgcolor: 'grey.100' }
                                            }}
                                        >
                                            <Typography sx={{ width: 200, fontWeight: 600 }}>Số tập:</Typography>
                                            <Typography color="text.secondary">{bookDetail?.titleBookChapter || 'N/A'}</Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: 'grey.50',
                                                '&:hover': { bgcolor: 'grey.100' }
                                            }}
                                        >
                                            <Typography sx={{ width: 200, fontWeight: 600 }}>Đơn giá:</Typography>
                                            <Typography color="text.secondary" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                {bookDetail?.unitPrice?.toLocaleString() || 'N/A'} VNĐ
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                            {selectedTab === 2 && (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                        Đánh giá từ độc giả
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Chưa có đánh giá nào cho cuốn sách này.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Paper>

                {/* Related Books */}
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                        📚 Có thể bạn cũng thích
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            justifyContent: 'center',
                        }}
                    >
                        {relatedBooks.map((book) => (
                            <Box key={book.id} sx={{ width: 220 }}>
                                <BookCard bookInformation={book} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </MainLayoutUser>
    )
}