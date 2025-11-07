import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    TextField,
    MenuItem,
    Button,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import type { FineRequest } from "../request/FineRequest";
import { FineApi } from "../apis";
import { FineReasonType, FineReasonLabel } from "../types/FineReasonType";

interface CreateFineDialogProps {
    openFineDiaLog: boolean;
    onHandleCloseFineDiaLog: () => void;
    borrowingDetailId: string;
    returnedDate?: Date;
    onSuccess: () => void;
}

export default function CreateFineDialog({
    openFineDiaLog,
    onHandleCloseFineDiaLog,
    borrowingDetailId,
    returnedDate,
    onSuccess,
}: CreateFineDialogProps) {
    const [fineList, setFineList] = useState<FineRequest[]>([]);
    const [newFine, setNewFine] = useState<FineRequest>({
        fineReason: FineReasonType.LateReturn,
        fineRate: 0,
    });

    // ✅ Tổng tiền phạt
    const totalFine = fineList.reduce((sum, fine) => sum + fine.fineRate, 0);

    // ✅ Kiểm tra trùng lý do
    const isDuplicateReason = fineList.some(
        (fine) => fine.fineReason === newFine.fineReason
    );

    const handleAddFine = () => {
        if (isDuplicateReason) return; // không thêm trùng
        setFineList([...fineList, newFine]);
        setNewFine({
            fineReason: FineReasonType.LateReturn,
            fineRate: 0,
        });
    };

    const handleRemoveFine = (index: number) => {
        const updated = [...fineList];
        updated.splice(index, 1);
        setFineList(updated);
    };

    const handleSaveFine = async () => {
        try {
            const response = await FineApi.createFine(borrowingDetailId, fineList);
            console.log(response)
            onSuccess();
            onHandleCloseFineDiaLog();
            setFineList([]);
        } catch (err) {
            console.error("Error creating fine:", err);
        }
    };

    return (
        <Dialog open={openFineDiaLog} onClose={onHandleCloseFineDiaLog} maxWidth="sm" fullWidth>
            <DialogTitle className="font-semibold text-lg text-center text-gray-800">
                Tạo phiếu phạt
            </DialogTitle>

            <DialogContent>
                <Box display="flex" alignItems="center" mb={2}>
                    <Typography sx={{ width: 220 }}>Mã chi tiết phiếu mượn:</Typography>
                    <TextField fullWidth value={borrowingDetailId} disabled />
                </Box>

                <Box display="flex" gap={1} alignItems="center" mb={2}>
                    <TextField
                        select
                        fullWidth
                        label="Lý do phạt"
                        value={newFine.fineReason}
                        onChange={(e) =>
                            setNewFine({
                                ...newFine,
                                fineReason: Number(e.target.value) as FineReasonType,
                            })
                        }
                    >
                        {Object.entries(FineReasonLabel).map(([key, label]) => (
                            <MenuItem key={key} value={Number(key)}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>


                    <TextField
                        label="Mức phạt (VNĐ)"
                        type="text"
                        value={newFine.fineRate}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setNewFine({ ...newFine, fineRate: Number(val) });
                        }}
                        fullWidth
                    />


                    <IconButton
                        color="primary"
                        onClick={handleAddFine}
                        disabled={isDuplicateReason || newFine.fineRate <= 0}
                        title={isDuplicateReason ? "Đã tồn tại lý do này" : "Thêm lý do"}
                    >
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Box>

                {/* Danh sách các lý do phạt */}
                {fineList.map((fine, index) => (
                    <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        p={1}
                        border={1}
                        borderRadius={2}
                        mb={1}
                    >
                        <Typography>
                            {FineReasonLabel[fine.fineReason]}:{" "}
                            <strong>{fine.fineRate.toLocaleString()} VNĐ</strong>
                        </Typography>
                        <IconButton color="error" onClick={() => handleRemoveFine(index)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                ))}

                {/* ✅ Tổng tiền phạt */}
                <Box mt={2} textAlign="right">
                    <Typography variant="subtitle1" fontWeight="bold">
                        Tổng tiền phạt: {totalFine.toLocaleString()} VNĐ
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onHandleCloseFineDiaLog}>Hủy</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveFine}
                    disabled={fineList.length === 0}
                >
                    Lưu phiếu phạt
                </Button>
            </DialogActions>
        </Dialog>
    );
}
