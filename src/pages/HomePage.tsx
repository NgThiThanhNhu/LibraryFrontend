import React, { useEffect, useState } from "react";
import BookCard from "../layout/BookCard";
import { BookImportWarehouseApi } from "../apis";
import MainLayoutGuest from "../layout/mainLayout/MainLayoutGuest";
import type { BookImportResponse } from "../response/Warehouse/BookImportResponse";
const HomePage: React.FC = () => {
    const [books, setBooks] = useState<BookImportResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
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
        <MainLayoutGuest>
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
        </MainLayoutGuest >
    );
};

export default HomePage;
