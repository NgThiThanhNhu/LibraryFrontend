import React, { useEffect, useState, useMemo } from 'react';
import {
    Box, Typography, List, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    FormControl, InputLabel, Select, MenuItem, CircularProgress,
    IconButton, Chip, Card, CardContent, Stack, Paper, Fade, Tooltip,
    Alert, Snackbar
} from '@mui/material';
import MainLayoutUser from '../layout/mainLayout/MainLayoutUser';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { BookCartApi, BookCartItemApi } from '../apis';
import type { BookCartResponse } from '../response/BookCartResponse';
import type { BookCartItemResponse } from '../response/BookCartItemResponse';

const MyBookListPage: React.FC = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState<BookCartResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
    const [openClearDialog, setOpenClearDialog] = useState(false);
    const [duration, setDuration] = useState(7);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const response = await BookCartApi.getBookCart();
            if (response.isSuccess && response.data) {
                setCart(response.data);
            } else {
                setCart(null);
                showSnackbar(response.message || 'Không thể tải giỏ sách', 'error');
            }
        } catch (error: any) {
            console.error('Error fetching cart:', error);
            showSnackbar('Có lỗi khi tải giỏ sách', 'error');
            setCart(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleIncreaseQuantity = async (item: BookCartItemResponse) => {
        try {
            const response = await BookCartItemApi.updateQuantity(item.bookCartItemId, { action: "increase" });
            if (response.isSuccess) {
                showSnackbar('Đã tăng số lượng', 'success');
                const newQuantity = response.data;
                setCart(prevCartData => {
                    if (!prevCartData) {
                        return null;
                    }
                    const itemToUpdate = prevCartData.bookCartItemResponses.find(bookCartItem => bookCartItem.bookCartItemId === item.bookCartItemId);
                    if (!itemToUpdate) {
                        return prevCartData;
                    }
                    const newTotalQuantity = prevCartData.totalQuantity + 1;
                    const newRemainingSlots = 5 - newTotalQuantity;
                    const newCanAdd = newTotalQuantity < 5;

                    return {
                        ...prevCartData,
                        bookCartItemResponses: prevCartData.bookCartItemResponses.map(cartItem => {
                            if (cartItem.bookCartItemId === item.bookCartItemId) {
                                const updatedCanDecrease = newQuantity > 1;
                                const updatedCanIncrease =
                                    newTotalQuantity < 5
                                    && newQuantity < cartItem.availableQuantity;

                                return {
                                    ...cartItem,
                                    requestedQuantity: newQuantity,
                                    canIncrease: updatedCanIncrease,
                                    canDecrease: updatedCanDecrease
                                };
                            }
                            if (newTotalQuantity >= 5) {
                                return {
                                    ...cartItem,
                                    canIncrease: false
                                }
                            }

                            return cartItem;
                        }),
                        totalQuantity: newTotalQuantity,
                        remainingSlots: newRemainingSlots,
                        canAddMore: newCanAdd,
                    };
                });
            } else {
                showSnackbar(response.message || 'Không thể tăng số lượng', 'error');
            }
        } catch (error: any) {
            console.error('Error increasing quantity:', error);
            showSnackbar(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        }
    };

    const handleDecreaseQuantity = async (item: BookCartItemResponse) => {
        try {
            const response = await BookCartItemApi.updateQuantity(item.bookCartItemId, { action: "decrease" });
            if (response.isSuccess) {
                showSnackbar('Đã giảm số lượng', 'success');
                const newQuantity = response.data;

                setCart(prevCartData => {
                    if (!prevCartData) {
                        return null;
                    }
                    const itemToUpdate = prevCartData.bookCartItemResponses.find(cartItem => cartItem.bookCartItemId === item.bookCartItemId);
                    if (!itemToUpdate) {
                        return prevCartData;
                    }
                    const newTotalQuantity = prevCartData.totalQuantity - 1;
                    const newRemainingSlots = 5 - newTotalQuantity;
                    const newCanAdd = newTotalQuantity < 5;
                    return {
                        ...prevCartData,
                        totalQuantity: newTotalQuantity,
                        remainingSlots: newRemainingSlots,
                        canAddMore: newCanAdd,
                        bookCartItemResponses: prevCartData.bookCartItemResponses.map(cartItem => {
                            if (cartItem.bookCartItemId === item.bookCartItemId) {
                                const updatedCanDecrease = newQuantity > 1;
                                const updatedCanIncrease =
                                    newQuantity < cartItem.availableQuantity
                                    && newTotalQuantity < 5;

                                return {
                                    ...cartItem,
                                    requestedQuantity: newQuantity,
                                    canDecrease: updatedCanDecrease,
                                    canIncrease: updatedCanIncrease
                                };
                            }

                            if (prevCartData.totalQuantity === 5 && newTotalQuantity < 5) {
                                const otherCanIncrease = cartItem.requestedQuantity < cartItem.availableQuantity;
                                return {
                                    ...cartItem,
                                    canIncrease: otherCanIncrease
                                };
                            }

                            return cartItem;
                        }),
                    };
                });
            } else {
                showSnackbar(response.message || 'Không thể giảm số lượng', 'error');
            }
        } catch (error: any) {
            console.error('Error decreasing quantity:', error);
            showSnackbar(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        }
    };

    const handleRemoveItem = async (item: BookCartItemResponse) => {
        if (!window.confirm(`Bạn có chắc muốn xóa "${item.bookTitle}" khỏi giỏ?`)) {
            return;
        }

        try {
            const response = await BookCartItemApi.removeItem(item.bookCartItemId);
            if (response.isSuccess) {
                showSnackbar('Đã xóa khỏi giỏ sách', 'success');
                await fetchCart();
            } else {
                showSnackbar(response.message || 'Không thể xóa', 'error');
            }
        } catch (error: any) {
            console.error('Error removing item:', error);
            showSnackbar(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        }
    };

    const handleClearCart = async (bookCart: BookCartResponse | null) => {
        try {
            if (bookCart == null) {
                showSnackbar('Không tìm thấy giỏ sách', 'error');
                return;
            }
            const response = await BookCartItemApi.clearAllBookCartItem(bookCart.bookCartId);
            if (response.isSuccess) {
                showSnackbar('Đã xóa tất cả sách khỏi giỏ', 'success');
                setOpenClearDialog(false);
                await fetchCart();
            } else {
                showSnackbar(response.message || 'Không thể xóa giỏ', 'error');
            }
        } catch (error: any) {
            console.error('Error clearing cart:', error);
            showSnackbar(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        }
    };

    const handleCheckout = async () => {
        if (duration < 1 || duration > 10) {
            showSnackbar('Số ngày mượn phải từ 1-10 ngày', 'error');
            return;
        }

        try {
            const response = await BookCartApi.checkoutBookCartItem({ duration });
            if (response.isSuccess && response.data) {
                showSnackbar('Tạo phiếu mượn thành công!', 'success');
                setOpenCheckoutDialog(false);
                navigate(`/user/borrowingstatus`);
            } else {
                showSnackbar(response.message || 'Không thể tạo phiếu mượn', 'error');
            }
        } catch (error: any) {
            console.error('Error checkout:', error);
            showSnackbar(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        }
    };
    return (
        <MainLayoutUser>
            <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
                <Box className="max-w-6xl mx-auto">
                    <Paper elevation={0} className="mb-6 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100">
                        <Stack direction="row" alignItems="center" justifyContent="space-between" className="mb-4">
                            <Stack direction="row" alignItems="center" spacing={2}>
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

                            {cart && cart.bookCartItemResponses.length > 0 && (
                                <Tooltip title="Xóa tất cả">
                                    <IconButton
                                        onClick={() => setOpenClearDialog(true)}
                                        color="error"
                                        className="hover:bg-red-50"
                                    >
                                        <DeleteSweepIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>

                        {cart && (
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                justifyContent="space-between"
                                alignItems={{ xs: 'stretch', sm: 'center' }}
                            >
                                <Stack direction="row" spacing={2} flexWrap="wrap">
                                    <Chip
                                        icon={<LocalLibraryIcon />}
                                        label={`${cart.totalBooks} tựa sách`}
                                        color="primary"
                                        variant="outlined"
                                        className="font-semibold"
                                    />
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label={`${cart.totalQuantity} quyển`}
                                        color="success"
                                        className="font-semibold"
                                    />
                                    {!cart.canAddMore && (
                                        <Chip
                                            label="Giỏ đã đầy"
                                            color="error"
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Stack>

                                <Box className="text-right">
                                    <Typography variant="body2" className="text-gray-600">
                                        Sử dụng: <strong>{cart.totalQuantity}/5</strong> quyển
                                    </Typography>
                                    {cart.canAddMore && (
                                        <Typography variant="caption" className="text-gray-500">
                                            Còn {cart.remainingSlots} slot
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>
                        )}
                    </Paper>

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
                    ) : !cart || cart.bookCartItemResponses.length === 0 ? (
                        <Card className="rounded-2xl shadow-sm">
                            <CardContent>
                                <Box className="flex flex-col items-center justify-center py-16">
                                    <Box className="bg-gray-100 p-6 rounded-full mb-4">
                                        <ShoppingCartIcon sx={{ fontSize: 64 }} className="text-gray-400" />
                                    </Box>
                                    <Typography variant="h6" className="text-gray-600 mb-2">
                                        Giỏ sách trống
                                    </Typography>
                                    <Typography className="text-gray-400 mb-4">
                                        Hãy thêm sách vào giỏ để bắt đầu mượn
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate(`/user/books`)}
                                        className="bg-gradient-to-r from-blue-500 to-purple-500"
                                    >
                                        Khám phá sách
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : (
                        <Stack spacing={2}>
                            {cart.bookCartItemResponses.map((item, index) => (
                                <Fade in={true} timeout={300 + index * 100} key={item.bookCartItemId}>
                                    <Card className="rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
                                        <CardContent className="p-4">
                                            <Stack
                                                direction={{ xs: 'column', md: 'row' }}
                                                spacing={3}
                                                alignItems={{ xs: 'stretch', md: 'center' }}
                                            >
                                                <Box className="relative flex-shrink-0">
                                                    <img
                                                        src={item.imageUrl || '/placeholder-book.png'}
                                                        alt={item.bookTitle}
                                                        className="w-full md:w-28 h-40 md:h-40 object-cover rounded-xl shadow-md"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/placeholder-book.png';
                                                        }}
                                                    />
                                                </Box>

                                                <Box className="flex-1 min-w-0">
                                                    <Typography variant="h6" className="font-bold text-gray-800 mb-2 line-clamp-2">
                                                        {item.bookTitle}
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        <Typography variant="body2" className="text-gray-600">
                                                            <span className="font-semibold">Tác giả:</span> {item.author}
                                                        </Typography>
                                                        <Typography variant="body2" className="text-gray-600">
                                                            <span className="font-semibold">NXB:</span> {item.publisher}
                                                        </Typography>
                                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                                            <Chip
                                                                label={item.statusText}
                                                                size="small"
                                                                color={item.availableQuantity >= item.requestedQuantity ? 'success' : 'warning'}
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
                                                        sx={{ width: 'fit-content', minWidth: '140px' }}
                                                    >
                                                        <Tooltip title="Giảm số lượng">
                                                            <span>
                                                                <IconButton
                                                                    onClick={() => handleDecreaseQuantity(item)}
                                                                    size="small"
                                                                    disabled={!item.canDecrease}
                                                                    className="text-blue-600"
                                                                    sx={{ width: 36, height: 36 }}
                                                                >
                                                                    <RemoveIcon />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>

                                                        <Box className="bg-gray-50 flex items-center justify-center"
                                                            sx={{ width: 48, height: 36 }}>
                                                            <Typography className="font-bold text-gray-800">
                                                                {item.requestedQuantity}
                                                            </Typography>
                                                        </Box>

                                                        <Tooltip title="Tăng số lượng">
                                                            <span>
                                                                <IconButton
                                                                    onClick={() => handleIncreaseQuantity(item)}
                                                                    size="small"
                                                                    disabled={!item.canIncrease}
                                                                    className="text-blue-600"
                                                                    sx={{ width: 36, height: 36 }}
                                                                >
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    </Paper>

                                                    <Tooltip title="Xóa khỏi giỏ">
                                                        <IconButton
                                                            onClick={() => handleRemoveItem(item)}
                                                            color="error"
                                                            size="small"
                                                            className="hover:bg-red-50"
                                                        >
                                                            <DeleteForeverIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            ))}
                        </Stack>
                    )}

                    {cart && cart.bookCartItemResponses.length > 0 && (
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
                                        Tổng số quyển sách
                                    </Typography>
                                    <Typography variant="h4" className="font-bold">
                                        {cart.totalQuantity} quyển ({cart.totalBooks} cuốn)
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    size="large"
                                    disabled={cart.totalQuantity === 0 || isLoading}
                                    onClick={() => setOpenCheckoutDialog(true)}
                                    className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-3 font-bold shadow-lg"
                                    startIcon={<LocalLibraryIcon />}
                                >
                                    Mượn Sách Ngay
                                </Button>
                            </Stack>
                        </Paper>
                    )}
                </Box>

                <Dialog
                    open={openCheckoutDialog}
                    onClose={() => setOpenCheckoutDialog(false)}
                    PaperProps={{ className: "rounded-2xl" }}
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
                        {cart && (
                            <Alert severity="info" className="mb-4">
                                Bạn đang mượn <strong>{cart.totalQuantity} quyển</strong> sách
                                (<strong>{cart.totalBooks} cuốn</strong>)
                            </Alert>
                        )}
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
                            helperText="Từ 1-10 ngày"
                        />
                    </DialogContent>
                    <DialogActions className="p-4">
                        <Button
                            onClick={() => setOpenCheckoutDialog(false)}
                            className="rounded-full"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleCheckout}
                            variant="contained"
                            className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                            disabled={duration < 1 || duration > 30}
                        >
                            Xác Nhận Mượn
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openClearDialog}
                    onClose={() => setOpenClearDialog(false)}
                    PaperProps={{ className: "rounded-2xl" }}
                >
                    <DialogTitle>Xóa tất cả sách</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Bạn có chắc muốn xóa tất cả sách khỏi giỏ?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenClearDialog(false)}>Hủy</Button>
                        <Button variant="contained" color="error" onClick={() => handleClearCart(cart)}>
                            Xóa tất cả
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </MainLayoutUser>
    );
};

export default MyBookListPage;