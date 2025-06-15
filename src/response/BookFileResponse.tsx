import type { BookFileType } from "../types/BookFileType";


export interface BookFileResponse {
    id: string,
    bookId: string,
    bookName: string,
    fileUrl: string,
    imageUrl: string,
    publicIdImage: string,
    publicIdFile: string,
    type: BookFileType

}