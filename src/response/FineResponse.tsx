import type { FineReasonType } from "../types/FineReasonType";

export interface FineResponse {
    fineReason: FineReasonType,
    daysLate: number,
    amount: number,
    fineRate: number
}