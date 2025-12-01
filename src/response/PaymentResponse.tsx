import type { PaymentType } from "../types/PaymentType";

export interface ResponsePayment {
    borrowAmount: number,
    paymentType: PaymentType,
    transactionNo: string,
    vnpText: string,
    vnpResponseCode: string,
    createDate: Date,
    paymentUrl: string,
    vnpBankCode: string
}