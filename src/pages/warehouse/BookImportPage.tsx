import { useEffect, useState } from 'react'

import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { BookImportRequest } from '../../request/Warehouse/BookImportRequest';
import type { BookCategoryResponse } from '../../response/BookCategoryResponse';
import type { BookChapterResponse } from '../../response/BookChapterResponse';
import type { PublisherResponse } from '../../response/publisherResponse';
import type { AuthorResponse } from '../../response/AuthorResponse';
import { AuthorApi, BookCategoryApi, BookChapterApi, BookImportWarehouseApi, PublisherApi } from '../../apis';
import type { BookImportResponse } from '../../response/Warehouse/BookImportResponse';
import MainLayout from '../../layout/mainLayout/MainLayout';
import AddBookImportForm from '../../layout/warehouse/AddBookImportForm';
import BookImportTable from '../../layout/warehouse/BookImportTable';




export const BookImportPage = () => {
    //add
    const initialBookImport: BookImportRequest = {
        title: " ",
        publisherId: " ",
        bookAuthorId: " ",
        yearPublished: null,
        quantity: null,
        unitPrice: null,
        categoryId: " ",
        bookChapterId: " ",
        description: ''
    }
    const [bookImportPage, setBookImportPage] = useState<BookImportRequest>(() => initialBookImport)
    const [bookImportPageDialogAdd, setBookImportPageDialogAdd] = useState<boolean>(false)
    const [categories, setCategories] = useState<BookCategoryResponse[]>([]);
    const [bookChapters, setBookChapters] = useState<BookChapterResponse[]>([]);
    const [publishers, setPublishers] = useState<PublisherResponse[]>([])
    const [bookAuthors, setBookAuthors] = useState<AuthorResponse[]>([])
    const [reload, setReload] = useState<boolean>(false)
    const openDialog = () => {
        setBookImportPageDialogAdd(true)
    }
    const closeDialog = () => {
        setBookImportPageDialogAdd(false)
    }
    const newChange = async (
        fields: keyof BookImportRequest,
        value: string
    ) => {
        setBookImportPage(prev => ({ ...prev, [fields]: value }))

    }
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await BookCategoryApi.getAllBookCategory();
                console.log(response);
                setCategories(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong
    }, [reload])

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await BookChapterApi.getAllBookChapter();
                console.log(response);
                setBookChapters(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong
    }, [reload])

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await PublisherApi.getAllPublisher();
                console.log(response);
                setPublishers(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong
    }, [reload])

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await AuthorApi.getAllAuthor();
                console.log(response);
                setBookAuthors(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong
    }, [reload])

    const [totalPriceResponse, setTotalPriceResponse] = useState<number | null>(null)
    const handleBtnAddOfBookImportPage = async () => {

        try {
            if (!bookImportPage.title.trim()) {
                alert("Không để trống tên đầu sách")
                return
            } else if (!bookImportPage.categoryId.trim()) {
                alert("Không để trống loại sách")
                return
            } else if (!bookImportPage.bookChapterId.trim()) {
                alert("Không để trống số tập")
                return
            } else if (!bookImportPage.bookAuthorId.trim()) {
                alert("Không để trống tên tác giả")
                return
            } else if (!bookImportPage.publisherId.trim()) {
                alert("Không để trống nhà xuất bản")
                return
            } else if (!bookImportPage.quantity == null) {
                alert("Không để trống tổng số sách")
                return
            } else if (!bookImportPage.unitPrice == null) {
                alert("Không để trống giá tiền của 1 cuốn")
                return
            } else if (!bookImportPage.yearPublished == null) {
                alert("Không để trống năm xuất bản của sách")
                return
            } else if (!totalPriceResponse == null) {
                alert("Tính tổng tiền thất bại. Vui lòng kiểm tra lại")
                return
            }


            const response = await BookImportWarehouseApi.addBook(bookImportPage)
            console.log(response)
            alert("Thêm thành công" + response)
            setBookImportPage(initialBookImport)
            setBookImportPageDialogAdd(false)
            setReload(true)
            setTotalPriceResponse(response.data.data.totalPrice)

        } catch (error) {
            alert("Lỗi. Vui lòng check console" + error)
        }
    }

    //getAll

    const [getAllBookImport, setGetAllBookImport] = useState<BookImportResponse[]>([])
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await BookImportWarehouseApi.getAllBookImport();
                console.log(response);
                setGetAllBookImport(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong


    }, [reload])

    //getbyid
    const [dialogGetById, setDialogGetById] = useState<boolean>(false)
    const [bookImportId, setBookImportId] = useState<string>('');
    const [bookImportGetById, setBookImportGetById] = useState<BookImportResponse>()
    const [box, setBox] = useState<boolean>(false)

    const onOpenLogGetById = () => {
        setDialogGetById(true);
    }
    const onCloseLogGetById = () => {
        setDialogGetById(false);
        setBookImportId('');
    }
    const onCloseBox = () => {
        setBox(false);
    }
    const onClickGetPublisherById = async () => {
        if (!bookImportId?.trim()) {
            alert("Vui lòng điền id cần tìm!");
            return;
        }

        // try {
        //     const response = await BookImportWarehouseApi.getBookImportById(bookImportId);
        //     console.log(response);

        //     if (response.data.data.id == bookImportId) {
        //         alert('Lấy dữ liệu thành công' + response);
        //         setBookImportGetById(response.data.data)
        //         setBox(true);

        //     } else {
        //         console.error('Id không tồn tại');
        //     }
        // } catch (error) {
        //     alert('Id không tồn tại' + error)
        // }
    }

    //delete
    const [logDelete, setlogDelete] = useState<boolean>(false)
    const [selectedBookImportIds, setSelectedBookImportIds] = useState<string[]>([]);
    const onClickOpenDialogDelete = () => {
        if (selectedBookImportIds.length > 0) {
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
            for (const id of selectedBookImportIds) {
                const response = await BookImportWarehouseApi.deleteBookImport(id);
            }
            alert('Xóa thành công')
            setReload(true);
            setlogDelete(false);
            setSelectedBookImportIds([]);

        } catch (error) {
            alert('Lỗi không xóa được' + error)
        }
    }

    //update
    const [logUpdate, setLogUpdate] = useState<boolean>(false)
    const [bookImportUpdate, setbookImportUpdate] = useState<BookImportRequest>(() => initialBookImport)
    const onClickOpenLogUpdate = () => {
        if (selectedBookImportIds.length === 1) {
            const selected = getAllBookImport.find(p => p.id === selectedBookImportIds[0])
            if (selected) {
                // setbookImportUpdate(selected) //đổ dữ liệu đang có từ hàng vào 

                setLogUpdate(true)
            }
        } else if (selectedBookImportIds.length > 1) {
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
            for (const id of selectedBookImportIds) {
                const response = await BookImportWarehouseApi.updateBookImport(id, bookImportUpdate)
            }
            alert('Cập nhật thành công')
            setReload(true)
            setLogUpdate(false)
            setSelectedBookImportIds([])

        } catch (error) {
            alert('Id không tồn tại ' + error)
        }
    }

    //tương tự giữa component table con và các page cha : con định nghĩa UI và kiểu dữ liệu mà UI đó sẽ sử dụng; cha chứa logic xử lý và gọi lại UI của con để đổ dữ liệu vào biến được định nghĩa ở UI

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
                        <AddBookImportForm dialogAdd={bookImportPageDialogAdd} onCloseDialog={closeDialog} PublisherList={publishers}
                            AuthorList={bookAuthors} CategoryList={categories} BookChapterList={bookChapters} bookImport={bookImportPage}
                            onNewChange={newChange} handleBtnAdd={handleBtnAddOfBookImportPage}
                        />
                    </div>
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={() => {
                            onOpenLogGetById();
                            onCloseBox();
                        }} > <span className="text-gray-700 group-hover:text-blue-500 transition">Tìm kiếm </span>
                            <SearchIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={dialogGetById} onClose={() => { setDialogGetById(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>TÌM KIẾM THÔNG TIN SÁCH</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                                    <TextField fullWidth placeholder='Nhập Id tủ sách' value={bookImportId} onChange={(e) => { setBookImportId(e.target.value) }}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                                </Box>
                                <Box >
                                    {box && (
                                        bookImportGetById && (
                                            <div style={{ marginTop: 20 }}>
                                                <TextField label="Id sách" value={bookImportGetById.id} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tên sách" value={bookImportGetById.title} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Năm sản xuất " value={bookImportGetById.yearPublished} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Loại sách " value={bookImportGetById.categoryName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Số tập " value={bookImportGetById.titleBookChapter} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tác giả " value={bookImportGetById.authorName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Nhà xuất bản " value={bookImportGetById.publisherName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tổng số sách " value={bookImportGetById.quantity} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Giá tiền một cuốn" value={bookImportGetById.unitPrice} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tổng tiền " value={bookImportGetById.totalPrice} fullWidth margin="normal" InputProps={{ readOnly: true }} />
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
                            <DialogTitle sx={{ textAlign: "center" }}>Cập nhật thông tin sách</DialogTitle>
                            <DialogContent>
                                <DialogContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền tên sách:</Typography>
                                        <TextField fullWidth placeholder='Nhập tên sách' value={bookImportUpdate.title} onChange={(e) => setbookImportUpdate({ ...bookImportUpdate, title: e.target.value })}></TextField>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền năm sản xuất:</Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            placeholder="năm sản xuất"
                                            value={bookImportUpdate.yearPublished ?? ""}
                                            onChange={(e) =>
                                                setbookImportUpdate({
                                                    ...bookImportUpdate,
                                                    yearPublished: e.target.value === "" ? null : parseInt(e.target.value)
                                                })
                                            }
                                        />
                                    </Box>
                                    <Box className="mb-4" >
                                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn loại sách</Typography>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="floor-select-label" >Chọn loại sách</InputLabel>
                                            <Select
                                                labelId="loại sách"
                                                value={bookImportUpdate.categoryId}
                                                label="Chọn loại sách"
                                                onChange={(e) => setbookImportUpdate({ ...bookImportUpdate, categoryId: e.target.value })}
                                            >
                                                {categories.map((cates) => (
                                                    <MenuItem key={cates.id} value={cates.id}>
                                                        {cates.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box className="mb-4" >
                                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn số tập</Typography>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="floor-select-label" >Chọn số tập</InputLabel>
                                            <Select
                                                labelId="số tập"
                                                value={bookImportUpdate.bookChapterId}
                                                label="Chọn số tập"
                                                onChange={(e) => setbookImportUpdate({ ...bookImportUpdate, bookChapterId: e.target.value })}
                                            >
                                                {bookChapters.map((chaps) => (
                                                    <MenuItem key={chaps.id} value={chaps.id}>
                                                        {chaps.titleChapter}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box className="mb-4" >
                                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn nhà xuất bản</Typography>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="floor-select-label" >Chọn nhà xuất bản</InputLabel>
                                            <Select
                                                labelId="nhà xuất bản"
                                                value={bookImportUpdate.publisherId}
                                                label="Chọn nhà xuất bản"
                                                onChange={(e) => setbookImportUpdate({ ...bookImportUpdate, publisherId: e.target.value })}
                                            >
                                                {publishers.map((pubs) => (
                                                    <MenuItem key={pubs.id} value={pubs.id}>
                                                        {pubs.publisherName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box className="mb-4" >
                                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn tác giả</Typography>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="floor-select-label" >Chọn tác giả</InputLabel>
                                            <Select
                                                labelId="tác giả"
                                                value={bookImportUpdate.bookAuthorId}
                                                label="Chọn tác giả"
                                                onChange={(e) => setbookImportUpdate({ ...bookImportUpdate, bookAuthorId: e.target.value })}
                                            >
                                                {bookAuthors.map((aus) => (
                                                    <MenuItem key={aus.id} value={aus.id}>
                                                        {aus.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền tổng số lượng sách:</Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            placeholder="tổng số sách"
                                            value={bookImportUpdate.quantity ?? ""}
                                            onChange={(e) =>
                                                setbookImportUpdate({
                                                    ...bookImportUpdate,
                                                    quantity: e.target.value === "" ? null : parseInt(e.target.value)
                                                })
                                            }
                                        />
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền giá một cuốn sách:</Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            placeholder="giá một cuốn sách"
                                            value={bookImportUpdate.unitPrice ?? ""}
                                            onChange={(e) =>
                                                setbookImportUpdate({
                                                    ...bookImportUpdate,
                                                    unitPrice: e.target.value === "" ? null : parseInt(e.target.value)
                                                })
                                            }
                                        />
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
                    <BookImportTable data={getAllBookImport} reload={reload} onSelectionChange={setSelectedBookImportIds} />
                </div>
            </div>
        </MainLayout >
    )
}
