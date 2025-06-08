export interface BookImportResponse {
    id: string,
    title: string,
    categoryId: string,
    bookChapterId: string,
    publisherId: string,
    bookAuthorId: string,
    authorName: string,
    publisherName: string,
    yearPublished: number | null,
    quantity: number | null,
    totalPrice: number | null,
    unitPrice: number | null,
    categoryName: string,
    titleBookChapter: string
}