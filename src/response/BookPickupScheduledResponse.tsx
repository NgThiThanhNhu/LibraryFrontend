export interface BookPickupScheduledResponse {
    id: string,
    borrowingId: string,
    scheduledPickupDate: Date | null,
    expiredPickupDate: Date | null,
    isPickedUp: boolean | null,
    librarianName: string,
    userName: string,
    isScheduled: boolean
}

