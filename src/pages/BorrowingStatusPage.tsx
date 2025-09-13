import { useEffect, useState } from "react";
import { Box, Chip, Button } from "@mui/material";
import {
    HourglassEmpty,
    CheckCircle,
    Book,
    AssignmentTurnedIn,
    CalendarToday
} from "@mui/icons-material";
import clsx from "clsx";
import MainLayoutUser from "../layout/mainLayout/MainLayoutUser";
import type { BorrowingUserResponse } from "../response/BorrowingUserResponse";
import type { BorrowingDetailResponse } from "../response/BorrowingDetailResponse";
import { Borrowing, BorrowingDetail } from "../apis";
import { BookDetailDialog } from "../layout/BookDetailDialog";

// Trạng thái mượn
const statusColumns = [
    { id: 0, title: "Chờ Duyệt", color: "bg-yellow-50", icon: <HourglassEmpty />, chipColor: "warning" },
    { id: 1, title: "Đã Duyệt", color: "bg-blue-50", icon: <CheckCircle />, chipColor: "info" },
    { id: 2, title: "Đã Hẹn Lịch", color: "bg-yellow-50", icon: <CalendarToday />, chipColor: "warning" },
    { id: 3, title: "Đang Mượn", color: "bg-indigo-50", icon: <Book />, chipColor: "primary" },
];

const doneColumn = {
    id: -1,
    title: "Hoàn Tất / Quá Hạn",
    color: "bg-green-50",
    icon: <AssignmentTurnedIn />,
    chipColor: "success",
};

const BorrowingStatusPage = () => {
    const [getAllUserBorrowing, setGetAllUserBorrowing] = useState<BorrowingUserResponse[]>([]);
    const [reload, setReload] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBorrowingId, setSelectedBorrowingId] = useState("");
    const [selectedBorrowingDetails, setSelectedBorrowingDetails] = useState<BorrowingDetailResponse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Borrowing.getAllUserBorrowing();
                console.log(response)
                setGetAllUserBorrowing(response.data);
            } catch (error) {
                alert("Không tải được dữ liệu: " + error);
            }
        };

        fetchData();
        setReload(false);
    }, [reload]);

    const getTicketsByStatus = (statusTitle: string) =>
        getAllUserBorrowing.filter(t => t.status.includes(statusTitle));

    const getDoneTickets = () =>
        getAllUserBorrowing.filter(t => t.status === "Đã trả" || t.status === "Đã quá hạn");

    const handleOpenDialog = async (borrowingId: string) => {
        try {
            const response = await BorrowingDetail.getBorrowingDetails(borrowingId);
            setSelectedBorrowingId(borrowingId);
            setSelectedBorrowingDetails(response.data.data);
            console.log(response)
            setDialogOpen(true);
        } catch (error) {
            alert("Lỗi khi tải chi tiết đơn mượn: " + error);
        }
    };

    return (
        <MainLayoutUser>
            <div className="bg-gradient-to-br from-blue-50 to-white p-6">
                <div className="bg-white/70 backdrop-blur-md border-2 border-blue-200 shadow-2xl rounded-3xl p-6 transition-all duration-500">
                    <div className="flex divide-x-2 divide-gray-200 w-full">
                        {[...statusColumns, doneColumn].map((status, index) => {
                            const tickets =
                                status.id === -1
                                    ? getDoneTickets()
                                    : getTicketsByStatus(status.title);

                            return (
                                <div
                                    key={status.id}
                                    className={clsx(
                                        "flex flex-col flex-1 px-4",
                                        index !== 0 ? "pl-6" : ""
                                    )}
                                >
                                    <div className="pb-4 border-b border-gray-300 flex items-center justify-center gap-2 font-semibold text-gray-700 text-lg">
                                        {status.icon} {status.title}
                                    </div>

                                    <div className="pt-4 space-y-4 animate-fade-in">
                                        {tickets.length === 0 ? (
                                            <p className="text-sm text-gray-400 italic text-center">Không có phiếu</p>
                                        ) : (
                                            tickets.map((ticket) => (
                                                <Box
                                                    key={ticket.code}
                                                    className={clsx(
                                                        "rounded-xl p-4 border transition transform hover:scale-[1.02] hover:shadow-lg",
                                                        ticket.status === "Đã quá hạn" ? "bg-red-50" : status.color
                                                    )}
                                                >
                                                    <div className="text-sm font-medium text-gray-800 mb-1">
                                                        📄 {ticket.code}
                                                    </div>
                                                    <Chip
                                                        label={ticket.status}
                                                        size="small"
                                                        className="mb-2"
                                                        color={
                                                            ticket.status === "Đã quá hạn"
                                                                ? "error"
                                                                : ticket.status === "Đã trả"
                                                                    ? "success"
                                                                    : (status.chipColor as any)
                                                        }
                                                    />
                                                    <div className="text-sm text-gray-600">
                                                        📅 Lập: {new Date(ticket.createDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        📅 Số ngày mượn: {ticket.duration}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        📅 Hạn: {new Date(ticket.dueDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        💬 Ngày phản hồi: {ticket.replyDate}
                                                    </div>

                                                    <Box>
                                                        <Button
                                                            onClick={() => handleOpenDialog(ticket.id)}
                                                            className="!bg-blue-500 hover:!bg-blue-600 !text-white !rounded-xl !px-4 !py-2 !text-sm"
                                                        >
                                                            Chi Tiết
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            ))
                                        )}
                                        <BookDetailDialog
                                            open={dialogOpen}
                                            onClose={() => setDialogOpen(false)}
                                            borrowingId={selectedBorrowingId}
                                            detail={selectedBorrowingDetails}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>



        </MainLayoutUser>
    );
};

export default BorrowingStatusPage;
