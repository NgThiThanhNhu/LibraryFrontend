import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
} from '@mui/material';

interface ExtendDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (days: number) => void;
}

const ExtendDialog: React.FC<ExtendDialogProps> = ({ open, onClose, onSubmit }) => {
    const [days, setDays] = useState<number>(0);

    const handleSubmit = () => {
        onSubmit(days);
        setDays(0);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Gia hạn mượn sách</DialogTitle>
            <DialogContent className="space-y-4">
                <Typography>Nhập số ngày bạn muốn gia hạn thêm:</Typography>
                <TextField
                    type="number"
                    label="Số ngày gia hạn"
                    fullWidth
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value || '0'))}
                    inputProps={{ min: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={handleSubmit}>Xác nhận</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExtendDialog;
