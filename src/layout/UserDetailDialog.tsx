import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Chip,
    Stack,
    Divider,
} from '@mui/material';

interface Props {
    open: boolean;
    onClose: () => void;
    user: {
        name: string;
        email: string;
        role: string;
        borrowCount?: number;
        borrowedGenres?: string[];
    } | null;
}

export default function UserDetailDialog({ open, onClose, user }: Props) {
    if (!user) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Thông tin người dùng</DialogTitle>
            <DialogContent className="space-y-4">
                <Typography><strong>Họ tên:</strong> {user.name}</Typography>
                <Typography><strong>Email:</strong> {user.email}</Typography>
                <Typography><strong>Vai trò:</strong> {user.role}</Typography>

                <Divider className="my-2" />

                <Typography><strong>Số lượt mượn sách:</strong> {user.borrowCount ?? 0}</Typography>

                <Typography><strong>Thể loại yêu thích:</strong></Typography>
                {user.borrowedGenres && user.borrowedGenres.length > 0 ? (
                    <Stack direction="row" spacing={1} className="mt-1 flex-wrap">
                        {user.borrowedGenres.map((genre, idx) => (
                            <Chip key={idx} label={genre} variant="outlined" />
                        ))}
                    </Stack>
                ) : (
                    <Typography color="text.secondary">Chưa có dữ liệu.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
            </DialogActions>
        </Dialog>
    );
}
