import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
} from '@mui/material';

interface Props {
    open: boolean;
    onClose: () => void;
    user: any;
    onSave: (user: any) => void;
}

export default function UserManageDialog({ open, onClose, user, onSave }: Props) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        role: 'User',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'User',
                phone: user.phone || '',
                address: user.address || '',
            });
        } else {
            setForm({
                name: '',
                email: '',
                role: 'User',
                phone: '',
                address: '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!form.name || !form.email) {
            alert('Vui lòng nhập đầy đủ Tên và Email.');
            return;
        }

        onSave({ ...form, id: user?.id || Date.now() });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</DialogTitle>
            <DialogContent className="space-y-4 py-4">
                <TextField
                    name="name"
                    label="Tên"
                    fullWidth
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    name="phone"
                    label="Số điện thoại"
                    fullWidth
                    value={form.phone}
                    onChange={handleChange}
                />
                <TextField
                    name="address"
                    label="Địa chỉ"
                    fullWidth
                    value={form.address}
                    onChange={handleChange}
                />
                <TextField
                    name="role"
                    label="Vai trò"
                    select
                    fullWidth
                    value={form.role}
                    onChange={handleChange}
                >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
}
