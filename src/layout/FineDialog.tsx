import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
} from '@mui/material';

type FineType = 'Hư hỏng' | 'Trễ hạn';

interface FineDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (fineType: FineType, amount: number, description: string) => void;
    fineType: FineType;
}

const FineDialog: React.FC<FineDialogProps> = ({
    open,
    onClose,
    onSubmit,
    fineType,
}) => {
    const [amount, setAmount] = useState<number>(0);
    const [daysLate, setDaysLate] = useState<number>(0);
    const [description, setDescription] = useState<string>('');

    // Reset fields khi mở lại
    useEffect(() => {
        if (open) {
            setAmount(0);
            setDaysLate(0);
            setDescription('');
        }
    }, [open]);

    const handleSubmit = () => {
        const finalAmount = fineType === 'Trễ hạn' ? daysLate * 5000 : amount;
        onSubmit(fineType, finalAmount, description);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="font-semibold text-lg text-gray-800">
                {fineType === 'Trễ hạn' ? 'Xử lý phạt do trễ hạn' : 'Xử lý phạt do hư hỏng'}
            </DialogTitle>

            <DialogContent className="flex flex-col gap-4 pt-4">
                {fineType === 'Trễ hạn' && (
                    <>
                        <TextField
                            label="Số ngày trễ"
                            type="number"
                            value={daysLate}
                            onChange={(e) => setDaysLate(parseInt(e.target.value || '0'))}
                            fullWidth
                            inputProps={{ min: 0 }}
                        />
                        <Typography variant="body2" className="text-gray-600">
                            Số tiền phạt = số ngày x 5.000 VNĐ
                        </Typography>
                        <TextField
                            label="Số tiền phạt (VNĐ)"
                            type="number"
                            value={daysLate * 5000}
                            fullWidth
                            disabled
                        />
                    </>
                )}

                {fineType === 'Hư hỏng' && (
                    <>
                        <TextField
                            label="Mô tả hư hỏng"
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Số tiền phạt (VNĐ)"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value || '0'))}
                            fullWidth
                            inputProps={{ min: 0 }}
                        />
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Hủy
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Xác nhận nộp phạt
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FineDialog;
