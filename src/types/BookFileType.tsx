export const BookFileType = {
    PDF: 0,
    DOCX: 1,
    image: 2,
    All: 3,
    None: 4
} as const;

export type BookFileType = (typeof BookFileType)[keyof typeof BookFileType];
