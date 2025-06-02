import { useEffect, useState } from 'react'
import type { BookCategoryRequest } from '../request/BookCategoryRequest';
import { BookCategoryApi } from '../apis';

import MainLayout from '../layout/MainLayout';
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BookCategoryTable from '../layout/BookCategoryTable';
import type { BookCategoryResponse } from '../response/BookCategoryResponse';
export const BookCategoryPage = () => {
    const initialBookCategory: BookCategoryRequest = {
        name: "",

    }

    const [bookCategory, setBookCategory] = useState<BookCategoryRequest>(() => initialBookCategory);
    //getall
    const [getAllBookCategory, setGetAllBookCategory] = useState<BookCategoryResponse[]>([]);
    const [reload, setReload] = useState<boolean>(false);



    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const onClickOpenDialog = async () => {
        setOpenDialog(true);
    }
    const onClickCloseDialog = async () => {
        setOpenDialog(false);
    }
    //hàm tự định nghĩa để lấy các thuộc tính trong publisher mà không cần phải viết riêng biệt từng hàm tương ứng với từng field
    const newChange = async (
        fields: keyof BookCategoryRequest,
        value: string
    ) => {
        setBookCategory(prev => ({ ...prev, [fields]: value }))

    }

    const onhandleAddingBtn = async () => {
        try {

            if (!bookCategory?.name.trim()) {
                alert("Vui lòng nhập loại sách!");
                return;
            }


            const response = await BookCategoryApi.addBookCategory(bookCategory);
            console.log(bookCategory);
            alert("Thêm thành công: " + response);
            setBookCategory(initialBookCategory);
            setOpenDialog(false);
            setReload(true);
        } catch (error) {
            alert('Có lỗi xảy ra' + error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await BookCategoryApi.getAllBookCategory();
                console.log(response);
                setGetAllBookCategory(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong


    }, [reload])

    //getbyid
    const [bookCategoryId, setBookCategoryId] = useState<string>('');
    const [bookCategoryGetById, setBookCategoryGetById] = useState<BookCategoryRequest>(() => initialBookCategory)
    const [box, setBox] = useState<boolean>(false)
    const [logGetById, setLogGetById] = useState<boolean>(false)
    const onOpenLogGetById = () => {
        setLogGetById(true);
    }
    const onCloseLogGetById = () => {
        setLogGetById(false);
        setBookCategoryId('');
    }
    const onCloseBox = () => {
        setBox(false);
    }
    const onClickGetPublisherById = async () => {
        if (!bookCategoryId?.trim()) {
            alert("Vui lòng điền id cần tìm!");
            return;
        }

        try {
            const response = await BookCategoryApi.getBookCategoryById(bookCategoryId);
            console.log(response);

            if (response.data.data.id == bookCategoryId) {
                alert('Lấy dữ liệu thành công' + response);
                setBookCategoryGetById(response.data.data)
                setBox(true);

            } else {
                console.error('Id không tồn tại');
            }
        } catch (error) {
            alert('Id không tồn tại' + error)
        }
    }



    //delete 
    const [logDelete, setlogDelete] = useState<boolean>(false)
    const [selectedBookCategoryIds, setSelectedBookCategoryIds] = useState<string[]>([]);
    const onClickOpenDialogDelete = () => {
        if (selectedBookCategoryIds.length > 0) {
            setlogDelete(true);
        } else {
            alert('Bạn chưa chọn dữ liệu để xóa')
        }

    }
    const onClickCloseDialogDelete = () => {
        setlogDelete(false);
    }
    const onHandleBtnDelete = async () => {
        try {
            for (const id of selectedBookCategoryIds) {
                const response = await BookCategoryApi.deleteBookCategory(id);
            }
            alert('Xóa thành công')
            setReload(true);
            setlogDelete(false);
            setSelectedBookCategoryIds([]);

        } catch (error) {
            alert('Lỗi không xóa được' + error)
        }
    }

    //UPDATE: dùng chung selectionid[] bắt điều kiện để xử lý
    const [logUpdate, setLogUpdate] = useState<boolean>(false)
    const [bookCategoryUpdate, setBookCategoryUpdate] = useState<BookCategoryRequest>(() => initialBookCategory)
    const onClickOpenLogUpdate = () => {
        if (selectedBookCategoryIds.length === 1) {
            const selected = getAllBookCategory.find(p => p.id === selectedBookCategoryIds[0])
            if (selected) {
                setBookCategoryUpdate(selected) //đổ dữ liệu đang có từ hàng vào 

                setLogUpdate(true)
            }
        } else if (selectedBookCategoryIds.length > 1) {
            alert('Chỉ chọn 1 Id để cập nhật')
        } else {
            alert('Id không được để trống')
        }


    }
    const onClickCloseLogUpdate = () => {
        setLogUpdate(false)
    }
    const onHandleUpdateBtn = async () => {
        try {
            for (const id of selectedBookCategoryIds) {
                const response = await BookCategoryApi.updateBookCategory(id, bookCategoryUpdate)
            }
            alert('Cập nhật thành công')
            setReload(true)
            setLogUpdate(false)
            setSelectedBookCategoryIds([])
        } catch (error) {
            alert('Id không tồn tại ' + error)
        }
    }


    return (
        <MainLayout>
            <div>
                <div className='flex flex-row gap-4'>
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={onClickOpenDialog}>
                            <span className="text-gray-700 group-hover:text-blue-500 transition">
                                Thêm
                            </span>
                            <AddIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={openDialog} onClose={() => { setOpenDialog(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>NHẬP THÔNG TIN LOẠI SÁCH</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 300 }}>Điền tên loại sách:</Typography>
                                    <TextField fullWidth placeholder='Nhập tên loại sách' value={bookCategory.name} onChange={(e) => newChange("name", e.target.value)}></TextField>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onhandleAddingBtn}>Lưu</Button>
                                    <Button color='error' onClick={onClickCloseDialog}>Hủy</Button>
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={() => {
                            onOpenLogGetById();
                            onCloseBox();
                        }} > <span className="text-gray-700 group-hover:text-blue-500 transition">Tìm kiếm </span>
                            <SearchIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={logGetById} onClose={() => { setLogGetById(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>TÌM THÔNG TIN LOẠI SÁCH</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                                    <TextField fullWidth placeholder='Nhập Id của loại sách' value={bookCategoryId} onChange={(e) => { setBookCategoryId(e.target.value) }}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                                </Box>
                                <Box >
                                    {box && (
                                        bookCategoryGetById && (
                                            <div style={{ marginTop: 20 }}>
                                                <TextField label="Tên Loại sách" value={bookCategoryGetById.name} fullWidth margin="normal" InputProps={{ readOnly: true }} />

                                            </div>
                                        )
                                    )
                                    }
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div >
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={onClickOpenDialogDelete}>
                            <span className="text-gray-700 group-hover:text-blue-500 transition">
                                Xóa
                            </span>
                            <DeleteIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={logDelete} onClose={() => { setlogDelete(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>Bạn có chắc chắn xóa không?</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onHandleBtnDelete}>Có</Button>
                                    <Button color='error' onClick={onClickCloseDialogDelete}>Hủy</Button>
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={onClickOpenLogUpdate}>
                            <span className="text-gray-700 group-hover:text-blue-500 transition">
                                Cập nhật
                            </span>
                            <EditIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={logUpdate} onClose={() => { setLogUpdate(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>Cập nhật thông tin nhà xuất bản</DialogTitle>
                            <DialogContent>
                                <DialogContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền tên nhà xuất bản:</Typography>
                                        <TextField fullWidth placeholder='Nhập tên nhà sản xuất' value={bookCategoryUpdate.name} onChange={(e) => setBookCategoryUpdate({ ...bookCategoryUpdate, name: e.target.value })}></TextField>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                        <Button color="primary" onClick={onHandleUpdateBtn}>Lưu</Button>
                                        <Button color='error' onClick={onClickCloseLogUpdate}>Hủy</Button>
                                    </Box>
                                </DialogContent>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className='DataTable'>
                    <BookCategoryTable data={getAllBookCategory} reload={reload} onSelectionChange={setSelectedBookCategoryIds} />
                </div>
            </div>
        </MainLayout>

    )
}
