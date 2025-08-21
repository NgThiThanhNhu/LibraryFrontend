import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

interface DetailDialogProps {
    open: boolean;
    onClose: () => void;
    data: {
        bookTitle: string;
        borrower: string;
        borrowDate: string;
        returnDate: string;
        status: string;
        approvedDate?: string;
        rejectedReason?: string;
    } | null;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ open, onClose, data }) => {
    if (!data) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chi tiết mượn sách</DialogTitle>
            <DialogContent className="space-y-3">
                <Typography><strong>Tên sách:</strong> {data.bookTitle}</Typography>
                <Typography><strong>Người mượn:</strong> {data.borrower}</Typography>
                <Typography><strong>Trạng thái:</strong> {data.status}</Typography>

                {data.status === 'Chờ duyệt' && (
                    <Typography color="warning.main">⏳ Yêu cầu mượn đang chờ phê duyệt.</Typography>
                )}

                {data.status === 'Bị từ chối' && (
                    <Typography color="error.main">
                        ❌ Đã bị từ chối{data.rejectedReason ? `: ${data.rejectedReason}` : '.'}
                    </Typography>
                )}

                {data.approvedDate && (
                    <Typography>
                        <strong>Ngày được duyệt:</strong>{' '}
                        {new Date(data.approvedDate).toLocaleString('vi-VN')}
                    </Typography>
                )}

                <Typography><strong>Ngày mượn:</strong> {data.borrowDate || 'Chưa có'}</Typography>
                <Typography><strong>Ngày trả:</strong> {data.returnDate || 'Chưa trả'}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DetailDialog;
