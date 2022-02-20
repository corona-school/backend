import { User } from "../user";
import { secret as Secret } from "@prisma/client";
import { prisma } from "../prisma";

export * from "./password";
export * from "./token";

export async function getSecrets(user: User): Promise<Omit<Secret, "secret">[]> {
    return await prisma.secret.findMany({
        where: {
            userId: user.userID,
            OR: [
                { expiresAt: null },
                { expiresAt: { gte: new Date() }}
            ]
        },
        select: { createdAt: true, expiresAt: true, id: true, lastUsed: true, type: true, userId: true }
    });
}