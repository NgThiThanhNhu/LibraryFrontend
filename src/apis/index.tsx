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

export const Authetication = {
    login: async (data: LoginRequest) => {
        const response = await axiosConfig.post(`/api/Authentication/Login`, data);
        return response.data;
    }
}

