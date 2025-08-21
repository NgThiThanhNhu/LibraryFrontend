import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import type { BorrowingResponse } from '../response/BorrowingResponse';


interface BorrowTableProps {
    data: BorrowingResponse[];
    reload: boolean
    // onOpenFineDialog: (type: 'Trễ hạn' | 'Hư hỏng', row: BorrowingResponse) => void;
    // onOpenDetailDialog: (row: BorrowingResponse) => void;
    // onOpenExtendDialog: (row: BorrowingResponse) => void;
    // onOpenReminderDialog: (row: BorrowingResponse) => void;
    // onConfirmReturn: (row: BorrowingResponse) => void;
    onApprove: (row: BorrowingResponse) => void;
    onReject: (row: BorrowingResponse) => void;
    onPickupSchedule: (row: BorrowingResponse) => void;
    onCancel: (row: BorrowingResponse) => void;
    onBorrowing: (row: BorrowingResponse) => void
}

const BorrowTable: React.FC<BorrowTableProps> = ({
    data,
    reload,
    // onOpenFineDialog,
    // onOpenDetailDialog,
    // onOpenExtendDialog,
    // onOpenReminderDialog,
    // onConfirmReturn,
    onApprove,
    onReject,
    onPickupSchedule,
    onCancel,
    onBorrowing,
}) => {
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Id phiếu mượn', flex: 1 },
        { field: 'code', headerName: 'Mã phiếu mượn', flex: 1 },
        { field: 'duration', headerName: 'Số ngày mượn', flex: 1 },
        { field: 'dueDate', headerName: 'Ngày đến hạn', flex: 1 },
        { field: 'userName', headerName: 'Người yêu cầu', flex: 1 },
        { field: 'librarianName', headerName: 'Thủ thư thực hiện', flex: 1 },
        { field: 'replyDate', headerName: 'Ngày phản hồi', flex: 1 },
        {
            field: 'status',
            headerName: 'Trạng thái',
            flex: 1,
            renderCell: (params) => {
                const status = params.value; // Đây là chuỗi trả về từ API sau khi đã convert enum
                const colorClass =
                    status === 'Đã trả'
                        ? 'bg-green-500'
                        : status === 'Đang Mượn'
                            ? 'bg-yellow-500'
                            : status === 'Đã quá hạn'
                                ? 'bg-red-500'
                                : status === 'Hư hỏng'
                                    ? 'bg-red-700'
                                    : status === 'Chờ Duyệt'
                                        ? 'bg-blue-500'
                                        : status === 'Đã Duyệt'
                                            ? 'bg-purple-500'
                                            : status === 'Đã Hẹn Lịch'
                                                ? 'bg-blue-500'
                                                : 'bg-yellow-500';
                return (
                    <span className={`text-white px-3 py-1 rounded-full text-sm ${colorClass}`}>
                        {status}
                    </span>
                );
            },
        },

        {
            field: 'actions',
            headerName: 'Hành động',
            flex: 2.5,
            sortable: false,
            renderCell: (params) => {
                const row = params.row as BorrowingResponse;
                const status = row.status;

                return (
                    <div className="flex flex-wrap p-4 gap-5">
                        {/* Luôn có nút Chi tiết */}
                        {/* <Button
                            size="small"
                            variant="outlined"
                            color="info"
                            onClick={() => onOpenDetailDialog(row)}
                        >
                            Chi tiết
                        </Button> */}

                        {/* Chờ Duyệt */}
                        {status === 'Chờ Duyệt' && (
                            <>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => onApprove(row)}
                                >
                                    Duyệt
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => onReject(row)}
                                >
                                    Từ chối
                                </Button>
                            </>
                        )}
                        {status === 'Đã Duyệt' && (
                            <>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => onPickupSchedule(row)}
                                >
                                    Ngày Lấy Sách
                                </Button>
                            </>
                        )}
                        {status === 'Đã Hẹn Lịch' && (
                            <>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => onCancel(row)}
                                >
                                    Hủy Phiếu
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => onBorrowing(row)}
                                >
                                    Đang Mượn
                                </Button>
                            </>
                        )}
                        {/* Đã Duyệt: không hiển thị hành động gì (đợi chuyển sang Đang Mượn) */}

                        {/* Đang Mượn */}
                        {/* {status === 'Đang Mượn' && (
                            <>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => onConfirmReturn(row)}
                                >
                                    Trả sách
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => onOpenExtendDialog(row)}
                                >
                                    Gia hạn
                                </Button>
                            </> */}
                        {/* )} */}

                        {/* Đã quá hạn */}
                        {/* {status === 'Đã quá hạn' && (
                            <>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => onOpenReminderDialog(row)}
                                >
                                    Nhắc nhở
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    onClick={() => onOpenFineDialog('Trễ hạn', row)}
                                >
                                    Nộp phạt
                                </Button>
                            </>
                        )} */}

                        {/* Hư hỏng */}
                        {/* {status === 'Hư hỏng' && (
                            <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => onOpenFineDialog('Hư hỏng', row)}
                            >
                                Nộp phạt
                            </Button>
                        )} */}

                        {/* Đã trả: không cần hành động gì thêm */}
                    </div>
                );
            },
        }

    ];

    return (
        <div className="bg-white rounded-lg shadow">
            <DataGrid
                rows={data}
                loading={reload}
                columns={columns}
                getRowHeight={() => 64}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                autoHeight
            />
        </div>
    );
};

export default BorrowTable;
