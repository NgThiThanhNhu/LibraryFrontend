import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Button,
    Typography,
} from '@mui/material';
import MainLayout from '../layout/mainLayout/MainLayout';
import ReserveFormDialog from '../layout/ReserveFormDialog';

const mockBooks = [
    {
        id: 1,
        title: 'Giáo trình Lập trình Java',
        category: 'Lập trình',
        author: 'Nguyễn Văn A',
        imageUrl: 'https://via.placeholder.com/150x200?text=Java',
    },
    {
        id: 2,
        title: 'Cơ sở dữ liệu nâng cao',
        category: 'Cơ sở dữ liệu',
        author: 'Trần Thị B',
        imageUrl: 'https://via.placeholder.com/150x200?text=SQL',
    },
    {
        id: 3,
        title: 'Trí tuệ nhân tạo cơ bản',
        category: 'AI',
        author: 'Lê Văn C',
        imageUrl: 'https://via.placeholder.com/150x200?text=AI',
    },
    {
        id: 4,
        title: 'Thiết kế Web',
        category: 'Frontend',
        author: 'Ngô Thị D',
        imageUrl: 'https://via.placeholder.com/150x200?text=HTML+CSS',
    },
    {
        id: 5,
        title: 'Hệ điều hành',
        category: 'OS',
        author: 'Đặng Văn E',
        imageUrl: 'https://via.placeholder.com/150x200?text=OS',
    },
    {
        id: 6,
        title: 'Mạng máy tính',
        category: 'Networking',
        author: 'Nguyễn Văn F',
        imageUrl: 'https://via.placeholder.com/150x200?text=Network',
    },
];

const ReserveBookPage: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBook, setSelectedBook] = useState<typeof mockBooks[0] | null>(null);

    const handleOpenDialog = (book: typeof mockBooks[0]) => {
        setSelectedBook(book);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedBook(null);
    };

    const handleSubmitReservation = (formData: {
        bookId: number;
        bookTitle: string;
        userName: string;
        note?: string;
    }) => {
        console.log('📚 Đặt trước:', formData);
        // TODO: Gọi API thực tế
        handleCloseDialog();
    };

    return (
        <MainLayout>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-6">📖 Đặt trước sách</h2>

                <div className="grid grid-cols-5 gap-6">
                    {mockBooks.map((book) => (
                        <Card
                            key={book.id}
                            className="rounded-xl border shadow-lg hover:shadow-xl transition-all"
                        ><CardMedia
                                component="img"
                                image={book.imageUrl}
                                alt={book.title}
                                className="w-full h-[200px] object-cover rounded-t-xl"
                            />

                            <CardContent className="flex flex-col gap-2">
                                <Typography variant="subtitle1" className="font-semibold line-clamp-2">
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    📚 Thể loại: {book.category}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    ✍️ Tác giả: {book.author}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleOpenDialog(book)}
                                    className="mt-2"
                                >
                                    Đặt trước
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <ReserveFormDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    onSubmit={(formData) =>
                        handleSubmitReservation({
                            ...formData,
                            bookId: selectedBook?.id || 0,
                            bookTitle: selectedBook?.title || '',
                        })
                    }
                    book={selectedBook}
                />
            </div>
        </MainLayout>
    );
};

export default ReserveBookPage;
