"use server";

import { Prisma } from "@prisma/client";
import { requireUser } from "@/lib/dal/auth";
import { accountSchema } from "@/lib/schemas/account.schema";
import { revalidatePath } from "next/cache";
import { ErrorCode } from "@/lib/errors/error-codes";
import {
  createAccountService,
  deleteAccountService,
  updateDefaultAccountService,
} from "@/lib/services/account.service";
import { mapDomainError } from "@/lib/errors/mapDomainError";

type ResponseResult =
  | { success: true; message: string; accountId?: string }
  | { success: false; error: string };

// Action to create a new account
export async function createAccount(data: unknown): Promise<ResponseResult> {
  // SERVER-SIDE validation (MANDATORY)
  const parsed = accountSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(ErrorCode.INVALID_FORM_DATA);
  }

  try {
    const user = await requireUser();
    const { name, type, balance, isDefault } = parsed.data;

    const balanceDecimal = new Prisma.Decimal(balance);

    // call service to create account
    const account = await createAccountService({
      userId: user.id,
      name,
      type,
      balance: balanceDecimal,
      isDefault,
    });

    revalidatePath("/accounts");
    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    revalidatePath("/transactions/create");

    return {
      success: true,
      message: "Account created successfully",
      accountId: account.id,
    };
  } catch (error) {
    // Map known domain errors
    const mapped = mapDomainError(error);

    // If error is known, normalize it to ResponseResult
    if (mapped) {
      return { success: false, error: mapped.error };
    }

    // If error is unknown, use ACCOUNT_CREATION_FAILED
    return { success: false, error: ErrorCode.ACCOUNT_CREATION_FAILED };
  }
}

// action to update default account
export async function updateDefaultAccount(
  accountId: string,
): Promise<ResponseResult> {
  try {
    const user = await requireUser();

    await updateDefaultAccountService({
      userId: user.id,
      accountId,
    });

    revalidatePath("/accounts");
    revalidatePath("/dashboard");

    return { success: true, message: "Default account updated successfully" };
  } catch (error) {
    const mapped = mapDomainError(error);

    // If error is known, normalize it to ResponseResult
    if (mapped) {
      return { success: false, error: mapped.error };
    }
    // If error is unknown, use ACCOUNT_UPDATE_FAILED
    return { success: false, error: ErrorCode.ACCOUNT_UPDATE_FAILED };
  }
}

// Action to delete a single account (production-safe)
export async function deleteAccount(
  accountId: string,
): Promise<ResponseResult> {
  try {
    const user = await requireUser();

    await deleteAccountService({ userId: user.id, accountId });

    revalidatePath("/accounts");
    revalidatePath("/transactions");

    return { success: true, message: "Account deleted successfully" };
  } catch (error) {
    // Map known domain errors
    const mapped = mapDomainError(error);

    // If error is known, normalize it to ResponseResult
    if (mapped) {
      return { success: false, error: mapped.error };
    }

    // If error is unknown, use ACCOUNT_DELETE_FAILED
    return { success: false, error: ErrorCode.ACCOUNT_DELETE_FAILED };
  }
}
