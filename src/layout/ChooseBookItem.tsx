import { use, useState } from 'react';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { BookCartApi } from '../apis';

type Props = {
    bookId: string;
    onSuccess?: () => void;
};

export default function ChooseBookItem({ bookId, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            const response = await BookCartApi.createCart({
                bookId: bookId,
                quantity: 1
            });
            console.log(bookId);
            if (response.isSuccess) {
                setSnackbar({
                    open: true,
                    message: response.message || 'Đã thêm vào giỏ sách!',
                    severity: 'success',
                });
                onSuccess?.();
            } else {
                setSnackbar({
                    open: true,
                    message: response.message || 'Không thể thêm vào giỏ',
                    severity: 'error',
                });
            }
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddShoppingCartIcon />}
                className="px-6 py-2"
            >
                {loading ? 'Đang thêm...' : 'Thêm vào giỏ sách'}
            </Button>

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
        </>
    );
}