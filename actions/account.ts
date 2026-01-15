"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { requireUser } from "../lib/dal/auth";
import { accountSchema } from "@/lib/schemas/account.schema";
import { revalidatePath, revalidateTag } from "next/cache";


// Action to create a new account
export async function createAccount(data: unknown) {
    // SERVER-SIDE validation (MANDATORY)
    const parsed = accountSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, error: "Invalid form data" };
    }

    try {
        const user = await requireUser();
        const { name, type, balance, isDefault } = parsed.data;

        const balanceDecimal = new Prisma.Decimal(balance);

        if (balanceDecimal.isNaN() || balanceDecimal.lessThan(0)) {
            throw new Error("Invalid balance amount");
        }

        // check if this user first account
        const existingAccounts = await prisma.account.count({
            where: { userId: user.id },
        });

        const shouldDefaultAccount = existingAccounts === 0 ? true : isDefault;

        // only one default account allowed
        if (shouldDefaultAccount) {
            await prisma.account.updateMany({
                where: {
                    userId: user.id,
                    isDefault: true,
                },
                data: {
                    isDefault: false,
                },
            });
        }

        const account = await prisma.account.create({
            data: {
                name: name,
                type: type,
                balance: balanceDecimal,
                isDefault: shouldDefaultAccount,
                userId: user.id,
            },
        });

        revalidateTag("accounts", "max"); // instant UI refresh

        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to create account" };
    }
}



// action to update default account
export async function updateDefaultAccount(accountId: string) {
    try {
        const user = await requireUser();

        await prisma.$transaction([
            prisma.account.updateMany({
                where: { userId: user.id },
                data: { isDefault: false },
            }),

            prisma.account.update({
                where: {
                    id: accountId,
                    userId: user.id, // ownership check
                },
                data: { isDefault: true },
            }),
        ]);


        revalidateTag("accounts", "max"); // instant UI refresh

        return { success: true };
    } catch (e) {
        return {
            success: false,
            message: "Failed to update default account",
        };
    }
}

// Action to delete a single account (production-safe)
export async function deleteAccount(accountId: string) {
    try {
        const user = await requireUser();

        await prisma.$transaction(async (tx) => {
            //  Verify ownership
            const account = await tx.account.findFirst({
                where: {
                    id: accountId,
                    userId: user.id,
                },
            });

            if (!account) {
                throw new Error("NOT_FOUND");
            }

            //  Prevent deleting the only default account
            if (account.isDefault) {
                const anotherDefault = await tx.account.findFirst({
                    where: {
                        userId: user.id,
                        id: { not: accountId },
                        isDefault: true,
                    },
                });

                // If no other default exists, deleting this one would
                // leave the user with zero default accounts.
                if (!anotherDefault) {
                    throw new Error("LAST_DEFAULT");
                }
            }

            //  Safe delete (filter-based)
            await tx.account.deleteMany({
                where: {
                    id: accountId,
                    userId: user.id,
                },
            });
        });

        revalidateTag("accounts", "max"); // instant UI refresh

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND") {
                return { success: false, error: "Account not found" };
            }

            if (error.message === "LAST_DEFAULT") {
                return {
                    success: false,
                    error: "You must have at least one default account",
                };
            }
        }

        return { success: false, error: "Failed to delete account" };
    }
}
