export const FEATURES = {
  RECURRING_TRANSACTIONS: "recurring_transactions",
  AI_RECEIPT_SCAN: "ai_receipt_scan",
  BULK_IMPORT: "bulk_import",
} as const;

export type FeatureKey = (typeof FEATURES)[keyof typeof FEATURES];
