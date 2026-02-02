import { Prisma } from "@prisma/client";

export function decimalToNumber(
  value: Prisma.Decimal | number | null | undefined,
) {
  if (value instanceof Prisma.Decimal) {
    return Number(value.toString());
  }
  return value ?? 0;
}

/**
 * Normalize CUSTOM date ranges inferred by the LLM
 * - Fix wrong year inference
 * - Ensure start <= end
 */
export function normalizeCustomDates(start: Date, end: Date) {
  const now = new Date();
  const currentYear = now.getFullYear();

  // If model inferred a year too far in the past, fix it
  if (start.getFullYear() < currentYear - 1) {
    start.setFullYear(currentYear);
    end.setFullYear(currentYear);
  }

  return { start, end };
}
