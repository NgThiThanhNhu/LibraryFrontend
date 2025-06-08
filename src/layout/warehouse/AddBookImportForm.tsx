import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";

import type { BookImportRequest } from "../../request/Warehouse/BookImportRequest";
import type { PublisherResponse } from "../../response/publisherResponse";
import type { AuthorResponse } from "../../response/AuthorResponse";
import type { BookCategoryResponse } from "../../response/BookCategoryResponse";
import type { BookChapterResponse } from "../../response/BookChapterResponse";


type Props = {
    dialogAdd: boolean,
    onCloseDialog: () => void,
    bookImport: BookImportRequest,
    onNewChange: (field: keyof BookImportRequest, value: string) => void,
    PublisherList: PublisherResponse[],
    AuthorList: AuthorResponse[],
    CategoryList: BookCategoryResponse[],
    BookChapterList: BookChapterResponse[],
    handleBtnAdd: () => void,

}

export default function AddBookImportForm({ dialogAdd, onCloseDialog, PublisherList, AuthorList, CategoryList, BookChapterList, bookImport, onNewChange, handleBtnAdd }: Props) {
    return (
        <div>
            <Dialog open={dialogAdd} onClose={onCloseDialog}>
                <DialogTitle className="text-xl font-bold text-blue-700">THÊM THÔNG TIN CỦA SÁCH</DialogTitle>
                <DialogContent>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền tên sách</Typography>
                        <TextField className="bg-white" fullWidth value={bookImport.title} onChange={(e) => onNewChange("title", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4" >
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn loại sách</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="floor-select-label" >Chọn loại sách</InputLabel>
                            <Select
                                labelId="floor-select-label"
                                value={bookImport.categoryId}
                                label="Chọn loại sách"
                                onChange={(e) => onNewChange("categoryId", e.target.value)}
                            >
                                {CategoryList.map((cates) => (

                                    <MenuItem key={cates.id} value={cates.id}>
                                        {cates.name}
                                    </MenuItem>

                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className="mb-4" >
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn số tập</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="floor-select-label" >Chọn số tập</InputLabel>
                            <Select
                                labelId="floor-select-label"
                                value={bookImport.bookChapterId}
                                label="Chọn số tập"
                                onChange={(e) => onNewChange("bookChapterId", e.target.value)}
                            >
                                {BookChapterList.map((chaps) => (

                                    <MenuItem key={chaps.id} value={chaps.id}>
                                        {chaps.titleChapter}
                                    </MenuItem>

                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className="mb-4" >
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn nhà xuất bản</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="floor-select-label" >Chọn nhà xuất bản</InputLabel>
                            <Select
                                labelId="floor-select-label"
                                value={bookImport.publisherId}
                                label="Chọn số tập"
                                onChange={(e) => onNewChange("publisherId", e.target.value)}
                            >
                                {PublisherList.map((pubs) => (

                                    <MenuItem key={pubs.id} value={pubs.id}>
                                        {pubs.publisherName}
                                    </MenuItem>

                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className="mb-4" >
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn tác giả</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="floor-select-label" >Chọn tác giả</InputLabel>
                            <Select
                                labelId="floor-select-label"
                                value={bookImport.bookAuthorId}
                                label="Chọn tác giả"
                                onChange={(e) => onNewChange("bookAuthorId", e.target.value)}
                            >
                                {AuthorList.map((aus) => (

                                    <MenuItem key={aus.id} value={aus.id}>
                                        {aus.name}
                                    </MenuItem>

                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền năm sản xuất</Typography>
                        <TextField className="bg-white" fullWidth value={bookImport.yearPublished} onChange={(e) => onNewChange("yearPublished", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền tổng lượng sách</Typography>
                        <TextField className="bg-white" fullWidth value={bookImport.quantity} onChange={(e) => onNewChange("quantity", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền giá tiền mỗi cuốn</Typography>
                        <TextField className="bg-white" fullWidth value={bookImport.unitPrice} onChange={(e) => onNewChange("unitPrice", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Tổng giá tiền</Typography>
                        <TextField className="bg-white" fullWidth value={bookImport.unitPrice} ></TextField>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                        <Button color="primary" onClick={handleBtnAdd}>Lưu</Button>
                        <Button color='error' onClick={onCloseDialog}>Hủy</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}