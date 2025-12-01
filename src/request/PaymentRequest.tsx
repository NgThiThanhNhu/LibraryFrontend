import type { PaymentType } from "../types/PaymentType";

export interface RequestPayment {
    borrowAmount: number,
    paymentType: PaymentType | null,
    vnpText: string,
    borrowingId: string
}