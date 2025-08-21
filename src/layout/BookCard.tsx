// layout/BookCard.tsx
import React, { useState } from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import type { BookImportResponse } from "../response/Warehouse/BookImportResponse";

interface BookCardProps {
    bookInformation: BookImportResponse;


}

const BookCard: React.FC<BookCardProps> = ({ bookInformation }) => {

    const navigate = useNavigate();



    const handleClick = async () => {

        navigate(`/user/books/${bookInformation.slug}`)


    };


    return (
        <div className="h-full">
            <Card
                className="h-full flex flex-col justify-between shadow-sm hover:shadow-md transition duration-200 rounded-xl overflow-hidden cursor-pointer"
                onClick={handleClick}
            >
                <CardMedia
                    component="img"
                    height="160"
                    image={(bookInformation.imageUrls?.[0] || "https://via.placeholder.com/160x220?text=No+Image")}
                    alt={bookInformation.title}
                    className="object-cover"
                />

                <CardContent className="p-3 flex flex-col gap-1">
                    <Typography variant="h6" className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">
                        {bookInformation.title}
                    </Typography>
                    <Typography variant="body2" className="text-xs text-gray-600 truncate">
                        {bookInformation.authorName}
                    </Typography>
                    <Typography variant="caption" className="text-xs text-blue-500">
                        {bookInformation.categoryName}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default BookCard;
