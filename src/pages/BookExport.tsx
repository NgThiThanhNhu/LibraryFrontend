import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
    Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import MainLayout from '../layout/mainLayout/MainLayout';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import type { GridColDef } from '@mui/x-data-grid';

interface ExportRecord {
    id: number;
    bookTitle: string;
    quantity: number;
    exportDate: string;
    exportedBy: string;
    note?: string;
}
const mockExportHistory = [
    {
        id: 1,
        bookTitle: 'Lập trình C# cơ bản',
        quantity: 5,
        exportDate: '2025-06-20 09:30',
        exportedBy: 'Admin A',
        note: 'Xuất cho chi nhánh 1'
    },
    {
        id: 2,
        bookTitle: 'AI cơ bản với Python',
        quantity: 3,
        exportDate: '2025-06-21 15:10',
        exportedBy: 'Admin B',
    },
];

const ExportHistoryPage: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [exportData, setExportData] = useState<ExportRecord[]>([]);
    const [exportHistory, setExportHistory] = useState(mockExportHistory);
    const [historySearch, setHistorySearch] = useState('');
    const [exportDateFilter, setExportDateFilter] = useState('');

    // 🔹 Giả lập gọi API lấy dữ liệu xuất sách
    useEffect(() => {
        const fakeApiCall = () => {
            return Promise.resolve<ExportRecord[]>([
                {
                    id: 1,
                    bookTitle: 'Lập trình C# cơ bản',
                    quantity: 5,
                    exportDate: '2025-06-20',
                    exportedBy: 'Admin A',
                    note: 'Xuất cho chi nhánh 1',
                },
                {
                    id: 2,
                    bookTitle: 'AI cơ bản với Python',
                    quantity: 3,
                    exportDate: '2025-06-21',
                    exportedBy: 'Admin B',
                },
                {
                    id: 3,
                    bookTitle: 'SQL nâng cao',
                    quantity: 2,
                    exportDate: '2025-06-22',
                    exportedBy: 'Admin C',
                    note: 'Bổ sung kho A',
                },
            ]);
        };

        fakeApiCall().then(setExportData);
    }, []);

    const filteredExportHistory = exportHistory.filter((item) => {
        const matchText =
            item.bookTitle.toLowerCase().includes(historySearch.toLowerCase()) ||
            item.exportedBy.toLowerCase().includes(historySearch.toLowerCase()) ||
            (item.note?.toLowerCase().includes(historySearch.toLowerCase()) ?? false);

        const matchDate =
            exportDateFilter === '' ||
            item.exportDate.startsWith(exportDateFilter); // So sánh phần ngày YYYY-MM-DD

        return matchText && matchDate;
    });

    const handleExportExcel = () => {
        const exportData = exportHistory.map((item) => ({
            'Tên sách': item.bookTitle,
            'Số lượng': item.quantity,
            'Ngày xuất': item.exportDate,
            'Người xuất': item.exportedBy,
            'Ghi chú': item.note || '',
        }));

        const worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_aoa(worksheet, [['📚 LỊCH SỬ XUẤT SÁCH - THƯ VIỆN ĐIỆN TỬ']], { origin: 'A1' });
        worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
        XLSX.utils.sheet_add_json(worksheet, exportData, { origin: 'A3', skipHeader: false });
        worksheet['!cols'] = [{ wch: 30 }, { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 25 }];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Lịch sử xuất sách');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        });
        saveAs(blob, 'lich_su_xuat_sach.xlsx');
    };

    const columns: GridColDef[] = [
        { field: 'bookTitle', headerName: 'Tên sách', flex: 2 },
        { field: 'quantity', headerName: 'Số lượng', flex: 1, type: 'number' },
        { field: 'exportDate', headerName: 'Ngày xuất', flex: 1.5 },
        { field: 'exportedBy', headerName: 'Người xuất', flex: 1.5 },
        {
            field: 'note',
            headerName: 'Ghi chú',
            flex: 2,
            renderCell: (params) => params.value || '-',
        },
    ];

    return (
        <MainLayout>
            <div className="w-full md:w-1/2">
                <Card>
                    <CardContent>
                        <div className="flex justify-between items-center mb-2">
                            <Typography variant="h6">📋 Lịch sử xuất sách</Typography>
                            <Button variant="outlined" onClick={handleExportExcel}>
                                Xuất Excel
                            </Button>
                        </div>
                        <div className="pb-3">
                            <div className="flex gap-6">
                                <TextField
                                    label="Tìm kiếm lịch sử"
                                    value={historySearch}
                                    onChange={(e) => setHistorySearch(e.target.value)}
                                    size="small"
                                    className="w-80"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    label="Ngày xuất"
                                    type="date"
                                    value={exportDateFilter}
                                    onChange={(e) => setExportDateFilter(e.target.value)}
                                    size="small"
                                    className="w-56"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                        </div>


                        <div className="bg-white rounded shadow">
                            <DataGrid
                                rows={filteredExportHistory}
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
                    </CardContent>
                </Card>
            </div>

        </MainLayout >
    );
};

export default ExportHistoryPage;
