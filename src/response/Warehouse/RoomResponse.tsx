export interface RoomResponse {
    id: string,
    roomName: string,
    maxBookShelfCapity: number | null,
    floorId: string,
    floorName: string,
    currentBookShelves: number | null,
    isFull: boolean
}