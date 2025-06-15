import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import type { ShelfSectionRequest } from "../../request/Warehouse/ShelfSectionRequest";
import type { ShelfResponse } from "../../response/Warehouse/ShelfResponse";


type Props = {
    dialogAdd: boolean,
    onCloseDialog: () => void,
    shelfSection: ShelfSectionRequest,
    onNewChange: (field: keyof ShelfSectionRequest, value: string) => void,
    ShelfList: ShelfResponse[],
    handleBtnAdd: () => void,

}

export default function AddShelfSectionForm({ dialogAdd, onCloseDialog, shelfSection, onNewChange, ShelfList, handleBtnAdd }: Props) {
    return (
        <div>
            <Dialog open={dialogAdd} onClose={onCloseDialog}>
                <DialogTitle className="text-xl font-bold text-blue-700">THÊM THÔNG TIN KHO SÁCH - Ô SÁCH</DialogTitle>
                <DialogContent>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền tên ô sách</Typography>
                        <TextField className="bg-white" fullWidth value={shelfSection.sectionName} onChange={(e) => onNewChange("sectionName", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4">
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Điền số sức chứa của ô</Typography>
                        <TextField className="bg-white" fullWidth value={shelfSection.capacity} onChange={(e) => onNewChange("capacity", e.target.value)}></TextField>
                    </Box>
                    <Box className="mb-4" >
                        <Typography className="text-sm font-medium text-gray-700 mb-1">Chọn kệ sách</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="floor-select-label" >Chọn kệ sách</InputLabel>
                            <Select
                                labelId="floor-select-label"
                                value={shelfSection.shelfId}
                                label="Chọn tủ sách"
                                onChange={(e) => onNewChange("shelfId", e.target.value)}
                            >
                                {ShelfList.map((Shelf) => (

                                    <MenuItem key={Shelf.id} value={Shelf.id} disabled={Shelf.isFull} style={{ opacity: Shelf.isFull ? 0.5 : 1 }}>
                                        {Shelf.shelfName}
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