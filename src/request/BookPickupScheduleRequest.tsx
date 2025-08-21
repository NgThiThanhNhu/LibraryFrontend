export interface BookPickupScheduleRequest {
    borrowingId: string,
    scheduledPickupDate: Date | null,
    expiredPickupDate: Date | null
}