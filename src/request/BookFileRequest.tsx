import type { BookFileType } from "../types/BookFileType"

export interface BookFileRequest {
    BookId: string,
    UploadFile: File | null,
    Image: File | null,
    BookFileType: BookFileType

}