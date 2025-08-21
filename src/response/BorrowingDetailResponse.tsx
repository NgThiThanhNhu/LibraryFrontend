export interface BorrowingDetailResponse {
    borrowingCode: string,
    bookItemTitle: string,
    urlImage: string,
    authorBookItem: string,
    categoryName: string,
    quantityStorage: number,
    returnedDate: Date,
    isScheduled: boolean
}