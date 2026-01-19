import { ErrorCode } from "../constants/error-codes";

export function mapDomainError(error: unknown) {
  if (!(error instanceof Error))
    return { success: false, error: "Something went wrong" };

  switch (error.message as ErrorCode) {
    // Auth errors
    case ErrorCode.UNAUTHORIZED:
      return {
        success: false,
        error: "You must be logged in to perform this action",
      };
    case ErrorCode.USER_NOT_FOUND:
      return { success: false, error: "User not found" };

    // validation
    case ErrorCode.INVALID_FORM_DATA:
      return { success: false, error: "Invalid form data" };

    // Transactions
    case ErrorCode.INSUFFICIENT_BALANCE:
      return { success: false, error: "Insufficient balance" };
    case ErrorCode.TRANSACTION_CREATION_FAILED:
      return { success: false, error: "Failed to create transaction" };
    case ErrorCode.PRO_FEATURE_REQUIRED:
      return {
        success: false,
        error: "Upgrade to Pro to use recurring transactions",
      };

    // Accounts
    case ErrorCode.ACCOUNT_NOT_FOUND:
      return { success: false, error: "Account not found" };
    case ErrorCode.LAST_DEFAULT_ACCOUNT:
      return {
        success: false,
        error: "You cannot delete your last default account",
      };
    case ErrorCode.ACCOUNT_ALREADY_DEFAULT:
      return {
        success: false,
        error: "This account is already set as default",
      };
    case ErrorCode.INVALID_BALANCE:
      return { success: false, error: "Invalid account balance" };
    case ErrorCode.ACCOUNT_CREATION_FAILED:
      return { success: false, error: "Failed to create account" };
    case ErrorCode.ACCOUNT_UPDATE_FAILED:
      return { success: false, error: "Failed to update account" };
    case ErrorCode.ACCOUNT_DELETE_FAILED:
      return { success: false, error: "Failed to delete account" };

    // Budget
    case ErrorCode.BUDGET_NOT_FOUND:
      return { success: false, error: "Budget not found" };

    // Rate limiting
    case ErrorCode.RATE_LIMITED:
      return { success: false, error: "Rate limit exceeded" };
    default:
      throw error; // unknown errors → 500
  }
}
