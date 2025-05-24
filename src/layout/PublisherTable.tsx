
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import type { PublisherResponse } from '../response/publisherResponse';


type Props = {
  data: PublisherResponse[],
  reload: boolean,
  onSelectionChange: (selectionIds: string[]) => void
}
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'publisherName', headerName: 'Tên nhà xuất bản', flex: 1 },
  { field: 'email', headerName: 'Email', width: 280 },
  {
    field: 'phone',
    headerName: 'Số điện thoại',
    flex: 1,
  },
  {
    field: 'address',
    headerName: 'Địa chỉ',
    flex: 1,

  },
];


const paginationModel = { page: 0, pageSize: 5 };

export default function PublisherTable({ data, reload, onSelectionChange
}: Props) {


  return (
    <Paper sx={{ height: 400, width: '100%' }}>
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
        sx={{ border: 0 }}
      />
    </Paper>
  );
}

