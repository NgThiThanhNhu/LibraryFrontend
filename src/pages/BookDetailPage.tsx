import { useEffect, useState } from "react"
import type { BookImportResponse } from "../response/Warehouse/BookImportResponse"
import { BookImportWarehouseApi } from "../apis"
import MainLayoutUser from "../layout/mainLayout/MainLayoutUser"
import { Box, Button, Card, CardContent, CardMedia, Chip, Container, Typography } from "@mui/material"
import BookCard from "../layout/BookCard"
import { useParams } from "react-router-dom"
import ChooseBookItem from "../layout/ChooseBookItem"
import type { BookItemResponse } from "../response/BookItemResponse"


export const BookDetailPage = () => {
    const initialBookDetail: BookImportResponse = {
        id: " ",
        title: " ",
        categoryId: " ",
        bookChapterId: " ",
        publisherId: " ",
        bookAuthorId: " ",
        authorName: " ",
        publisherName: " ",
        yearPublished: null,
        quantity: null,
        totalPrice: null,
        unitPrice: null,
        categoryName: " ",
        titleBookChapter: " ",
        description: " ",
        slug: " ",
        bookFileId: [],
        imageUrls: [],
        fileUrls: []
    }
    const { slug } = useParams();
    const [bookDetail, setBookDetail] = useState<BookImportResponse>(() => initialBookDetail)
    const [bookitem, setBookItem] = useState<BookItemResponse>()
    const [fileUrl, setFileUrl] = useState<string[]>([])
    const onHandleReadOnline = (bookDetail: BookImportResponse) => {
        if (!bookDetail.fileUrls || bookDetail.fileUrls.length === 0) {
            alert("Sách này chưa có file đọc online!");
            return;
        }
        window.open(bookDetail.fileUrls[0], "_blank");
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await BookImportWarehouseApi.getBookImportBySlug(slug!);
            console.log(response)
            if (!response.data.isSuccess) {
                alert('không kết nối slug được')
            }
            setBookDetail(response.data.data)
        }
        fetchData();
    }, [slug])
    return (
        <MainLayoutUser>
            <Container className="py-10">
                <Box className="bg-white shadow-xl rounded-2xl p-6 md:p-10 space-y-6">

                    <Box className="flex flex-col-2 md:flex-row gap-8">

                        <Card className="w-full md:max-w-xs shadow-md rounded-xl">
                            <CardMedia
                                component="img"
                                image={bookDetail?.imageUrls?.[0] || "/default-book.jpg"}
                                alt={bookDetail?.title}
                                className="rounded-xl object-cover"
                            />
                        </Card>


                        <Box className="flex-1 space-y-4">
                            <Typography variant="h4" fontWeight="bold">
                                {bookDetail?.title}
                            </Typography>

                            <Typography variant="subtitle1" color="text.secondary">
                                Tác giả: {bookDetail?.authorName}
                            </Typography>

                            <Typography variant="subtitle1" color="text.secondary">
                                Thể loại: {bookDetail?.categoryName}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">
                                Số lượng còn lại:{" "}
                                <span className="text-green-600 font-semibold">
                                    {bookDetail?.quantity || 0}
                                </span>
                            </Typography>

                            <Box className="pt-4 flex gap-4 flex-wrap">
                                <ChooseBookItem bookId={bookDetail.id} onChose={(bookItem) => setBookItem(bookItem)} />
                                <Button variant="outlined" color="secondary" onClick={() => onHandleReadOnline(bookDetail)}>
                                    Đọc online
                                </Button>
                            </Box>
                        </Box>
                    </Box>


                    <Box>
                        <Typography variant="h6" fontWeight="bold" className="mb-2">
                            Mô tả sách
                        </Typography>
                        <Typography
                            variant="body1"
                            className="text-justify whitespace-pre-line text-gray-700"
                        >
                            {bookDetail?.description || "Không có mô tả cho cuốn sách này."}
                        </Typography>
                    </Box>
                </Box>
            </Container>

            {/* Sách gợi ý (để dành sau cho hệ thống recommendation) */}
            <Container className="py-10">
                <Typography variant="h5" fontWeight="bold" className="mb-4">
                    Có thể bạn cũng thích
                </Typography>
                <Box className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Gợi ý sách - bạn sẽ map list từ AI sau */}
                    {[1, 2, 3, 4].map((_, idx) => (
                        <Card key={idx} className="shadow-md hover:shadow-lg transition rounded-xl">
                            <CardMedia
                                component="img"
                                image="/default-book.jpg"
                                alt={`Sách đề xuất ${idx + 1}`}
                                className="rounded-t-xl h-48 object-cover"
                            />
                            <CardContent>
                                <Typography variant="body1" fontWeight="medium">
                                    Tên sách đề xuất
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </MainLayoutUser>

    )
}
