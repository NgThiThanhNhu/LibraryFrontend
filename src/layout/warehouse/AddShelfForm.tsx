import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";

import type { ShelfRequest } from "../../request/Warehouse/ShelfResquest";
import type { BookShelfResponse } from "../../response/Warehouse/BookShelfResponse";


type Props = {
    dialogAdd: boolean,
    onCloseDialog: () => void,
    shelf: ShelfRequest,
    onNewChange: (field: keyof ShelfRequest, value: string) => void,
    bookShelfList: BookShelfResponse[],
    handleBtnAdd: () => void,

}

export default function AddShelfForm({ dialogAdd, onCloseDialog, shelf, onNewChange, bookShelfList, handleBtnAdd }: Props) {
    return (
        <div>
            <Dialog open={dialogAdd} onClose={onCloseDialog}>
                <DialogTitle className="text-xl font-bold text-blue-700">THÊM THÔNG TIN KHO SÁCH - KỆ SÁCH</DialogTitle>
                <DialogContent>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền tên kệ sách</Typography>
                        <TextField className="bg-white" fullWidth value={shelf.shelfName} onChange={(e) => onNewChange("shelfName", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền số ngăn của kệ sách</Typography>
                        <TextField className="bg-white" fullWidth value={shelf.numberOfSections} onChange={(e) => onNewChange("numberOfSections", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4" >
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn tủ sách</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="floor-select-label" >Chọn tủ sách</InputLabel>
                            <Select
                                labelId="floor-select-label"
                                value={shelf.bookshelfId}
                                label="Chọn tủ sách"
                                onChange={(e) => onNewChange("bookshelfId", e.target.value)}
                            >
                                <MenuItem value="" disabled>
                                    -- Chọn phòng --
                                </MenuItem>
                                {bookShelfList.map((bookShelf) => (

                                    <MenuItem key={bookShelf.id} value={bookShelf.id} disabled={bookShelf.isFull} style={{ opacity: bookShelf.isFull ? 0.5 : 1 }}>
                                        {bookShelf.bookShelfName}
                                    </MenuItem>

                                ))}
                            </Select>
                        </FormControl>
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