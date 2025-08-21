export interface BookImportRequest {
    title: string,
    publisherId: string,
    bookAuthorId: string,
    yearPublished: number | null,
    quantity: number | null,
    unitPrice: number | null,
    categoryId: string,
    bookChapterId: string,
    description: string
}