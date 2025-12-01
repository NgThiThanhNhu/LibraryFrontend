import type { FineReasonType } from "../types/FineReasonType";

export interface FineRequest {
    fineReason: FineReasonType,
    fineRate: number
}