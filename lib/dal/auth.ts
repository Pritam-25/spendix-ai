"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const requireUser = async () => {
    const {userId, isAuthenticated} = await auth();
    if(!isAuthenticated || !userId) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
    });
    
    if(!user) {
        throw new Error("User not found");
    }

    return user;
};