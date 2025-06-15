import { useEffect, useState } from 'react'




import { BookImportTransactionWarehouseApi } from '../../apis';

import MainLayout from '../../layout/MainLayout';

import SearchIcon from '@mui/icons-material/Search';
import BookImportTransactionTable from '../../layout/warehouse/BookImportTransactionTable';
import type { BookImportTransactionResponse } from '../../response/Warehouse/BookImportTransactionResponse';
import { BookImportTransactionType } from '../../types/BookImportTransactionType';
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { TransactionTypeName } from '../../types/BookImportTransactionType';

export const BookImportTransactionPage = () => {

    //getAll

    const [getAllBookImport, setGetAllBookImport] = useState<BookImportTransactionResponse[]>([])
    const [reload, setReload] = useState<boolean>(false)
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await BookImportTransactionWarehouseApi.getAllBookImportTransaction();
                console.log(response);
                setGetAllBookImport(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong


    }, [reload])
    //getbybookid
    const [dialogGetById, setDialogGetById] = useState<boolean>(false)
    const [bookId, setBookId] = useState<string>('');
    const [bookImportGetById, setBookImportGetById] = useState<BookImportTransactionResponse>({
        id: " ",
        bookId: " ",
        bookTitle: " ",
        quantity: null,
        unitPrice: null,
        totalPrice: null,
        transactionType: BookImportTransactionType.Import,
        createdDate: null
    })
    const [box, setBox] = useState<boolean>(false)

    const onOpenLogGetById = () => {
        setDialogGetById(true);
    }
    const onCloseLogGetById = () => {
        setDialogGetById(false);
        setBookId('');
    }
    const onCloseBox = () => {
        setBox(false);
    }
    const onClickGetPublisherById = async () => {
        if (!bookId?.trim()) {
            alert("Vui lòng điền id cần tìm!");
            return;
        }

        try {
            const response = await BookImportTransactionWarehouseApi.getBookImportTransactionbyId(bookId);
            console.log(response);

            if (response.data.data.bookId == bookId) {
                alert('Lấy dữ liệu thành công' + response);
                setBookImportGetById(response.data.data)
                setBox(true);

            } else {
                console.error('Id không tồn tại');
            }
        } catch (error) {
            alert('Id không tồn tại' + error)
        }
    }

    return (
        <MainLayout>
            <div>
                <div >
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={() => {
                            onOpenLogGetById();
                            onCloseBox();
                        }} > <span className="text-gray-700 group-hover:text-blue-500 transition">Tìm kiếm </span>
                            <SearchIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={dialogGetById} onClose={() => { setDialogGetById(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>TÌM KIẾM LỊCH SỬ NHẬP SÁCH</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                                    <TextField fullWidth placeholder='Nhập Id của sách' value={bookId} onChange={(e) => { setBookId(e.target.value) }}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                                </Box>
                                <Box >
                                    {box && (
                                        bookImportGetById && (
                                            <div style={{ marginTop: 20 }}>
                                                <TextField label="Id lịch sử giao dịch" value={bookImportGetById.id} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Id của sách đã nhập" value={bookImportGetById.bookId} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tên sách " value={bookImportGetById.bookTitle} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tổng số lượng " value={bookImportGetById.quantity} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Giá một cuốn " value={
                                                    typeof bookImportGetById.unitPrice === 'number'
                                                        ? bookImportGetById.unitPrice.toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        })
                                                        : ''
                                                }
                                                    fullWidth
                                                    margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tổng tiền " value={
                                                    typeof bookImportGetById.totalPrice === 'number'
                                                        ? bookImportGetById.totalPrice.toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        })
                                                        : ''
                                                }
                                                    fullWidth
                                                    margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Loại giao dịch " value={TransactionTypeName[bookImportGetById.transactionType]} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Ngày giao dịch " value={bookImportGetById.createdDate
                                                    ? new Date(bookImportGetById.createdDate).toLocaleString('vi-VN', {
                                                        hour12: false,
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : ''
                                                }
                                                    fullWidth
                                                    margin="normal" InputProps={{ readOnly: true }} />

                                            </div>
                                        )
                                    )
                                    }
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className='DataTable'>
                        <BookImportTransactionTable data={getAllBookImport} reload={reload} />
                    </div>
                </div>
            </div>
        </MainLayout >
    )
}
