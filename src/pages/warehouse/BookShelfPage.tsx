import { useEffect, useState } from 'react'

import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import type { FloorResponse } from '../../response/Warehouse/FloorResponse';
import { BookShelfWarehouseApi, FloorWarehouseApi, RoomWarehouseApi } from '../../apis';
import FloorTable from '../../layout/warehouse/FloorTable';
import MainLayout from '../../layout/MainLayout';
import type { RoomRequest } from '../../request/Warehouse/RoomRequest';
import AddRoomForm from '../../layout/warehouse/AddRoomForm';
import type { RoomResponse } from '../../response/Warehouse/RoomResponse';
import RoomTable from '../../layout/warehouse/RoomTable';
import type { BookShelfRequest } from '../../request/Warehouse/BookShelfRequest';
import AddBookShelfForm from '../../layout/warehouse/AddBookShelfForm';
import type { BookShelfResponse } from '../../response/Warehouse/BookShelfResponse';
import BookShelfTable from '../../layout/warehouse/BookShelfTable';

export const BookShelfPage = () => {
    //add
    const initialBookShelf: BookShelfRequest = {
        bookShelfName: "",
        numberOfShelves: null,
        roomId: ""
    }
    const [bookShelfPage, setbookShelfPage] = useState<BookShelfRequest>(() => initialBookShelf)
    const [bookShelfPageDialogAdd, setbookShelfPageDialogAdd] = useState<boolean>(false)
    const [rooms, setRooms] = useState<RoomResponse[]>([]);
    const [reload, setReload] = useState<boolean>(false)
    const openDialog = () => {
        setbookShelfPageDialogAdd(true)
    }
    const closeDialog = () => {
        setbookShelfPageDialogAdd(false)
    }
    const newChange = async (
        fields: keyof BookShelfRequest,
        value: string
    ) => {
        setbookShelfPage(prev => ({ ...prev, [fields]: value }))

    }
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await RoomWarehouseApi.getAllRoom();
                console.log(response);
                setRooms(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong
    }, [reload])

    const handleBtnAddOfBookShelfPage = async () => {

        try {
            if (!bookShelfPage.bookShelfName.trim()) {
                alert("Không để trống tên phòng")
                return
            } else if (bookShelfPage.numberOfShelves == null) {
                alert("Không để trống sức chứa của phòng")
                return
            } else if (!bookShelfPage.roomId.trim()) {
                alert("Không để trống tên phòng")
                return
            }
            const checkCurrentBookShelf = rooms.find(r => r.id === bookShelfPage.roomId);

            if (!checkCurrentBookShelf) {
                alert("Phòng không tồn tại!");
                return;
            }

            if (checkCurrentBookShelf.isFull) {
                alert("Đã đạt giới hạn số tủ sách của phòng");
                return;
            }

            const response = await BookShelfWarehouseApi.addBookShelf(bookShelfPage)
            console.log(response)
            alert("Thêm thành công" + response)
            setbookShelfPage(initialBookShelf)
            setbookShelfPageDialogAdd(false)
            setReload(true)


        } catch (error) {
            alert("Lỗi. Vui lòng check console" + error)
        }
    }

    //getAll

    const [getAllBookShelf, setGetAllBookShelf] = useState<BookShelfResponse[]>([])
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await BookShelfWarehouseApi.getAllBookShelf();
                console.log(response);
                const mappedData = response.data.map((BookShelf: BookShelfResponse) => ({
                    ...BookShelf,
                    isFull: BookShelf.isFull ? "Đã đầy" : "Còn trống"
                }));

                setGetAllBookShelf(mappedData);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong


    }, [reload])

    //getbyid
    const [dialogGetById, setDialogGetById] = useState<boolean>(false)
    const [bookShelfId, setBookShelfId] = useState<string>('');
    const [bookShelfGetById, setBookShelfGetById] = useState<BookShelfResponse>({
        id: " ",
        bookShelfName: " ",
        numberOfShelves: null,
        roomId: " ",
        roomName: " ",
        isFull: false,
        currentShelves: null
    })
    const [box, setBox] = useState<boolean>(false)

    const onOpenLogGetById = () => {
        setDialogGetById(true);
    }
    const onCloseLogGetById = () => {
        setDialogGetById(false);
        setBookShelfId('');
    }
    const onCloseBox = () => {
        setBox(false);
    }
    const onClickGetPublisherById = async () => {
        if (!bookShelfId?.trim()) {
            alert("Vui lòng điền id cần tìm!");
            return;
        }

        try {
            const response = await BookShelfWarehouseApi.getBookShelfById(bookShelfId);
            console.log(response);

            if (response.data.data.id == bookShelfId) {
                alert('Lấy dữ liệu thành công' + response);
                setBookShelfGetById(response.data.data)
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
    const [selectedBookShelfIds, setSelectedBookShelfIds] = useState<string[]>([]);
    const onClickOpenDialogDelete = () => {
        if (selectedBookShelfIds.length > 0) {
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
            for (const id of selectedBookShelfIds) {
                const response = await BookShelfWarehouseApi.deleteBookShelf(id);
            }
            alert('Xóa thành công')
            setReload(true);
            setlogDelete(false);
            setSelectedBookShelfIds([]);

        } catch (error) {
            alert('Lỗi không xóa được' + error)
        }
    }

    //update
    const [logUpdate, setLogUpdate] = useState<boolean>(false)
    const [bookShelfUpdate, setbookShelfUpdate] = useState<BookShelfRequest>(() => initialBookShelf)
    const onClickOpenLogUpdate = () => {
        if (selectedBookShelfIds.length === 1) {
            const selected = getAllBookShelf.find(p => p.id === selectedBookShelfIds[0])
            if (selected) {
                setbookShelfUpdate(selected) //đổ dữ liệu đang có từ hàng vào 

                setLogUpdate(true)
            }
        } else if (selectedBookShelfIds.length > 1) {
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
            for (const id of selectedBookShelfIds) {
                const response = await BookShelfWarehouseApi.updateBookShelf(id, bookShelfUpdate)
            }
            alert('Cập nhật thành công')
            setReload(true)
            setLogUpdate(false)
            setSelectedBookShelfIds([])

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
                        <AddBookShelfForm dialogAdd={bookShelfPageDialogAdd} onCloseDialog={closeDialog} bookShelf={bookShelfPage} onNewChange={newChange} roomList={rooms} handleBtnAdd={handleBtnAddOfBookShelfPage} />
                    </div>
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={() => {
                            onOpenLogGetById();
                            onCloseBox();
                        }} > <span className="text-gray-700 group-hover:text-blue-500 transition">Tìm kiếm </span>
                            <SearchIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={dialogGetById} onClose={() => { setDialogGetById(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>TÌM THÔNG TIN KHO SÁCH - TỦ SÁCH</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                                    <TextField fullWidth placeholder='Nhập Id tủ sách' value={bookShelfId} onChange={(e) => { setBookShelfId(e.target.value) }}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                                </Box>
                                <Box >
                                    {box && (
                                        bookShelfGetById && (
                                            <div style={{ marginTop: 20 }}>
                                                <TextField label="Id tủ sách" value={bookShelfGetById.id} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tên tủ sách " value={bookShelfGetById.bookShelfName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Số kệ của tủ " value={bookShelfGetById.numberOfShelves} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Id của phòng " value={bookShelfGetById.roomId} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tên phòng " value={bookShelfGetById.roomName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
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
                            <DialogTitle sx={{ textAlign: "center" }}>Cập nhật thông tin kho sách - tủ sách</DialogTitle>
                            <DialogContent>
                                <DialogContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền số phòng:</Typography>
                                        <TextField fullWidth placeholder='Nhập tên tủ sách' value={bookShelfUpdate.bookShelfName} onChange={(e) => setbookShelfUpdate({ ...bookShelfUpdate, bookShelfName: e.target.value })}></TextField>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền số kệ của tủ:</Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            placeholder="số kệ"
                                            value={bookShelfUpdate.numberOfShelves ?? ""}
                                            onChange={(e) =>
                                                setbookShelfUpdate({
                                                    ...bookShelfUpdate,
                                                    numberOfShelves: e.target.value === "" ? null : parseInt(e.target.value)
                                                })
                                            }
                                        />

                                    </Box>
                                    <Box className="mb-4" >
                                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn tên phòng</Typography>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="floor-select-label" >Chọn phòng</InputLabel>
                                            <Select
                                                labelId="phòng"
                                                value={bookShelfUpdate.roomId}
                                                label="Chọn phòng"
                                                onChange={(e) => setbookShelfUpdate({ ...bookShelfUpdate, roomId: e.target.value })}
                                            >
                                                {rooms.map((room) => (
                                                    <MenuItem key={room.id} value={room.id}>
                                                        {room.floorName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
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
                    <BookShelfTable data={getAllBookShelf} reload={reload} onSelectionChange={setSelectedBookShelfIds} />
                </div>
            </div>
        </MainLayout >
    )
}
