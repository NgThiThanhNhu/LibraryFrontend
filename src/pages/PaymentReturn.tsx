import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Stack,
    Divider,
    Paper,
    Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import type { ResponsePayment } from '../response/PaymentResponse';
import { PaymentLabel, PaymentType } from '../types/PaymentType';
import styles from '../css/PaymentReturn.module.css';

interface paramResponse {
    borrowAmount: number,
    paymentType: PaymentType,
    transactionNo: string,
    vnpText: string,
    vnpResponseCode: string,
    vnpBankCode: string,
    Date: Date,
}

const PaymentReturn: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<boolean>(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentResult, setPaymentResult] = useState<paramResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        handlePaymentCallback();
    }, [searchParams]);

    const handlePaymentCallback = async () => {
        const params: any = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        console.log('VNPay callback params:', params);

        setPaymentResult(params);
        console.log(paymentResult);

        const urlStatus = params["status"];
        const urlResponseCode = params["vnp_ResponseCode"];

        if (urlStatus === "success" && (urlResponseCode === '00')) {
            if (urlResponseCode !== '00') {
                setError(getVNPayErrorMessage(urlResponseCode));
                setStatus(false);
            }
            setStatus(true);
        } else {
            const errorCode = urlResponseCode || urlResponseCode || '99';
            const errorMessage = params.data.message || getVNPayErrorMessage(errorCode);
            setError(errorMessage);
            setStatus(false);
        }
        console.log(status);
        setLoading(false);
    };

    const getVNPayErrorMessage = (code: string): string => {
        const errorMessages: { [key: string]: string } = {
            '00': 'Giao dịch thành công',
            '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
            '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking tại ngân hàng',
            '10': 'Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
            '11': 'Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch',
            '12': 'Thẻ/Tài khoản bị khóa',
            '13': 'Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)',
            '24': 'Khách hàng hủy giao dịch',
            '51': 'Tài khoản không đủ số dư để thực hiện giao dịch',
            '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày',
            '75': 'Ngân hàng thanh toán đang bảo trì',
            '79': 'Khách hàng nhập sai mật khẩu thanh toán quá số lần quy định',
            '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi)'
        };
        return errorMessages[code] || 'Giao dịch không thành công';
    };

    const handleBackToDashboard = () => {
        navigate('/admin/borrow-manage');
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <Box className={styles.loadingContainer}>
                <Card sx={{ p: 4, textAlign: 'center', minWidth: 350, borderRadius: 4 }}>
                    <CircularProgress size={60} sx={{ color: '#667eea' }} />
                    <Typography sx={{ mt: 3, fontSize: 18, fontWeight: 500 }}>
                        Đang xử lý kết quả thanh toán...
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Vui lòng không đóng trang này
                    </Typography>
                </Card>
            </Box>
        );
    }

    return (
        <Box
            className={status ? styles.successBackground : styles.errorBackground}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                p: 2
            }}
        >
            <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 4, boxShadow: 6 }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3} alignItems="center">
                        {status ? (
                            <>
                                <Box
                                    className={`${styles.iconCircle} ${styles.iconCircleSuccess} ${styles.iconSuccess}`}
                                >
                                    <CheckCircleIcon sx={{ fontSize: 60, color: 'white' }} />
                                </Box>
                                <Typography variant="h4" fontWeight={700} color="success.main">
                                    Thanh toán thành công!
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Box
                                    className={`${styles.iconCircle} ${styles.iconCircleError} ${styles.iconError}`}
                                >
                                    <ErrorIcon sx={{ fontSize: 60, color: 'white' }} />
                                </Box>
                                <Typography variant="h4" fontWeight={700} color="error.main">
                                    Thanh toán thất bại
                                </Typography>
                            </>
                        )}

                        <Alert
                            severity={status ? 'success' : 'error'}
                            sx={{
                                width: '100%',
                                fontSize: 16,
                                '& .MuiAlert-message': {
                                    width: '100%',
                                    textAlign: 'center'
                                }
                            }}
                            className={styles.fadeIn}
                        >
                            {error || getVNPayErrorMessage(paymentResult?.vnpResponseCode || '99')}
                        </Alert>

                        {paymentResult && (
                            <>
                                <Divider sx={{ width: '100%' }} />
                                <Paper
                                    elevation={0}
                                    sx={{
                                        width: '100%',
                                        p: 3,
                                        bgcolor: '#f9fafb',
                                        borderRadius: 2
                                    }}
                                    className={styles.fadeIn}
                                >
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <ReceiptLongIcon color="primary" />
                                            <Typography variant="h6" fontWeight={600}>
                                                Thông tin giao dịch
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography color="text.secondary">
                                                Số tiền:
                                            </Typography>
                                            <Typography variant="h6" fontWeight={700} color={status ? 'success.main' : 'error.main'}>
                                                {paymentResult.borrowAmount?.toLocaleString('vi-VN')}₫
                                            </Typography>
                                        </Box>

                                        <Divider />

                                        {paymentResult.paymentType && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography color="text.secondary">
                                                    Phương thức:
                                                </Typography>
                                                <Chip
                                                    label={PaymentLabel[paymentResult.paymentType]}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        )}

                                        {paymentResult.vnpText && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography color="text.secondary">
                                                    Nội dung:
                                                </Typography>
                                                <Typography fontWeight={600} sx={{ textAlign: 'right', maxWidth: '100%' }}>
                                                    {paymentResult.vnpText}
                                                </Typography>
                                            </Box>
                                        )}

                                        {paymentResult.vnpBankCode && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography color="text.secondary">
                                                    Ngân hàng:
                                                </Typography>
                                                <Chip
                                                    label={paymentResult.vnpBankCode}
                                                    size="small"
                                                    color="primary"
                                                />
                                            </Box>
                                        )}

                                        {paymentResult.transactionNo && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography color="text.secondary">
                                                    Mã GD:
                                                </Typography>
                                                <Typography fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                                                    {paymentResult.transactionNo}
                                                </Typography>
                                            </Box>
                                        )}

                                        {paymentResult.vnpResponseCode && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography color="text.secondary">
                                                    Mã phản hồi:
                                                </Typography>
                                                <Chip
                                                    label={paymentResult.vnpResponseCode}
                                                    size="small"
                                                    color={status ? 'success' : 'error'}
                                                    sx={{ fontFamily: 'monospace' }}
                                                />
                                            </Box>
                                        )}

                                        {paymentResult.Date && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography color="text.secondary">
                                                    Thời gian:
                                                </Typography>
                                                <Typography fontWeight={600}>
                                                    {new Date(paymentResult.Date).toLocaleString('vi-VN')}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Divider />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography color="text.secondary">
                                                Trạng thái:
                                            </Typography>
                                            <Chip
                                                label={status ? 'Thành công' : 'Thất bại'}
                                                color={status ? 'success' : 'error'}
                                                icon={status ? <CheckCircleIcon /> : <ErrorIcon />}
                                            />
                                        </Box>
                                    </Stack>
                                </Paper>
                            </>
                        )}

                        <Stack direction="row" spacing={2} sx={{ width: '100%', mt: 2 }} className={styles.fadeIn}>
                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                startIcon={<HomeIcon />}
                                onClick={handleBackToHome}
                                sx={{ borderRadius: 2, py: 1.5 }}
                            >
                                Về trang chủ
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={handleBackToDashboard}
                                className={status ? styles.buttonGradientSuccess : styles.buttonGradientInfo}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5
                                }}
                            >
                                Quản lý mượn trả
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PaymentReturn;