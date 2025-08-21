import React, { useState } from 'react'
import type { BookItemResponse } from '../response/BookItemResponse';
import { Box, Button } from '@mui/material';
import { BookItemApi } from '../apis';

type Props = {
    bookId: string
    onChose: (bookItem: BookItemResponse) => void
}

export default function ChooseBookItem({ bookId, onChose }: Props) {


    const onHandleClick = async () => {
        try {
            const response = await BookItemApi.ChooseBookItem(bookId);
            onChose(response.data.data)

            console.log(response)
        } catch (error) {
            alert("Lỗi không lấy được bookitemid" + error)
        }
    }
    return (
        <div>

            <Button variant="contained" color="primary" onClick={onHandleClick}>
                Thêm vào Sách của tôi

            </Button>

        </div>
    );
}
