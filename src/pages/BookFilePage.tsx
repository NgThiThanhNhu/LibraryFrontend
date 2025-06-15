import { Button } from "@mui/material";
import MainLayout from "../layout/MainLayout";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadBookFileForm from "../layout/UploadBookFileForm";
import { useState } from "react";
import { BookFileApi } from "../apis";
import type { BookFileRequest } from "../request/BookFileRequest";


export const BookFilePage = () => {
    //add
    const [uploadData, setUploadData] = useState<BookFileRequest>({
        BookId: "",
        UploadFile: null,
        Image: null,
        BookFileType: 0,
    });
    const [bookFilePageDialogAdd, setbookFilePageDialogAdd] = useState<boolean>(false)

    const openDialog = () => {
        setbookFilePageDialogAdd(true)
    }
    const closeDialog = () => {
        setbookFilePageDialogAdd(false)
    }

    const handleChange = (field: keyof BookFileRequest, value: any) => {
        setUploadData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleBtnAddOfBookFilePage = async () => {
        if (!uploadData.UploadFile || !uploadData.Image || !uploadData.BookId) {
            alert("Vui lòng chọn đủ thông tin!");
            return;
        }
        try {

            const response = await BookFileApi.uploadBookFile(uploadData);
            alert("upload thành công")
            console.log(response)
        } catch (error) {
            alert("Upload thất bại. Vui lòng check console" + error)
        }
    }





    return (
        <MainLayout>
            <div>
                <div className='flex flex-row gap-4'>
                    <div>
                        <Button className="group flex items-center space-x-1 hover:bg-gray-100 " variant="text" onClick={openDialog}>
                            <span className="text-gray-700 group-hover:text-blue-500 transition">
                                Upload
                            </span>
                            <CloudUploadIcon className="text-gray-700 group-hover:text-blue-500 transition" fontSize='small' sx={{ marginLeft: 0.22 }} />
                        </Button>
                        <UploadBookFileForm dialogAdd={bookFilePageDialogAdd} onCloseDialog={closeDialog} onChange={handleChange} dataUploadFile={uploadData} handleSubmit={handleBtnAddOfBookFilePage} />
                    </div>
                </div>
            </div>

        </MainLayout >
    )
}
