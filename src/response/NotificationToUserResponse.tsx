export interface NotificationToUserResponse {
    notiId: string,
    borrowingId: string,
    title: string,
    message: string,
    userId: string,
    borrowingCode: string,
    sendTime: Date,
    isRead: boolean
}