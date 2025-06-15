export const BookImportTransactionType = {
    Import: 0,      // Nhập sách mới
    Export: 1,      // Xuất sách (giao cho mượn)
    ReturnToStock: 2, // Trả sách về kho
    Remove: 3 // Loại bỏ sách khỏi kho (sách hư, mất, không còn lưu hành)
} as const;

export type BookImportTransactionType = (typeof BookImportTransactionType)[keyof typeof BookImportTransactionType];

export const TransactionTypeName: Record<BookImportTransactionType, string> = {
    [BookImportTransactionType.Import]: "Nhập sách",
    [BookImportTransactionType.Export]: "Xuất sách",
    [BookImportTransactionType.ReturnToStock]: "Trả sách",
    [BookImportTransactionType.Remove]: "Xóa sách"
};