import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import type { BookShelfRequest } from "../../request/Warehouse/BookShelfRequest";
import type { RoomResponse } from "../../response/Warehouse/RoomResponse";


type Props = {
    dialogAdd: boolean,
    onCloseDialog: () => void,
    bookShelf: BookShelfRequest,
    onNewChange: (field: keyof BookShelfRequest, value: string) => void,
    roomList: RoomResponse[],
    handleBtnAdd: () => void,

}

export default function AddBookShelfForm({ dialogAdd, onCloseDialog, bookShelf, onNewChange, roomList, handleBtnAdd }: Props) {
    return (
        <div>
            <Dialog open={dialogAdd} onClose={onCloseDialog}>
                <DialogTitle className="text-xl font-bold text-blue-700">THÊM THÔNG TIN KHO SÁCH - TỦ SÁCH</DialogTitle>
                <DialogContent>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền tên tủ sách</Typography>
                        <TextField className="bg-white" fullWidth value={bookShelf.bookShelfName} onChange={(e) => onNewChange("bookShelfName", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền số kệ của tủ</Typography>
                        <TextField className="bg-white" fullWidth value={bookShelf.numberOfShelves} onChange={(e) => onNewChange("numberOfShelves", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4" >
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn tên phòng</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="floor-select-label" >Chọn phòng</InputLabel>
                            <Select
                                labelId="floor-select-label"
                                value={bookShelf.roomId}
                                label="Chọn tầng"
                                onChange={(e) => onNewChange("roomId", e.target.value)}
                            >
                                {roomList.map((room) => (
                                    <Tooltip key={room.id}
                                        title={room.isFull ? "Phòng đã đầy" : ""}
                                        arrow
                                        placement="right">
                                        <span>
                                            <MenuItem key={room.id} value={room.id} disabled={room.isFull} style={{ opacity: room.isFull ? 0.5 : 1 }}>
                                                {room.roomName}
                                            </MenuItem>
                                        </span>
                                    </Tooltip>
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