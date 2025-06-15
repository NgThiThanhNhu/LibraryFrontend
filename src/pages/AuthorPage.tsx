import { useEffect, useState } from 'react'
import type { AuthorRequest } from '../request/AuthorRequest'
import { AuthorApi } from '../apis'
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MainLayout from '../layout/MainLayout';
import type { AuthorResponse } from '../response/AuthorResponse';
import AuthorTable from '../layout/AuthorTable';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const AuthorPage = () => {
    const initialAuthor: AuthorRequest = {
        name: ""
    }
    const [author, setAuthor] = useState<AuthorRequest>(() => initialAuthor)
    const [dialogAdd, setDialogAdd] = useState<boolean>(false)
    const [reload, setReload] = useState<boolean>(false)
    const openDialog = () => {
        setDialogAdd(true)
    }
    const closeDialog = () => {
        setDialogAdd(false)
    }
    const newChange = async (
        fields: keyof AuthorRequest,
        value: string
    ) => {
        setAuthor(prev => ({ ...prev, [fields]: value }))

    }
    const handleBtnAdd = async () => {

        try {
            if (!author.name.trim()) {
                alert("Không để trống tên tác giả")
            }
            const response = await AuthorApi.addAuthor(author)
            console.log(response)
            alert("Thêm tác giả thành công" + response)
            setAuthor(initialAuthor)
            setDialogAdd(false)
            setReload(true)
        } catch (error) {
            alert("Lỗi. Vui lòng check console" + error)
        }
    }

    //getAll
    const [getAllAuthor, setGetAllAuthor] = useState<AuthorResponse[]>([])
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await AuthorApi.getAllAuthor();
                console.log(response);
                setGetAllAuthor(response.data);
            } catch (error) {
                alert('Không tải được dữ liệu lên' + error);
            }
        };

        fetchData();
        setReload(false); // tắt reload sau khi tải xong


    }, [reload])

    //getbyid
    const [dialogGetById, setDialogGetById] = useState<boolean>(false)
    const [authorId, setAuthorId] = useState<string>('');
    const [authorGetById, setAuthorGetById] = useState<AuthorRequest>(() => initialAuthor)
    const [box, setBox] = useState<boolean>(false)

    const onOpenLogGetById = () => {
        setDialogGetById(true);
    }
    const onCloseLogGetById = () => {
        setDialogGetById(false);
        setAuthorId('');
    }
    const onCloseBox = () => {
        setBox(false);
    }
    const onClickGetPublisherById = async () => {
        if (!authorId?.trim()) {
            alert("Vui lòng điền id cần tìm!");
            return;
        }

        try {
            const response = await AuthorApi.getAuthorById(authorId);
            console.log(response);

            if (response.data.data.id == authorId) {
                alert('Lấy dữ liệu thành công' + response);
                setAuthorGetById(response.data.data)
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
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
    const onClickOpenDialogDelete = () => {
        if (selectedAuthorIds.length > 0) {
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
            for (const id of selectedAuthorIds) {
                const response = await AuthorApi.deleteAuthor(id);
            }
            alert('Xóa thành công')
            setReload(true);
            setlogDelete(false);
            setSelectedAuthorIds([]);

        } catch (error) {
            alert('Lỗi không xóa được' + error)
        }
    }

    //update
    const [logUpdate, setLogUpdate] = useState<boolean>(false)
    const [authorUpdate, setAuthorUpdate] = useState<AuthorRequest>(() => initialAuthor)
    const onClickOpenLogUpdate = () => {
        if (selectedAuthorIds.length === 1) {
            const selected = getAllAuthor.find(p => p.id === selectedAuthorIds[0])
            if (selected) {
                setAuthorUpdate(selected) //đổ dữ liệu đang có từ hàng vào 

                setLogUpdate(true)
            }
        } else if (selectedAuthorIds.length > 1) {
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
            for (const id of selectedAuthorIds) {
                const response = await AuthorApi.updateAuthor(id, authorUpdate)
            }
            alert('Cập nhật thành công')
            setReload(true)
            setLogUpdate(false)
            setSelectedAuthorIds([])
        } catch (error) {
            alert('Id không tồn tại ' + error)
        }
    }



    return (
        <MainLayout>
            <div>
                <div className="border-b border-gray-300 pb-4 mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Quản lý tác giả
                    </h1>
                </div>
                <div className='flex flex-row gap-4'>
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={openDialog}>
                            <span className="text-gray-700 group-hover:text-blue-500 transition">
                                Thêm
                            </span>
                            <AddIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <Dialog open={dialogAdd} onClose={() => { setDialogAdd(false) }}>
                            <DialogTitle sx={{ textAlign: "center" }}>NHẬP THÔNG TIN TÁC GIẢ</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 300 }}>Điền tên tác giả:</Typography>
                                    <TextField fullWidth placeholder='Nhập tên nhà sản xuất' value={author.name} onChange={(e) => newChange("name", e.target.value)}></TextField>
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
                            <DialogTitle sx={{ textAlign: "center" }}>TÌM THÔNG TIN TÁC GIẢ</DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                                    <TextField fullWidth placeholder='Nhập Id của nhà sản xuất' value={authorId} onChange={(e) => { setAuthorId(e.target.value) }}></TextField>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                                </Box>
                                <Box >
                                    {box && (
                                        authorGetById && (
                                            <div style={{ marginTop: 20 }}>
                                                <TextField label="Tên tác giả" value={authorGetById.name} fullWidth margin="normal" InputProps={{ readOnly: true }} />

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
                            <DialogTitle sx={{ textAlign: "center" }}>Cập nhật thông tin tác giả</DialogTitle>
                            <DialogContent>
                                <DialogContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ width: 300 }}>Điền tên tác giả:</Typography>
                                        <TextField fullWidth placeholder='Nhập tên tác giả' value={authorUpdate.name} onChange={(e) => setAuthorUpdate({ ...authorUpdate, name: e.target.value })}></TextField>
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
                    <AuthorTable data={getAllAuthor} reload={reload} onSelectionChange={setSelectedAuthorIds} />
                </div>
            </div>
        </MainLayout>
    )
}
