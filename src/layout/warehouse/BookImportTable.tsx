
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import type { BookImportResponse } from '../../response/Warehouse/BookImportResponse';


type Props = {
    data: BookImportResponse[],
    reload: boolean,
    onSelectionChange: (selectionIds: string[]) => void
}
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'title', headerName: 'Tên sách', flex: 1 },
    { field: 'authorName', headerName: 'Tên tác giả', flex: 1 },
    { field: 'publisherName', headerName: 'Nhà xuất bản', flex: 1 },
    { field: 'yearPublished', headerName: 'Năm sản xuất', flex: 1 },
    { field: 'quantity', headerName: 'Tổng sách', flex: 1 },
    { field: 'unitPrice', headerName: 'Giá tiền một cuốn', flex: 1 },
    { field: 'categoryName', headerName: 'Loại sách', flex: 1 },
    { field: 'titleBookChapter', headerName: 'Số tập', flex: 1 },
    { field: 'totalPrice', headerName: 'Tổng tiền', flex: 1 },
];


const paginationModel = { page: 0, pageSize: 5 };

export default function BookImportTable({ data, reload, onSelectionChange
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
                checkboxSelection

                onRowSelectionModelChange={(selection) => {
                    const stringIds = Array.from(selection.ids).map((id) => String(id));
                    onSelectionChange(stringIds);
                }}
                sx={{ border: 0.5 }}
            />
        </Paper>
    );
}

