import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { useEffect, useState} from 'react'
import PublisherApi from '../apis';
import type { PublisherRequest } from '../request/publisherRequest';
import AddIcon from '@mui/icons-material/Add';
import type { PublisherResponse } from '../response/publisherResponse';
import PublisherTable from '../layout/PublisherTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridRowSelectionModel } from '@mui/x-data-grid';




export const PublisherPage = () => {
    const initialPublisher: PublisherRequest={
        publisherName: "",
        address: "",
        email: "",
        phone: ""
    }
  
    const [publisher, setPublisher] = useState<PublisherRequest>(()=>initialPublisher);
    //getall
    const[getAllPublisher, setGetAllPublisher] = useState<PublisherResponse[]>([]);
    const[reload, setReload] = useState<boolean>(false);

    //update
    const[updatePublisher, setUpdatePublisher] = useState<PublisherRequest>(()=>initialPublisher);
    const[selectedIds, setSelectedIds] = useState<GridRowSelectionModel>();



    const [openDialogAdd, setOpenDialogAdd] = useState<boolean>(false);
    const onClickOpenDialog = async () =>{
        setOpenDialogAdd(true);
    }
    const onClickCloseDialog = async () =>{
        setOpenDialogAdd(false);
    }
    //hàm tự định nghĩa để lấy các thuộc tính trong publisher mà không cần phải viết riêng biệt từng hàm tương ứng với từng field
    const newChange = async(
        fields: keyof PublisherRequest,
        value: string
    )=>{
        setPublisher(prev =>({...prev, [fields]: value}))

    }
    const onhandleAddingBtn = async () =>{
        try{
            
            if(!publisher?.publisherName.trim() && !publisher?.email.trim()){
                alert("Vui lòng nhập tên nhà sản xuất!");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(publisher.email)){
                alert("Email không hợp lệ!");
                return;
            }

            const phoneRegex = /^0\d{9}$/;
            if(!phoneRegex.test(publisher.phone)){
                alert("Số điện thoại không hợp lệ!");
                return;
            }

            const response = await PublisherApi.addPublisher(publisher);
            console.log(publisher);
            alert("Thêm thành công: " + response);
            setPublisher(initialPublisher);
            setOpenDialogAdd(false);
            setReload(true);
        }catch(error){
            alert('Có lỗi xảy ra' + error);
        }
    }

    const onHandleInformationDefault = () =>{
        if(selectedIds?.ids !== 1){
            alert("Chỉ chọn 1 ô để cập nhật");
            return;
        }
    }
    const onHandleUpdatingBtn = () =>{

    }
    useEffect (()=>{
        const fetchData = async () =>{
            
                try{
                    const response = await PublisherApi.getAllPublisher();
                    console.log(response);
                    setGetAllPublisher(response.data);
                }catch(error){
                    alert('Không tải được dữ liệu lên' + error);
                }
            };
            
            fetchData();
            setReload(false); // tắt reload sau khi tải xong
            
        
    },[reload])
    
  return (
    <div>
        <div className='AddIcon'>
         <Button onClick={onClickOpenDialog}>Thêm
            <AddIcon/>
         </Button>
         <Button onClick={onClickOpenDialog}>Xóa
            <DeleteIcon/>
         </Button>
        <Dialog open = {openDialogAdd} onClose={()=>{setOpenDialogAdd(false)}}>
            <DialogTitle sx={{ textAlign: "center" }}>NHẬP THÔNG TIN NHÀ SẢN XUẤT</DialogTitle>
            <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: 300 }}>Điền tên nhà xuất bản:</Typography>
            <TextField fullWidth placeholder='Nhập tên nhà sản xuất' value={publisher.publisherName} onChange={(e)=> newChange("publisherName", e.target.value)}></TextField>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: 300 }}>Điền email:</Typography>
            <TextField fullWidth placeholder='Nhập email của nhà sản xuất' value={publisher.email} onChange={(e)=>newChange("email", e.target.value)}></TextField>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: 300 }}>Điền số điện thoại:</Typography>
            <TextField fullWidth placeholder='Nhập số điện thoại của nhà sản xuất' value={publisher.phone} onChange={(e)=>newChange("phone", e.target.value)}></TextField>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: 300 }}>Điền địa chỉ:</Typography>
            <TextField fullWidth placeholder='Nhập địa chỉ liên hệ' value={publisher.address} onChange={(e)=>newChange("address", e.target.value)}></TextField>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2}}>
            <Button color="primary" onClick={onhandleAddingBtn}>Lưu</Button>
            <Button color='error' onClick={onClickCloseDialog}>Hủy</Button>
            </Box>
            </DialogContent>
        </Dialog>
        </div>
        <div className='updateIcon'>
        <Button onClick={onClickOpenDialog}>Sửa
            <EditIcon/>
        </Button>
        <Dialog open = {openDialogAdd} onClose={()=>{setOpenDialogAdd(false)}}>
            <DialogTitle sx={{ textAlign: "center" }}>NHẬP THÔNG TIN NHÀ SẢN XUẤT</DialogTitle>
            <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: 300 }}>Điền tên nhà xuất bản:</Typography>
            <TextField fullWidth placeholder='Nhập tên nhà sản xuất' value={publisher.publisherName} onChange={(e)=> newChange("publisherName", e.target.value)}>{}</TextField>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: 300 }}>Điền email:</Typography>
            <TextField fullWidth placeholder='Nhập email của nhà sản xuất' value={publisher.email} onChange={(e)=>newChange("email", e.target.value)}></TextField>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: 300 }}>Điền số điện thoại:</Typography>
            <TextField fullWidth placeholder='Nhập số điện thoại của nhà sản xuất' value={publisher.phone} onChange={(e)=>newChange("phone", e.target.value)}></TextField>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ width: 300 }}>Điền địa chỉ:</Typography>
            <TextField fullWidth placeholder='Nhập địa chỉ liên hệ' value={publisher.address} onChange={(e)=>newChange("address", e.target.value)}></TextField>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2}}>
            <Button color="primary" onClick={onhandleAddingBtn}>Cập Nhật</Button>
            <Button color='error' onClick={onClickCloseDialog}>Hủy</Button>
            </Box>
            </DialogContent>
        </Dialog>
        </div>
        <div className='DataTable'>
            <PublisherTable data = {getAllPublisher} reload = {reload} />
        </div>
    </div>
  )
}
