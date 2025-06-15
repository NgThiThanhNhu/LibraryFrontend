import type { BookImportTransactionType } from "../../types/BookImportTransactionType";

export interface BookImportTransactionResponse {

    id: string,
    bookId: string,
    bookTitle: string,
    quantity: number | null,
    unitPrice: number | null,
    totalPrice: number | null,
    transactionType: BookImportTransactionType,
    createdDate: Date | null
}