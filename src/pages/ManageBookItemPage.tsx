import React, { useState } from 'react';
import {
    Card, CardContent, Typography, TextField, Chip, Button,
    Table, TableHead, TableBody, TableCell, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions,
    MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import MainLayout from '../layout/mainLayout/MainLayout';

type StatusType = 'available' | 'borrowed' | 'reserved' | 'damaged';

interface BookItem {
    id: number;
    code: string;
    title: string;
    position: string;
    status: StatusType;
}

interface ManageBookItemsProps {
    bookItems: BookItem[];
    updateBookItemStatus: (id: number, status: StatusType) => void;
    deleteBookItem: (id: number) => void;
}

const statusColorMap: Record<StatusType, 'success' | 'warning' | 'info' | 'error'> = {
    available: 'success',
    borrowed: 'warning',
    reserved: 'info',
    damaged: 'error',
};

const ManageBookItemsPage: React.FC<ManageBookItemsProps> = ({ bookItems, updateBookItemStatus, deleteBookItem }) => {
    const [searchText, setSearchText] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [editedStatus, setEditedStatus] = useState<StatusType>('available');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

    const filteredItems = bookItems.filter((item) =>
        `${item.code} ${item.title} ${item.position}`.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleEditClick = (item: BookItem) => {
        setEditId(item.id);
        setEditedStatus(item.status);
    };

    const handleSaveStatus = () => {
        if (editId !== null) {
            updateBookItemStatus(editId, editedStatus);
            setEditId(null);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteDialog({ open: true, id });
    };

    const confirmDelete = () => {
        if (deleteDialog.id !== null) {
            deleteBookItem(deleteDialog.id);
            setDeleteDialog({ open: false, id: null });
        }
    };

    return (

        <div className="p-6 max-w-6xl mx-auto">
            <Typography variant="h5" className="mb-4 font-semibold">
                📚 Quản lý BookItem
            </Typography>

            <Card className="mb-4 shadow">
                <CardContent>
                    <TextField
                        label="Tìm theo mã, tiêu đề hoặc vị trí"
                        fullWidth
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </CardContent>
            </Card>

            <Card className="shadow">
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã sách</TableCell>
                                <TableCell>Tiêu đề</TableCell>
                                <TableCell>Vị trí kho</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.code}</TableCell>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.position}</TableCell>
                                    <TableCell>
                                        {editId === item.id ? (
                                            <FormControl size="small" fullWidth>
                                                <InputLabel>Trạng thái</InputLabel>
                                                <Select
                                                    value={editedStatus}
                                                    onChange={(e) => setEditedStatus(e.target.value as StatusType)}
                                                    label="Trạng thái"
                                                >
                                                    <MenuItem value="available">Sẵn sàng</MenuItem>
                                                    <MenuItem value="borrowed">Đã mượn</MenuItem>
                                                    <MenuItem value="reserved">Đã đặt</MenuItem>
                                                    <MenuItem value="damaged">Hư hỏng</MenuItem>
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <Chip
                                                label={
                                                    item.status === 'available'
                                                        ? 'Sẵn sàng'
                                                        : item.status === 'borrowed'
                                                            ? 'Đã mượn'
                                                            : item.status === 'reserved'
                                                                ? 'Đã đặt'
                                                                : 'Hư hỏng'
                                                }
                                                color={statusColorMap[item.status]}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editId === item.id ? (
                                            <Button variant="contained" size="small" color="success" onClick={handleSaveStatus}>
                                                Lưu
                                            </Button>
                                        ) : (
                                            <Button variant="outlined" size="small" color="primary" onClick={() => handleEditClick(item)}>
                                                Sửa
                                            </Button>
                                        )}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="error"
                                            className="ml-2"
                                            onClick={() => handleDeleteClick(item.id)}
                                        >
                                            Xoá
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Dialog xác nhận xóa */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
                <DialogTitle>Xác nhận xoá BookItem</DialogTitle>
                <DialogContent>
                    Bạn có chắc muốn xoá BookItem này không? Hành động này sẽ <strong>giảm số lượng</strong> của đầu sách tương ứng.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Huỷ</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">Xoá</Button>
                </DialogActions>
            </Dialog>
        </div>

    );
};

export default ManageBookItemsPage;
