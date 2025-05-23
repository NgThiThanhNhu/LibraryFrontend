import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { useEffect, useState} from 'react'
import PublisherApi from '../apis';
import type { PublisherRequest } from '../request/publisherRequest';
import AddIcon from '@mui/icons-material/Add';
import type { PublisherResponse } from '../response/publisherResponse';
import PublisherTable from '../layout/PublisherTable';

import DeleteIcon from '@mui/icons-material/Delete';

import SearchIcon from '@mui/icons-material/Search';




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
    
    

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const onClickOpenDialog = async () =>{
        setOpenDialog(true);
    }
    const onClickCloseDialog = async () =>{
        setOpenDialog(false);
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
            setOpenDialog(false);
            setReload(true);
        }catch(error){
            alert('Có lỗi xảy ra' + error);
        }
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

    //getbyid
    const [publisherId, setPublisherId] = useState<string>('');
    const [publisherGetById, setPublisherGetById] = useState<PublisherRequest>(()=>initialPublisher)
    const [box, setBox ] = useState<boolean>(false)
    const [logGetById, setLogGetById] = useState<boolean>(false)
    const onOpenLogGetById = () =>{
        setLogGetById(true);
    }
    const onCloseLogGetById = () =>{
        setLogGetById(false);
        setPublisherId('');
    }
    const onCloseBox = () =>{
        setBox(false);
    }
    const onClickGetPublisherById = async ()=>{
        if(!publisherId?.trim())
        {
            alert("Vui lòng điền id cần tìm!");
            return; 
        }

        try{
            const response = await PublisherApi.getPublisherById(publisherId);
            console.log(response);
            
            if(response.data.data.id == publisherId){
              alert('Lấy dữ liệu thành công' + response);
              setPublisherGetById(response.data.data)
              setBox(true);
              
            }else{
              console.error('Id không tồn tại');
            }
        }catch(error){
            alert('Id không tồn tại' + error)
        }
    }

    //delete 
    



  return (
    <div>
        <div className='AddIcon'>
         <Button onClick={onClickOpenDialog}>Thêm
            <AddIcon/>
         </Button>
        <Dialog open = {openDialog} onClose={()=>{setOpenDialog(false)}}>
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
        <div className='SearchIcon'>
            <Button onClick={()=>{
                onOpenLogGetById();
                onCloseBox();
            }} > Tìm kiếm
                <SearchIcon/>
            </Button>
            <Dialog open = {logGetById} onClose={()=>{setLogGetById(false)}}>
                <DialogTitle sx={{ textAlign: "center" }}>TÌM THÔNG TIN NHÀ SẢN XUẤT</DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ width: 200 }}>Điền Id: </Typography>
                    <TextField fullWidth placeholder='Nhập Id của nhà sản xuất' value={publisherId} onChange={(e)=>{setPublisherId(e.target.value)}}></TextField>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2}}>
                    <Button color="primary" onClick={onClickGetPublisherById}>Tìm</Button>
                    <Button color='error' onClick={onCloseLogGetById}>Thoát</Button>
                </Box>
                <Box >
                    {box &&(
                    publisherGetById &&(
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
            <Button onClick={onClickOpenDialog}>Xóa
            <DeleteIcon/>
         </Button>
        </div>
        <div className='DataTable'>
            <PublisherTable data = {getAllPublisher} reload = {reload} />
        </div>
    </div>
  )
}
