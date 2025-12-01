export const BookCartStatus = {
    Active: 1,
    Saved: 2,
    Expired: 3,
    CheckedOut: 4,
    Cancelled: 5
} as const;

export type BookCartStatus = (typeof BookCartStatus)[keyof typeof BookCartStatus];

export const BookCartStatusLabel: Record<BookCartStatus, string> = {
    [BookCartStatus.Active]: "Hoạt động",
    [BookCartStatus.Saved]: "Đã lưu",
    [BookCartStatus.Expired]: "Hết hạn",
    [BookCartStatus.CheckedOut]: "Đã mượn",
    [BookCartStatus.Cancelled]: "Đã xóa",
};