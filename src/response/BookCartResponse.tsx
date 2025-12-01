import type { BookCartStatus } from "../types/BookCartStatus"
import type { BookCartItemResponse } from "./BookCartItemResponse"

export interface BookCartResponse {
    bookCartId: string,
    userId: string,
    createAt: Date,
    totalBooks: number,
    totalQuantity: number,
    remainingSlots: number,
    canAddMore: boolean,
    expiredDate: Date,
    cartStatus: BookCartStatus,
    updateAt: Date,
    bookCartItemResponses: BookCartItemResponse[]
}