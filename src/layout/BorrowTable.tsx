import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Button, Chip } from '@mui/material';
import type { BorrowingResponse } from '../response/BorrowingResponse';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import WarningIcon from '@mui/icons-material/Warning';
import ReceiptIcon from '@mui/icons-material/Receipt';

interface BorrowTableProps {
    data: BorrowingResponse[];
    reload: boolean
    onOpenFineDialog: (row: BorrowingResponse) => void;
    onConfirmReturn: (row: BorrowingResponse) => void;
    onApprove: (row: BorrowingResponse) => void;
    onReject: (row: BorrowingResponse) => void;
    onPickupSchedule: (row: BorrowingResponse) => void;
    onCancel: (row: BorrowingResponse) => void;
    onBorrowing: (row: BorrowingResponse) => void;
    onHandleOverDue: (row: BorrowingResponse) => void
}

const BorrowTable: React.FC<BorrowTableProps> = ({
    data,
    reload,
    onOpenFineDialog,
    onConfirmReturn,
    onApprove,
    onReject,
    onPickupSchedule,
    onCancel,
    onBorrowing,
    onHandleOverDue
}) => {
    const columns: GridColDef[] = [
        {
            field: 'code',
            headerName: 'Mã phiếu',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                <span className="font-semibold text-blue-600">
                    {params.value}
                </span>
            )
        },
        {
            field: 'userName',
            headerName: 'Người mượn',
            flex: 1.2,
            minWidth: 150
        },
        {
            field: 'duration',
            headerName: 'Thời hạn',
            flex: 0.8,
            minWidth: 100,
            renderCell: (params) => (
                <Chip
                    label={`${params.value} ngày`}
                    size="small"
                    color="primary"
                    variant="outlined"
                />
            )
        },
        {
            field: 'dueDate',
            headerName: 'Ngày đến hạn',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                <span className="text-gray-700">
                    {params.value || 'N/A'}
                </span>
            )
        },
        {
            field: 'librarianName',
            headerName: 'Thủ thư',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                <span className="text-gray-600">
                    {params.value || 'Chưa xử lý'}
                </span>
            )
        },
        {
            field: 'isReminded',
            headerName: 'Nhắc nhở',
            flex: 0.8,
            minWidth: 100,
            renderCell: (params) => (
                params.row.isReminded
                    ? <Chip
                        label="Đã nhắc"
                        size="small"
                        color="success"
                        icon={<CheckCircleIcon />}
                    />
                    : <Chip
                        label="Chưa nhắc"
                        size="small"
                        color="default"
                        icon={<ScheduleIcon />}
                    />
            )
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            flex: 1,
            minWidth: 130,
            renderCell: (params) => {
                const status = params.value;
                const statusConfig: Record<string, { color: any; icon: React.ReactNode; label: string }> = {
                    'Đã trả': {
                        color: 'success',
                        icon: <CheckCircleIcon fontSize="small" />,
                        label: 'Đã trả'
                    },
                    'Đang Mượn': {
                        color: 'warning',
                        icon: <LocalShippingIcon fontSize="small" />,
                        label: 'Đang mượn'
                    },
                    'Đã quá hạn': {
                        color: 'error',
                        icon: <WarningIcon fontSize="small" />,
                        label: 'Quá hạn'
                    },
                    'Chờ Duyệt': {
                        color: 'info',
                        icon: <ScheduleIcon fontSize="small" />,
                        label: 'Chờ duyệt'
                    },
                    'Đã Duyệt': {
                        color: 'primary',
                        icon: <CheckCircleIcon fontSize="small" />,
                        label: 'Đã duyệt'
                    },
                    'Đã Hẹn Lịch': {
                        color: 'secondary',
                        icon: <ScheduleIcon fontSize="small" />,
                        label: 'Đã hẹn lịch'
                    },
                };

                const config = statusConfig[status] || {
                    color: 'default',
                    icon: null,
                    label: status
                };

                return (
                    <Chip
                        icon={config.icon}
                        label={config.label}
                        color={config.color}
                        size="small"
                        variant="filled"
                    />
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            flex: 2,
            minWidth: 280,
            sortable: false,
            renderCell: (params) => {
                const row = params.row as BorrowingResponse;
                const status = row.status;

                return (
                    <div className="flex flex-wrap gap-2 py-2">
                        {/* Chờ Duyệt */}
                        {status === 'Chờ Duyệt' && (
                            <>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => onApprove(row)}
                                    startIcon={<CheckCircleIcon />}
                                >
                                    Duyệt
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => onReject(row)}
                                    startIcon={<CancelIcon />}
                                >
                                    Từ chối
                                </Button>
                            </>
                        )}

                        {/* Đã Duyệt */}
                        {status === 'Đã Duyệt' && (
                            <>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onPickupSchedule(row)}
                                    startIcon={<ScheduleIcon />}
                                >
                                    Hẹn lịch
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => onReject(row)}
                                    startIcon={<CancelIcon />}
                                >
                                    Hủy
                                </Button>
                            </>
                        )}

                        {/* Đã Hẹn Lịch */}
                        {status === 'Đã Hẹn Lịch' && (
                            <>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => onCancel(row)}
                                    startIcon={<CancelIcon />}
                                >
                                    Hủy phiếu
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => onBorrowing(row)}
                                    startIcon={<LocalShippingIcon />}
                                >
                                    Cho mượn
                                </Button>
                            </>
                        )}

                        {/* Đang Mượn */}
                        {status === 'Đang Mượn' && (
                            <>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => onConfirmReturn(row)}
                                    startIcon={<AssignmentReturnIcon />}
                                >
                                    Trả sách
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => onHandleOverDue(row)}
                                    startIcon={<WarningIcon />}
                                >
                                    Quá hạn
                                </Button>
                            </>
                        )}

                        {/* Đã quá hạn */}
                        {status === 'Đã quá hạn' && (
                            <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => onOpenFineDialog(row)}
                                startIcon={<ReceiptIcon />}
                            >
                                Chi tiết phạt
                            </Button>
                        )}
                    </div>
                );
            },
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md">
            <DataGrid
                rows={data}
                loading={reload}
                columns={columns}
                getRowHeight={() => 70}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                }}
                autoHeight
                sx={{
                    '& .MuiDataGrid-cell': {
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f3f4f6',
                        fontWeight: 600,
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: '#f9fafb',
                    },
                }}
            />
        </div>
    );
};

export default BorrowTable;