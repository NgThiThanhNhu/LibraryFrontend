export interface BookPickupScheduledResponse {
    id: string,
    borrowingId: string,
    scheduledPickupDate: Date,
    expiredPickupDate: Date,
    isPickedUp: boolean,
    librarianName: string,
    userName: string,
    isScheduled: boolean
}

