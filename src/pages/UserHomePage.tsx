// pages/HomePage.tsx
import React, { useEffect, useState } from "react";
import BookCard from "../layout/BookCard";
import { BookImportWarehouseApi } from "../apis";
import MainLayoutGuest from "../layout/mainLayout/MainLayoutGuest";

import { Link, useNavigate } from "react-router-dom";
import { Rating, Typography } from "@mui/material";
import type { BookImportResponse } from "../response/Warehouse/BookImportResponse";
import MainLayoutUser from "../layout/mainLayout/MainLayoutUser";



const UserHomePage: React.FC = () => {
    const [books, setBooks] = useState<BookImportResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [book, setBook] = useState<string>();


    const [isAvailable, setIsAvailable] = useState(true);
    const [relatedBooks, setRelatedBooks] = useState<any[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await BookImportWarehouseApi.getAllBookImport();
                setBooks(response.data);

                console.log(response.data);
            } catch (error) {
                alert("Lỗi khi tải sách: " + error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);




    return (
        <MainLayoutUser>
            <div className="max-w-screen-xl mx-auto px-4 py-6">
                {loading ? (
                    <p className="text-center text-gray-600">Đang tải sách...</p>
                ) : books.length === 0 ? (
                    <p className="text-center text-gray-600">Không có sách nào được tìm thấy.</p>
                ) : (
                    <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {books.map((book) => (

                            <BookCard key={book.id} bookInformation={book} />


                        ))}
                    </div>
                )}
            </div>


        </MainLayoutUser >
    );
};

export default UserHomePage;
