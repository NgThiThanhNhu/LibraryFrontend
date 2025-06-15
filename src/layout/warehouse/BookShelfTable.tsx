
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import type { BookShelfResponse } from '../../response/Warehouse/BookShelfResponse';


type Props = {
    data: BookShelfResponse[],
    reload: boolean,
    onSelectionChange: (selectionIds: string[]) => void
}
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'bookShelfName', headerName: 'Tên tủ sách', flex: 1 },
    { field: 'numberOfShelves', headerName: 'Số kệ sách', flex: 1 },
    { field: 'roomName', headerName: 'Tên phòng', flex: 1 },
    { field: 'currentShelves', headerName: 'Số kệ sách hiện có', flex: 1 },
    { field: 'isFull', headerName: 'Trạng thái của tủ sách', flex: 1 },


];


const paginationModel = { page: 0, pageSize: 5 };

export default function BookShelfTable({ data, reload, onSelectionChange
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

