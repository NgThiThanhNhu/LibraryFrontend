import axios from "axios";
import { axiosClient } from "./config";
import type { PublisherRequest } from "../request/publisherRequest";
import type { LoginRequest } from "../request/LoginRequest";
import type { AuthorRequest } from "../request/AuthorRequest";
import type { BookCategoryRequest } from "../request/BookCategoryRequest";
import type { BookChapterRequest } from "../request/BookChapterRequest";
import type { FloorRequest } from "../request/Warehouse/FloorRequest";
import type { RoomRequest } from "../request/Warehouse/RoomRequest";
import type { BookShelfRequest } from "../request/Warehouse/BookShelfRequest";
import type { ShelfRequest } from "../request/Warehouse/ShelfResquest";
import type { ShelfSectionRequest } from "../request/Warehouse/ShelfSectionRequest";
import type { BookImportRequest } from "../request/Warehouse/BookImportRequest";
import type { BookFileRequest } from "../request/BookFileRequest";
import type { BookItemRequest } from "../request/BookItemRequest";
import type { RegisterRequest } from "../request/RegisterRequest";
import type { ConfirmOTPRequest } from "../request/ConfirmOTPRequest";
import type { BorrowingRequest } from "../request/BorrowingRequest";
import type { ReplyBorrowingRequest } from "../request/ReplyBorrowingRequest";
import type { BookPickupScheduleRequest } from "../request/BookPickupScheduleRequest";
import type { FineRequest } from "../request/FineRequest";
import type { RequestPayment } from "../request/PaymentRequest";
import type { BookCartRequest } from "../request/BookCartRequest";
import type { UpdateBookCartItemRequest } from "../request/UpdateBookCartItemRequest";
import type { CheckoutBookCartRequest } from "../request/CheckoutBookCartRequest";

const axiosConfig = axiosClient();

export const PublisherApi = {
    addPublisher: async (data: PublisherRequest) => {
        const response = await axiosConfig.post(`/api/Publisher/AddPublisher`, data);
        return response.data;
    },
    getAllPublisher: async () => {
        const response = await axiosConfig.get(`/api/Publisher/GetAllPublisher`)
        return response.data;
    },
    updatePublisher: async (id: string, data: PublisherRequest,) => {
        const response = await axiosConfig.post(`/api/Publisher/UpdatePublisher/${id}`, data)
        return response.data;
    },
    getPublisherById: async (id: string) => {
        const response = await axiosConfig.get(`/api/Publisher/GetPublisherById/${id}`)
        return response;
    },
    deletePublisher: async (id: string) => {
        const response = await axiosConfig.post(`/api/Publisher/DeletePublisher/${id}`)
        return response;
    }
}

export const AuthorApi = {
    addAuthor: async (data: AuthorRequest) => {
        const response = await axiosConfig.post(`/api/BookAuthor/AddBookAuthor`, data)
        return response.data;
    },
    getAllAuthor: async () => {
        const response = await axiosConfig.get(`/api/BookAuthor/GetAllBookAuthor`)
        return response.data
    },
    getAuthorById: async (id: string) => {
        const response = await axiosConfig.get(`/api/BookAuthor/GetBookAuthorById/${id}`)
        return response
    },
    deleteAuthor: async (id: string) => {
        const response = await axiosConfig.post(`/api/BookAuthor/DeleteBookAuthor/${id}`)
        return response
    },
    updateAuthor: async (id: string, data: AuthorRequest) => {
        const response = await axiosConfig.post(`/api/BookAuthor/UpdateBookAuthor/${id}`, data)
        return response.data
    }
}

export const BookCategoryApi = {
    addBookCategory: async (data: BookCategoryRequest) => {
        const response = await axiosConfig.post(`/api/BookCategory/AddBookCategory`, data);
        return response.data;
    },
    getAllBookCategory: async () => {
        const response = await axiosConfig.get(`/api/BookCategory/GetAllBookCategory`)
        return response.data;
    },
    updateBookCategory: async (id: string, data: BookCategoryRequest,) => {
        const response = await axiosConfig.post(`/api/BookCategory/UpdateBookCategory/${id}`, data)
        return response.data;
    },
    getBookCategoryById: async (id: string) => {
        const response = await axiosConfig.get(`/api/BookCategory/GetBookCategoryById/${id}`)
        return response;
    },
    deleteBookCategory: async (id: string) => {
        const response = await axiosConfig.post(`/api/BookCategory/DeleteBookCategory/${id}`)
        return response;
    }
}

export const BookChapterApi = {
    addBookChapter: async (data: BookChapterRequest) => {
        const response = await axiosConfig.post(`/api/BookChapter/AddBookChapter`, data);
        return response.data;
    },
    getAllBookChapter: async () => {
        const response = await axiosConfig.get(`/api/BookChapter/GetAllBookChapter`)
        return response.data;
    },
    updateBookChapter: async (id: string, data: BookChapterRequest,) => {
        const response = await axiosConfig.post(`/api/BookChapter/UpdateBookChapter/${id}`, data)
        return response.data;
    },
    getBookChapterById: async (id: string) => {
        const response = await axiosConfig.get(`/api/BookChapter/GetBookChapterById/${id}`)
        return response;
    },
    deleteBookChapter: async (id: string) => {
        const response = await axiosConfig.post(`/api/BookChapter/DeleteBookChapter/${id}`)
        return response;
    }
}

export const FloorWarehouseApi = {
    addFloor: async (data: FloorRequest) => {
        const response = await axiosConfig.post(`/api/Floor/AddFloor`, data);
        return response.data;
    },
    getAllFloor: async () => {
        const response = await axiosConfig.get(`/api/Floor/GetAllFloor`)
        return response.data;
    },
    updateFloor: async (id: string, data: FloorRequest) => {
        const response = await axiosConfig.post(`/api/Floor/UpdateFloor/${id}`, data)
        return response.data;
    },
    getFloorById: async (id: string) => {
        const response = await axiosConfig.get(`/api/Floor/GetFloorById/${id}`)
        return response;
    },
    deleteFloor: async (id: string) => {
        const response = await axiosConfig.post(`/api/Floor/DeleteFloor/${id}`)
        return response;
    }
}

export const RoomWarehouseApi = {
    addRoom: async (data: RoomRequest) => {
        const response = await axiosConfig.post(`/api/Room/AddRoom`, data);
        return response.data;
    },
    getAllRoom: async () => {
        const response = await axiosConfig.get(`/api/Room/GetAllRoom`)
        return response.data;
    },
    updateRoom: async (id: string, data: RoomRequest) => {
        const response = await axiosConfig.post(`/api/Room/UpdateRoom/${id}`, data)
        return response.data;
    },
    getRoomById: async (id: string) => {
        const response = await axiosConfig.get(`/api/Room/GetRoomById/${id}`)
        return response;
    },
    deleteRoom: async (id: string) => {
        const response = await axiosConfig.post(`/api/Room/DeleteRoom/${id}`)
        return response;
    }
}


export const BookShelfWarehouseApi = {
    addBookShelf: async (data: BookShelfRequest) => {
        const response = await axiosConfig.post(`/api/BookShelf/AddBookShelf`, data);
        return response.data;
    },
    getAllBookShelf: async () => {
        const response = await axiosConfig.get(`/api/BookShelf/GetAllBookShelf`)
        return response.data;
    },
    updateBookShelf: async (id: string, data: BookShelfRequest) => {
        const response = await axiosConfig.post(`/api/BookItem/UpdateBookItem/${id}`, data)
        return response.data;
    },
    getBookShelfById: async (id: string) => {
        const response = await axiosConfig.get(`/api/BookItem/GetBookItemById/${id}`)
        return response;
    },
    deleteBookShelf: async (id: string) => {
        const response = await axiosConfig.post(`/api/BookItem/DeleteBookItem/${id}`)
        return response;
    }
}

export const ShelfWarehouseApi = {
    addShelf: async (data: ShelfRequest) => {
        const response = await axiosConfig.post(`/api/Shelf/AddShelf`, data);
        return response.data;
    },
    getAllShelf: async () => {
        const response = await axiosConfig.get(`/api/Shelf/GetAllShelf`)
        return response.data;
    },
    updateShelf: async (id: string, data: ShelfRequest) => {
        const response = await axiosConfig.post(`/api/Shelf/UpdateShelf/${id}`, data)
        return response.data;
    },
    getShelfById: async (id: string) => {
        const response = await axiosConfig.get(`/api/Shelf/GetShelfById/${id}`)
        return response;
    },
    deleteShelf: async (id: string) => {
        const response = await axiosConfig.post(`/api/Shelf/DeleteShelf/${id}`)
        return response;
    }
}

export const ShelfSectionWarehouseApi = {
    addShelfSection: async (data: ShelfSectionRequest) => {
        const response = await axiosConfig.post(`/api/ShelfSection/AddShelfSection`, data);
        return response.data;
    },
    getAllShelfSection: async () => {
        const response = await axiosConfig.get(`/api/ShelfSection/GetAllShelfSection`)
        return response.data;
    },
    updateShelfSection: async (id: string, data: ShelfSectionRequest) => {
        const response = await axiosConfig.post(`/api/ShelfSection/UpdateShelfSection/${id}`, data)
        return response.data;
    },
    getShelfSectionById: async (id: string) => {
        const response = await axiosConfig.get(`/api/ShelfSection/GetShelfSectionById/${id}`)
        return response;
    },
    deleteShelfSection: async (id: string) => {
        const response = await axiosConfig.post(`/api/ShelfSection/DeleteShelfSection/${id}`)
        return response;
    }
}

export const BookImportWarehouseApi = {
    addBook: async (data: BookImportRequest) => {
        const response = await axiosConfig.post(`/api/Book/AddBook`, data);
        return response.data;
    },
    getAllBookImport: async () => {
        const response = await axiosConfig.get(`/api/Book/GetAllBook`)
        return response.data;
    },
    updateBookImport: async (id: string, data: BookImportRequest) => {
        const response = await axiosConfig.post(`/api/Book/UpdateBook/${id}`, data)
        return response.data;
    },
    getBookImportBySlug: async (slug: string) => {
        const response = await axiosConfig.get(`/api/Book/GetBookBySlug/${slug}`)
        return response;
    },
    deleteBookImport: async (id: string) => {
        const response = await axiosConfig.post(`/api/Book/DeleteBook/${id}`)
        return response;
    }
}

export const BookFileApi = {
    uploadBookFile: async (data: BookFileRequest) => {
        const formData = new FormData();
        formData.append("BookId", data.BookId);
        if (data.UploadFile) {
            formData.append("UploadFile", data.UploadFile);
        }
        if (data.Image) {
            formData.append("Image", data.Image);
        }
        formData.append("BookFileType", data.BookFileType.toString());

        const response = await axiosConfig.post(`/api/BookFile/UploadFileAndImage`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }
}

export const BookImportTransactionWarehouseApi = {
    getAllBookImportTransaction: async () => {
        const response = await axiosConfig.get(`/api/BookImportTransaction/GetAllBookImportTransaction`)
        return response.data;
    },
    getBookImportTransactionbyId: async (BookId: string) => {
        const response = await axiosConfig.get(`/api/BookImportTransaction/GetBookImportTransactionById/${BookId}`)
        return response
    }
}

/*export const BookItemApi = {
    ChooseBookItem: async (bookId: string) => {
        const response = await axiosConfig.get(`/api/BookItem/ChooseBookItemByBookId/${bookId}`)
        return response
    }
}*/

export const BookCartApi = {
    createCart: async (data: BookCartRequest) => {
        const response = await axiosConfig.post(`/api/BookCart/createCart`, data);
        return response.data;
    },
    getBookCart: async () => {
        const response = await axiosConfig.get(`/api/BookCart/GetBookCartActive`);
        return response.data;
    },
    checkoutBookCartItem: async (data: CheckoutBookCartRequest) => {
        const response = await axiosConfig.post(`/api/BookCart/checkout`, data);
        return response.data;
    }
}

export const BookCartItemApi = {
    updateQuantity: async (bookCartItemId: string, data: UpdateBookCartItemRequest) => {
        const response = await axiosConfig.put(`/api/BookCartItem/${bookCartItemId}/quantity`, data);
        return response.data
    },
    removeItem: async (bookCartItemId: string) => {
        const response = await axiosConfig.delete(`/api/BookCartItem/bookCartItem/${bookCartItemId}`);
        return response.data;
    },
    clearAllBookCartItem: async (bookCartId: string) => {
        const response = await axiosConfig.delete(`/api/BookCartItem/clear/${bookCartId}`);
        return response.data;
    }
}

export const Borrowing = {
    createBorrowing: async (data: BorrowingRequest) => {
        const response = await axiosConfig.post(`/api/Borrowing/createBorrowing`, data)
        return response.data
    },
    getAllUserBorrowing: async () => {
        const response = await axiosConfig.get(`/api/Borrowing/getAllUserBorrowing`)
        return response.data
    },
    getAllBorrowing: async () => {
        const response = await axiosConfig.get(`/api/Borrowing/getAllBorrowing`)
        return response.data
    },
    updateBorrowingStatus: async (id: string, status: ReplyBorrowingRequest) => {
        const response = await axiosConfig.post(`/api/Borrowing/updateBorrowing/${id}`, status)
        return response.data
    }
}

export const NotificationToUser = {
    getAllNotifications: async () => {
        const response = await axiosConfig.get(`/api/NotificationToUser/getAllNotifications`)
        return response.data
    },
    readNotification: async (NotificationId: string) => {
        const response = await axiosConfig.post(`/api/NotificationToUser/readnotification/${NotificationId}`)
        return response
    }
}

export const BorrowingDetail = {
    getBorrowingDetailsForUser: async (borrowingId: string) => {
        const response = await axiosConfig.get(`/api/BorrowingDetail/borrowings/${borrowingId}/details/user`)
        return response
    },
    getBorrowingDetailForFine: async (borrowingId: string) => {
        const response = await axiosConfig.get(`/api/BorrowingDetail/borrowings/${borrowingId}/details/fine`)
        return response
    }
}

export const BookPickupSchedule = {
    createSchedule: async (data: BookPickupScheduleRequest) => {
        const response = await axiosConfig.post(`/api/BookPickupSchedule/createSchedule`, data)
        return response.data
    },
    getScheduleByBorrowingId: async (borrowingId: string) => {
        const response = await axiosConfig.get(`/api/BookPickupSchedule/getScheduledByBorrowingId/${borrowingId}`)
        return response
    },
    deleteScheduled: async (borrowingId: string) => {
        const response = await axiosConfig.post(`/api/BookPickupSchedule/deleteScheduled/${borrowingId}`)
        return response.data
    }
}

export const FineApi = {
    createFine: async (borrowingDetailId: string, data: FineRequest[]) => {
        const response = await axiosConfig.post(`/api/Fine/createFine?borrowingDetailId=${borrowingDetailId}`, data)
        return response.data
    }
}

export const PaymentApi = {
    createPayment: async (data: RequestPayment) => {
        const response = await axiosConfig.post(`/api/Payment/create-vnpayment`, data);
        return response.data;
    },
    paymentReturn: async (params: any) => {
        const response = await axiosConfig.get(`/api/Payment/ReturnUrl`, { params });
        return response;
    },
    createCashPayment: async (data: RequestPayment) => {
        const response = await axiosConfig.post(`/api/Payment/create-cashpayment`, data);
        return response.data;
    }
}

export const Authetication = {
    login: async (data: LoginRequest) => {
        const response = await axiosConfig.post(`/api/Authentication/Login`, data);
        return response.data;
    },
    register: async (data: RegisterRequest) => {
        const response = await axiosConfig.post(`/api/Authentication/Register`, data)
        return response.data
    },
    confirmOTP: async (data: ConfirmOTPRequest) => {
        const response = await axiosConfig.post(`/api/Authentication/ConfirmOtp`, data)
        return response.data
    },
    logout: async () => {
        const response = await axiosConfig.post(`/api/Authentication/Logout`)
        return response.data
    }
}

export const AutheticationInfo = {
    getInfo: async () => {
        const response = await axiosConfig.get(`/api/AuthenticationInfo/authenticationInfor`);
        return response;
    }
}
