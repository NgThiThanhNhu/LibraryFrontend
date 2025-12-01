export interface BookCartItemResponse {
    bookCartItemId: string;
    bookId: string;
    bookTitle: string;
    author: string;
    publisher: string;
    imageUrl: string;
    createAt: Date;
    requestedQuantity: number;    // Số lượng muốn mượn
    availableQuantity: number;    // Số quyển còn available
    canIncrease: boolean;
    canDecrease: boolean;
    statusText: string;
}