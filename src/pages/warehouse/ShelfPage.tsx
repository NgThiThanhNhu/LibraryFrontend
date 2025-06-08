import { useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { BookShelfWarehouseApi, ShelfWarehouseApi } from '../../apis';
import MainLayout from '../../layout/MainLayout';
import type { BookShelfResponse } from '../../response/Warehouse/BookShelfResponse';
import type { ShelfRequest } from '../../request/Warehouse/ShelfResquest';
import type { ShelfResponse } from '../../response/Warehouse/ShelfResponse';
import AddShelfForm from '../../layout/warehouse/AddShelfForm';
import ShelfTable from '../../layout/warehouse/ShelfTable';

export const ShelfPage = () => {
    //add
    const initialShelf: ShelfRequest = {
        shelfName: " ",
        numberOfSections: null,
        bookshelfId: " "
    }
    const [shelfPage, setShelfPage] = useState<ShelfRequest>(() => initialShelf)
    const [shelfPageDialogAdd, setShelfPageDialogAdd] = useState<boolean>(false)
    const [bookShelves, setBookShelves] = useState<BookShelfResponse[]>([]);
    const [reload, setReload] = useState<boolean>(false)
    const openDialog = () => {
        setShelfPageDialogAdd(true)
    }
    const closeDialog = () => {
        setShelfPageDialogAdd(false)
    }
    const newChange = async (
        fields: keyof ShelfRequest,
        value: string
    ) => {
        setShelfPage(prev => ({ ...prev, [fields]: value }))

    }
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await BookShelfWarehouseApi.getAllBookShelf();
                console.log(response);
                setBookShelves(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong
    }, [reload])

    const handleBtnAddOfShelfPage = async () => {

        try {
            if (!shelfPage.shelfName.trim()) {
                alert("Không để trống tên kệ")
                return
            } else if (shelfPage.numberOfSections == null) {
                alert("Không để trống số ô của kệ")
                return
            } else if (!shelfPage.bookshelfId.trim()) {
                alert("Không để trống tên tủ sách")
                return
            }

            const checkCurrentShef = bookShelves.find(bs => bs.id === shelfPage.bookshelfId);

            if (!checkCurrentShef) {
                alert("Tủ sách không tồn tại!");
                return;
            }

            if (checkCurrentShef.isFull) {
                alert("Đã đạt giới hạn số kệ sách trong tủ sách này.");
                return;
            }


            const response = await ShelfWarehouseApi.addShelf(shelfPage)
            console.log(response)
            alert("Thêm thành công" + response)
            setShelfPage(initialShelf)
            setShelfPageDialogAdd(false)
            setReload(true)


        } catch (error) {
            alert("Lỗi. Vui lòng check console" + error)
        }
    }

    //getAll

    const [getAllShelf, setGetAllShelf] = useState<ShelfResponse[]>([])
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await ShelfWarehouseApi.getAllShelf();
                console.log(response);
                const mappedData = response.data.map((shelf: ShelfResponse) => ({
                    ...shelf,
                    isFull: shelf.isFull ? "Đã đầy" : "Còn trống"
                }));
                setGetAllShelf(mappedData);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong


    }, [reload])

    //getbyid
    const [dialogGetById, setDialogGetById] = useState<boolean>(false)
    const [shelfId, setShelfId] = useState<string>('');
    const [shelfGetById, setShelfGetById] = useState<ShelfResponse>({
        id: " ",
        shelfName: " ",
        numberOfSections: null,
        bookshelfId: " ",
        bookshelfName: " ",
        currentSection: null,
        isFull: false
    })
    const [box, setBox] = useState<boolean>(false)

    const onOpenLogGetById = () => {
        setDialogGetById(true);
    }
    const onCloseLogGetById = () => {
        setDialogGetById(false);
        setShelfId('');
    }
    const onCloseBox = () => {
        setBox(false);
    }
    const onClickGetPublisherById = async () => {
        if (!shelfId?.trim()) {
            alert("Vui lòng điền id cần tìm!");
            return;
        }

        try {
            const response = await ShelfWarehouseApi.getShelfById(shelfId);
            console.log(response);

            if (response.data.data.id == shelfId) {
                alert('Lấy dữ liệu thành công' + response);
                setShelfGetById(response.data.data)
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
    const [selectedShelfIds, setSelectedShelfIds] = useState<string[]>([]);
    const onClickOpenDialogDelete = () => {
        if (selectedShelfIds.length > 0) {
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
            for (const id of selectedShelfIds) {
                const response = await ShelfWarehouseApi.deleteShelf(id);
            }
            alert('Xóa thành công')
            setReload(true);
            setlogDelete(false);
            setSelectedShelfIds([]);

        } catch (error) {
            alert('Lỗi không xóa được' + error)
        }
    }

    //update
    const [logUpdate, setLogUpdate] = useState<boolean>(false)
    const [shelfUpdate, setShelfUpdate] = useState<ShelfRequest>(() => initialShelf)
    const onClickOpenLogUpdate = () => {
        if (selectedShelfIds.length === 1) {
            const selected = getAllShelf.find(p => p.id === selectedShelfIds[0])
            if (selected) {
                setShelfUpdate(selected) //đổ dữ liệu đang có từ hàng vào 

                setLogUpdate(true)
            }
        } else if (selectedShelfIds.length > 1) {
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
            for (const id of selectedShelfIds) {
                const response = await ShelfWarehouseApi.updateShelf(id, shelfUpdate)
            }
            alert('Cập nhật thành công')
            setReload(true)
            setLogUpdate(false)
            setSelectedShelfIds([])

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
                        <AddShelfForm dialogAdd={shelfPageDialogAdd} onCloseDialog={closeDialog} shelf={shelfPage} onNewChange={newChange} bookShelfList={bookShelves} handleBtnAdd={handleBtnAddOfShelfPage} />
                    </div>
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={() => {
                            onOpenLogGetById();
                            onCloseBox();
                        }} > <span className="text-gray-700 group-hover:text-blue-500 transition">Tìm kiếm </span>
                            <SearchIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={dialogGetById} onClose={() => { setDialogGetById(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>TÌM THÔNG TIN KHO SÁCH - KỆ SÁCH</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                                    <TextField fullWidth placeholder='Nhập Id kệ sách' value={shelfId} onChange={(e) => { setShelfId(e.target.value) }}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                                </Box>
                                <Box >
                                    {box && (
                                        shelfGetById && (
                                            <div style={{ marginTop: 20 }}>
                                                <TextField label="Id kệ sách" value={shelfGetById.id} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tên kệ sách " value={shelfGetById.shelfName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Số ô của kệ " value={shelfGetById.numberOfSections} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Id tủ sách " value={shelfGetById.bookshelfId} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tên tủ sách " value={shelfGetById.bookshelfName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Số ô hiện có " value={shelfGetById.currentSection} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Trạng thái của kệ " value={shelfGetById.isFull} fullWidth margin="normal" InputProps={{ readOnly: true }} />
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
                            <DialogTitle sx={{ textAlign: "center" }}>Cập nhật thông tin kho sách - kệ sách</DialogTitle>
                            <DialogContent>
                                <DialogContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền tên kệ:</Typography>
                                        <TextField fullWidth placeholder='Nhập tên tủ sách' value={shelfUpdate.shelfName} onChange={(e) => setShelfUpdate({ ...shelfUpdate, shelfName: e.target.value })}></TextField>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền số ô của kệ:</Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            placeholder="số kệ"
                                            value={shelfUpdate.numberOfSections ?? ""}
                                            onChange={(e) =>
                                                setShelfUpdate({
                                                    ...shelfUpdate,
                                                    numberOfSections: e.target.value === "" ? null : parseInt(e.target.value)
                                                })
                                            }
                                        />

                                    </Box>
                                    <Box className="mb-4" >
                                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn tủ sách</Typography>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="floor-select-label" >Chọn tủ sách</InputLabel>
                                            <Select
                                                labelId="tủ sách"
                                                value={shelfUpdate.bookshelfId}
                                                label="Chọn tủ sách"
                                                onChange={(e) => setShelfUpdate({ ...shelfUpdate, bookshelfId: e.target.value })}
                                            >
                                                {bookShelves.map((bookShelf) => (
                                                    <MenuItem key={bookShelf.id} value={bookShelf.id}>
                                                        {bookShelf.bookShelfName}
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
                    <ShelfTable data={getAllShelf} reload={reload} onSelectionChange={setSelectedShelfIds} />
                </div>
            </div>
        </MainLayout >
    )
}
