import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Chip,
    Divider,
    Alert,
    Snackbar,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import SearchFilterBar from '../layout/SearchFilterBar';
import BorrowTable from '../layout/BorrowTable';
import type { StatusType } from './BorrowAndManageWrapper';
import type { BorrowingResponse } from '../response/BorrowingResponse';
import { BookPickupSchedule, Borrowing, BorrowingDetail, PaymentApi } from '../apis';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import type { BookPickupScheduleRequest } from '../request/BookPickupScheduleRequest';
import { useNavigate } from 'react-router-dom';
import type { BorrowingDetailForFineResponse } from '../response/BorrowingDetailForFineResponse';
import { FineReasonLabel } from '../types/FineReasonType';
import type { FineResponse } from '../response/FineResponse';
import CreateFineDialog from '../layout/CreateFineDialog';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import type { RequestPayment } from '../request/PaymentRequest';
import { PaymentType, PaymentLabel } from '../types/PaymentType';

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.tz.setDefault("Asia/Ho_Chi_Minh")

interface BorrowStatusProps {
    bookItems: {
        id: number;
        code: string;
        title: string;
        position: string;
        status: StatusType;
    }[];
    updateBookItemStatus: (id: number, status: StatusType) => void;
}

const BorrowStatusPage: React.FC<BorrowStatusProps> = () => {
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('Tất cả');
    const [borrowData, setBorrowData] = useState<BorrowingResponse[]>([]);
    const [reload, setReload] = useState<boolean>(false);

    // Snackbar states
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const handleApprove = async (row: any) => {
        try {
            const response = await Borrowing.updateBorrowingStatus(row.id, { borrowingStatus: 1 })
            setSnackbar({
                open: true,
                message: 'Đã duyệt phiếu mượn thành công!',
                severity: 'success'
            });
            setReload(true)
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Lỗi khi duyệt phiếu mượn: ' + error,
                severity: 'error'
            });
        }
    };

    const handleReject = async (row: any) => {
        try {
            const response = await Borrowing.updateBorrowingStatus(row.id, { borrowingStatus: 6 })
            setSnackbar({
                open: true,
                message: 'Đã từ chối phiếu mượn',
                severity: 'info'
            });
            setReload(true)
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Lỗi khi từ chối: ' + error,
                severity: 'error'
            });
        }
    };

    const [logOpenSchedule, setLogOpenSchedule] = useState<boolean>(false)
    const navigate = useNavigate()
    const [selectedBorrowing, setSelectedBorrowing] = useState<BorrowingResponse | null>(null);
    const [schedule, setSchedule] = useState<BookPickupScheduleRequest>({
        borrowingId: " ",
        scheduledPickupDate: null,
        expiredPickupDate: null
    })

    const handleOpenPickupDialog = (row: BorrowingResponse) => {
        setSelectedBorrowing(row);
        setSchedule({
            borrowingId: row.id,
            scheduledPickupDate: null,
            expiredPickupDate: null
        })
        setLogOpenSchedule(true);
    };

    const handlePickupSchedule = async () => {
        try {
            if (!schedule.expiredPickupDate || !schedule.scheduledPickupDate) {
                setSnackbar({
                    open: true,
                    message: 'Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc',
                    severity: 'warning'
                });
                return;
            }

            const response = await BookPickupSchedule.createSchedule(schedule)
            setReload(true)

            if (!response.isSuccess) {
                setSnackbar({
                    open: true,
                    message: 'Phiếu mượn quá ngày để hẹn lịch. Chỉ được hẹn trong 3 ngày kể từ ngày duyệt.',
                    severity: 'error'
                });
                navigate(`/admin/borrow-manage`)
            } else {
                setSnackbar({
                    open: true,
                    message: 'Đã hẹn lịch lấy sách thành công!',
                    severity: 'success'
                });
            }
            setLogOpenSchedule(false);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Lỗi khi hẹn lịch: ' + error,
                severity: 'error'
            });
        }
    }

    const handleCancel = async (row: any) => {
        try {
            const response = await BookPickupSchedule.deleteScheduled(row.id)
            setSnackbar({
                open: true,
                message: response.message,
                severity: response.isSuccess ? 'success' : 'error'
            });
            setReload(true)
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Lỗi: ' + error,
                severity: 'error'
            });
        }
    }

    const handleBorrowing = async (row: any) => {
        try {
            const response = await Borrowing.updateBorrowingStatus(row.id, { borrowingStatus: 3 })
            setSnackbar({
                open: true,
                message: response.message || 'Đã cập nhật trạng thái đang mượn',
                severity: response.isSuccess ? 'success' : 'error'
            });
            setReload(true)
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Lỗi: ' + error,
                severity: 'error'
            });
        }
    }

    const filteredData = borrowData.filter((row) => {
        const matchText =
            row.status.toLowerCase().includes(searchText.toLowerCase()) ||
            row.userName.toLowerCase().includes(searchText.toLowerCase());
        const matchStatus = filterStatus === 'Tất cả' || row.status === filterStatus;
        return matchText && matchStatus;
    });

    const handleConfirmReturn = async (row: any) => {
        try {
            const response = await Borrowing.updateBorrowingStatus(row.id, { borrowingStatus: 4 })
            setSnackbar({
                open: true,
                message: response.message || 'Đã xác nhận trả sách',
                severity: response.isSuccess ? 'success' : 'error'
            });
            setReload(true)
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Lỗi: ' + error,
                severity: 'error'
            });
        }
    }

    const handleOverDue = async (row: any) => {
        try {
            const response = await Borrowing.updateBorrowingStatus(row.id, { borrowingStatus: 5 })
            setSnackbar({
                open: true,
                message: response.message || 'Đã đánh dấu quá hạn',
                severity: response.isSuccess ? 'warning' : 'error'
            });
            setReload(true)
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Lỗi: ' + error,
                severity: 'error'
            });
        }
    }

    const [openDetailDiaLog, setopenDetailDiaLog] = useState<boolean>(false);
    const [openFineDiaLog, setOpenFineDialog] = useState<boolean>(false);
    const [paymentDialog, setPaymentDialog] = useState<boolean>(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>(PaymentType.Cash);

    const handleOpenDetailDialog = (row: any) => {
        setSelectedBorrowing(row);
        setopenDetailDiaLog(true);
    }

    const handleCloseDetailDialog = () => {
        setopenDetailDiaLog(false);
    }

    const onHandleOpenFineDiaLog = () => {
        setOpenFineDialog(true);
    }

    const onHandleCloseFineDiaLog = () => {
        setOpenFineDialog(false);
    }

    // Payment handlers
    const handleOpenPaymentDialog = () => {
        setPaymentDialog(true);
        setSelectedPaymentType(PaymentType.Cash);
    };

    const handleClosePaymentDialog = () => {
        setPaymentDialog(false);
        setSelectedPaymentType(PaymentType.Cash);
        setPaymentProcessing(false);
    };

    // Tính tổng tiền phạt
    const calculateTotalFine = (): number => {
        let total = 0;
        borrowingDetailsForFine.forEach(detail => {
            if (detail.fineResponses && detail.fineResponses.length > 0) {
                detail.fineResponses.forEach(fine => {
                    total += fine.amount;
                });
            }
        });
        return total;
    };

    const handlePayment = async () => {
        setPaymentProcessing(true);

        try {
            const totalAmount = calculateTotalFine();

            if (totalAmount === 0) {
                setSnackbar({
                    open: true,
                    message: 'Không có khoản phạt nào cần thanh toán',
                    severity: 'warning'
                });
                setPaymentProcessing(false);
                return;
            }

            if (selectedPaymentType === PaymentType.Cash) {
                const response = await PaymentApi.createCashPayment({
                    borrowAmount: totalAmount,
                    paymentType: PaymentType.Cash,
                    vnpText: `Thanh toan tien phat ${selectedBorrowing?.code}`,
                    borrowingId: selectedBorrowing?.id || "",
                });

                if (response.isSuccess) {
                    setSnackbar({
                        open: true,
                        message: 'Thanh toán tiền mặt thành công!',
                        severity: 'success'
                    });

                    handleClosePaymentDialog();
                    handleCloseDetailDialog();
                    setReload(true);
                } else {
                    setSnackbar({
                        open: true,
                        message: response.message || 'Thanh toán thất bại',
                        severity: 'error'
                    });
                }
            } else if (selectedPaymentType === PaymentType.VNPay) {
                const response = await PaymentApi.createPayment({
                    borrowAmount: totalAmount,
                    paymentType: PaymentType.VNPay,
                    vnpText: `Thanh toan tien phat ${selectedBorrowing?.code}`,
                    borrowingId: selectedBorrowing?.id || "",
                });

                if (response.isSuccess && response.data?.paymentUrl) {
                    setSnackbar({
                        open: true,
                        message: 'Đang chuyển đến trang thanh toán VNPay...',
                        severity: 'info'
                    });

                    handleClosePaymentDialog();
                    handleCloseDetailDialog();

                    setTimeout(() => {
                        window.location.href = response.data.paymentUrl;
                    }, 1000);
                } else {
                    setSnackbar({
                        open: true,
                        message: response.message || 'Không thể tạo link thanh toán VNPay',
                        severity: 'error'
                    });
                }
            }
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: 'Lỗi thanh toán: ' + (error.message || error),
                severity: 'error'
            });
        } finally {
            setPaymentProcessing(false);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Borrowing.getAllBorrowing()
                setBorrowData(response.data)
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'Lỗi tải dữ liệu: ' + error,
                    severity: 'error'
                });
            }
        }
        fetchData()
        setReload(false)
    }, [reload])

    const [borrowingDetailId, setBorrowingDetailId] = useState<string>("")
    const [returnDate, setReturnDate] = useState<Date | undefined>()
    const [borrowingDetailsForFine, setBorrowingDetailsForFine] = useState<BorrowingDetailForFineResponse[]>([]);
    const [expandedFineIndex, setExpandedFineIndex] = useState<{ [bookIndex: number]: number | null }>({});

    useEffect(() => {
        const fecthBorrowngDetailsForFine = async () => {
            if (!selectedBorrowing?.id) return;
            try {
                const response = await BorrowingDetail.getBorrowingDetailForFine(selectedBorrowing.id);
                setBorrowingDetailsForFine(response.data.data)
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'Lỗi tải danh sách chi tiết phiếu mượn: ' + error,
                    severity: 'error'
                });
            } finally {
                setReload(false);
            }
        }
        fecthBorrowngDetailsForFine()
    }, [selectedBorrowing, reload])

    return (
        <div className="p-4">
            {/* Search and Filter Card */}
            <Card className="mb-6 shadow-md">
                <CardContent>
                    <SearchFilterBar
                        searchText={searchText}
                        filterStatus={filterStatus}
                        onSearchTextChange={setSearchText}
                        onFilterStatusChange={setFilterStatus}
                    />
                </CardContent>
            </Card>

            {/* Borrow Table */}
            <BorrowTable
                data={filteredData}
                reload={reload}
                onApprove={handleApprove}
                onReject={handleReject}
                onPickupSchedule={handleOpenPickupDialog}
                onCancel={handleCancel}
                onBorrowing={handleBorrowing}
                onConfirmReturn={handleConfirmReturn}
                onHandleOverDue={handleOverDue}
                onOpenFineDialog={handleOpenDetailDialog}
            />

            {/* Schedule Pickup Dialog */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Dialog
                    open={logOpenSchedule}
                    onClose={() => setLogOpenSchedule(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        📅 Chọn khoảng thời gian lấy sách
                    </DialogTitle>
                    <DialogContent sx={{ mt: 3 }}>
                        <Stack spacing={3}>
                            <DatePicker
                                label="Ngày bắt đầu"
                                value={schedule.scheduledPickupDate ? dayjs(schedule.scheduledPickupDate) : null}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        const now = dayjs();
                                        const merged = newValue
                                            .hour(now.hour())
                                            .minute(now.minute())
                                            .second(now.second());
                                        setSchedule({
                                            ...schedule,
                                            scheduledPickupDate: merged.toDate(),
                                        });
                                    } else {
                                        setSchedule({ ...schedule, scheduledPickupDate: null });
                                    }
                                }}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                            <DatePicker
                                label="Ngày kết thúc"
                                value={schedule.expiredPickupDate ? dayjs(schedule.expiredPickupDate) : null}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        const now = dayjs();
                                        const merged = newValue
                                            .hour(now.hour())
                                            .minute(now.minute())
                                            .second(now.second());
                                        setSchedule({
                                            ...schedule,
                                            expiredPickupDate: merged.toDate(),
                                        });
                                    } else {
                                        setSchedule({ ...schedule, expiredPickupDate: null });
                                    }
                                }}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setLogOpenSchedule(false)} variant="outlined">
                            Hủy
                        </Button>
                        <Button
                            onClick={handlePickupSchedule}
                            disabled={!schedule.scheduledPickupDate || !schedule.expiredPickupDate}
                            variant="contained"
                            color="primary"
                        >
                            Xác nhận
                        </Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>

            {/* Fine Detail Dialog */}
            <Dialog
                open={openDetailDiaLog}
                onClose={handleCloseDetailDialog}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <ReceiptLongIcon />
                    <span>Chi tiết phiếu phạt - {selectedBorrowing?.code}</span>
                </DialogTitle>

                <DialogContent sx={{ mt: 2 }}>
                    {reload ? (
                        <Box className="flex justify-center items-center py-8">
                            <Typography>Đang tải...</Typography>
                        </Box>
                    ) : borrowingDetailsForFine && borrowingDetailsForFine.length > 0 ? (
                        <Stack spacing={3}>
                            {/* Bảng tổng hợp */}
                            <TableContainer component={Paper} elevation={2}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f3f4f6' }}>
                                            <TableCell><strong>Sách</strong></TableCell>
                                            <TableCell align="right"><strong>Giá sách</strong></TableCell>
                                            <TableCell><strong>Lý do phạt</strong></TableCell>
                                            <TableCell align="right"><strong>Tiền phạt</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {borrowingDetailsForFine.map((detail, index) => (
                                            <React.Fragment key={index}>
                                                {detail.fineResponses && detail.fineResponses.length > 0 ? (
                                                    detail.fineResponses.map((fine, fineIdx) => (
                                                        <TableRow
                                                            key={`${index}-${fineIdx}`}
                                                            sx={{ '&:hover': { bgcolor: '#f9fafb' } }}
                                                        >
                                                            {fineIdx === 0 && (
                                                                <>
                                                                    <TableCell rowSpan={detail.fineResponses.length}>
                                                                        <Typography variant="body2" fontWeight={600}>
                                                                            {detail.bookTitle}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {new Date(detail.returnedDate).toLocaleDateString("vi-VN")}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell rowSpan={detail.fineResponses.length} align="right">
                                                                        <Typography variant="body2">
                                                                            {detail.unitPrice.toLocaleString('vi-VN')}₫
                                                                        </Typography>
                                                                    </TableCell>
                                                                </>
                                                            )}
                                                            <TableCell>
                                                                <Chip
                                                                    label={FineReasonLabel[fine.fineReason as keyof typeof FineReasonLabel]}
                                                                    color="error"
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                                    {fine.fineRate.toLocaleString('vi-VN')}₫/ngày × {fine.daysLate} ngày
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="body2" fontWeight={600} color="error.main">
                                                                    {fine.amount.toLocaleString('vi-VN')}₫
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {detail.bookTitle}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {detail.unitPrice.toLocaleString('vi-VN')}₫
                                                        </TableCell>
                                                        <TableCell colSpan={2} align="center">
                                                            <Typography variant="body2" color="text.secondary">
                                                                Chưa có phiếu phạt
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                onClick={() => {
                                                                    onHandleOpenFineDiaLog();
                                                                    handleCloseDetailDialog();
                                                                    setBorrowingDetailId(detail.borrowingDetailId);
                                                                    setReturnDate(detail.returnedDate ?? undefined);
                                                                }}
                                                                sx={{ mt: 1 }}
                                                            >
                                                                + Tạo phiếu phạt
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        {/* Tổng cộng */}
                                        <TableRow sx={{ bgcolor: '#fef3c7' }}>
                                            <TableCell colSpan={3} align="right">
                                                <Typography variant="h6" fontWeight={700}>
                                                    TỔNG CỘNG:
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="h6" fontWeight={700} color="error.main">
                                                    {calculateTotalFine().toLocaleString('vi-VN')}₫
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    ) : (
                        <Alert severity="info">Không có dữ liệu chi tiết phiếu mượn.</Alert>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, gap: 1, bgcolor: '#f9fafb' }}>
                    <Button onClick={handleCloseDetailDialog} variant="outlined">
                        Đóng
                    </Button>
                    {calculateTotalFine() > 0 && (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<PaymentIcon />}
                            onClick={handleOpenPaymentDialog}
                            sx={{
                                px: 3,
                                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                }
                            }}
                        >
                            Thanh toán {calculateTotalFine().toLocaleString('vi-VN')}₫
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Payment Dialog */}
            <Dialog
                open={paymentDialog}
                onClose={handleClosePaymentDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <PaymentIcon />
                    <span>Thanh toán tiền phạt</span>
                </DialogTitle>

                <DialogContent sx={{ mt: 3 }}>
                    <Stack spacing={3}>
                        {/* Amount Display */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                                textAlign: 'center',
                                border: '2px solid #22c55e'
                            }}
                        >
                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                Tổng số tiền cần thanh toán
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#16a34a' }}>
                                {calculateTotalFine().toLocaleString('vi-VN')}₫
                            </Typography>
                        </Paper>

                        <FormControl component="fieldset">
                            <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>
                                Chọn phương thức thanh toán
                            </FormLabel>
                            <RadioGroup
                                value={selectedPaymentType}
                                onChange={(e) => setSelectedPaymentType(parseInt(e.target.value) as PaymentType)}
                            >
                                <Paper
                                    elevation={selectedPaymentType === PaymentType.Cash ? 3 : 0}
                                    sx={{
                                        p: 2.5,
                                        mb: 2,
                                        border: selectedPaymentType === PaymentType.Cash ? '2px solid #22c55e' : '1px solid #e5e7eb',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            borderColor: '#22c55e',
                                            boxShadow: 2
                                        }
                                    }}
                                    onClick={() => setSelectedPaymentType(PaymentType.Cash)}
                                >
                                    <FormControlLabel
                                        value={PaymentType.Cash}
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#22c55e' }} />
                                                <Box>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {PaymentLabel[PaymentType.Cash]}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Thanh toán trực tiếp tại quầy thủ thư
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </Paper>

                                <Paper
                                    elevation={selectedPaymentType === PaymentType.VNPay ? 3 : 0}
                                    sx={{
                                        p: 2.5,
                                        border: selectedPaymentType === PaymentType.VNPay ? '2px solid #22c55e' : '1px solid #e5e7eb',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            borderColor: '#22c55e',
                                            boxShadow: 2
                                        }
                                    }}
                                    onClick={() => setSelectedPaymentType(PaymentType.VNPay)}
                                >
                                    <FormControlLabel
                                        value={PaymentType.VNPay}
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <PaymentIcon sx={{ fontSize: 32, color: '#22c55e' }} />
                                                <Box>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {PaymentLabel[PaymentType.VNPay]}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Thanh toán trực tuyến qua cổng VNPay
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </Paper>
                            </RadioGroup>
                        </FormControl>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 2.5, gap: 1, bgcolor: '#f9fafb' }}>
                    <Button
                        onClick={handleClosePaymentDialog}
                        variant="outlined"
                        disabled={paymentProcessing}
                        sx={{ px: 3 }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handlePayment}
                        variant="contained"
                        color="success"
                        disabled={paymentProcessing}
                        startIcon={paymentProcessing ? null : <PaymentIcon />}
                        sx={{
                            px: 4,
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                            }
                        }}
                    >
                        {paymentProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create Fine Dialog */}
            <CreateFineDialog
                openFineDiaLog={openFineDiaLog}
                onHandleCloseFineDiaLog={onHandleCloseFineDiaLog}
                borrowingDetailId={borrowingDetailId}
                returnedDate={returnDate}
                onSuccess={() => setReload(true)}
            />

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    iconMapping={{
                        success: <CheckCircleOutlineIcon fontSize="inherit" />,
                        error: <ErrorOutlineIcon fontSize="inherit" />
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default BorrowStatusPage;