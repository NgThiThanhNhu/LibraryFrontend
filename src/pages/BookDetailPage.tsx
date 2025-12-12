import { useEffect, useState } from "react"
import type { BookImportResponse } from "../response/Warehouse/BookImportResponse"
import { BookImportWarehouseApi, UserBookIteractionApi } from "../apis"
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
    TextField,
    Card,
    CardContent,
    Stack,
    CircularProgress,
    Snackbar,
    Alert,
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
import SendIcon from '@mui/icons-material/Send';
import RateReviewIcon from '@mui/icons-material/RateReview';
import type { UserBookInteractionResponse } from "../response/UserBookIteractionResponse"
import type { UserBookIteractionRequest } from "../request/UserBookInteractionRequest"
import { Details } from "@mui/icons-material"

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
    }

    const { slug } = useParams();
    const navigate = useNavigate();
    const [bookDetail, setBookDetail] = useState<BookImportResponse>(() => initialBookDetail)
    const [bookitem, setBookItem] = useState<BookItemResponse>()
    const [fileUrl, setFileUrl] = useState<string[]>([])
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [relatedBooks, setRelatedBooks] = useState<BookImportResponse[]>([]);

    const [reviews, setReviews] = useState<UserBookInteractionResponse[]>([]);
    const [newRating, setNewRating] = useState<number>(0);
    const [newReviewText, setNewReviewText] = useState<string>("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

    const onHandleReadOnline = (bookDetail: BookImportResponse) => {
        if (!bookDetail.imageUrls || bookDetail.imageUrls.length === 0) {
            setSnackbar({
                open: true,
                message: "Sách này chưa có ảnh bìa!",
                severity: "error"
            });
            return;
        }
        navigate(`/user/read/${bookDetail.id}`, {
            state: {
                bookTitle: bookDetail.title,
                bookFileId: bookDetail.bookFileId
            }
        })
        // window.open(bookDetail.fileUrls[0], '_blank');
    };
    const fetchReviews = async (bookId: string) => {
        setIsLoadingReviews(true);
        try {
            const response = await UserBookIteractionApi.getListComment(bookId);
            if (response.isSuccess) {
                setReviews(response.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsLoadingReviews(false);
        }
    };

    const handleSubmitReview = async () => {
        if (newRating === 0) {
            setSnackbar({ open: true, message: "Vui lòng chọn số sao đánh giá!", severity: "error" });
            return;
        }

        if (newReviewText.trim().length < 10) {
            setSnackbar({ open: true, message: "Bình luận phải có ít nhất 10 ký tự!", severity: "error" });
            return;
        }

        setIsSubmittingReview(true);
        try {
            const interactionRequest: UserBookIteractionRequest = {
                bookId: bookDetail.id,
                interactionType: 7,
                rating: newRating,
                reviewText: newReviewText.trim()
            };

            const response = await UserBookIteractionApi.createCommnet(interactionRequest);
            console.log(response)
            if (response.isSuccess) {
                setReviews([response.data, ...reviews]);
                setNewRating(0);
                setNewReviewText("");
                setSnackbar({ open: true, message: "Đánh giá của bạn đã được gửi thành công!", severity: "success" });
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            setSnackbar({ open: true, message: "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!", severity: "error" });
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Hôm nay";
        if (diffDays === 1) return "Hôm qua";
        if (diffDays < 7) return `${diffDays} ngày trước`;

        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

                if (response.data.data.id) {
                    fetchReviews(response.data.data.id);
                }

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
                                <Rating
                                    value={reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0}
                                    precision={0.5}
                                    readOnly
                                    size="large"
                                />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ({reviews.length} đánh giá)
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
                            <Tab label={`⭐ Đánh giá (${reviews.length})`} />
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
                                <Box>
                                    {/* Write Review Section */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            mb: 4,
                                            borderRadius: 3,
                                            bgcolor: alpha('#667eea', 0.03),
                                            border: '2px solid',
                                            borderColor: alpha('#667eea', 0.1),
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <RateReviewIcon sx={{ color: 'primary.main' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                Viết đánh giá của bạn
                                            </Typography>
                                        </Box>

                                        <Stack spacing={3}>
                                            <Box>
                                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                                                    Đánh giá sao *
                                                </Typography>
                                                <Rating
                                                    value={newRating}
                                                    onChange={(event, newValue) => setNewRating(newValue || 0)}
                                                    size="large"
                                                    sx={{
                                                        '& .MuiRating-iconFilled': {
                                                            color: '#ffc107',
                                                        },
                                                        '& .MuiRating-iconHover': {
                                                            color: '#ffb400',
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            {/* Review Text Input */}
                                            <Box>
                                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                                                    Nhận xét của bạn *
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    placeholder="Chia sẻ cảm nhận của bạn về cuốn sách này... (Tối thiểu 10 ký tự)"
                                                    value={newReviewText}
                                                    onChange={(e) => setNewReviewText(e.target.value)}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            bgcolor: 'white',
                                                        }
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    color={newReviewText.length < 10 ? 'error.main' : 'text.secondary'}
                                                    sx={{ mt: 0.5, display: 'block' }}
                                                >
                                                    {newReviewText.length}/500 ký tự
                                                </Typography>
                                            </Box>

                                            {/* Submit Button */}
                                            <Button
                                                variant="contained"
                                                size="large"
                                                startIcon={isSubmittingReview ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                                onClick={handleSubmitReview}
                                                disabled={isSubmittingReview}
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    px: 4,
                                                    py: 1.5,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: 4,
                                                    },
                                                    '&:disabled': {
                                                        background: 'grey.300',
                                                    }
                                                }}
                                            >
                                                {isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                                            </Button>
                                        </Stack>
                                    </Paper>

                                    {/* Reviews List */}
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                        Đánh giá từ độc giả
                                    </Typography>

                                    {isLoadingReviews ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : reviews.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 6 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                                                Chưa có đánh giá nào
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Hãy là người đầu tiên đánh giá cuốn sách này!
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Stack spacing={2}>
                                            {reviews.map((review) => (
                                                <Card
                                                    key={review.id}
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: 3,
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            borderColor: 'primary.main',
                                                            boxShadow: 2,
                                                            transform: 'translateX(4px)',
                                                        }
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 3 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 48,
                                                                    height: 48,
                                                                    bgcolor: 'primary.main',
                                                                    fontWeight: 700,
                                                                    fontSize: '1.2rem'
                                                                }}
                                                            >
                                                                {review.userName.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                                        {review.userName}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {formatDate(review.createAt)}
                                                                    </Typography>
                                                                </Box>
                                                                <Rating value={review.rating} readOnly size="small" sx={{ mb: 1.5 }} />
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        lineHeight: 1.7,
                                                                        color: 'text.secondary',
                                                                    }}
                                                                >
                                                                    {review.reviewText}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Stack>
                                    )}
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

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MainLayoutUser>
    )
}