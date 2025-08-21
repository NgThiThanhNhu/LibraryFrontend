import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Checkbox, List, ListItem, Button, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import MainLayoutUser from '../layout/mainLayout/MainLayoutUser';
import { BookCartItem, Borrowing } from '../apis';
import type { BookCartItemResponse } from '../response/BookCartItemResponse';
import type { BorrowingRequest } from '../request/BorrowingRequest';

const MyBookListPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<BookCartItemResponse[]>([]);
    const [selectedItems, setSelectedItems] = useState<BookCartItemResponse[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [duration, setDuration] = useState(7);

    // Lấy giỏ sách
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await BookCartItem.GetAllBookCartOfUser();
                setCartItems(res.data.data);
            } catch (error) {
                console.error('Lỗi khi lấy giỏ sách:', error);
            }
        };
        fetchCart();
    }, []);

    // Chọn hoặc bỏ chọn sách
    const toggleSelect = (item: BookCartItemResponse) => {
        setSelectedItems((prev) =>
            prev.some(i => i.bookItemId === item.bookItemId)
                ? prev.filter(i => i.bookItemId !== item.bookItemId)
                : [...prev, item]
        );
    };

    // Gửi BorrowingRequest
    const handleBorrow = async (borrowDays: number) => {
        if (selectedItems.length === 0) {
            alert('Bạn chưa chọn sách nào để mượn.');
            return;
        }

        const request: BorrowingRequest = {
            duration: borrowDays,
            bookiTemIds: selectedItems.map(i => i.bookItemId),
        };

        try {
            const res = await Borrowing.createBorrowing(request);
            console.log(res)

            if (res.isSuccess) {
                alert('Mượn sách thành công!');
                setSelectedItems([]);
                const updated = await BookCartItem.GetAllBookCartOfUser();
                setCartItems(updated.data.data);
                console.log(cartItems)
                console.log(selectedItems)
                console.log(updated)
            } else {
                alert(`Lỗi: ${res.data.message}`);
            }
        } catch (err) {
            alert('Có lỗi xảy ra khi gửi yêu cầu mượn sách.');
            console.error(err);
        }
    };

    return (
        <MainLayoutUser>
            <div className="p-6">
                <Box className="p-6 max-w-5xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100">


                    {cartItems.length === 0 ? (
                        <Typography className="text-gray-500">Chưa có cuốn sách nào trong giỏ.</Typography>
                    ) : (
                        <List>
                            {cartItems.map((item) => (
                                <React.Fragment key={item.id}>
                                    <ListItem
                                        className="flex items-start md:items-center px-2 py-4 hover:bg-gray-50 rounded-lg transition duration-200"
                                        secondaryAction={
                                            <Checkbox
                                                edge="end"
                                                checked={selectedItems.some(i => i.bookItemId === item.bookItemId)}
                                                onChange={() => toggleSelect(item)}
                                                className="mt-2 md:mt-0"
                                            />
                                        }
                                    >
                                        <div className="w-20 h-28 bg-gray-200 rounded-lg mr-4 flex-shrink-0"></div>

                                        <div className="flex-1 space-y-1">
                                            <p className="text-lg font-semibold text-gray-800">{item.bookItemTitle}</p>
                                            <p className="text-sm text-gray-600">Tác giả: {item.bookItemAuthor}</p>
                                            <p className="text-sm text-gray-600">Thể loại: {item.bookItemCategory}</p>
                                        </div>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    )}

                    <div className="mt-8 flex justify-end">
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={selectedItems.length === 0}
                            onClick={() => setOpenDialog(true)}
                            className="rounded-full shadow-md px-8 py-3 text-base font-semibold tracking-wide"
                        >
                            Mượn sách ({selectedItems.length})
                        </Button>
                    </div>
                </Box>

                {/* Dialog nhập số ngày mượn */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Nhập số ngày mượn sách</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Số ngày mượn"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            inputProps={{ min: 1, max: 30 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Huỷ</Button>
                        <Button
                            onClick={async () => {
                                await handleBorrow(duration);
                                setOpenDialog(false);
                            }}
                            variant="contained"
                            color="primary"
                        >
                            Xác nhận mượn
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </MainLayoutUser>
    );
};

export default MyBookListPage;
