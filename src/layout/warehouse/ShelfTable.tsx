
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';



import type { ShelfResponse } from '../../response/Warehouse/ShelfResponse';


type Props = {
    data: ShelfResponse[],
    reload: boolean,
    onSelectionChange: (selectionIds: string[]) => void
}
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'shelfName', headerName: 'Tên kệ sách', flex: 1 },
    { field: 'numberOfSections', headerName: 'Số ngăn của kệ', flex: 1 },
    { field: 'bookshelfId', headerName: 'Id tủ sách', flex: 1 },
    { field: 'bookshelfName', headerName: 'Tên tủ sách', flex: 1 },
    { field: 'currentSection', headerName: 'Số ô hiện có', flex: 1 },
    { field: 'isFull', headerName: 'Trạng thái của kệ', flex: 1 },
];


const paginationModel = { page: 0, pageSize: 5 };

export default function ShelfTable({ data, reload, onSelectionChange
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

