import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import type { RoomRequest } from "../../request/Warehouse/RoomRequest";
import type { FloorResponse } from "../../response/Warehouse/FloorResponse";


type Props = {
    dialogAdd: boolean,
    onCloseDialog: () => void,
    room: RoomRequest,
    onNewChange: (field: keyof RoomRequest, value: string) => void,
    floorList: FloorResponse[],
    handleBtnAdd: () => void,

}

export default function AddRoomForm({ dialogAdd, onCloseDialog, room, onNewChange, floorList, handleBtnAdd }: Props) {
    return (
        <div>
            <Dialog open={dialogAdd} onClose={onCloseDialog}>
                <DialogTitle className="text-xl font-bold text-blue-700">THÊM THÔNG TIN KHO SÁCH - PHÒNG</DialogTitle>
                <DialogContent>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền tên phòng</Typography>
                        <TextField className="bg-white" fullWidth value={room.roomName} onChange={(e) => onNewChange("roomName", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền sức chứa tối đa của phòng</Typography>
                        <TextField className="bg-white" fullWidth value={room.maxBookShelfCapity} onChange={(e) => onNewChange("maxBookShelfCapity", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4" >
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn tên tầng</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="floor-select-label" >Chọn tầng</InputLabel>
                            <Select
                                labelId="floor-select-label"
                                value={room.floorId}
                                label="Chọn tầng"
                                onChange={(e) => onNewChange("floorId", e.target.value)}
                            >
                                {floorList.map((floor) => (
                                    <MenuItem key={floor.id} value={floor.id}>
                                        {floor.floorName}
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