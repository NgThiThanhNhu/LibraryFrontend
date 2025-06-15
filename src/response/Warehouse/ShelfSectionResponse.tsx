export interface ShelfSectionResponse {
    id: string,
    sectionName: string,
    capacity: number | null,
    shelfId: string,
    shelfName: string,
    isFull: boolean,
    currentBookItem: number | null

}