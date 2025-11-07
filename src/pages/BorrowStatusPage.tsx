import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import SearchFilterBar from '../layout/SearchFilterBar';
import BorrowTable from '../layout/BorrowTable';
import type { StatusType } from './BorrowAndManageWrapper';
import type { BorrowingResponse } from '../response/BorrowingResponse';
import { BookPickupSchedule, Borrowing, BorrowingDetail } from '../apis';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import type { BookPickupScheduleRequest } from '../request/BookPickupScheduleRequest';
import { useNavigate } from 'react-router-dom';
import type { BorrowingDetailForFineResponse } from '../response/BorrowingDetailForFineResponse';
import { FineReasonLabel } from '../types/FineReasonType';
import styleFineReason from '../css/BorrowStatusPage.module.css';
import type { FineResponse } from '../response/FineResponse';
import CreateFineDialog from '../layout/CreateFineDialog';
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
    const handleApprove = async (row: any) => {

        try {
            const response = await Borrowing.updateBorrowingStatus(row.id, { borrowingStatus: 1 })
            console.log(response)
            setReload(true)
        } catch (error) {
            console.log("Lỗi " + error)
        }
    };

    const handleReject = async (row: any) => {
        try {
            const response = await Borrowing.updateBorrowingStatus(row.id, { borrowingStatus: 6 })
            console.log(response)
            setReload(true)
        } catch (error) {
            console.log("Lỗi " + error)
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
            if (!schedule.expiredPickupDate || !schedule.scheduledPickupDate) return alert("Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc")
            const payload = {
                borrowingId: schedule.borrowingId,
                scheduledDateTime: schedule.scheduledPickupDate
                    ? dayjs(schedule.scheduledPickupDate).tz("Asia/Ho_Chi_Minh").utc().toISOString()
                    : null,
                scheduleExpired: schedule.expiredPickupDate ? dayjs(schedule.expiredPickupDate).tz("Asia/Ho_Chi_Minh").utc().toISOString()
                    : null
            }
            console.log("Payload gửi backend:", payload);
            const response = await BookPickupSchedule.createSchedule(schedule)
            setSchedule(schedule)
            setReload(true)
            if (!response.isSuccess) {
                alert("Phiếu mượn quá ngày để hẹn lịch. Chỉ được hẹn trong 3 ngày kể từ ngày duyệt.")
                navigate(`/admin/borrow-manage`)
            }
            setLogOpenSchedule(false);
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    const handleCancel = async (row: any) => {
        try {
            const response = await BookPickupSchedule.deleteScheduled(row.id)
            if (!response.isSuccess) alert(response.message)
            else alert(response.message)
            setReload(true)
        } catch (error) {
            alert("Lỗi" + error)
        }
    }
    const handleBorrowing = async (row: any) => {
        try {
            const response = await Borrowing.updateBorrowingStatus(row.id, { borrowingStatus: 3 })
            if (!response.isSuccess) alert(response.message)
            else alert(response.message)
            setReload(true)
        } catch (error) {
            alert("Lỗi: " + error)
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
            if (!response.isSuccess) alert(response.message)
            else alert(response.message)
            setReload(true)
        } catch (error) {
            alert("Lỗi" + error)
        }
    }

    const handleOverDue = async (row: any) => {
        try {
            const response = await Borrowing.updateBorrowingStatus(row.id, { borrowingStatus: 5 })
            if (!response.isSuccess) alert(response.message)
            else alert(response.message)
            setReload(true)
        } catch (error) {
            alert("Lỗi: " + error)
        }
    }
    const [openDetailDiaLog, setopenDetailDiaLog] = useState<boolean>(false);
    const [openFineDiaLog, setOpenFineDialog] = useState<boolean>(false);
    const [fineResponse, setFineResponse] = useState<FineResponse[]>([]);
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
    const handleFineDialog = () => {
        try {


        } catch (error) {
            alert("Lỗi: " + error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Borrowing.getAllBorrowing()
                setBorrowData(response.data)
            } catch (error) {
                alert("lỗi UseEffect" + error)
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
                console.log(response)
            } catch (error) {
                alert("Lỗi tải danh sách chi tiết phiếu mượn cho nộp phạt " + error)
            } finally {
                setReload(false);
            }
        }
        fecthBorrowngDetailsForFine()
    }, [selectedBorrowing, reload])
    return (
        <div>
            <Card className="mb-6">
                <CardContent>
                    <SearchFilterBar
                        searchText={searchText}
                        filterStatus={filterStatus}
                        onSearchTextChange={setSearchText}
                        onFilterStatusChange={setFilterStatus}
                    />
                </CardContent>
            </Card>

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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Dialog open={logOpenSchedule} onClose={() => setLogOpenSchedule(false)}>
                    <DialogTitle>Chọn khoảng thời gian lấy sách</DialogTitle>
                    <DialogContent sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <DatePicker
                            label="Ngày bắt đầu"
                            value={schedule.scheduledPickupDate ? dayjs(schedule.scheduledPickupDate) : null}
                            onChange={(newValue) => {
                                if (newValue) {
                                    const now = dayjs(); // giờ hiện tại
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
                        />
                        <DatePicker
                            label="Ngày kết thúc"
                            value={schedule.expiredPickupDate ? dayjs(schedule.expiredPickupDate) : null}
                            onChange={(newValue) => {
                                if (newValue) {
                                    const now = dayjs(); // giờ hiện tại
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
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setLogOpenSchedule(false)}>Hủy</Button>
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
            <Dialog open={openDetailDiaLog} onClose={handleCloseDetailDialog} maxWidth="sm" fullWidth>
                <DialogTitle className="font-semibold text-lg text-center text-gray-800">
                    {selectedBorrowing?.code}
                </DialogTitle>

                <DialogContent className="space-y-4">
                    {reload ? (
                        <Typography>Đang tải ...</Typography>
                    ) : borrowingDetailsForFine && borrowingDetailsForFine.length > 0 ? (
                        borrowingDetailsForFine.map((detail, bookIndex) => (
                            <div key={bookIndex} className="border-b border-gray-200 pb-4 mb-4">
                                <Typography><strong>Tên sách:</strong> {detail.bookTitle}</Typography>
                                <Typography><strong>Giá:</strong> {detail.unitPrice}₫</Typography>
                                <Typography><strong>Ngày trả:</strong> {new Date(detail.returnedDate).toLocaleDateString("vi-VN")}</Typography>

                                <Typography className={styleFineReason.FineReasonContainer}>
                                    <strong>Lý do phạt:</strong>
                                    {detail.fineResponses && detail.fineResponses.length > 0 ? (
                                        <div className={styleFineReason.groupFineReason}>
                                            {detail.fineResponses.map((fineDetail, fineIndex) => (
                                                <div
                                                    key={fineIndex}
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() =>
                                                        setExpandedFineIndex((prev) => ({
                                                            ...prev,
                                                            [bookIndex]:
                                                                prev[bookIndex] === fineIndex ? null : fineIndex,
                                                        }))
                                                    }
                                                    onKeyDown={(e) =>
                                                        e.key === "Enter" &&
                                                        setExpandedFineIndex((prev) => ({
                                                            ...prev,
                                                            [bookIndex]:
                                                                prev[bookIndex] === fineIndex ? null : fineIndex,
                                                        }))
                                                    }
                                                    className={`
                                                            ${styleFineReason.fineReasonItem} 
                                                            ${expandedFineIndex[bookIndex] === fineIndex
                                                            ? styleFineReason.fineReasonSelected
                                                            : styleFineReason.fineReasonUnselected
                                                        }
                                        `}
                                                >
                                                    {
                                                        FineReasonLabel[
                                                        fineDetail.fineReason as keyof typeof FineReasonLabel
                                                        ]
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        "Không có"
                                    )}
                                </Typography>

                                {/* Chi tiết lý do phạt hiển thị riêng cho từng sách */}
                                {expandedFineIndex[bookIndex] !== null &&
                                    detail.fineResponses[expandedFineIndex[bookIndex]!] && (
                                        <div className="mt-3 ml-4 space-y-1 border-l-2 border-red-300 pl-4">
                                            <Typography>
                                                <strong>Tiền phạt:</strong>{" "}
                                                {detail.fineResponses[expandedFineIndex[bookIndex]!].amount}₫
                                            </Typography>
                                            <Typography>
                                                <strong>Mức phạt:</strong>{" "}
                                                {detail.fineResponses[expandedFineIndex[bookIndex]!].fineRate}₫
                                            </Typography>
                                            <Typography>
                                                <strong>Số ngày trễ:</strong>{" "}
                                                {detail.fineResponses[expandedFineIndex[bookIndex]!].daysLate}
                                            </Typography>
                                        </div>
                                    )}

                                <div className="flex justify-end mt-3">
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        className="rounded-xl shadow-sm hover:shadow-md"
                                        disabled={detail.isFined}
                                        onClick={() => {
                                            onHandleOpenFineDiaLog();
                                            handleCloseDetailDialog();
                                            setBorrowingDetailId(detail.borrowingDetailId);
                                            setReturnDate(detail.returnedDate ?? undefined);
                                        }}
                                    >
                                        {detail.isFined ? "Đã có phiếu phạt" : "Tạo phiếu phạt"}
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Typography>Không có dữ liệu chi tiết phiếu mượn.</Typography>
                    )}
                </DialogContent>
            </Dialog>
            <CreateFineDialog
                openFineDiaLog={openFineDiaLog}
                onHandleCloseFineDiaLog={onHandleCloseFineDiaLog}
                borrowingDetailId={borrowingDetailId}
                returnedDate={returnDate}
                onSuccess={() => setReload(true)}
            />

        </div>
    );
};

export default BorrowStatusPage;
