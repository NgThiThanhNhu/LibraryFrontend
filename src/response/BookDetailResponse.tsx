export interface BookDetailResponse {
    bookId: string,
    title: string,
    authorName: string,
    quantity: number | null,
    totalPrice: number | null,
    unitPrice: number | null,
    categoryName: string,
    titleBookChapter: string,
    description: string,
    imageUrl: string[],
    fileUrl: string[]
}

