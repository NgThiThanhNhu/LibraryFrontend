import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Checkbox, List, ListItem, Button, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    FormControl, InputLabel, Select, MenuItem, CircularProgress,
    IconButton, Chip, Card, CardContent, Stack, Paper, Fade, Tooltip
} from '@mui/material';
import MainLayoutUser from '../layout/mainLayout/MainLayoutUser';
import { BookCartItem, Borrowing } from '../apis';
import type { BorrowingRequest } from '../request/BorrowingRequest';
import type { BookCartTitleResponse } from '../response/BookCartTitleResponse';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SortIcon from '@mui/icons-material/Sort';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MyBookListPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<BookCartTitleResponse[]>([]);
    const [selectedItems, setSelectedItems] = useState<BookCartTitleResponse[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [duration, setDuration] = useState(7);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    type SortOption = 'newest' | 'oldest';
    const [sortOrder, setSortOrder] = useState<SortOption>('oldest');

    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const res = await BookCartItem.getAllBookCartOfUser();
            if (res.isSuccess && res.data) {
                setCartItems(res.data);
                setSelectedItems((prev: BookCartTitleResponse[]) => {
                    const fetchedBookIds = new Set(res.data.map((item: BookCartTitleResponse) => item.bookId));
                    return prev.filter((item: BookCartTitleResponse) => fetchedBookIds.has(item.bookId));
                });
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy giỏ sách:', error);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleDecreaseQuantity = async (item: BookCartTitleResponse) => {
        if (item.quantityBookCart <= 0) return;
        if (item.quantityBookCart === 1) {
            if (!window.confirm(`Bạn có chắc muốn xóa cuốn "${item.bookTitle}" khỏi giỏ?`)) {
                return;
            }
        }
        const bookItemIdToDelete = item.bookItemIds[0];
        if (!bookItemIdToDelete) {
            alert('Không tìm thấy bản sao để xóa.');
            return;
        }
        try {
            const res = await BookCartItem.deleteBookCartItem(bookItemIdToDelete);
            console.log(bookItemIdToDelete);
            if (res.isSuccess) {
                await fetchCart();
            } else {
                alert(`Lỗi khi xóa: ${res.message}`);
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi giảm số lượng/xóa sách khỏi giỏ.');
            console.error(error);
        }
    };

    const handleIncreaseQuantity = async (item: BookCartTitleResponse) => {
        try {
            const res = await BookCartItem.addBookCartItem(item.bookId);
            if (res.isSuccess) {
                await fetchCart();
            } else {
                alert(`Lỗi khi thêm: ${res.message}. Có thể tất cả bản sao đã được mượn hoặc giữ.`);
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi tăng số lượng.');
            console.error(error);
        }
    };

    const sortedCartItems = useMemo(() => {
        const items = [...cartItems];
        items.sort((a, b) => {
            const dateA = new Date(a.createAt).getTime();
            const dateB = new Date(b.createAt).getTime();
            if (sortOrder === 'oldest') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
        return items;
    }, [cartItems, sortOrder]);

    const toggleSelect = (item: BookCartTitleResponse) => {
        setSelectedItems((prev) =>
            prev.some(i => i.bookId === item.bookId)
                ? prev.filter(i => i.bookId !== item.bookId)
                : [...prev, item]
        );
    };

    const totalSelectedCopies = useMemo(() => {
        return selectedItems.reduce((sum, item) => sum + item.quantityBookCart, 0);
    }, [selectedItems]);

    const allSelectedBookItemIds = useMemo(() => {
        return selectedItems.flatMap(item => item.bookItemIds);
    }, [selectedItems]);

    const handleBorrow = async (borrowDays: number) => {
        if (allSelectedBookItemIds.length === 0) {
            alert('Bạn chưa chọn sách nào để mượn.');
            return;
        }

        const request: BorrowingRequest = {
            duration: borrowDays,
            bookiTemIds: allSelectedBookItemIds,
        };

        try {
            const res = await Borrowing.createBorrowing(request);
            if (res.isSuccess) {
                alert('Mượn sách thành công!');
                setSelectedItems([]);
                await fetchCart();
            } else {
                alert(`Lỗi: ${res.message}`);
            }
        } catch (err) {
            alert('Có lỗi xảy ra khi gửi yêu cầu mượn sách.');
            console.error(err);
        }
    };

    return (
        <MainLayoutUser>
            <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
                <Box className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <Paper elevation={0} className="mb-6 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100">
                        <Stack direction="row" alignItems="center" spacing={2} className="mb-4">
                            <Box className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                                <ShoppingCartIcon className="text-white" sx={{ fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" className="font-bold text-gray-800">
                                    Giỏ Sách Của Tôi
                                </Typography>
                                <Typography variant="body2" className="text-gray-500">
                                    Quản lý và mượn sách dễ dàng
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Stats và Sort */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                        >
                            <Stack direction="row" spacing={2}>
                                <Chip
                                    icon={<LocalLibraryIcon />}
                                    label={`${cartItems.length} tựa sách`}
                                    color="primary"
                                    variant="outlined"
                                    className="font-semibold"
                                />
                                {selectedItems.length > 0 && (
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label={`${selectedItems.length} đã chọn`}
                                        color="success"
                                        className="font-semibold"
                                    />
                                )}
                            </Stack>

                            <FormControl size="small" className="min-w-[180px]">
                                <InputLabel id="sort-label">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <SortIcon fontSize="small" />
                                        <span>Sắp xếp</span>
                                    </Stack>
                                </InputLabel>
                                <Select
                                    labelId="sort-label"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as SortOption)}
                                    label="Sắp xếp"
                                >
                                    <MenuItem value="oldest">Cũ nhất trước</MenuItem>
                                    <MenuItem value="newest">Mới nhất trước</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Paper>

                    {/* Cart Items */}
                    {isLoading ? (
                        <Card className="rounded-2xl shadow-sm">
                            <CardContent>
                                <Box className="flex flex-col items-center justify-center py-16">
                                    <CircularProgress size={48} />
                                    <Typography className="mt-4 text-gray-500">
                                        Đang tải giỏ sách...
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : sortedCartItems.length === 0 ? (
                        <Card className="rounded-2xl shadow-sm">
                            <CardContent>
                                <Box className="flex flex-col items-center justify-center py-16">
                                    <Box className="bg-gray-100 p-6 rounded-full mb-4">
                                        <ShoppingCartIcon sx={{ fontSize: 64 }} className="text-gray-400" />
                                    </Box>
                                    <Typography variant="h6" className="text-gray-600 mb-2">
                                        Giỏ sách trống
                                    </Typography>
                                    <Typography className="text-gray-400">
                                        Hãy thêm sách vào giỏ để bắt đầu mượn
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : (
                        <Stack spacing={2}>
                            {sortedCartItems.map((item, index) => {
                                const isSelected = selectedItems.some(i => i.bookId === item.bookId);
                                return (
                                    <Fade in={true} timeout={300 + index * 100} key={item.bookId}>
                                        <Card
                                            className={`rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${isSelected ? 'ring-2 ring-blue-400 bg-blue-50/30' : ''
                                                }`}
                                        >
                                            <CardContent className="p-4">
                                                <Stack
                                                    direction={{ xs: 'column', md: 'row' }}
                                                    spacing={3}
                                                    alignItems={{ xs: 'stretch', md: 'center' }}
                                                >
                                                    {/* Book Image */}
                                                    <Box className="relative flex-shrink-0">
                                                        <img
                                                            src={item.imageUrls?.[0] || 'placeholder.jpg'}
                                                            alt={item.bookTitle}
                                                            className="w-full md:w-28 h-40 md:h-40 object-cover rounded-xl shadow-md"
                                                        />
                                                        {isSelected && (
                                                            <Box className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                                                                <CheckCircleIcon fontSize="small" />
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    {/* Book Info */}
                                                    <Box className="flex-1 min-w-0">
                                                        <Typography variant="h6" className="font-bold text-gray-800 mb-2 line-clamp-2">
                                                            {item.bookTitle}
                                                        </Typography>
                                                        <Stack spacing={1}>
                                                            <Typography variant="body2" className="text-gray-600">
                                                                <span className="font-semibold">Tác giả:</span> {item.bookAuthor}
                                                            </Typography>
                                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                                <Chip
                                                                    label={item.bookCategory}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    className="text-xs"
                                                                />
                                                                <Chip
                                                                    label={new Date(item.createAt).toLocaleDateString('vi-VN')}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    className="text-xs"
                                                                />
                                                            </Stack>
                                                        </Stack>
                                                    </Box>

                                                    <Stack
                                                        direction={{ xs: 'row', md: 'column' }}
                                                        spacing={2}
                                                        alignItems="center"
                                                        justifyContent={{ xs: 'space-between', md: 'center' }}
                                                    >
                                                        <Paper
                                                            elevation={0}
                                                            className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden"
                                                            sx={{ width: 'fit-content', minWidth: '120px' }}
                                                        >
                                                            <Tooltip title={item.quantityBookCart > 1 ? "Giảm số lượng" : "Xóa khỏi giỏ"}>
                                                                <IconButton
                                                                    onClick={() => handleDecreaseQuantity(item)}
                                                                    size="small"
                                                                    className={item.quantityBookCart > 1 ? "text-blue-600" : "text-red-600"}
                                                                    sx={{ width: 36, height: 36 }}
                                                                >
                                                                    {item.quantityBookCart > 1 ? <RemoveIcon /> : <DeleteForeverIcon />}
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Box className="bg-gray-50 flex items-center justify-center"
                                                                sx={{ width: 48, height: 36 }}>
                                                                <Typography className="font-bold text-gray-800">
                                                                    {item.quantityBookCart}
                                                                </Typography>
                                                            </Box>

                                                            <Tooltip title="Thêm bản sao">
                                                                <IconButton
                                                                    onClick={() => handleIncreaseQuantity(item)}
                                                                    size="small"
                                                                    className="text-blue-600"
                                                                >
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Paper>

                                                        {/* Select Checkbox */}
                                                        <Tooltip title="Chọn để mượn">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onChange={() => toggleSelect(item)}
                                                                icon={<Box className="w-6 h-6 border-2 border-gray-300 rounded-md" />}
                                                                checkedIcon={
                                                                    <Box className="w-6 h-6 bg-blue-500 border-2 border-blue-500 rounded-md flex items-center justify-center">
                                                                        <CheckCircleIcon className="text-white" fontSize="small" />
                                                                    </Box>
                                                                }
                                                            />
                                                        </Tooltip>
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                );
                            })}
                        </Stack>
                    )}

                    {/* Footer - Borrow Button */}
                    {cartItems.length > 0 && (
                        <Paper
                            elevation={4}
                            className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white sticky bottom-4"
                        >
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={3}
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Box>
                                    <Typography variant="body2" className="opacity-90">
                                        Tổng số bản sao được chọn
                                    </Typography>
                                    <Typography variant="h4" className="font-bold">
                                        {totalSelectedCopies} cuốn
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    size="large"
                                    disabled={totalSelectedCopies === 0 || isLoading}
                                    onClick={() => setOpenDialog(true)}
                                    className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-3 font-bold shadow-lg"
                                    startIcon={<LocalLibraryIcon />}
                                >
                                    Mượn Sách Ngay
                                </Button>
                            </Stack>
                        </Paper>
                    )}
                </Box>

                {/* Borrow Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    PaperProps={{
                        className: "rounded-2xl"
                    }}
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogTitle className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <Stack direction="row" spacing={2} alignItems="center">
                            <LocalLibraryIcon />
                            <span>Xác nhận mượn sách</span>
                        </Stack>
                    </DialogTitle>
                    <DialogContent className="mt-4">
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Số ngày mượn"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={duration}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                setDuration(isNaN(value) ? 1 : Math.max(1, Math.min(30, value)));
                            }}
                            inputProps={{ min: 1, max: 30 }}
                            helperText={`Từ 1-30 ngày • ${totalSelectedCopies} bản sao được chọn`}
                        />
                    </DialogContent>
                    <DialogActions className="p-4">
                        <Button
                            onClick={() => setOpenDialog(false)}
                            className="rounded-full"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={async () => {
                                if (duration < 1 || duration > 30) return;
                                setOpenDialog(false);
                                await handleBorrow(duration);
                            }}
                            variant="contained"
                            className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        >
                            Xác Nhận Mượn
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </MainLayoutUser>
    );
};

export default MyBookListPage;