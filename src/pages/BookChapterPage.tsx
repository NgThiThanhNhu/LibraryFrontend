import { useEffect, useState } from 'react'
import type { AuthorRequest } from '../request/AuthorRequest'
import { AuthorApi, BookChapterApi } from '../apis'
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MainLayout from '../layout/MainLayout';
import type { AuthorResponse } from '../response/AuthorResponse';
import AuthorTable from '../layout/AuthorTable';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { BookChapterRequest } from '../request/BookChapterRequest';
import type { BookChapterResponse } from '../response/BookChapterResponse';
import BookChapterTable from '../layout/BookChapterTable';

export const BookChapterPage = () => {
    const initialBookChapter: BookChapterRequest = {
        titleChapter: ""
    }
    const [bookChapter, setBookChapter] = useState<BookChapterRequest>(() => initialBookChapter)
    const [dialogAdd, setDialogAdd] = useState<boolean>(false)
    const openDialog = () => {
        setDialogAdd(true)
    }
    const closeDialog = () => {
        setDialogAdd(false)
    }
    const newChange = async (
        fields: keyof BookChapterRequest,
        value: string
    ) => {
        setBookChapter(prev => ({ ...prev, [fields]: value }))

    }
    const handleBtnAdd = async () => {

        try {
            if (!bookChapter.titleChapter.trim()) {
                alert("Không để trống tên tác giả")
            }
            const response = await BookChapterApi.addBookChapter(bookChapter)
            console.log(response)
            alert("Thêm tác giả thành công" + response)
            setBookChapter(initialBookChapter)
            setDialogAdd(false)
            setReload(true)

        } catch (error) {
            alert("Lỗi. Vui lòng check console" + error)
        }
    }

    //getAll
    const [reload, setReload] = useState<boolean>(false)
    const [getAllBookChapter, setGetAllBookChapter] = useState<BookChapterResponse[]>([])
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await BookChapterApi.getAllBookChapter();
                console.log(response);
                setGetAllBookChapter(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong


    }, [reload])

    //getbyid
    const [dialogGetById, setDialogGetById] = useState<boolean>(false)
    const [bookChapterId, setBookChapterId] = useState<string>('');
    const [bookChapterGetById, setBookChapterGetById] = useState<BookChapterRequest>(() => initialBookChapter)
    const [box, setBox] = useState<boolean>(false)

    const onOpenLogGetById = () => {
        setDialogGetById(true);
    }
    const onCloseLogGetById = () => {
        setDialogGetById(false);
        setBookChapterId('');
    }
    const onCloseBox = () => {
        setBox(false);
    }
    const onClickGetPublisherById = async () => {
        if (!bookChapterId?.trim()) {
            alert("Vui lòng điền id cần tìm!");
            return;
        }

        try {
            const response = await BookChapterApi.getBookChapterById(bookChapterId);
            console.log(response);

            if (response.data.data.id == bookChapterId) {
                alert('Lấy dữ liệu thành công' + response);
                setBookChapterGetById(response.data.data)
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
    const [selectedBookChapterIds, setSelectedBookChapterIds] = useState<string[]>([]);
    const onClickOpenDialogDelete = () => {
        if (selectedBookChapterIds.length > 0) {
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
            for (const id of selectedBookChapterIds) {
                const response = await BookChapterApi.deleteBookChapter(id);
            }
            alert('Xóa thành công')
            setReload(true);
            setlogDelete(false);
            setSelectedBookChapterIds([]);

        } catch (error) {
            alert('Lỗi không xóa được' + error)
        }
    }

    //update
    const [logUpdate, setLogUpdate] = useState<boolean>(false)
    const [bookChapterUpdate, setBookChapterUpdate] = useState<BookChapterRequest>(() => initialBookChapter)
    const onClickOpenLogUpdate = () => {
        if (selectedBookChapterIds.length === 1) {
            const selected = getAllBookChapter.find(p => p.id === selectedBookChapterIds[0])
            if (selected) {
                setBookChapterUpdate(selected) //đổ dữ liệu đang có từ hàng vào 

                setLogUpdate(true)
            }
        } else if (selectedBookChapterIds.length > 1) {
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
            for (const id of selectedBookChapterIds) {
                const response = await BookChapterApi.updateBookChapter(id, bookChapterUpdate)
            }
            alert('Cập nhật thành công')
            setReload(true)
            setLogUpdate(false)
            setSelectedBookChapterIds([])
        } catch (error) {
            alert('Id không tồn tại ' + error)
        }
    }



    return (
        <MainLayout>
            <div>
                <div className='flex flex-row gap-4'>
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={openDialog}>
                            <span className="text-gray-700 group-hover:text-blue-500 transition">
                                Thêm
                            </span>
                            <AddIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={dialogAdd} onClose={() => { setDialogAdd(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>NHẬP THÔNG TIN SỐ TẬP CỦA SÁCH</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 300 }}>Điền tên số tập sách:</Typography>
                                    <TextField fullWidth placeholder='Nhập tên số tập sách' value={bookChapter.titleChapter} onChange={(e) => newChange("titleChapter", e.target.value)}></TextField>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={handleBtnAdd}>Lưu</Button>
                                    <Button color='error' onClick={closeDialog}>Hủy</Button>
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
                        <Dialog open={dialogGetById} onClose={() => { setDialogGetById(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>TÌM THÔNG TIN TẬP SÁCH</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                                    <TextField fullWidth placeholder='Nhập Id của số tập sách' value={bookChapterId} onChange={(e) => { setBookChapterId(e.target.value) }}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                                </Box>
                                <Box >
                                    {box && (
                                        bookChapterGetById && (
                                            <div style={{ marginTop: 20 }}>
                                                <TextField label="Tên tác giả" value={bookChapterGetById.titleChapter} fullWidth margin="normal" InputProps={{ readOnly: true }} />

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
                            <DialogTitle sx={{ textAlign: "center" }}>Cập nhật thông tin số tập sách</DialogTitle>
                            <DialogContent>
                                <DialogContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền tên số tập sách:</Typography>
                                        <TextField fullWidth placeholder='Nhập tên tác giả' value={bookChapterUpdate.titleChapter} onChange={(e) => setBookChapterUpdate({ ...bookChapterUpdate, titleChapter: e.target.value })}></TextField>
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
                    <BookChapterTable data={getAllBookChapter} reload={reload} onSelectionChange={setSelectedBookChapterIds} />
                </div>
            </div>
        </MainLayout>
    )
}
