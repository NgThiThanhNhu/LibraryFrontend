export const PaymentType = {
    Cash: 1,
    VNPay: 2,
    Momo: 3,
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export const PaymentLabel: Record<PaymentType, string> = {
    [PaymentType.Cash]: "Tiền mặt",
    [PaymentType.VNPay]: "VnPay",
    [PaymentType.Momo]: "Momo",
};