export interface BookItemResponse {
    id: string,
    barCode: string,
    title: string,
    authorName: string,
    publisherName: string,
    yearPublished: 0,
    unitPrice: number | null,
    bookStatus: number | null,
    categoryName: string,
    titleBookChapter: string,
    shelfSectionName: string,
    imageUrl: string[]
}