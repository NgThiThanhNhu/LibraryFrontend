import React, { useState } from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    Tooltip,
    alpha,
    Fade,
    Rating,
    LinearProgress,
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from "react-router-dom";
import type { BookImportResponse } from "../response/Warehouse/BookImportResponse";

interface BookCardProps {
    bookInformation: BookImportResponse;
}

const BookCard: React.FC<BookCardProps> = ({ bookInformation }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleClick = () => {
        navigate(`/user/books/${bookInformation.slug}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    // Mock data - thay bằng data thật từ API
    const rating = 4.5;
    const totalBorrows = 124;
    const availability = 8; // số sách còn lại
    const totalCopies = 10;
    const availabilityPercent = (availability / totalCopies) * 100;

    return (
        <Card
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
            sx={{
                height: 464, // FIXED TOTAL HEIGHT
                minHeight: 464, // Minimum height
                maxHeight: 464, // Maximum height
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 2,
                bgcolor: 'background.paper',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                },
            }}
        >
            {/* Image Container - FIXED HEIGHT */}
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: 280, // FIXED HEIGHT
                    width: '100%',
                    bgcolor: 'grey.100',
                    flexShrink: 0, // Không cho co lại
                }}
            >
                <CardMedia
                    component="img"
                    image={bookInformation.imageUrls?.[0] || "https://via.placeholder.com/200x280?text=No+Image"}
                    alt={bookInformation.title}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover', // Quan trọng: cover để cắt ảnh vừa khung
                        objectPosition: 'center', // Căn giữa ảnh
                        transition: 'transform 0.5s ease',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                />

                {/* Gradient Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: isHovered
                            ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)'
                            : 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 30%)',
                        transition: 'all 0.3s ease',
                    }}
                />

                {/* Favorite Button */}
                <Fade in={isHovered}>
                    <IconButton
                        onClick={handleFavoriteClick}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: alpha('#fff', 0.9),
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                                bgcolor: 'white',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                        size="small"
                    >
                        {isFavorite ? (
                            <FavoriteIcon sx={{ color: 'error.main', fontSize: 20 }} />
                        ) : (
                            <FavoriteBorderIcon sx={{ color: 'error.main', fontSize: 20 }} />
                        )}
                    </IconButton>
                </Fade>

                {/* Trending Badge */}
                {totalBorrows > 100 && (
                    <Chip
                        icon={<TrendingUpIcon sx={{ fontSize: 14, color: 'white !important' }} />}
                        label="Hot"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            bgcolor: 'error.main',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            height: 24,
                            animation: isHovered ? 'pulse 2s infinite' : 'none',
                            '@keyframes pulse': {
                                '0%, 100%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.05)' },
                            },
                            '& .MuiChip-label': {
                                px: 1,
                            },
                            '& .MuiChip-icon': {
                                marginLeft: 0.5,
                            }
                        }}
                    />
                )}

                {/* Category Chip */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                    }}
                >
                    <Chip
                        label={bookInformation.categoryName}
                        size="small"
                        sx={{
                            bgcolor: alpha('#fff', 0.95),
                            backdropFilter: 'blur(10px)',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: 24,
                            '& .MuiChip-label': {
                                px: 1.5,
                            }
                        }}
                    />
                </Box>

                {/* Quick Action Buttons */}
                <Fade in={isHovered}>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            display: 'flex',
                            gap: 0.5,
                        }}
                    >
                        <Tooltip title="Xem chi tiết" arrow>
                            <IconButton
                                size="small"
                                sx={{
                                    bgcolor: alpha('#fff', 0.9),
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        bgcolor: 'white',
                                    },
                                }}
                            >
                                <VisibilityIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Mượn sách" arrow>
                            <IconButton
                                size="small"
                                sx={{
                                    bgcolor: alpha('#667eea', 0.9),
                                    color: 'white',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        bgcolor: '#667eea',
                                    },
                                }}
                            >
                                <LocalLibraryIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Fade>
            </Box>

            {/* Content - FIXED HEIGHT */}
            <CardContent
                sx={{
                    p: 2,
                    height: 180, // FIXED HEIGHT
                    flexShrink: 0, // Không cho co lại
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                    justifyContent: 'space-between',
                }}
            >
                {/* Top Section */}
                <Box>
                    {/* Title - FIXED HEIGHT */}
                    <Tooltip title={bookInformation.title} arrow placement="top">
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                lineHeight: 1.3,
                                height: '2.6rem', // FIXED: exactly 2 lines
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: 'text.primary',
                                transition: 'color 0.2s ease',
                                mb: 0.5,
                                '&:hover': {
                                    color: 'primary.main',
                                }
                            }}
                        >
                            {bookInformation.title}
                        </Typography>
                    </Tooltip>

                    {/* Author - FIXED HEIGHT */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.85rem',
                            height: '1.4rem', // FIXED HEIGHT
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                            }}
                        />
                        {bookInformation.authorName}
                    </Typography>

                    {/* Rating */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.5,
                        }}
                    >
                        <Rating
                            value={rating}
                            precision={0.5}
                            size="small"
                            readOnly
                            sx={{
                                fontSize: '1rem',
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                            }}
                        >
                            {rating.toFixed(1)}
                        </Typography>
                    </Box>
                </Box>

                {/* Bottom Section */}
                <Box>
                    {/* Availability Progress */}
                    <Box sx={{ mb: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                                Tình trạng
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: availabilityPercent > 50 ? 'success.main' : availabilityPercent > 20 ? 'warning.main' : 'error.main' }}>
                                {availability}/{totalCopies} cuốn
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={availabilityPercent}
                            sx={{
                                height: 6,
                                borderRadius: 1,
                                bgcolor: alpha('#000', 0.05),
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 1,
                                    bgcolor: availabilityPercent > 50 ? 'success.main' : availabilityPercent > 20 ? 'warning.main' : 'error.main',
                                }
                            }}
                        />
                    </Box>

                    {/* Stats */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                        }}
                    >
                        <Chip
                            label={availability > 0 ? "Có sẵn" : "Hết sách"}
                            size="small"
                            color={availability > 0 ? "success" : "error"}
                            sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                '& .MuiChip-label': {
                                    px: 1,
                                }
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.disabled',
                                fontSize: '0.7rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.3,
                            }}
                        >
                            <StarIcon sx={{ fontSize: 12, color: 'warning.main' }} />
                            {totalBorrows} lượt mượn
                        </Typography>
                    </Box>
                </Box>
            </CardContent>

            {/* Bottom Accent Line - Animated */}
            <Box
                sx={{
                    height: 4,
                    background: availability > 0
                        ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                    transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease',
                }}
            />
        </Card>
    );
};

export default BookCard;