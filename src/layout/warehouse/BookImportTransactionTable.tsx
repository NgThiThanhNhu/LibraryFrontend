
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';


import type { BookImportTransactionResponse } from '../../response/Warehouse/BookImportTransactionResponse';
import { TransactionTypeName } from '../../types/BookImportTransactionType';
import { BookImportTransactionType } from '../../types/BookImportTransactionType';

type Props = {
    data: BookImportTransactionResponse[],
    reload: boolean,

}
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'bookId', headerName: 'Id sách', flex: 1 },
    { field: 'bookTitle', headerName: 'Tên sách', flex: 1 },
    { field: 'quantity', headerName: 'Tổng số sách', flex: 1 },
    {
        field: 'unitPrice',
        headerName: 'Giá tiền một cuốn',
        flex: 1,
        renderCell: (params) => (
            <span>{params.value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
        )
    },
    {
        field: 'transactionType',
        headerName: 'Loại giao dịch',
        flex: 1,
        renderCell: (params) => {
            const type = params.value as BookImportTransactionType;
            const label = TransactionTypeName[type] ?? "Không xác định";
            return <span>{label}</span>;
        }

    },
    {
        field: 'createdDate',
        headerName: 'Ngày tạo',
        flex: 1,
        renderCell: (params) => {
            const date = new Date(params.value);
            return (
                <span>{date.toLocaleString('vi-VN', {
                    hour12: false,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>
            );
        }
    },
    {
        field: 'totalPrice',
        headerName: 'Tổng tiền',
        flex: 1,
        renderCell: (params) => (
            <span>{params.value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
        )
    }
];


const paginationModel = { page: 0, pageSize: 5 };

export default function BookImportTransactionTable({ data, reload
}: Props) {


    return (
        <Paper sx={{ height: 450, width: '100%' }}>
            <DataGrid
                rows={data}
                loading={reload}
                getRowId={(row) => row.id} //đảm bảo mỗi hàng có mỗi id duy nhất
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}

                sx={{ border: 0.5 }}
            />
        </Paper>
    );
}

