export const BookStatusType = {
    Available: 0, //có sẵn
    Borrowed: 1, //đã mượn
    Reserved: 2 //đã được đặt trước
} as const;

export type BookStatusType = (typeof BookStatusType)[keyof typeof BookStatusType];
