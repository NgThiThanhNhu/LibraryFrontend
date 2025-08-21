import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    CardMedia,
} from '@mui/material';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: {
        bookId: number;
        bookTitle: string;
        userName: string;
        note?: string;
    }) => void;
    book: {
        id: number;
        title: string;
        category: string;
        author: string;
        imageUrl: string;
    } | null;
}

const ReserveFormDialog: React.FC<Props> = ({ open, onClose, onSubmit, book }) => {
    const [userName, setUserName] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        if (!book || !userName.trim()) return;
        onSubmit({
            bookId: book.id,
            bookTitle: book.title,
            userName: userName.trim(),
            note: note.trim(),
        });
        setUserName('');
        setNote('');
    };

    if (!book) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="font-semibold text-lg">
                📖 Xác nhận đặt trước sách
            </DialogTitle>
            <DialogContent>
                <Box className="flex gap-4 items-start mb-4">
                    <CardMedia
                        component="img"
                        image={book.imageUrl}
                        alt={book.title}
                        style={{ width: 120, height: 160, borderRadius: 8 }}
                    />
                    <Box>
                        <Typography variant="subtitle1" className="font-semibold">{book.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            📚 Thể loại: {book.category}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            ✍️ Tác giả: {book.author}
                        </Typography>
                    </Box>
                </Box>

                <TextField
                    fullWidth
                    label="Tên người đặt"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    margin="dense"
                    required
                />
                <TextField
                    fullWidth
                    label="Ghi chú (tuỳ chọn)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    margin="dense"
                    multiline
                    rows={2}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Hủy
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained" disabled={!userName.trim()}>
                    Đặt trước
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReserveFormDialog;
