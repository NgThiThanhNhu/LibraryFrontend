import { useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { ShelfSectionRequest } from '../../request/Warehouse/ShelfSectionRequest';
import type { ShelfResponse } from '../../response/Warehouse/ShelfResponse';
import { ShelfSectionWarehouseApi, ShelfWarehouseApi } from '../../apis';
import type { ShelfSectionResponse } from '../../response/Warehouse/ShelfSectionResponse';
import MainLayout from '../../layout/mainLayout/MainLayout';
import AddShelfSectionForm from '../../layout/warehouse/AddShelfSectionForm';
import ShelfSectionTable from '../../layout/warehouse/ShelfSectionTable';

export const ShelfSectionPage = () => {
    //add
    const initialShelfSection: ShelfSectionRequest = {
        sectionName: " ",
        capacity: null,
        shelfId: ""
    }
    const [shelfSectionPage, setShelfSectionPage] = useState<ShelfSectionRequest>(() => initialShelfSection)
    const [shelfSectionPageDialogAdd, setShelfSectionPageDialogAdd] = useState<boolean>(false)
    const [Shelves, setShelves] = useState<ShelfResponse[]>([]);
    const [reload, setReload] = useState<boolean>(false)
    const openDialog = () => {
        setShelfSectionPageDialogAdd(true)
    }
    const closeDialog = () => {
        setShelfSectionPageDialogAdd(false)
    }
    const newChange = async (
        fields: keyof ShelfSectionRequest,
        value: string
    ) => {
        setShelfSectionPage(prev => ({ ...prev, [fields]: value }))

    }
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await ShelfWarehouseApi.getAllShelf();
                console.log(response);
                setShelves(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong
    }, [reload])

    const handleBtnAddOfShelfSectionPage = async () => {

        try {
            if (!shelfSectionPage.sectionName.trim()) {
                alert("Không để trống tên ngăn")
                return
            } else if (shelfSectionPage.capacity == null) {
                alert("Không để trống sức chứa của ô")
                return
            } else if (!shelfSectionPage.shelfId.trim()) {
                alert("Không để trống tên kệ sách")
                return
            }

            // const checkCurrentShef = bookShelves.find(bs => bs.id === shelfPage.bookshelfId);

            // if (!checkCurrentShef) {
            //     alert("Tủ sách không tồn tại!");
            //     return;
            // }

            // if (checkCurrentShef.isFull) {
            //     alert("Đã đạt giới hạn số kệ sách trong tủ sách này.");
            //     return;
            // }


            const response = await ShelfSectionWarehouseApi.addShelfSection(shelfSectionPage)
            console.log(response)
            alert("Thêm thành công" + response)
            setShelfSectionPage(initialShelfSection)
            setShelfSectionPageDialogAdd(false)
            setReload(true)


        } catch (error) {
            alert("Lỗi. Vui lòng check console" + error)
        }
    }

    //getAll

    const [getAllShelfSection, setGetAllShelfSection] = useState<ShelfSectionResponse[]>([])
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await ShelfSectionWarehouseApi.getAllShelfSection();
                console.log(response);
                const mappedData = response.data.map((shelfsection: ShelfSectionResponse) => ({
                    ...shelfsection,
                    isFull: shelfsection.isFull ? "Đã đầy" : "Còn trống"
                }));

                setGetAllShelfSection(mappedData);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong


    }, [reload])

    //getbyid
    const [dialogGetById, setDialogGetById] = useState<boolean>(false)
    const [shelfSectionId, setShelfSectionId] = useState<string>('');
    const [shelfSectionGetById, setShelfSectionGetById] = useState<ShelfSectionResponse>({
        id: " ",
        sectionName: " ",
        capacity: null,
        shelfId: "",
        shelfName: "",
        isFull: false,
        currentBookItem: null
    })
    const [box, setBox] = useState<boolean>(false)

    const onOpenLogGetById = () => {
        setDialogGetById(true);
    }
    const onCloseLogGetById = () => {
        setDialogGetById(false);
        setShelfSectionId('');
    }
    const onCloseBox = () => {
        setBox(false);
    }
    const onClickGetPublisherById = async () => {
        if (!shelfSectionId?.trim()) {
            alert("Vui lòng điền id cần tìm!");
            return;
        }

        try {
            const response = await ShelfSectionWarehouseApi.getShelfSectionById(shelfSectionId);
            console.log(response);

            if (response.data.data.id == shelfSectionId) {
                alert('Lấy dữ liệu thành công' + response);
                setShelfSectionGetById(response.data.data)
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
    const [selectedShelfSectionIds, setSelectedShelfSectionIds] = useState<string[]>([]);
    const onClickOpenDialogDelete = () => {
        if (selectedShelfSectionIds.length > 0) {
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
            for (const id of selectedShelfSectionIds) {
                const response = await ShelfSectionWarehouseApi.deleteShelfSection(id);
            }
            alert('Xóa thành công')
            setReload(true);
            setlogDelete(false);
            setSelectedShelfSectionIds([]);

        } catch (error) {
            alert('Lỗi không xóa được' + error)
        }
    }

    //update
    const [logUpdate, setLogUpdate] = useState<boolean>(false)
    const [shelfSectionUpdate, setShelfSectionUpdate] = useState<ShelfSectionRequest>(() => initialShelfSection)
    const onClickOpenLogUpdate = () => {
        if (selectedShelfSectionIds.length === 1) {
            const selected = getAllShelfSection.find(p => p.id === selectedShelfSectionIds[0])
            if (selected) {
                setShelfSectionUpdate(selected) //đổ dữ liệu đang có từ hàng vào 

                setLogUpdate(true)
            }
        } else if (selectedShelfSectionIds.length > 1) {
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
            for (const id of selectedShelfSectionIds) {
                const response = await ShelfSectionWarehouseApi.updateShelfSection(id, shelfSectionUpdate)
            }
            alert('Cập nhật thành công')
            setReload(true)
            setLogUpdate(false)
            setSelectedShelfSectionIds([])

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
                        <AddShelfSectionForm dialogAdd={shelfSectionPageDialogAdd} onCloseDialog={closeDialog} shelfSection={shelfSectionPage} onNewChange={newChange} ShelfList={Shelves} handleBtnAdd={handleBtnAddOfShelfSectionPage} />
                    </div>
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={() => {
                            onOpenLogGetById();
                            onCloseBox();
                        }} > <span className="text-gray-700 group-hover:text-blue-500 transition">Tìm kiếm </span>
                            <SearchIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={dialogGetById} onClose={() => { setDialogGetById(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>TÌM THÔNG TIN KHO SÁCH - Ô SÁCH</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                                    <TextField fullWidth placeholder='Nhập Id kệ sách' value={shelfSectionId} onChange={(e) => { setShelfSectionId(e.target.value) }}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                                </Box>
                                <Box >
                                    {box && (
                                        shelfSectionGetById && (
                                            <div style={{ marginTop: 20 }}>
                                                <TextField label="Id ô sách" value={shelfSectionGetById.id} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tên ô sách " value={shelfSectionGetById.sectionName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Sức chứa của ô " value={shelfSectionGetById.capacity} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Id kệ sách " value={shelfSectionGetById.shelfId} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Tên kệ sách " value={shelfSectionGetById.shelfName} fullWidth margin="normal" InputProps={{ readOnly: true }} />

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
                            <DialogTitle sx={{ textAlign: "center" }}>Cập nhật thông tin kho sách - ô sách</DialogTitle>
                            <DialogContent>
                                <DialogContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền tên ô:</Typography>
                                        <TextField fullWidth placeholder='Nhập tên tủ sách' value={shelfSectionUpdate.sectionName} onChange={(e) => setShelfSectionUpdate({ ...shelfSectionUpdate, sectionName: e.target.value })}></TextField>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền sức chứa của ô:</Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            placeholder="sức chứa"
                                            value={shelfSectionUpdate.capacity ?? ""}
                                            onChange={(e) =>
                                                setShelfSectionUpdate({
                                                    ...shelfSectionUpdate,
                                                    capacity: e.target.value === "" ? null : parseInt(e.target.value)
                                                })
                                            }
                                        />

                                    </Box>
                                    <Box className="mb-4" >
                                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn kệ sách</Typography>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="floor-select-label" >Chọn kệ sách</InputLabel>
                                            <Select
                                                labelId="kệ sách"
                                                value={shelfSectionUpdate.shelfId}
                                                label="Chọn tủ sách"
                                                onChange={(e) => setShelfSectionUpdate({ ...shelfSectionUpdate, shelfId: e.target.value })}
                                            >
                                                {Shelves.map((Shelf) => (
                                                    <MenuItem key={Shelf.id} value={Shelf.id}>
                                                        {Shelf.shelfName}
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
                    <ShelfSectionTable data={getAllShelfSection} reload={reload} onSelectionChange={setSelectedShelfSectionIds} />
                </div>
            </div>
        </MainLayout >
    )
}
