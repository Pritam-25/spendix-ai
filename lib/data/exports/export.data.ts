import { exportToCSV } from "./export.csv";

export type ExportFormat = "csv" | "excel" | "pdf";

export async function exportTransactions(
  format: ExportFormat,
  data: any[],
  accountId?: string,
) {
  switch (format) {
    case "csv":
      return await exportToCSV(data, accountId);
    case "excel":
    // return await exportToExcel(userId, data);
    case "pdf":
    // return await exportToPDF(userId, data);
    default:
      throw new Error("Unsupported export format");
  }
}
