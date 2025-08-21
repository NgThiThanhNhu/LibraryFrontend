import React from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Paper,
} from '@mui/material';

interface Props {
    users: any[];
    onEdit: (user: any) => void;
    onViewDetail: (user: any) => void;
    onDelete: (user: any) => void;
}

export default function UserManageTable({ users, onEdit, onViewDetail, onDelete }: Props) {
    return (
        <Paper className="overflow-x-auto">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tên</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Vai trò</TableCell>
                        <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell align="right">
                                <div className="flex justify-end gap-2">
                                    <Button size="small" variant="outlined" onClick={() => onViewDetail(user)}>
                                        Chi tiết
                                    </Button>
                                    <Button size="small" variant="outlined" color="primary" onClick={() => onEdit(user)}>
                                        Sửa
                                    </Button>
                                    <Button size="small" variant="outlined" color="error" onClick={() => onDelete(user)}>
                                        Xóa
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
