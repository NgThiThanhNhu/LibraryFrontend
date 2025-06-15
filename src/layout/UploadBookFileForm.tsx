import { useState } from "react";
import type { BookFileRequest } from "../request/BookFileRequest";
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import type { BookFileType } from "../types/BookFileType";



type Props = {
    dialogAdd: boolean,
    onCloseDialog: () => void,
    dataUploadFile: BookFileRequest,
    onChange: (field: keyof BookFileRequest, value: string | number | File | null) => void,
    handleSubmit: () => void,

};



export default function UploadBookFileForm({ dialogAdd, onCloseDialog, onChange, dataUploadFile, handleSubmit }: Props) {






    return (
        <Dialog open={dialogAdd} onClose={onCloseDialog}>
            <DialogTitle>Tải file sách lên</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Book ID"
                        value={dataUploadFile.BookId}
                        onChange={(e) => onChange("BookId", e.target.value)}
                        fullWidth
                    />

                    <FormControl fullWidth>
                        <InputLabel>Loại File</InputLabel>
                        <Select
                            value={dataUploadFile.BookFileType}
                            onChange={(e) => onChange("BookFileType", Number(e.target.value))}
                        >
                            <MenuItem value={0}>PDF</MenuItem>
                            <MenuItem value={1}>DOCX</MenuItem>
                            <MenuItem value={2}>Image</MenuItem>
                            <MenuItem value={3}>All</MenuItem>
                            <MenuItem value={4}>None</MenuItem>
                        </Select>
                    </FormControl>

                    <InputLabel>File chính</InputLabel>
                    <input
                        type="file"
                        onChange={(e) => onChange("UploadFile", e.target.files?.[0] || null)}
                    />

                    <InputLabel>Ảnh bìa</InputLabel>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange("Image", e.target.files?.[0] || null)}
                    />

                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Tải lên
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
