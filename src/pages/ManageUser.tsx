import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import MainLayout from '../layout/mainLayout/MainLayout';
import UserManageDialog from '../layout/UserManageDialog';
import UserManageTable from '../layout/UserManageTable';
import UserDetailDialog from '../layout/UserDetailDialog';


export default function ManageUsers() {
    const [openDialog, setOpenDialog] = useState(false);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean, user: any | null }>({ open: false, user: null });

    useEffect(() => {
        // Giả lập dữ liệu
        setUsers([
            {
                id: 1,
                name: 'Nguyễn Văn A',
                email: 'a@gmail.com',
                role: 'Admin',
                borrowedGenres: ['Khoa học', 'Lập trình'],
                borrowCount: 12,
            },
            {
                id: 2,
                name: 'Trần Thị B',
                email: 'b@gmail.com',
                role: 'User',
                borrowedGenres: ['Tâm lý', 'Tiểu thuyết'],
                borrowCount: 7,
            },
        ]);
    }, []);

    const handleAddUser = () => {
        setSelectedUser(null);
        setOpenDialog(true);
    };

    const handleEditUser = (user: any) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleViewDetail = (user: any) => {
        setSelectedUser(user);
        setOpenDetailDialog(true);
    };

    const handleDeleteUser = (user: any) => {
        setConfirmDelete({ open: true, user });
    };

    const confirmDeleteUser = () => {
        if (confirmDelete.user) {
            setUsers(users.filter((u) => u.id !== confirmDelete.user.id));
        }
        setConfirmDelete({ open: false, user: null });
    };

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <MainLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h5">Quản lý người dùng</Typography>
                    <Button variant="contained" onClick={handleAddUser}>
                        Thêm người dùng
                    </Button>
                </div>

                <div className="mb-4">
                    <TextField
                        label="Tìm kiếm người dùng"
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <UserManageTable
                    users={filteredUsers}
                    onEdit={handleEditUser}
                    onViewDetail={handleViewDetail}
                    onDelete={handleDeleteUser}
                />

                <UserManageDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    user={selectedUser}
                    onSave={(newUser: any) => {
                        if (newUser.id) {
                            setUsers((prev) =>
                                prev.map((u) => (u.id === newUser.id ? newUser : u))
                            );
                        } else {
                            setUsers((prev) => [...prev, { ...newUser, id: Date.now() }]);
                        }
                        setOpenDialog(false);
                    }}
                />

                <UserDetailDialog
                    open={openDetailDialog}
                    onClose={() => setOpenDetailDialog(false)}
                    user={selectedUser}
                />

                {/* Dialog xác nhận xóa */}
                <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, user: null })}>
                    <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
                    <DialogContent>
                        Bạn có chắc muốn xóa tài khoản: {confirmDelete.user?.name}?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDelete({ open: false, user: null })}>Hủy</Button>
                        <Button onClick={confirmDeleteUser} color="error">Xóa</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </MainLayout>
    );
}
