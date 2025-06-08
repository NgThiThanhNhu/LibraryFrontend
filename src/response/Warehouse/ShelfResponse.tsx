export interface ShelfResponse {
    id: string,
    shelfName: string,
    numberOfSections: number | null,
    bookshelfId: string,
    bookshelfName: string,
    currentSection: number | null,
    isFull: boolean

}