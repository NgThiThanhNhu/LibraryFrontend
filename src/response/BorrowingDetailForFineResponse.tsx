
import type { FineResponse } from "./FineResponse";

export interface BorrowingDetailForFineResponse {
    borrowingDetailId: string,
    bookTitle: string,
    unitPrice: number,
    fineResponses: FineResponse[],
    returnedDate: Date,
    isFined: boolean
}