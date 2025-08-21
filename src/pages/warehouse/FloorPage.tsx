import { useEffect, useState } from 'react'

import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { FloorRequest } from '../../request/Warehouse/FloorRequest';
import { FloorWarehouseApi } from '../../apis';
import type { FloorResponse } from '../../response/Warehouse/FloorResponse';
import MainLayout from '../../layout/mainLayout/MainLayout';
import FloorTable from '../../layout/warehouse/FloorTable';


export const FloorPage = () => {
    const initialFloor: FloorRequest = {
        floorName: ""
    }
    const [floor, setFloor] = useState<FloorRequest>(() => initialFloor)
    const [dialogAdd, setDialogAdd] = useState<boolean>(false)
    const openDialog = () => {
        setDialogAdd(true)
    }
    const closeDialog = () => {
        setDialogAdd(false)
    }
    const newChange = async (
        fields: keyof FloorRequest,
        value: string
    ) => {
        setFloor(prev => ({ ...prev, [fields]: value }))

    }
    const handleBtnAdd = async () => {

        try {
            if (!floor.floorName.trim()) {
                alert("Không để trống tên tầng")
            }
            const response = await FloorWarehouseApi.addFloor(floor)
            console.log(response)
            alert("Thêm thành công" + response)
            setFloor(initialFloor)
            setDialogAdd(false)
            setReload(true)

        } catch (error) {
            alert("Lỗi. Vui lòng check console" + error)
        }
    }

    //getAll
    const [reload, setReload] = useState<boolean>(false)
    const [getAllFloor, setGetAllFloor] = useState<FloorResponse[]>([])
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await FloorWarehouseApi.getAllFloor();
                console.log(response);
                setGetAllFloor(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong


    }, [reload])

    //getbyid
    const [dialogGetById, setDialogGetById] = useState<boolean>(false)
    const [floorId, setFloorId] = useState<string>('');
    const [floorGetById, setFlooretById] = useState<FloorRequest>(() => initialFloor)
    const [box, setBox] = useState<boolean>(false)

    const onOpenLogGetById = () => {
        setDialogGetById(true);
    }
    const onCloseLogGetById = () => {
        setDialogGetById(false);
        setFloorId('');
    }
    const onCloseBox = () => {
        setBox(false);
    }
    const onClickGetPublisherById = async () => {
        if (!floorId?.trim()) {
            alert("Vui lòng điền id cần tìm!");
            return;
        }

        try {
            const response = await FloorWarehouseApi.getFloorById(floorId);
            console.log(response);

            if (response.data.data.id == floorId) {
                alert('Lấy dữ liệu thành công' + response);
                setFlooretById(response.data.data)
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
    const [selectedFloorIds, setSelectedFloorIds] = useState<string[]>([]);
    const onClickOpenDialogDelete = () => {
        if (selectedFloorIds.length > 0) {
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
            for (const id of selectedFloorIds) {
                const response = await FloorWarehouseApi.deleteFloor(id);
            }
            alert('Xóa thành công')
            setReload(true);
            setlogDelete(false);
            setSelectedFloorIds([]);

        } catch (error) {
            alert('Lỗi không xóa được' + error)
        }
    }

    //update
    const [logUpdate, setLogUpdate] = useState<boolean>(false)
    const [floorUpdate, setFloorUpdate] = useState<FloorRequest>(() => initialFloor)
    const onClickOpenLogUpdate = () => {
        if (selectedFloorIds.length === 1) {
            const selected = getAllFloor.find(p => p.id === selectedFloorIds[0])
            if (selected) {
                setFloorUpdate(selected) //đổ dữ liệu đang có từ hàng vào 

                setLogUpdate(true)
            }
        } else if (selectedFloorIds.length > 1) {
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
            for (const id of selectedFloorIds) {
                const response = await FloorWarehouseApi.updateFloor(id, floorUpdate)
            }
            alert('Cập nhật thành công')
            setReload(true)
            setLogUpdate(false)
            setSelectedFloorIds([])
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
                        <Dialog open={dialogAdd} onClose={() => { setDialogAdd(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>NHẬP THÔNG TIN KHO SÁCH - TẦNG</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 300 }}>Điền tên tầng:</Typography>
                                    <TextField fullWidth placeholder='Nhập tên tầng' value={floor.floorName} onChange={(e) => newChange("floorName", e.target.value)}></TextField>
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
                            <DialogTitle sx={{ textAlign: "center" }}>TÌM THÔNG TIN KHO SÁCH - TẦNG</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                                    <TextField fullWidth placeholder='Nhập Id tầng' value={floorId} onChange={(e) => { setFloorId(e.target.value) }}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                                </Box>
                                <Box >
                                    {box && (
                                        floorGetById && (
                                            <div style={{ marginTop: 20 }}>
                                                <TextField label="Tên tầng " value={floorGetById.floorName} fullWidth margin="normal" InputProps={{ readOnly: true }} />

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
                            <DialogTitle sx={{ textAlign: "center" }}>Cập nhật thông tin kho sách - tầng</DialogTitle>
                            <DialogContent>
                                <DialogContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền tên tầng:</Typography>
                                        <TextField fullWidth placeholder='Nhập tên tầng' value={floorUpdate.floorName} onChange={(e) => setFloorUpdate({ ...floorUpdate, floorName: e.target.value })}></TextField>
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
                    <FloorTable data={getAllFloor} reload={reload} onSelectionChange={setSelectedFloorIds} />
                </div>
            </div>
        </MainLayout>
    )
}
