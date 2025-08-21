// src/layout/ReturnConfirmDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from '@mui/material';

interface ReturnConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bookTitle: string;
    borrower: string;
}

const ReturnConfirmDialog: React.FC<ReturnConfirmDialogProps> = ({
    open,
    onClose,
    onConfirm,
    bookTitle,
    borrower,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xác nhận trả sách</DialogTitle>
            <DialogContent>
                <Typography>
                    Bạn có chắc muốn xác nhận <strong>trả sách</strong> cho người mượn{' '}
                    <strong>{borrower}</strong> với cuốn <strong>{bookTitle}</strong> không?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Hủy
                </Button>
                <Button variant="contained" color="success" onClick={onConfirm}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReturnConfirmDialog;
