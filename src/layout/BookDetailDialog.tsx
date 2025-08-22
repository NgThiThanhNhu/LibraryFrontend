import { useEffect, useState, forwardRef } from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    CircularProgress,
    Chip,
    Divider,
    IconButton,
    Fade,
    Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { BorrowingDetailResponse } from "../response/BorrowingDetailResponse";
import type { BookPickupScheduledResponse } from "../response/BookPickupScheduledResponse";
import { BookPickupSchedule } from "../apis";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
    open: boolean;
    onClose: () => void;
    borrowingId: string;
    detail: BorrowingDetailResponse[];
};

// Transition Fade cho Dialog
const Transition = forwardRef(function Transition(props: any, ref) {
    return <Fade ref={ref} {...props} timeout={400} />;
});

export const BookDetailDialog = ({ open, onClose, borrowingId, detail }: Props) => {
    if (!open) return null;

    const borrowingCode = detail[0]?.borrowingCode || borrowingId;

    const [schedule, setSchedule] = useState<BookPickupScheduledResponse>();
    const [loadingSchedule, setLoadingSchedule] = useState(false);

    useEffect(() => {
        if (!open) return;
        const fetchSchedule = async () => {
            setLoadingSchedule(true);
            try {
                const response = await BookPickupSchedule.getScheduleByBorrowingId(borrowingId);
                const data = response.data.data;

                // Convert UTC -> VN khi nhận từ BE
                const converted = {
                    ...data,
                    scheduledPickupDate: dayjs.utc(data.scheduledPickupDate).tz("Asia/Ho_Chi_Minh").toDate(),
                    expiredPickupDate: dayjs.utc(data.expiredPickupDate).tz("Asia/Ho_Chi_Minh").toDate(),
                };
                setSchedule(converted);
            } catch (error) {
                alert("Lỗi: " + error);
            } finally {
                setLoadingSchedule(false);
            }
        };
        fetchSchedule();
    }, [open, borrowingId]);
    const formatDateTime = (date?: string | Date | null) => {
        if (!date) return "";
        return dayjs(date).format("DD/MM/YYYY HH:mm"); // Giờ VN
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            maxWidth="md"
            hideBackdrop
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 300 }}
            PaperProps={{
                sx: {
                    width: "700px",
                    borderRadius: 4,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    bgcolor: "white",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid #e0e0e0",
                    bgcolor: "#f5faff",
                }}
            >
                <DialogTitle
                    sx={{
                        p: 0,
                        fontWeight: "bold",
                        color: "#1565c0",
                        fontSize: "1.3rem",
                    }}
                >
                    Mã Phiếu mượn {borrowingCode}
                </DialogTitle>
                <IconButton onClick={onClose} sx={{ color: "#1565c0" }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 2 }}>
                <Box>
                    {detail.length === 0 ? (
                        <Typography textAlign="center" color="text.secondary">
                            Không có sách nào trong đơn này.
                        </Typography>
                    ) : (
                        <Box display="flex" flexDirection="column" gap={2}>
                            {detail.map((book, index) => (
                                <Card
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        borderRadius: 3,
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                                        overflow: "hidden",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 120, objectFit: "cover", bgcolor: "#f5faff" }}
                                        image={book.urlImage || "https://via.placeholder.com/150"}
                                        alt={book.bookItemTitle}
                                    />

                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                            {book.bookItemTitle}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tác giả: {book.authorBookItem}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Thể loại: {book.categoryName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Kho: {book.quantityStorage}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ngày trả: {formatDateTime(book.returnedDate)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>

                <Divider />

                {detail.some((b) => b.isScheduled) && (
                    <Fade in timeout={500}>
                        <Box
                            sx={{
                                borderRadius: 3,
                                p: 3,
                                bgcolor: "#f9fcff",
                                border: "1px solid #cfe8fc",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                                },
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ mb: 2, fontWeight: "bold", color: "#1565c0" }}
                            >
                                Lịch hẹn lấy sách
                            </Typography>

                            {loadingSchedule ? (
                                <CircularProgress size={28} />
                            ) : schedule ? (
                                <Box display="flex" flexDirection="column" gap={1.5}>
                                    <Typography>
                                        ⏰ Từ: <b>{formatDateTime(schedule.scheduledPickupDate)}</b>
                                    </Typography>
                                    <Typography>
                                        ⏳ Đến: <b>{formatDateTime(schedule.expiredPickupDate)}</b>
                                    </Typography>
                                    <Typography>👨‍🏫 Thủ thư: {schedule.librarianName}</Typography>
                                    <Typography>👤 Người nhận: {schedule.userName}</Typography>
                                    <Chip
                                        label={schedule.isPickedUp ? "✅ Đã đến lấy đơn" : "⌛ Chưa đến nhận đơn"}
                                        color={schedule.isPickedUp ? "success" : "warning"}
                                        sx={{ mt: 1, alignSelf: "flex-start", fontWeight: "bold" }}
                                    />
                                </Box>
                            ) : (
                                <Typography color="text.secondary">Chưa có lịch hẹn</Typography>
                            )}
                        </Box>
                    </Fade>
                )}
            </DialogContent>
        </Dialog>
    );
};
