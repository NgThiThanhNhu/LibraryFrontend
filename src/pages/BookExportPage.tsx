import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import MainLayout from '../layout/mainLayout/MainLayout';

const mockBookItems = [
    { id: 101, title: 'Giáo trình Lập trình Java', code: 'JAVA-001', position: 'Kệ A1', status: 'available' },
    { id: 102, title: 'Giáo trình Lập trình Java', code: 'JAVA-002', position: 'Kệ A1', status: 'available' },
    { id: 201, title: 'Cơ sở dữ liệu', code: 'DB-001', position: 'Kệ B3', status: 'available' },
    { id: 301, title: 'Mạng máy tính', code: 'NET-001', position: 'Kệ C2', status: 'available' },
];

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

const BookExportPage: React.FC = () => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [search, setSearch] = useState('');

    const [openDialog, setOpenDialog] = useState(false);
    const [exportHistory, setExportHistory] = useState(mockExportHistory);



    const filteredBookItems = mockBookItems.filter(
        (item) =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.position.toLowerCase().includes(search.toLowerCase())
    );




    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleExport = () => {
        if (selectedIds.length === 0) return;
        setOpenDialog(true);
    };

    const handleConfirmExport = () => {
        const selectedItems = mockBookItems.filter((item) =>
            selectedIds.includes(item.id)
        );

        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].slice(0, 5);

        const newExport = {
            id: exportHistory.length + 1,
            bookTitle: selectedItems.map(item => item.title).join(', '),
            quantity: selectedItems.length,
            exportDate: `${date} ${time}`,
            exportedBy: 'Admin Demo',
        };

        setExportHistory([newExport, ...exportHistory]);
        setSelectedIds([]);
        setOpenDialog(false);
    };




    return (
        <MainLayout>
            <div className=" max-w-[1400px] mx-auto space-y-6">
                <Typography variant="h5" className="font-semibold">
                    📦 Quản lý xuất sách khỏi kho
                </Typography>

                <TextField
                    label="Tìm theo tên sách hoặc vị trí"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Bảng kho sách */}
                    <div className="w-full md:w-1/2">
                        <Card>
                            <CardContent>
                                <Typography variant="h6" className="mb-2">Kho sách sẵn sàng</Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Chọn</TableCell>
                                            <TableCell>Mã sách</TableCell>
                                            <TableCell>Tiêu đề</TableCell>
                                            <TableCell>Vị trí</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredBookItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedIds.includes(item.id)}
                                                        onChange={() => toggleSelect(item.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>{item.code}</TableCell>
                                                <TableCell>{item.title}</TableCell>
                                                <TableCell>{item.position}</TableCell>
                                                <TableCell>
                                                    <span className="text-green-600 font-medium">Sẵn sàng</span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="flex justify-end mt-4">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={selectedIds.length === 0}
                                        onClick={handleExport}
                                    >
                                        Xuất {selectedIds.length} cuốn sách
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>





                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Xác nhận xuất sách</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Bạn có chắc chắn muốn xuất <strong>{selectedIds.length}</strong> cuốn sách khỏi kho?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Huỷ</Button>
                            <Button variant="contained" color="success" onClick={handleConfirmExport}>
                                Xác nhận
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </MainLayout>
    );
};

export default BookExportPage;
