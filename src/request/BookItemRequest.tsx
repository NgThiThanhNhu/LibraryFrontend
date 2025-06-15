import type { BookStatusType } from "../types/BookStatusType";

export interface BookItemRequest {
    bookStatus: BookStatusType,
    bookId: string

}