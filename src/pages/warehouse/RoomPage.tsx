import { useEffect, useState } from 'react'

import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { FloorRequest } from '../../request/Warehouse/FloorRequest';
import type { FloorResponse } from '../../response/Warehouse/FloorResponse';
import { FloorWarehouseApi, RoomWarehouseApi } from '../../apis';
import FloorTable from '../../layout/warehouse/FloorTable';
import MainLayout from '../../layout/MainLayout';
import type { RoomRequest } from '../../request/Warehouse/RoomRequest';
import AddRoomForm from '../../layout/warehouse/AddRoomForm';
import type { RoomResponse } from '../../response/Warehouse/RoomResponse';
import RoomTable from '../../layout/warehouse/RoomTable';

export const RoomPage = () => {
    const initialRoom: RoomRequest = {
        roomName: " ",
        floorId: " "
    }
    const [roomPage, setRoomPage] = useState<RoomRequest>(() => initialRoom)
    const [roomPageDialogAdd, setRoomPageDialogAdd] = useState<boolean>(false)
    const [floors, setFloors] = useState<FloorResponse[]>([]);
    const [reload, setReload] = useState<boolean>(false)
    const openDialog = () => {
        setRoomPageDialogAdd(true)
    }
    const closeDialog = () => {
        setRoomPageDialogAdd(false)
    }
    const newChange = async (
        fields: keyof RoomRequest,
        value: string
    ) => {
        setRoomPage(prev => ({ ...prev, [fields]: value }))

    }
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await FloorWarehouseApi.getAllFloor();
                console.log(response);
                setFloors(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong
    }, [reload])

    const handleBtnAddOfRoomPage = async () => {

        try {
            if (!roomPage.roomName.trim()) {
                alert("Không để trống tên tầng")
            }
            const response = await RoomWarehouseApi.addRoom(roomPage)
            console.log(response)
            alert("Thêm thành công" + response)
            setRoomPage(initialRoom)
            setRoomPageDialogAdd(false)
            setReload(true)

        } catch (error) {
            alert("Lỗi. Vui lòng check console" + error)
        }
    }

    //getAll

    const [getAllRoom, setGetAllRoom] = useState<RoomResponse[]>([])
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await RoomWarehouseApi.getAllRoom();
                console.log(response);
                setGetAllRoom(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong


    }, [reload])

    //getbyid
    const [dialogGetById, setDialogGetById] = useState<boolean>(false)
    const [roomId, setRoomId] = useState<string>('');
    const [roomGetById, setRoomGetById] = useState<RoomResponse>({
        id: " ",
        roomName: " ",
        floorId: "",
        floorName: ""
    })
    const [box, setBox] = useState<boolean>(false)

    const onOpenLogGetById = () => {
        setDialogGetById(true);
    }
    const onCloseLogGetById = () => {
        setDialogGetById(false);
        setRoomId('');
    }
    const onCloseBox = () => {
        setBox(false);
    }
    const onClickGetPublisherById = async () => {
        if (!roomId?.trim()) {
            alert("Vui lòng điền id cần tìm!");
            return;
        }

        try {
            const response = await RoomWarehouseApi.getRoomById(roomId);
            console.log(response);

            if (response.data.data.id == roomId) {
                alert('Lấy dữ liệu thành công' + response);
                setRoomGetById(response.data.data)
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
    const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
    const onClickOpenDialogDelete = () => {
        if (selectedRoomIds.length > 0) {
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
            for (const id of selectedRoomIds) {
                const response = await RoomWarehouseApi.deleteRoom(id);
            }
            alert('Xóa thành công')
            setReload(true);
            setlogDelete(false);
            setSelectedRoomIds([]);

        } catch (error) {
            alert('Lỗi không xóa được' + error)
        }
    }

    //update
    const [logUpdate, setLogUpdate] = useState<boolean>(false)
    const [roomUpdate, setRoomUpdate] = useState<RoomRequest>(() => initialRoom)
    const onClickOpenLogUpdate = () => {
        if (selectedRoomIds.length === 1) {
            const selected = getAllRoom.find(p => p.id === selectedRoomIds[0])
            if (selected) {
                setRoomUpdate(selected) //đổ dữ liệu đang có từ hàng vào 

                setLogUpdate(true)
            }
        } else if (selectedRoomIds.length > 1) {
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
            for (const id of selectedRoomIds) {
                const response = await RoomWarehouseApi.updateRoom(id, roomUpdate)
            }
            alert('Cập nhật thành công')
            setReload(true)
            setLogUpdate(false)
            setSelectedRoomIds([])
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
                        <AddRoomForm dialogAdd={roomPageDialogAdd} onCloseDialog={closeDialog} room={roomPage} onNewChange={newChange} floorList={floors} handleBtnAdd={handleBtnAddOfRoomPage} />
                    </div>
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={() => {
                            onOpenLogGetById();
                            onCloseBox();
                        }} > <span className="text-gray-700 group-hover:text-blue-500 transition">Tìm kiếm </span>
                            <SearchIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={dialogGetById} onClose={() => { setDialogGetById(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>TÌM THÔNG TIN KHO SÁCH - PHÒNG</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                                    <TextField fullWidth placeholder='Nhập Id phòng' value={roomId} onChange={(e) => { setRoomId(e.target.value) }}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                                </Box>
                                <Box >
                                    {box && (
                                        roomGetById && (
                                            <div style={{ marginTop: 20 }}>
                                                <TextField label="Id phòng" value={roomGetById.id} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Số phòng " value={roomGetById.roomName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Số tầng " value={roomGetById.floorName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
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
                            <DialogTitle sx={{ textAlign: "center" }}>Cập nhật thông tin kho sách - phòng</DialogTitle>
                            <DialogContent>
                                <DialogContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền số phòng:</Typography>
                                        <TextField fullWidth placeholder='Nhập tên phòng' value={roomUpdate.roomName} onChange={(e) => setRoomUpdate({ ...roomUpdate, roomName: e.target.value })}></TextField>
                                    </Box>
                                    <Box className="mb-4" >
                                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn tên tầng</Typography>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel id="floor-select-label" >Chọn tầng</InputLabel>
                                            <Select
                                                labelId="floor-select-label"
                                                value={roomUpdate.floorId}
                                                label="Chọn tầng"
                                                onChange={(e) => setRoomUpdate({ ...roomUpdate, floorId: e.target.value })}
                                            >
                                                {floors.map((floor) => (
                                                    <MenuItem key={floor.id} value={floor.id}>
                                                        {floor.floorName}
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
                    <RoomTable data={getAllRoom} reload={reload} onSelectionChange={setSelectedRoomIds} />
                </div>
            </div>
        </MainLayout >
    )
}
