import { hasFeature } from "./has-feature";
import { FEATURES } from "./features";
import { ErrorCode } from "../errors/error-codes";

export async function requireRecurringTransactions() {
  const allowed = await hasFeature(FEATURES.RECURRING_TRANSACTIONS);

  if (!allowed) {
    throw new Error(ErrorCode.PRO_FEATURE_REQUIRED);
  }
}
