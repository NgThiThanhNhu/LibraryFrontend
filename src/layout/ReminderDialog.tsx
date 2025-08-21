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

interface ReminderDialogProps {
    open: boolean;
    onClose: () => void;
    onSend: (message: string) => void;
    borrowerName: string;
}

const ReminderDialog: React.FC<ReminderDialogProps> = ({
    open,
    onClose,
    onSend,
    borrowerName,
}) => {
    const [message, setMessage] = useState(
        `Xin chào ${borrowerName}, bạn đang trễ hạn trả sách. Vui lòng trả sớm nhất có thể.`
    );

    const handleSend = () => {
        onSend(message);
        setMessage('');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Gửi nhắc nhở trả sách</DialogTitle>
            <DialogContent className="space-y-3">
                <Typography>
                    Soạn nội dung tin nhắn gửi đến <strong>{borrowerName}</strong>:
                </Typography>
                <TextField
                    label="Nội dung"
                    multiline
                    fullWidth
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={handleSend}>Gửi</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReminderDialog;
