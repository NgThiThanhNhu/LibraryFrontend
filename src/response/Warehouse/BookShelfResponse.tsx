export interface BookShelfResponse {
    id: string,
    bookShelfName: string,
    numberOfShelves: number | null,
    roomId: string,
    roomName: string,
    isFull: boolean,
    currentShelves: number | null
}