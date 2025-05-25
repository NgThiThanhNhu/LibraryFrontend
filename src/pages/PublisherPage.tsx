import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import PublisherApi from '../apis';
import type { PublisherRequest } from '../request/publisherRequest';
import AddIcon from '@mui/icons-material/Add';
import type { PublisherResponse } from '../response/publisherResponse';
import PublisherTable from '../layout/PublisherTable';

import DeleteIcon from '@mui/icons-material/Delete';

import SearchIcon from '@mui/icons-material/Search';

import EditIcon from '@mui/icons-material/Edit';

import MainLayout from '../layout/MainLayout';




export const PublisherPage = () => {
    const initialPublisher: PublisherRequest = {
        publisherName: "",
        address: "",
        email: "",
        phone: ""
    }

    const [publisher, setPublisher] = useState<PublisherRequest>(() => initialPublisher);
    //getall
    const [getAllPublisher, setGetAllPublisher] = useState<PublisherResponse[]>([]);
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
        fields: keyof PublisherRequest,
        value: string
    ) => {
        setPublisher(prev => ({ ...prev, [fields]: value }))

    }

    const onhandleAddingBtn = async () => {
        try {

            if (!publisher?.publisherName.trim() && !publisher?.email.trim()) {
                alert("Vui lòng nhập tên nhà sản xuất!");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(publisher.email)) {
                alert("Email không hợp lệ!");
                return;
            }

            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(publisher.phone)) {
                alert("Số điện thoại không hợp lệ!");
                return;
            }

            const response = await PublisherApi.addPublisher(publisher);
            console.log(publisher);
            alert("Thêm thành công: " + response);
            setPublisher(initialPublisher);
            setOpenDialog(false);
            setReload(true);
        } catch (error) {
            alert('Có lỗi xảy ra' + error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await PublisherApi.getAllPublisher();
                console.log(response);
                setGetAllPublisher(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong


    }, [reload])

    //getbyid
    const [publisherId, setPublisherId] = useState<string>('');
    const [publisherGetById, setPublisherGetById] = useState<PublisherRequest>(() => initialPublisher)
    const [box, setBox] = useState<boolean>(false)
    const [logGetById, setLogGetById] = useState<boolean>(false)
    const onOpenLogGetById = () => {
        setLogGetById(true);
    }
    const onCloseLogGetById = () => {
        setLogGetById(false);
        setPublisherId('');
    }
    const onCloseBox = () => {
        setBox(false);
    }
    const onClickGetPublisherById = async () => {
        if (!publisherId?.trim()) {
            alert("Vui lòng điền id cần tìm!");
            return;
        }

        try {
            const response = await PublisherApi.getPublisherById(publisherId);
            console.log(response);

            if (response.data.data.id == publisherId) {
                alert('Lấy dữ liệu thành công' + response);
                setPublisherGetById(response.data.data)
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
    const [selectedPublisherIds, setSelectedPublisherIds] = useState<string[]>([]);
    const onClickOpenDialogDelete = () => {
        if (selectedPublisherIds.length > 0) {
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
            for (const id of selectedPublisherIds) {
                const response = await PublisherApi.deletePublisher(id);
            }
            alert('Xóa thành công')
            setReload(true);
            setlogDelete(false);
            setSelectedPublisherIds([]);

        } catch (error) {
            alert('Lỗi không xóa được' + error)
        }
    }

    //UPDATE: dùng chung selectionid[] bắt điều kiện để xử lý
    const [logUpdate, setLogUpdate] = useState<boolean>(false)
    const [publisherUpdate, setPublisherUpdate] = useState<PublisherRequest>(() => initialPublisher)
    const onClickOpenLogUpdate = () => {
        if (selectedPublisherIds.length === 1) {
            const selected = getAllPublisher.find(p => p.id === selectedPublisherIds[0])
            if (selected) {
                setPublisherUpdate(selected) //đổ dữ liệu đang có từ hàng vào 

                setLogUpdate(true)
            }
        } else if (selectedPublisherIds.length > 1) {
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
            for (const id of selectedPublisherIds) {
                const response = await PublisherApi.updatePublisher(id, publisherUpdate)
            }
            alert('Cập nhật thành công')
            setReload(true)
            setLogUpdate(false)
            setSelectedPublisherIds([])
        } catch (error) {
            alert('Id không tồn tại ' + error)
        }
    }


    return (
        <MainLayout>
            <div>
                <div className='flex flex-row gap-4'>
                    <div>
                        <Button className="w-29 hover:bg-blue-100 px-4 py-2 rounded transition duration-300 ease-in-out" variant="outlined" onClick={onClickOpenDialog}>Thêm
                            <AddIcon fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={openDialog} onClose={() => { setOpenDialog(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>NHẬP THÔNG TIN NHÀ SẢN XUẤT</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 300 }}>Điền tên nhà xuất bản:</Typography>
                                    <TextField fullWidth placeholder='Nhập tên nhà sản xuất' value={publisher.publisherName} onChange={(e) => newChange("publisherName", e.target.value)}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 300 }}>Điền email:</Typography>
                                    <TextField fullWidth placeholder='Nhập email của nhà sản xuất' value={publisher.email} onChange={(e) => newChange("email", e.target.value)}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 300 }}>Điền số điện thoại:</Typography>
                                    <TextField fullWidth placeholder='Nhập số điện thoại của nhà sản xuất' value={publisher.phone} onChange={(e) => newChange("phone", e.target.value)}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 300 }}>Điền địa chỉ:</Typography>
                                    <TextField fullWidth placeholder='Nhập địa chỉ liên hệ' value={publisher.address} onChange={(e) => newChange("address", e.target.value)}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onhandleAddingBtn}>Lưu</Button>
                                    <Button color='error' onClick={onClickCloseDialog}>Hủy</Button>
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className='SearchIcon'>
                        <Button className="w-29 hover:bg-blue-100 px-4 py-2 rounded transition duration-300 ease-in-out" variant="outlined" onClick={() => {
                            onOpenLogGetById();
                            onCloseBox();
                        }} > Tìm kiếm
                            <SearchIcon fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={logGetById} onClose={() => { setLogGetById(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>TÌM THÔNG TIN NHÀ SẢN XUẤT</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                                    <TextField fullWidth placeholder='Nhập Id của nhà sản xuất' value={publisherId} onChange={(e) => { setPublisherId(e.target.value) }}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                                </Box>
                                <Box >
                                    {box && (
                                        publisherGetById && (
                                            <div style={{ marginTop: 20 }}>
                                                <TextField label="Tên nhà xuất bản" value={publisherGetById.publisherName} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Email" value={publisherGetById.email} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Số điện thoại" value={publisherGetById.phone} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                                <TextField label="Địa chỉ" value={publisherGetById.address} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                            </div>
                                        )
                                    )
                                    }
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className='deleteIcon'>
                        <Button className="w-29 hover:bg-blue-100 px-4 py-2 rounded transition duration-300 ease-in-out" variant="outlined" onClick={onClickOpenDialogDelete}>Xóa
                            <DeleteIcon fontSize='small' sx={{ marginLeft: 0.22 }} />
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
                    <div className='updateIcon'>
                        <Button className=" w-29 hover:bg-blue-100 px-4 py-2 rounded transition duration-300 ease-in-out" variant="outlined" onClick={onClickOpenLogUpdate}>Cập nhật
                            <EditIcon fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={logUpdate} onClose={() => { setLogUpdate(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>Cập nhật thông tin nhà xuất bản</DialogTitle>
                            <DialogContent>
                                <DialogContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền tên nhà xuất bản:</Typography>
                                        <TextField fullWidth placeholder='Nhập tên nhà sản xuất' value={publisherUpdate.publisherName} onChange={(e) => setPublisherUpdate({ ...publisherUpdate, publisherName: e.target.value })}></TextField>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền email:</Typography>
                                        <TextField fullWidth placeholder='Nhập email của nhà sản xuất' value={publisherUpdate.email} onChange={(e) => setPublisherUpdate({ ...publisherUpdate, email: e.target.value })}></TextField>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền số điện thoại:</Typography>
                                        <TextField fullWidth placeholder='Nhập số điện thoại của nhà sản xuất' value={publisherUpdate.phone} onChange={(e) => setPublisherUpdate({ ...publisherUpdate, phone: e.target.value })}></TextField>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền địa chỉ:</Typography>
                                        <TextField fullWidth placeholder='Nhập địa chỉ liên hệ' value={publisherUpdate.address} onChange={(e) => setPublisherUpdate({ ...publisherUpdate, address: e.target.value })}></TextField>
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
                    <PublisherTable data={getAllPublisher} reload={reload} onSelectionChange={setSelectedPublisherIds} />
                </div>
            </div>
        </MainLayout>

    )
}
