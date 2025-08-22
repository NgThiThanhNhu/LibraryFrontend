import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import SearchFilterBar from '../layout/SearchFilterBar';
import BorrowTable from '../layout/BorrowTable';
import type { StatusType } from './BorrowAndManageWrapper';
import type { BorrowingResponse } from '../response/BorrowingResponse';
import { BookPickupSchedule, Borrowing } from '../apis';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import type { BookPickupScheduleRequest } from '../request/BookPickupScheduleRequest';
import { useNavigate } from 'react-router-dom';

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
    const [reload, setReload] = useState<boolean>(false)
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
        </div>
    );
};

export default BorrowStatusPage;
