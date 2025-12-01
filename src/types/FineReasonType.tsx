export const FineReasonType = {
    LateReturn: 0,
    LostBook: 1,
    DamagedBook: 2,
} as const;

export type FineReasonType = (typeof FineReasonType)[keyof typeof FineReasonType];

export const FineReasonLabel: Record<FineReasonType, string> = {
    [FineReasonType.LateReturn]: "Trả muộn",
    [FineReasonType.LostBook]: "Mất sách",
    [FineReasonType.DamagedBook]: "Hư sách",
};