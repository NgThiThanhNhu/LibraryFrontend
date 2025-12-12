export interface UserReadingSessionResponse {
    id: string;
    userId: string;
    bookId: string;
    startTime: string;
    endTime?: string;
    durationSeconds: number;
    lastPageNumber: number;
    totalPages: number;
    readingProgress: number;
    isCompleted: boolean;
}