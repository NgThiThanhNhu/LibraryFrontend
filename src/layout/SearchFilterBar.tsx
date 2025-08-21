import React from 'react';
import { TextField, MenuItem } from '@mui/material';

interface SearchFilterBarProps {
    searchText: string;
    filterStatus: string;
    onSearchTextChange: (value: string) => void;
    onFilterStatusChange: (value: string) => void;
}

const statusOptions = ['Tất cả', 'Đã trả', 'Chưa trả', 'Trễ hạn'];

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
    searchText,
    filterStatus,
    onSearchTextChange,
    onFilterStatusChange,
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <TextField
                label="Tìm kiếm trạng thái phiếu mượn hoặc người mượn"
                variant="outlined"
                size="small"
                fullWidth
                value={searchText}
                onChange={(e) => onSearchTextChange(e.target.value)}
            />
            <TextField
                select
                label="Trạng thái"
                variant="outlined"
                size="small"
                value={filterStatus}
                onChange={(e) => onFilterStatusChange(e.target.value)}
                className="min-w-[150px]"
            >
                {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                        {status}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
};

export default SearchFilterBar;
